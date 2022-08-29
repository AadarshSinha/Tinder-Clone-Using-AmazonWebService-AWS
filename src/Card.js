import { S3Image } from 'aws-amplify-react-native/dist/Storage';
import React from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


export default function Card({ user}) {
  return (
    <View style={styles.CardContainer}>
      
      <S3Image imgKey={ user.image } style={styles.photo} />
      <View style={styles.textContainer}>
        <View style={styles.textRow}>
          <Text style={[styles.textPrimary, styles.textShadow]}>{user.name}</Text>
          <Text style={[styles.textSecondary, styles.textShadow]}>{user.age}  </Text>
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