import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { Typography, Colors, Base } from '../styles';

import { IconButton } from '../components';
import Firebase from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import * as firebase from 'firebase';
import 'firebase/database';

const auth = Firebase.auth();
const db = firebase.database();

const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const Home = ({ navigation }) => {
  const [privacy, setPrivacy] = useState('public')
  const { user } = useContext(AuthenticatedUserContext);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  const ref = db.ref('users/'+user.uid)
  ref.on('value', (data) => {
    console.log(data.val())
    console.log('users/'+user.uid)
    const identifier = user.uid
    if(data.val()==null){
      console.log("NULL!!!")
      ref.set({
          public: true
      })
    }
  })

  return (
  <ScreenContainer>
    <StatusBar style='dark-content' />
      <View style={styles.row}>
        <Text style={styles.title}>Welcome {user.email}!</Text>
        <IconButton
          name='logout'
          size={24}
          color='#000'
          onPress={handleSignOut}
        />
      </View>
      <Text style={styles.text}>Your UID is: {user.uid} </Text>
      <Text>User profile: {privacy}</Text>
  </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Base.base,
    paddingTop: 50,
    paddingHorizontal: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    ...Typography.title
  },
  text: {
    ...Typography.text
  }
});