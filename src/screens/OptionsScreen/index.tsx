import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DocumentPicker from "react-native-document-picker";

import { useScreenLock } from "../../components/ScreenLockContext";
import { styles } from "./styles";

import * as CHSCONSTANTS from "../../constants/constants";

const supportedAudioExtension =
  /\.(aac|aif|aiff|amr|m4a|mp3|wav|3gp)$/i;

const supportedAudioMimeTypes = new Set([
  "audio/aac",
  "audio/aiff",
  "audio/amr",
  "audio/mp3",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/x-aac",
  "audio/x-aiff",
  "audio/x-m4a",
  "audio/x-wav",
  "audio/3gpp",
]);

const isAudioSelection = (
  mimeType: string | null,
  fileName: string | null,
) => {
  const normalizedMimeType = mimeType?.toLowerCase();

  if (normalizedMimeType && supportedAudioMimeTypes.has(normalizedMimeType)) {
    return true;
  }

  if (normalizedMimeType && normalizedMimeType !== "application/octet-stream") {
    return false;
  }

  return supportedAudioExtension.test(fileName || "");
};

// --------------------------------------------------
// Option Item
// --------------------------------------------------

interface OptionItemProps {
  title: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const OptionItem: React.FC<OptionItemProps> = ({
  title,
  value,
  onIncrease,
  onDecrease,
}) => (
  <View style={styles.optionItem}>
    <Text style={styles.optionTitle}>{title}</Text>

    <View style={styles.optionControls}>
      <TouchableOpacity
        style={[
          styles.controlButton,
          value === 2 && styles.disabledButton,
        ]}
        onPress={onDecrease}
        disabled={value === 2}
      >
        <AntDesign
          name="minus"
          size={20}
          color="#fff"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.controlButton,
          value === 59 && styles.disabledButton,
        ]}
        onPress={onIncrease}
        disabled={value === 59}
      >
        <Icon
          name="add"
          size={20}
          color="#fff"
        />
      </TouchableOpacity>
    </View>

    <Text style={styles.optionValue}>
      {title === "Frequency"
        ? `${value} sessions`
        : `${value} minutes`}
    </Text>
  </View>
);

// --------------------------------------------------
// Toggle Item
// --------------------------------------------------

interface ToggleItemProps {
  title: string;
  value: boolean;
  onToggle: () => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({
  title,
  value,
  onToggle,
}) => (
  <View style={styles.toggleItem}>
    <Text style={styles.toggleTitle}>
      {title}
    </Text>

    <Switch
      trackColor={{
        false: "#767577",
        true: "#81b0ff",
      }}
      thumbColor={
        value ? "#f5dd4b" : "#f4f3f4"
      }
      ios_backgroundColor="#3e3e3e"
      onValueChange={onToggle}
      value={value}
    />
  </View>
);

// --------------------------------------------------
// Stat Item
// --------------------------------------------------

interface StatItemProps {
  title: string;
  value: number;
}

const StatItem: React.FC<StatItemProps> = ({
  title,
  value,
}) => (
  <View style={styles.statItem}>
    <Text style={styles.statTitle}>
      {title}
    </Text>

    <Text style={styles.statValue}>
      {value}
    </Text>
  </View>
);

// --------------------------------------------------
// Color Picker Item
// --------------------------------------------------

interface ColorPickerItemProps {
  title: string;
  description: string;
  selectedColor: string;
  onSelect: (color: string) => void;
}

const ColorPickerItem: React.FC<
  ColorPickerItemProps
> = ({
  title,
  description,
  selectedColor,
  onSelect,
}) => {
  const colors = [
    "#00563B",
    "#2563EB",
    "#7C3AED",
    "#DB2777",
    "#DC2626",
    "#EA580C",
    "#CA8A04",
    "#0891B2",
  ];

  return (
    <View style={styles.colorPickerItem}>
      <Text style={styles.colorPickerTitle}>
        {title}
      </Text>

      <Text style={styles.colorDescription}>
        {description}
      </Text>

      <View style={styles.colorList}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => onSelect(color)}
            style={[
              styles.colorCircle,
              {
                backgroundColor: color,
              },
              selectedColor === color &&
                styles.selectedColorCircle,
            ]}
          >
            {selectedColor === color && (
              <Icon
                name="checkmark"
                size={20}
                color="#fff"
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// --------------------------------------------------
// Options Screen
// --------------------------------------------------

export default function OptionsScreen() {
  const [completedToday, setCompletedToday] =
    useState(
      CHSCONSTANTS.defaultTodayStat
    );

  const [completedAllTime, setCompletedAllTime] =
    useState(
      CHSCONSTANTS.defaultAllTimeStat
    );

  const {
    workLength,
    setWorkLength,

    breakLength,
    setBreakLength,

    setModifiedFrequency,

    longBreakEnabled,
    setLongBreakEnabled,

    longBreakLength,
    setLongBreakLength,

    longBreakFrequency,
    setLongBreakFrequency,

    soundEnabled,
    setSoundEnabled,

    ringtoneUri,
    ringtoneName,
    ringtoneLoaded,
    setRingtoneSelection,

    vibrationEnabled,
    setVibrationEnabled,

    preventScreenLock,
    setPreventScreenLock,

    workColor,
    setWorkColor,

    breakColor,
    setBreakColor,
  } = useScreenLock();

  const [isPickingRingtone, setIsPickingRingtone] =
    useState(false);

  const selectRingtone = async () => {
    setIsPickingRingtone(true);

    try {
      const selection = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.audio,
        copyTo: "documentDirectory",
      });

      if (!isAudioSelection(selection.type, selection.name)) {
        throw new Error("Please select a supported audio file.");
      }

      if (!selection.fileCopyUri) {
        throw new Error(
          selection.copyError ||
            "The selected audio file could not be saved.",
        );
      }

      await setRingtoneSelection(
        selection.fileCopyUri,
        selection.name || "Custom ringtone",
      );
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        return;
      }

      console.error("Error selecting ringtone:", error);
      Alert.alert(
        "Unable to select ringtone",
        error instanceof Error
          ? error.message
          : "Please try selecting another audio file.",
      );
    } finally {
      setIsPickingRingtone(false);
    }
  };

  const resetRingtone = async () => {
    try {
      await setRingtoneSelection(null, null);
    } catch (error) {
      console.error("Error resetting ringtone:", error);
      Alert.alert(
        "Unable to reset ringtone",
        "Please try again.",
      );
    }
  };

  // --------------------------------------------------
  // Midnight Reset
  // --------------------------------------------------

  const checkMidnightReset = async () => {
    try {
      const lastDate =
        await AsyncStorage.getItem(
          "lastSessionDate"
        );

      const today =
        new Date().toDateString();

      if (lastDate !== today) {
        await AsyncStorage.setItem(
          "completedToday",
          "0"
        );

        setCompletedToday(0);

        await AsyncStorage.setItem(
          "lastSessionDate",
          today
        );
      }
    } catch (error) {
      console.log(
        "Error resetting completedToday:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Load Stats
  // --------------------------------------------------

  useEffect(() => {
    const loadStats = async () => {
      await checkMidnightReset();

      const todayCount =
        await AsyncStorage.getItem(
          "completedToday"
        );

      const allTimeCount =
        await AsyncStorage.getItem(
          "completedAllTime"
        );

      setCompletedToday(
        todayCount
          ? parseInt(todayCount, 10)
          : 0
      );

      setCompletedAllTime(
        allTimeCount
          ? parseInt(allTimeCount, 10)
          : 0
      );
    };

    loadStats();
  }, []);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* ------------------------------------------ */}
      {/* Timer Length */}
      {/* ------------------------------------------ */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Timer Length
        </Text>

        <View style={styles.cardContainer}>
          <OptionItem
            title="Work"
            value={workLength}
            onIncrease={() =>
              setWorkLength((prev) =>
                Math.min(prev + 1, 59)
              )
            }
            onDecrease={() =>
              setWorkLength((prev) =>
                Math.max(prev - 1, 2)
              )
            }
          />

          <OptionItem
            title="Break"
            value={breakLength}
            onIncrease={() =>
              setBreakLength((prev) =>
                Math.min(prev + 1, 59)
              )
            }
            onDecrease={() =>
              setBreakLength((prev) =>
                Math.max(prev - 1, 2)
              )
            }
          />
        </View>

        {/* ---------------------------------------- */}
        {/* Long Break */}
        {/* ---------------------------------------- */}

        <Text style={styles.sectionTitle}>
          Long Break
        </Text>

        <View style={styles.cardContainer}>
          <ToggleItem
            title="Enable Long Break"
            value={longBreakEnabled}
            onToggle={() => {
              setLongBreakEnabled(
                !longBreakEnabled
              );

              setModifiedFrequency(1);
            }}
          />

          {longBreakEnabled && (
            <>
              <OptionItem
                title="Long Break"
                value={longBreakLength}
                onIncrease={() =>
                  setLongBreakLength(
                    (prev) =>
                      Math.min(
                        prev + 5,
                        60
                      )
                  )
                }
                onDecrease={() =>
                  setLongBreakLength(
                    (prev) =>
                      Math.max(
                        prev - 5,
                        15
                      )
                  )
                }
              />

              <OptionItem
                title="Frequency"
                value={longBreakFrequency}
                onIncrease={() =>
                  setLongBreakFrequency(
                    (prev) =>
                      Math.min(
                        prev + 1,
                        8
                      )
                  )
                }
                onDecrease={() =>
                  setLongBreakFrequency(
                    (prev) =>
                      Math.max(
                        prev - 1,
                        2
                      )
                  )
                }
              />
            </>
          )}
        </View>
      </View>

      {/* ------------------------------------------ */}
      {/* Alarm */}
      {/* ------------------------------------------ */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Alarm
        </Text>

        <ToggleItem
          title="Enable Vibration"
          value={vibrationEnabled}
          onToggle={() =>
            setVibrationEnabled(
              !vibrationEnabled
            )
          }
        />

        <ToggleItem
          title="Enable Sound"
          value={soundEnabled}
          onToggle={() =>
            setSoundEnabled(
              !soundEnabled
            )
          }
        />

        <View style={styles.ringtoneItem}>
          <Text style={styles.ringtoneTitle}>
            Custom Ringtone
          </Text>
          <Text style={styles.ringtoneDescription}>
            {ringtoneLoaded
              ? ringtoneName || "Using the default ringtone"
              : "Loading saved ringtone..."}
          </Text>
          <View style={styles.ringtoneActions}>
            <TouchableOpacity
              style={[
                styles.ringtoneButton,
                (!ringtoneLoaded || isPickingRingtone) &&
                  styles.disabledButton,
              ]}
              onPress={selectRingtone}
              disabled={!ringtoneLoaded || isPickingRingtone}
            >
              <Text style={styles.ringtoneButtonText}>
                {isPickingRingtone
                  ? "Choosing..."
                  : ringtoneUri
                    ? "Change ringtone"
                    : "Choose audio file"}
              </Text>
            </TouchableOpacity>

            {ringtoneUri && (
              <TouchableOpacity
                style={[
                  styles.ringtoneButton,
                  !ringtoneLoaded && styles.disabledButton,
                ]}
                onPress={resetRingtone}
                disabled={!ringtoneLoaded}
              >
                <Text style={styles.ringtoneButtonText}>
                  Use default
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* ------------------------------------------ */}
      {/* Stats */}
      {/* ------------------------------------------ */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Stats
        </Text>

        <StatItem
          title="Completed Today"
          value={completedToday}
        />

        <StatItem
          title="Completed All-Time"
          value={completedAllTime}
        />
      </View>

      {/* ------------------------------------------ */}
      {/* Screen Lock */}
      {/* ------------------------------------------ */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Screen Lock
        </Text>

        <ToggleItem
          title="Prevent Screen Auto-Lock"
          value={preventScreenLock}
          onToggle={() =>
            setPreventScreenLock(
              !preventScreenLock
            )
          }
        />
      </View>

      {/* ------------------------------------------ */}
      {/* Appearance */}
      {/* ------------------------------------------ */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Appearance
        </Text>

        <View style={styles.cardContainer}>

          {/* Work Session */}
          <ColorPickerItem
            title="Work Session"
            description="Choose a background color for your work timer"
            selectedColor={workColor}
            onSelect={setWorkColor}
          />

          {/* Break Session */}
          <ColorPickerItem
            title="Break Session"
            description="Choose a background color for your break timer"
            selectedColor={breakColor}
            onSelect={setBreakColor}
          />

        </View>
      </View>

    </ScrollView>
  );
}