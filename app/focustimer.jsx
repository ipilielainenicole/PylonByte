import { useState, useEffect, useRef } from "react"; 
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

export default function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);

  const timerRef = useRef(null);
  const user = auth.currentUser;

  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().focusSessions) {
        setSessions(docSnap.data().focusSessions);
      }
    };
    loadSessions();
  }, [user]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) handleComplete();
          else {
            setMinutes((m) => m - 1);
            setSeconds(59);
          }
        } else setSeconds((s) => s - 1);
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, seconds, minutes]);

  const handleComplete = async () => {
    setIsRunning(false);
    alert("Focus session completed! 🎯");

    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const newSession = { duration: `${25}m`, completedAt: new Date() };

    await updateDoc(docRef, { focusSessions: arrayUnion(newSession) });
    setSessions((prev) => [...prev, newSession]);
    setMinutes(25);
    setSeconds(0);
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎯 Focus Timer</Text>

      <View style={styles.timerCard}>
        <Text style={styles.timer}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={handleStartPause}>
            <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sessionTitle}>Previous Focus Sessions:</Text>
      {sessions.length === 0 ? (
        <Text style={styles.noSession}>No sessions yet</Text>
      ) : (
        sessions.map((s, index) => (
          <View key={index} style={styles.sessionCard}>
            <Text style={styles.session}>
              {new Date(s.completedAt.seconds * 1000).toLocaleString()} - {s.duration}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7e7e7",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#9d6684ff",
    textAlign: "center",
    marginBottom: 30,
  },
  timerCard: {
    backgroundColor: "#FFD5D5",
    width: "100%",
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  timer: {
    fontSize: 52,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#9d6684ff",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    backgroundColor: "#FDAAAA",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#9d6684ff",
    alignSelf: "flex-start",
  },
  sessionCard: {
    width: "100%",
    backgroundColor: "#FFD5D5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  session: {
    fontSize: 14,
    color: "#9d6684ff",
  },
  noSession: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#9d6684ff",
  },
});
