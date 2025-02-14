import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useScreenLock } from "../../components/ScreenLockContext";
import { styles } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";




const OptionItem = ({ title, value, onIncrease, onDecrease }) => (
  <View style={styles.optionItem}>
    <Text style={styles.optionTitle}>{title}</Text>

    <View style={styles.optionControls}>
      <TouchableOpacity
        style={[styles.controlButton, value === 2 && styles.disabledButton]}
        onPress={onDecrease}
        disabled={value === 2}>
        <AntDesign name="minus" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlButton, value === 59 && styles.disabledButton]}
        onPress={onIncrease}
        disabled={value === 59}
      >
        <Icon name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </View>

    <Text style={styles.optionValue}>{title === 'Frequency' ? `${value} sessions` : `${value} minutes`}</Text>
  </View>
);


const ToggleItem = ({ title, value, onToggle }) => (
  <View style={styles.toggleItem}>
    <Text style={styles.toggleTitle}>{title}</Text>
    <Switch
      trackColor={{ false: "#767577", true: "#81b0ff" }}
      thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onToggle}
      value={value}
    />
  </View>
);

const StatItem = ({ title, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export default function OptionsScreen() {

  // const [longBreakEnabled, setLongBreakEnabled] = useState(false);
  // const [longBreakLength, setLongBreakLength] = useState(15);
  // const [longBreakFrequency, setLongBreakFrequency] = useState(4);


  const [completedToday, setCompletedToday] = useState(0);
  const [completedAllTime, setCompletedAllTime] = useState(0);
  const [workSessionsCompleted, setWorkSessionsCompleted] = useState(0);

  const {
    workLength,
    setWorkLength,
    breakLength,
    setBreakLength,
    modifiedFrequency,
    setModifiedFrequency,
    longBreakEnabled,
    setLongBreakEnabled,
    longBreakLength,
    setLongBreakLength,
    longBreakFrequency,
    setLongBreakFrequency,
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    preventScreenLock,
    setPreventScreenLock
  } = useScreenLock();


  // useEffect(() => {
  //   if (workSessionsCompleted >= longBreakFrequency) {
  //     // Once the user has completed enough sessions for a long break      
  //     Alert.alert(`Time for a long break! Take ${longBreakLength} minutes.`);
  //     setWorkSessionsCompleted(0); // Reset session counter after long break
  //   }
  // }, [workSessionsCompleted, longBreakFrequency, longBreakLength]);


  const checkMidnightReset = async () => {
    try {
      const lastDate = await AsyncStorage.getItem('lastSessionDate');
      const today = new Date().toDateString();


      if (lastDate !== today) {
        await AsyncStorage.setItem('completedToday', '0');
        setCompletedToday(0);
        await AsyncStorage.setItem('lastSessionDate', today);
      }
    } catch (error) {
      console.log('Error resetting completedToday:', error);
    }
  };


  useEffect(() => {
    checkMidnightReset();
  }, []);



  useEffect(() => {
    const loadStats = async () => {
      await checkMidnightReset();


      const todayCount = await AsyncStorage.getItem("completedToday");
      const allTimeCount = await AsyncStorage.getItem("completedAllTime");


      setCompletedToday(todayCount ? parseInt(todayCount) : 0);
      setCompletedAllTime(allTimeCount ? parseInt(allTimeCount) : 0);
    };


    loadStats();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Timer Length</Text>
        <View style={styles.cardContainer}>
          <OptionItem
            title="Work"
            value={workLength}
            onIncrease={() => setWorkLength((prev) => Math.min(prev + 1, 59))}
            onDecrease={() => setWorkLength((prev) => Math.max(prev - 1, 2))}
          />
          <OptionItem
            title="Break"
            value={breakLength}
            onIncrease={() => setBreakLength((prev) => Math.min(prev + 1, 59))}
            onDecrease={() => setBreakLength((prev) => Math.max(prev - 1, 2))}
          />
        </View>

        <Text style={styles.sectionTitle}>Long Break</Text>
        <View style={styles.cardContainer}>
          <ToggleItem
            title="Enable Long Break"
            value={longBreakEnabled}
            onToggle={() => {
              setLongBreakEnabled(!longBreakEnabled);
              setModifiedFrequency(1);
            }}
          />
          {longBreakEnabled && (
            <>
              <OptionItem
                title="Long Break"
                value={longBreakLength}
                onIncrease={() => setLongBreakLength((prev) => Math.min(prev + 5, 60))}
                onDecrease={() => setLongBreakLength((prev) => Math.max(prev - 5, 15))}
              />
              <OptionItem
                title="Frequency"
                value={longBreakFrequency}
                onIncrease={() => setLongBreakFrequency((prev) => Math.min(prev + 1, 8))}
                onDecrease={() => setLongBreakFrequency((prev) => Math.max(prev - 1, 2))}
              />
            </>
          )}
        </View>
      </View>


      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alarm</Text>
        <ToggleItem title="Enable Vibration" value={vibrationEnabled} onToggle={() => setVibrationEnabled(!vibrationEnabled)} />
        <ToggleItem title="Enable Sound" value={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <StatItem title="Completed Today" value={completedToday} />
        <StatItem title="Completed All-Time" value={completedAllTime} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Screen Lock</Text>
        <ToggleItem title="Prevent Screen Auto-Lock" value={preventScreenLock} onToggle={() => setPreventScreenLock(!preventScreenLock)} />
      </View>
    </ScrollView>
  );
}

