import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [progress, setProgress] = useState("");

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      const saved = await AsyncStorage.getItem("profile");
      if (saved) {
        const data = JSON.parse(saved);
        setName(data.name);
        setGoal(data.goal);
        setProgress(data.progress);
      }
    };
    loadProfile();
  }, []);

  // Save profile
  const saveProfile = async () => {
    const data = { name, goal, progress };
    await AsyncStorage.setItem("profile", JSON.stringify(data));
    alert("Profile saved ✅");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 My Profile</Text>

      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Your main goal"
        value={goal}
        onChangeText={setGoal}
        style={styles.input}
      />
      <TextInput
        placeholder="Progress (%)"
        value={progress}
        onChangeText={setProgress}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>📊 Dashboard</Text>
        <Text style={styles.summaryText}>Hello, {name || "User"} 👋</Text>
        <Text style={styles.summaryText}>🎯 Goal: {goal || "Not set yet"}</Text>
        <Text style={styles.summaryText}>🚀 Progress: {progress ? progress + "%" : "0%"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f7e7e7" 
  },

  // Titles
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center",
    color: "#9d6684ff" 
  },
  summaryTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10,
    color: "#9d6684ff"
  },

  // Input fields
  input: { 
    borderWidth: 1, 
    borderColor: "#FDAAAA", 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 10,
    backgroundColor: "#FFD5D5" 
  },

  // Buttons
  button: { 
    backgroundColor: "#FDAAAA", 
    padding: 12, 
    borderRadius: 8, 
    alignItems: "center", 
    marginBottom: 20 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },

  // Summary cards
  summary: { 
    marginTop: 20, 
    padding: 15, 
    borderWidth: 1, 
    borderColor: "#FDAAAA", 
    borderRadius: 8, 
    backgroundColor: "#FFD5D5" 
  },
  summaryText: { 
    fontSize: 16, 
    marginBottom: 5,
    color: "#483b45ff" 
  },
});
