import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

  // Load tasks on start
  useEffect(() => {
    const loadTasks = async () => {
      const saved = await AsyncStorage.getItem("tasks");
      if (saved) setTasks(JSON.parse(saved));
    };
    loadTasks();
  }, []);

  // Save tasks whenever changed
  useEffect(() => {
    AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskText.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: taskText }]);
      setTaskText("");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id, newText) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text: newText } : task)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Task Manager</Text>
      <TextInput
        placeholder="Enter new task..."
        value={taskText}
        onChangeText={setTaskText}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <TextInput
              style={styles.taskText}
              value={item.text}
              onChangeText={(newText) => updateTask(item.id, newText)}
            />
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.delete}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f7e7e7" // soft pastel background
  },

  // Titles
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center",
    color: "#9d6684ff" // deep accent for titles
  },

  // Input fields
  input: { 
    borderWidth: 1, 
    borderColor: "#FDAAAA", 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 10, 
    backgroundColor: "#FFD5D5" // soft pink input background
  },

  // Buttons
  button: { 
    backgroundColor: "#FDAAAA", // pink button
    padding: 12, 
    borderRadius: 8, 
    alignItems: "center", 
    marginBottom: 20 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },

  // Task cards
  taskCard: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    borderWidth: 1, 
    borderColor: "#FDAAAA", 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 10, 
    backgroundColor: "#FFD5D5" 
  },
  taskText: { 
    flex: 1, 
    marginRight: 10, 
    color: "#483b45ff" // darker text for readability
  },
  delete: { 
    fontSize: 18, 
    color: "#9d6684ff" // themed delete instead of plain red
  },
});
//
