import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const RegisterSelectionScreen = ({ navigation }) => {
  const [userType, setUserType] = useState('Driver');  // Default to Driver

  const handleGoogleSignIn = () => {
    // Handle Google OAuth logic here
    console.log('Google sign-in pressed for', userType);
    navigation.navigate('VerifyEmail');
  };

  const handleEmailRegistration = () => {
    // Pass the selected `userType` to the `RegisterScreen`
    navigation.navigate('Register', { userType });
  };

  return (
    <View style={styles.container}>
      {/* Title with Car Icon */}
      <View style={styles.titleContainer}>
        <MaterialCommunityIcons name="car" size={50} color="white" />
        <Text style={styles.title}>ParkEasy</Text>
      </View>

      <Text style={styles.subtitle}>
        Register an account to either list your parking spot or reserve a parking spot.
      </Text>

      {/* User Type Picker with Dropdown Arrow */}
      <RNPickerSelect
        onValueChange={(value) => setUserType(value)}
        value={userType}
        items={[
          { label: 'Driver', value: 'Driver' },
          { label: 'Lister', value: 'Lister' }
        ]}
        useNativeAndroidPickerStyle={false}  // Allows custom styling
        style={pickerSelectStyles}
        placeholder={{}}
        Icon={() => {
          return <FontAwesome name="chevron-down" size={20} color="#0066FF" style={styles.arrowIcon} />;
        }}
      />

      {/* Google OAuth Button with Icon */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <FontAwesome name="google" size={20} color="#0066FF" style={styles.iconLeft} />
        <Text style={styles.googleButtonText}>Continue With Google</Text>
      </TouchableOpacity>

      {/* Email Registration Button with Icon */}
      <TouchableOpacity style={styles.emailButton} onPress={handleEmailRegistration}>
        <FontAwesome name="envelope" size={20} color="white" style={styles.iconLeft} />
        <Text style={styles.emailButtonText}>Create Account with Email</Text>
      </TouchableOpacity>

      {/* Login Option */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}> Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#fff',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 32,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 5,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#0066FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailButton: {
    flexDirection: 'row',
    backgroundColor: '#0066FF',
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconLeft: {
    marginRight: 8,
  },
  loginContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#fff',
  },
  loginLink: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },

  arrowIcon: {
    paddingTop: 10,
    paddingRight: 20,
  },
  
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
      paddingRight: 30,
      marginBottom: 20,
      backgroundColor: 'white',
      color: '#0066FF',
      textAlign: 'center',  // This ensures the text is center-aligned on iOS
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'white',
      borderRadius: 8,
      paddingRight: 30,
      marginBottom: 20,
      backgroundColor: 'white',
      color: '#0066FF',
      textAlign: 'center',  // This ensures the text is center-aligned on Android
    },
  });

export default RegisterSelectionScreen;



