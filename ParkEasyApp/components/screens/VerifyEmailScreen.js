import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';  // Use MaterialCommunityIcons
import axios from 'axios';  // To handle resending the verification email

const VerifyEmailScreen = ({ navigation, route }) => {
  const { email } = route.params;

  const handleResendEmail = async () => {
    try {
      // Resend verification email logic
      await axios.post('https://parkeasy-application.onrender.com/api/resend-verification', { email });
      Alert.alert('Success', 'Verification email resent! Please check your inbox.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend verification email.');
    }
  };

  const handleVerifyLater = () => {
    console.log('Verify later pressed');
    navigation.navigate('HomeScreen');  // Allow user to skip for now
  };

  return (
    <View style={styles.container}>
      {/* Header with Verify Later */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleVerifyLater}>
          <Text style={styles.verifyLaterText}>Verify Later</Text>
        </TouchableOpacity>
      </View>

      {/* Logo and Title */}
      <View style={styles.logoContainer}>
        <MaterialCommunityIcons name="car" size={40} color="#0066FF" />
        <Text style={styles.title}>ParkEasy</Text>
      </View>

      {/* Email Verification Message */}
      <View style={styles.messageContainer}>
        {/* Circular Icon Container */}
        <View style={styles.circleIcon}>
          <MaterialCommunityIcons name="email-outline" size={40} color="#2ECC71" />
        </View>
        <Text style={styles.subtitle}>You Are Almost There</Text>
        <Text style={styles.description}>
          To complete your sign up, please verify your email {email}.
        </Text>
      </View>

      {/* Resend Email Section */}
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Didn’t receive it? Check your spam folders
        </Text>
        <TouchableOpacity onPress={handleResendEmail}>
          <Text style={styles.resendLink}>Resend</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  verifyLaterText: {
    color: '#0066FF',
    fontSize: 14,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066FF',
    marginLeft: 10,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  circleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#2ECC71',  // Green circle border
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  resendLink: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: 'bold',
  },
});

export default VerifyEmailScreen;
