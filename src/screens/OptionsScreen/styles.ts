import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2937",
    padding: 16,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "500",
  },

  optionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  toggleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(55, 65, 81, 0.7)",
    borderRadius: 12,
    marginBottom: 8,
  },

  toggleTitle: {
    color: "#fff",
    fontSize: 16,
  },

  ringtoneItem: {
    padding: 16,
    backgroundColor: "rgba(55, 65, 81, 0.7)",
    borderRadius: 12,
    marginTop: 8,
  },

  ringtoneTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  ringtoneDescription: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    marginTop: 6,
    marginBottom: 12,
  },

  ringtoneActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  ringtoneButton: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: "#374151",
    borderRadius: 8,
  },

  ringtoneButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "rgba(55, 65, 81, 0.7)",
    borderRadius: 12,
    marginBottom: 8,
  },

  statTitle: {
    color: "#fff",
    fontSize: 16,
  },

  statValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  startButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  minutesText: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.8,
  },

  cardContainer: {
    backgroundColor: "rgba(55, 65, 81, 0.9)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },

  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },

  optionControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  controlButton: {
    padding: 6,
    backgroundColor: "#374151",
    borderRadius: 6,
  },

  disabledButton: {
    opacity: 0.5,
  },

  optionTitle: {
    color: "#fff",
    fontSize: 16,
  },

  optionValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  // Appearance - Color Picker

  colorPickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },

  colorPickerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  colorDescription: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 14,
  },

  colorList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedColorCircle: {
    borderWidth: 3,
    borderColor: "#fff",
  },
});