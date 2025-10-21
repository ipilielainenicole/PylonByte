import { useState } from "react"; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore"; 

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    try {
      // 🔹 Firebase Auth Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Firestore check
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("User data:", userData);
        router.push("/dashboard");
      } else {
        alert("No user profile found in Firestore");
      }
    } catch (error) {
      console.log("Login Error:", error); // better debugging
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 PylonByte Login</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don’t have an account? Sign up</Text>
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
