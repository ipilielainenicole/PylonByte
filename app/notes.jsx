import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function Notes() {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const user = auth.currentUser;
  const notesCollection = collection(db, "users", user.uid, "notes");

  // Load notes from Firestore
  const loadNotes = async () => {
    if (!user) return;
    const snapshot = await getDocs(notesCollection);
    const loadedNotes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNotes(loadedNotes);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Add or update note
  const handleSaveNote = async () => {
    if (!noteText.trim()) {
      Alert.alert("Please enter a note");
      return;
    }

    try {
      if (editingId) {
        const noteRef = doc(db, "users", user.uid, "notes", editingId);
        await updateDoc(noteRef, { text: noteText });
        setEditingId(null);
      } else {
        await addDoc(notesCollection, { text: noteText, createdAt: new Date() });
      }

      setNoteText("");
      loadNotes();
    } catch (error) {
      Alert.alert("Error saving note", error.message);
    }
  };

  // Edit note
  const handleEditNote = (note) => {
    setNoteText(note.text);
    setEditingId(note.id);
  };

  // Delete note
  const handleDeleteNote = async (id) => {
    try {
      const noteRef = doc(db, "users", user.uid, "notes", id);
      await deleteDoc(noteRef);
      loadNotes();
    } catch (error) {
      Alert.alert("Error deleting note", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 My Notes</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter note"
          style={styles.input}
          value={noteText}
          onChangeText={setNoteText}
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveNote}>
          <Text style={styles.buttonText}>{editingId ? "Update" : "Add"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>{item.text}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditNote(item)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteNote(item.id)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7e7e7",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#9d6684ff",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFD5D5",
    borderColor: "#FDAAAA",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FDAAAA",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noteCard: {
    backgroundColor: "#FFD5D5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FDAAAA",
  },
  noteText: {
    fontSize: 16,
    color: "#9d6684ff",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    marginRight: 10,
    backgroundColor: "#FDAAAA",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#f47c7c",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#9d6684ff",
    textAlign: "center",
    marginTop: 20,
  },
});
