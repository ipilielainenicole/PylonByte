import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig"; 
import { doc, setDoc } from "firebase/firestore"; // ✅ add Firestore functions

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // ✅ Step 1: Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Step 2: Save user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });

      alert("Account created successfully!");
      router.push("/"); // go back to login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Create Account</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20, 
    backgroundColor: "#f7e7e7"
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
    color: "#9d6684ff" 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#FDAAAA", 
    padding: 10, 
    width: "100%", 
    marginBottom: 10, 
    borderRadius: 8,
    backgroundColor: "#FFD5D5"
  },
  button: { 
    padding: 15, 
    borderRadius: 8, 
    width: "100%", 
    alignItems: "center",
    backgroundColor: "#FDAAAA" 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  link: { 
    marginTop: 15, 
    color: "#FDAAAA" 
  },
});
