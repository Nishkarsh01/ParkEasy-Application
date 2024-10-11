import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Send a POST request to your back-end login API
      const response = await axios.post('https://parkeasy-application.onrender.com/api/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {

        const token = response.data.token; 
        await SecureStore.setItemAsync('authToken', token);
        console.log(response.data);
        Alert.alert('Success', 'Login successful!');

        const { user_type } = response.data.user;
        navigation.navigate('Home', { userType: user_type });
      }
    } catch (error) {
      console.error('Login Error:', error.response);
      Alert.alert('Error', error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in pressed');
  };

  const handleClose = () => {
    navigation.navigate('RegisterSelection');
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <MaterialCommunityIcons name="close" size={40} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ParkEasy</Text>
        <MaterialCommunityIcons name="car" size={36} color="black" />
      </View>

      <Text style={styles.subtitle}>Login to access your account</Text>

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

      {/* Login Button */}
      <TouchableOpacity
        style={email && password ? styles.loginButton : styles.loginButtonDisabled}
        onPress={handleLogin}
        disabled={!email || !password}
      >
        <Text style={styles.loginButtonText}>Login</Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 8,
    textAlign: 'left',
    color: 'black',
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
  loginButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonDisabled: {
    backgroundColor: '#d3d3d3',
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
