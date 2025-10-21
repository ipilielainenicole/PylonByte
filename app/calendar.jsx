import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  Platform,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function Calendar() {
  const [eventText, setEventText] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const user = auth.currentUser;
  const eventsCollection = collection(db, "users", user.uid, "events");

  const loadEvents = async () => {
    if (!user) return;
    try {
      const snapshot = await getDocs(eventsCollection);
      const loadedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      loadedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(loadedEvents);
    } catch (error) {
      Alert.alert("Error loading events", error.message);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleSaveEvent = async () => {
    if (!eventText.trim() || !eventDate.trim()) {
      Alert.alert("Please enter both event name and date.");
      return;
    }

    try {
      if (editingId) {
        const eventRef = doc(db, "users", user.uid, "events", editingId);
        await updateDoc(eventRef, { text: eventText, date: eventDate });
        setEditingId(null);
      } else {
        await addDoc(eventsCollection, { text: eventText, date: eventDate });
      }

      setEventText("");
      setEventDate("");
      loadEvents();
    } catch (error) {
      Alert.alert("Error saving event", error.message);
    }
  };

  const handleEditEvent = (event) => {
    setEventText(event.text);
    setEventDate(event.date);
    setEditingId(event.id);
  };

  const handleDeleteEvent = async (id) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "users", user.uid, "events", id));
            loadEvents();
          } catch (error) {
            Alert.alert("Error deleting event", error.message);
          }
        },
      },
    ]);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEventText("");
    setEventDate("");
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <View style={styles.dateChip}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.cardButtons}>
          <TouchableOpacity onPress={() => handleEditEvent(item)}>
            <Text style={styles.editButton}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteEvent(item.id)}>
            <Text style={styles.deleteButton}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.eventText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 My Calendar</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter event"
          style={styles.input}
          value={eventText}
          onChangeText={setEventText}
        />
        <TextInput
          placeholder="YYYY-MM-DD"
          style={styles.input}
          value={eventDate}
          onChangeText={setEventDate}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, editingId && styles.updateButton]}
            onPress={handleSaveEvent}
          >
            <Text style={styles.buttonText}>
              {editingId ? "💾 Update Event" : "➕ Add Event"}
            </Text>
          </TouchableOpacity>

          {editingId && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>✨ No events yet. Add one above!</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff5f6",
  },
  header: {
    paddingVertical: 25,
    backgroundColor: "#f8d5e0",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#9d6684",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#9d6684",
  },
  inputContainer: {
    backgroundColor: "rgba(255, 213, 213, 0.85)",
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    shadowColor: "#9d6684",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FDAAAA",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#9d6684",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    backgroundColor: "#FDAAAA",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  updateButton: {
    backgroundColor: "#f89db5",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    flex: 0.4,
    backgroundColor: "#FFD5D5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDAAAA",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    color: "#9d6684",
    fontWeight: "bold",
    fontSize: 15,
  },
  eventCard: {
    backgroundColor: "#ffeef0",
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dateChip: {
    backgroundColor: "#FDAAAA",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dateText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  eventText: {
    fontSize: 16,
    color: "#9d6684",
    marginTop: 5,
    lineHeight: 22,
  },
  cardButtons: {
    flexDirection: "row",
    gap: 6,
  },
  editButton: {
    fontSize: 18,
  },
  deleteButton: {
    fontSize: 18,
  },
  emptyText: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#9d6684",
    textAlign: "center",
    marginTop: 40,
  },
});
