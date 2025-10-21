import { useState } from "react"; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig"; 
import { doc, setDoc } from "firebase/firestore"; 

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
      // 🔹 Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Save user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });

      alert("Account created successfully!");
      router.push("/"); // go back to login
    } catch (error) {
      console.log("Signup Error:", error); // better debugging
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
        keyboardType="email-address"
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
    backgroundColor: "#f7e7e7",
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 30, 
    color: "#9d6684ff",
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#FDAAAA",
    backgroundColor: "#FFD5D5",
    fontSize: 16,
    padding: 12, 
    width: "100%", 
    marginBottom: 15, 
    borderRadius: 10,
  },
  button: { 
    backgroundColor: "#FDAAAA",
    padding: 15, 
    borderRadius: 10, 
    width: "100%", 
    alignItems: "center",
  },
  buttonText: { 
    color: "#fff",
    fontWeight: "bold", 
    fontSize: 16,
  },
  link: { 
    marginTop: 20, 
    color: "#FDAAAA", 
    fontSize: 14,
    fontWeight: "500",
  },
});
