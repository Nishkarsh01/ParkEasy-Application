import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';  // Import Axios for API requests

const RegisterScreen = ({ navigation, route }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');

  // Password validation regex: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Get the user type (Driver or Lister) from the previous screen
  useEffect(() => {
    if (route.params?.userType) {
      setUserType(route.params.userType);
    }
  }, [route.params?.userType]);

  const handleCreateAccount = async () => {
    // Validate if full name, email, and password are provided
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    // Check if the password is strong enough
    if (!strongPasswordRegex.test(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters, contain 1 uppercase, 1 number, and 1 special character.');
      return;
    }

    try {
      // Send a POST request to your back-end to register the user
      const response = await axios.post('https://parkeasy-application.onrender.com/api/initiate-registration', {
        full_name: fullName,
        email: email,
        password: password,
        user_type: userType  // Include the user type (Driver or Lister)
      }, {
        headers: {
          'Content-Type': 'application/json'
        }});

      // If registration is successful, show success message
      Alert.alert('Success', 'Account created successfully! Please verify your email.', [
        { text: 'OK', onPress: () => navigation.navigate('VerifyEmail', { email }) }  // Navigate to VerifyEmail screen
      ]);

    } catch (error) {
      console.log('Error:', error.response);  // Log detailed error response for debugging
      if (error.response && error.response.data && error.response.data.error) {
        Alert.alert('Error', error.response.data.error);  // Display error returned from backend
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in pressed');
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <MaterialCommunityIcons name="close" size={40} color="black" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>ParkEasy</Text>
        <MaterialCommunityIcons name="car" size={50} color="black" />
      </View>

      <Text style={styles.subtitle}>Create an account to access all features.</Text>

      {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Create Account Button */}
      <TouchableOpacity
        style={fullName && email && password ? styles.createButton : styles.createButtonDisabled}
        onPress={handleCreateAccount}
        disabled={!fullName || !email || !password}
      >
        <Text style={styles.createButtonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Google Sign-In Button */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <FontAwesome name="google" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 8,
    color: 'black',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  createButtonDisabled: {
    backgroundColor: '#d3d3d3',
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen;
