import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, Image } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";

export default function Dashboard() {
  const router = useRouter();

  const features = [
    { label: "Profile", icon: "account", route: "/profile" },
    { label: "Task Manager", icon: "check-circle-outline", route: "/tasks" },
    { label: "Daily Planner", icon: "calendar-today", route: "/planner" },
    { label: "Focus Timer", icon: "timer-sand", route: "/focustimer" },
    { label: "Notes", icon: "note-outline", route: "/notes" },
    { label: "Calendar", icon: "calendar-month", route: "/calendar" },
  ];

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/n.png")} // Ensure your logo.jpg is inside /assets
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>PylonByte Dashboard</Text>

      {/* Features in Grid Layout */}
      <View style={styles.gridContainer}>
        {features.map((feature, index) => {
          const scaleAnim = useRef(new Animated.Value(1)).current;

          const handlePressIn = () => {
            Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
          };

          const handlePressOut = () => {
            Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
          };

          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => router.push(feature.route)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
                <MaterialCommunityIcons name={feature.icon} size={36} color="#9d6684ff" />
                <Text style={styles.cardText}>{feature.label}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7e7e7",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 25,

    // Glowing shadow on all sides
    shadowColor: "#ff00ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#9d6684ff",
    textAlign: "center",
    marginBottom: 25,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15, // modern spacing
  },
  card: {
    width: 110,
    height: 110,
    backgroundColor: "#FFD5D5",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FDAAAA",
    margin: 8,

    // Card shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9d6684ff",
    textAlign: "center",
    marginTop: 8,
  },
});
