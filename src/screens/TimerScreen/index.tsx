import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StatusBar, Vibration, Easing } from 'react-native';
import { styles } from './styles';
import Sound from 'react-native-sound';
import { useScreenLock } from '../../components/ScreenLockContext';
   
import AsyncStorage from '@react-native-async-storage/async-storage';


const TimerScreen = ({ navigation }) => {
    
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [sessionType, setSessionType] = useState('Work');
   
    const [alarmSound, setAlarmSound] = useState(null);
    const { workLength, breakLength, soundEnabled, vibrationEnabled, longBreakEnabled, longBreakLength, longBreakFrequency,modifiedFrequency } = useScreenLock();
    const [frequency, setFrequency] = useState(modifiedFrequency);

    const [modifiedBreakLength, setModifiedBreakLength] = useState(breakLength);

    const [completedToday, setCompletedToday] = useState(0);
    const [completedAllTime, setCompletedAllTime] = useState(0);
    const rotationProgress = useRef(new Animated.Value(0)).current;
    const colorProgress = useRef(new Animated.Value(0)).current;
    const progressAnimation = useRef(null);
    const colorAnimation = useRef(null);



    useEffect(() => {
        setTimeLeft(workLength*60);
        Sound.setCategory('Playback');

        const sound = new Sound('ringtone.wav', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Failed to load sound', error);
                return;
            }
            setAlarmSound(sound);
        });

        return () => {
            if (alarmSound) {
                alarmSound.release();
            }
        };
    }, []);

    const playAlarmSound = () => {
        if (alarmSound && soundEnabled) {
            alarmSound.play((success) => {
                if (!success) {
                    console.log('Sound playback failed');
                }
            });
        }
        if (vibrationEnabled) {
            Vibration.vibrate(8000);
        }
    };



    const startAnimations = () => {
        // Stop existing animations
        if (progressAnimation.current) {
            progressAnimation.current.stop();
        }
        if (colorAnimation.current) {
            colorAnimation.current.stop();
        }

        // Reset values
        rotationProgress.setValue(0);
        colorProgress.setValue(0);

        // Create and start rotation animation
        progressAnimation.current = Animated.timing(rotationProgress, {
            toValue: 1,
            duration: timeLeft * 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        });

        // Create and start color animation
        colorAnimation.current = Animated.timing(colorProgress, {
            toValue: 1,
            duration: timeLeft * 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        });

        progressAnimation.current.start();
        colorAnimation.current.start();
    };

    const stopAnimations = () => {
        if (progressAnimation.current) {
            progressAnimation.current.stop();
        }
        if (colorAnimation.current) {
            colorAnimation.current.stop();
        }
    };


    useEffect(() => {
        const loadStats = async () => {
            const todayCount = await AsyncStorage.getItem('completedToday');
            const allTimeCount = await AsyncStorage.getItem('completedAllTime');
           
            setCompletedToday(todayCount ? parseInt(todayCount) : 0);
            setCompletedAllTime(allTimeCount ? parseInt(allTimeCount) : 0);
        };
        loadStats();
    }, []);

    const handleSessionCompletion = async () => {
       console.log("longBreakEnabled",longBreakEnabled);
       console.log("longBreakLength",longBreakLength);
       console.log("longBreakFrequency",longBreakFrequency);
       console.log("modifiedFrequency",modifiedFrequency);

        if (sessionType === "Work") {
            const todayCount = await AsyncStorage.getItem('completedToday');
            const allTimeCount = await AsyncStorage.getItem('completedAllTime');
       
            const updatedToday = (todayCount ? parseInt(todayCount) : 0) + 1;
            const updatedAllTime = (allTimeCount ? parseInt(allTimeCount) : 0) + 1;

           setCompletedToday(updatedToday);
            setCompletedAllTime(updatedAllTime);
       
            await AsyncStorage.setItem('completedToday', updatedToday.toString());
            await AsyncStorage.setItem('completedAllTime', updatedAllTime.toString());
            setFrequency(prevFrequency=>prevFrequency+1);
        }
        if(longBreakEnabled){
            if(longBreakFrequency===frequency){
                setFrequency(1);
                setModifiedBreakLength(longBreakLength);
            }
        }
     
        const nextSession = sessionType === "Work" ? "Break" : "Work";
        setSessionType(nextSession);
        setTimeLeft(nextSession === "Work" ? workLength * 60 : modifiedBreakLength * 60);
        setIsActive(true);
    };
    
   
    useEffect(() => {
        let timer;
        if (isActive) {
            // Reset progress only when the session starts
            startAnimations();    
            // Animate the progress bar over the duration of the session (in seconds)
            // Animated.timing(progress, {
            //     toValue: 1,
            //     duration: timeLeft * 1000, // duration in milliseconds
            //     easing: Easing.linear,
            //     useNativeDriver: false, // Set this to false for animating colors
            // }).start();
    
            // Countdown logic for timeLeft
            timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        playAlarmSound();
                        setIsActive(false);
                        handleSessionCompletion();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            stopAnimations();
            clearInterval(timer);
        }
    
        return () =>{
            clearInterval(timer);
        stopAnimations();
        } 
    }, [isActive, timeLeft, sessionType]);
    
    
    
    

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (isActive) {
            setIsActive(false);
            setIsPaused(true);
        } else {
            setIsActive(true);
            setIsPaused(false);
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(sessionType === 'Work' ? workLength * 60 : breakLength * 60);
        rotationProgress.setValue(0);
        colorProgress.setValue(0);
                stopAlarmSound();
    };

    const stopAlarmSound = () => {
        if (alarmSound) {
            alarmSound.stop(() => {
                console.log('Sound stopped');
            });
        }
    };

    const handleOptions = () => {
        navigation.navigate('OptionsScreen');
    };


    
    const rotateInterpolation = rotationProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const colorInterpolation = colorProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['#4A90E2', '#FF6347'],
    });


    const workColor = "green"; 
    const breakColor = "violet"; 
   
 
    const backgroundColor = sessionType === "Work" ? workColor : breakColor;

    return (
<View style={[styles.container, { backgroundColor }]}>
<StatusBar backgroundColor={backgroundColor} />
            <View style={styles.timerContainer}>
                <View style={styles.staticBorder} />
                <Animated.View
                    style={[
                        styles.animatedBorder,
                        {
                            transform: [{
                                rotate: rotateInterpolation
                            }],
                            borderLeftColor: colorInterpolation,
                        },
                    ]}
                />

                <View style={styles.timerCircle}>
                    <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
                </View>
            </View>
            <Text style={styles.sessionType}>{sessionType} Session</Text>

            <View style={styles.controlsContainer}>
                {/* This ensures Stop button has a reserved space */}
                <View style={{ height: 50, justifyContent: 'center' }}>
                    {isActive && (
                        <TouchableOpacity style={styles.stopButton} onPress={resetTimer}>
                            <Text style={styles.stopText}>Stop</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Round Button - Position remains fixed */}
                <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.roundButton} onPress={toggleTimer}>
                        <Text style={styles.buttonText}>
                            {isActive ? 'Pause' : isPaused ? 'Resume' : 'Start'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={handleOptions} style={styles.optionsButton}>
                <Text style={styles.optionsType}>Options</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TimerScreen;