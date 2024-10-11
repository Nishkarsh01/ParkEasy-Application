import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';  // Ensure proper import
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const ProfileScreen = ({ navigation, route }) => {
  const { userType } = route.params || {};  // Retrieve user type, e.g. 'Driver' or 'Lister'

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        // Redirect to login if token is missing
        navigation.replace('Login');
      }
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      // Remove the token from AsyncStorage
      await SecureStore.deleteItemAsync('authToken');  // Delete the token

        // Reset the navigation stack so the user can't go back to protected screens
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],  // Redirect to the login screen
          })
        ); 

      // Show a confirmation message
      Alert.alert('Logged Out', 'You have been successfully logged out.', [
        { text: 'OK', onPress: () => navigation.replace('Login') },  // Navigate to Login screen
      ]);
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Account Settings</Text>
      </View>

      {/* Profile Fields */}
      <View style={styles.section}>
        <View style={styles.row}>
          <FontAwesome name="envelope" size={20} color="gray" />
          <Text style={styles.label}>Email: john.doe@gmail.com</Text>
        </View>

        <TouchableOpacity style={styles.row}>
          <FontAwesome name="lock" size={20} color="gray" />
          <Text style={styles.label}>Password</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <MaterialCommunityIcons name="phone" size={20} color="gray" />
          <Text style={styles.label}>Phone Number:</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>

        {/* Show License Plate & Vehicle only for Driver */}
        {userType === 'Driver' && (
          <TouchableOpacity style={styles.row}>
            <MaterialCommunityIcons name="car" size={20} color="gray" />
            <Text style={styles.label}>License Plate & Vehicle</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="gray" />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.row}>
          <MaterialCommunityIcons name="credit-card-outline" size={20} color="gray" />
          <Text style={styles.label}>Payment Information</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <MaterialCommunityIcons name="bell-outline" size={20} color="gray" />
          <Text style={styles.label}>Notifications</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <MaterialCommunityIcons name="calendar" size={20} color="gray" />
          <Text style={styles.label}>Calendar Reminders</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home-outline" size={24} color="gray" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Reservations')}>
          <MaterialCommunityIcons name="calendar-outline" size={24} color="gray" />
          <Text style={styles.navText}>Reservations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <MaterialCommunityIcons name="account-outline" size={24} color="blue" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('More')}>
          <MaterialCommunityIcons name="menu" size={24} color="gray" />
          <Text style={styles.navText}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0066FF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    margin: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: 'black',
  },
  signOutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 100,    
    alignItems: 'center',
  },
  signOutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default ProfileScreen;
