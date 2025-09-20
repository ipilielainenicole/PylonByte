import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 PylonByte Dashboard</Text>
      
      <TouchableOpacity style={styles.card} onPress={() => router.push("/profile")}>
        <Text style={styles.cardText}>👤 Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push("/tasks")}>
        <Text style={styles.cardText}>✅ Task Manager</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push("/planner")}>
        <Text style={styles.cardText}>📅 Daily Planner</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20,
    backgroundColor: "#f7e7e7", // soft pink background
  },

  // Titles
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    marginBottom: 30,
    color: "#9d6684ff", // strong pink for title
  },

  // Cards
  card: { 
    width: "100%", 
    backgroundColor: "#FFD5D5", // soft pink card
    padding: 20, 
    borderRadius: 12, 
    alignItems: "center", 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FDAAAA", // border accent
  },
  cardText: { 
    fontSize: 18, 
    fontWeight: "600",
    color: "#9d6684ff", // dark pink text for readability
  },
});
