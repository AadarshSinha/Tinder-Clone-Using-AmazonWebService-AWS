import React, { useState ,useEffect} from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Auth, DataStore} from 'aws-amplify';
import {User, WaitlingList, Matches, ChatUsers} from './models';

export default function Card({ user }) {
  console.log("card2 = ",user)
  const [currentUser,setCurrentUser] = useState(null)
  useEffect(() => {
    const getCurrentUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', user.user1),
      );
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setCurrentUser(dbUsers[0]);
    };
    getCurrentUser();
  }, []);
  const diasplayImage = () => {
    return <Image source={{uri: `https://lpu549be2fd8f0f4ba1b6d780e258bd43bc71012-staging.s3.ap-south-1.amazonaws.com/public/${currentUser.image}`}} style={styles.photo} />; 
  } 
  if (currentUser === null) return;
  return (
    
    <View style={styles.CardContainer}>
       {diasplayImage()}
      <View style={styles.textContainer}>
        <View style={styles.textRow}>
          <Text style={[styles.textPrimary, styles.textShadow]}>{currentUser.name}</Text>
          <Text style={[styles.textSecondary, styles.textShadow]}>{currentUser.age}  </Text>
          <FontAwesome5 name="info-circle" size={20} color="white"></FontAwesome5>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  CardContainer:{
    // backgroundColor:'red',
    width:'100%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
  },
  photo: {
    height: '98%',
    width:'94%',
    backgroundColor:"white",
    resizeMode: 'cover',
    borderRadius: 20,
  },
  textContainer: {
    position: 'absolute',
    bottom: 100,
    left: '5%',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textPrimary: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
  },
  textSecondary: {
    color: 'white',
    marginLeft: 10,
    fontSize: 25,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.80)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
})