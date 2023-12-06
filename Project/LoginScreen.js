import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Divider } from "react-native-elements";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../Config";
import HomePage from "./HomePage";
import RegisterScreen from "./RegisterScreen";
import { useState } from "react";
import { useEffect } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { KeyboardAvoidingView } from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => setSignedIn(false), []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        atIndex = email.indexOf("@");
        result = email.substring(0, atIndex);
        navigation.replace("Tabs", { id: result });
        setSignedIn(true);
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        alert("Invalid Login Credentials");
        setSignedIn(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../Images/logo.png")} style={styles.logo} />
        <View>
          <Text style={[styles.title, { textAlign: "center" }]}>UDST</Text>
          <Text style={[styles.title, { textAlign: "center" }]}></Text>
          <Text style={styles.title}>GPA Calculator and Estimator</Text>
        </View>
      </View>
      <View style={styles.form}>
        <View>
          <Text style={styles.signInText}>Sign in</Text>
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#666"
            autoComplete="false"
            autoCorrect={false}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#666"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <View style={styles.options}>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.buttonText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
        <Divider />
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
            style={styles.loginButton}
          >
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007bff",
  },
  header: {
    backgroundColor: "#007bff",
    paddingVertical: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  logo: {
    width: 80,
    height: 110,
    paddingTop: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  form: {
    flex: 1,
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
    justifyContent: "space-around",
  },
  signInText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    color: "#333",
    marginLeft: 5,
  },
  forgotPassword: {
    color: "#007bff",
  },
  loginButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  guestButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
});
