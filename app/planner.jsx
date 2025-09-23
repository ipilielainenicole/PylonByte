import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // adjust path

export default function Planner() {
  const [plans, setPlans] = useState([]);
  const [planText, setPlanText] = useState("");
  const [time, setTime] = useState("");

  // Load plans in real-time from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "plans"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlans(data);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  const addPlan = async () => {
    if (planText.trim() && time.trim()) {
      try {
        await addDoc(collection(db, "plans"), {
          text: planText,
          time: time,
          createdAt: new Date(),
        });
        setPlanText("");
        setTime("");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const deletePlan = async (id) => {
    try {
      await deleteDoc(doc(db, "plans", id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Daily Planner</Text>

      <TextInput
        placeholder="Enter activity..."
        value={planText}
        onChangeText={setPlanText}
        style={styles.input}
      />
      <TextInput
        placeholder="Time (e.g. 9:00 AM)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={addPlan}>
        <Text style={styles.buttonText}>Add Plan</Text>
      </TouchableOpacity>

      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.planCard}>
            <Text style={styles.planText}>
              {item.time} - {item.text}
            </Text>
            <TouchableOpacity onPress={() => deletePlan(item.id)}>
              <Text style={styles.delete}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f7e7e7" // soft pastel pink background
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center", 
    color: "#9d6684ff" // same as signup/profile titles
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#FDAAAA", 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 12, 
    backgroundColor: "#FFD5D5", 
    fontSize: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  button: { 
    backgroundColor: "#FDAAAA", 
    padding: 14, 
    borderRadius: 10, 
    alignItems: "center", 
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  planCard: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: "#FDAAAA", 
    borderRadius: 12, 
    padding: 14, 
    backgroundColor: "#FFD5D5",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  planText: { 
    flex: 1, 
    fontSize: 16, 
    color: "#483b45ff" // darker accent for readability
  },
  delete: { 
    fontSize: 20, 
    color: "#9d6684ff", // matches theme instead of plain red
    marginLeft: 10 
  },
});
/////