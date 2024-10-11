import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const HomeScreen = ({ route, navigation }) => {
  const { userType } = route.params;  // Get the user type passed from the login screen


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

  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Text style={styles.logoText}>ParkEasy - {userType} View</Text>
        <MaterialCommunityIcons name="car" size={36} color="white" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Address, Venue or Airport"
        />
      </View>

      {/* Parking Information Card */}
      <View style={styles.card}>
        <Text style={styles.addressText}>160 Main St. W. - Lot</Text>
        <Text style={styles.priceText}>CA$4.37</Text>

        <Text style={styles.infoText}>0.3 Miles</Text>
        <Text style={styles.infoText}>Date: March 4, 2024</Text>

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>Enter After: 2:00pm | Exit Before: 10:00pm</Text>
          <MaterialCommunityIcons name="bell-outline" size={24} color="blue" />
        </View>

        {/* Parking Spot Image */}
        <Image
          style={styles.parkingImage}
          source={{ uri: 'https://via.placeholder.com/300' }}  // Replace with actual image URL
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home-outline" size={24} color="blue" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Reservations')}>
          <MaterialCommunityIcons name="calendar-outline" size={24} color="gray" />
          <Text style={styles.navText}>Reservations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <MaterialCommunityIcons name="account-outline" size={24} color="gray" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile', { userType })}  // Navigate to Profile with userType
        >
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
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  addressText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
    color: 'green',
    marginVertical: 5,
  },
  infoText: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  timeText: {
    fontSize: 14,
    color: 'black',
  },
  parkingImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 10,
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

export default HomeScreen;
