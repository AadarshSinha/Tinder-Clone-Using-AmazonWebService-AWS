import React, { useEffect, useState } from 'react';
import 
{
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView
} from 'react-native';
import {Auth, DataStore, Storage} from 'aws-amplify';
import {User} from './models/';


const ProfileScreen = ({users}) => {
  const [Name,setName]=useState("")
  const [Age,setAge]=useState("")
  const [Bio,setBio]=useState("")
  const [Gender,setGender]=useState("")

   
  useEffect(()=>{
    if (!users || users.length === 0) {
      return;
    }
    const temp = users[0];
    setName(temp.name);
    setBio(temp.bio);
    setAge(temp.age);
    setGender(temp.gender);
  },users);


  const Submit = async () => {
    if (!users || users.length === 0) {
      console.log("adding new user to db");
      return;
    }
    console.log("updating user to db");
  }
  const logOut = async () => {
    Auth.signOut();
  };
  return(
    <View style={styles.ProfileContainer}>

        <Text style={styles.textt}>Profile Photo</Text>
        <Image 
        style={styles.image}
        />
        <Text style={styles.textt}>Name</Text>
        <TextInput 
        style={styles.name}
        value={Name}
        onChangeText={setName}
        />
        <Text style={styles.textt}>Age</Text>
        <TextInput 
        style={styles.age}
        value={Age}
        onChangeText={setAge}
        />
        <Text style={styles.textt}>Gender</Text>
        <TextInput 
        style={styles.gender}
        value={Gender}
        onChangeText={setGender}
        />
        <Text style={styles.textt}>Bio</Text>
        <TextInput 
        style={styles.bio}
        value={Bio}
        onChangeText={setBio}
        multiline
        numberOfLines={3}
        />
        <View style={styles.profileFooter}>
            <Pressable style={styles.button} onPress={Submit}>
                <Text style={styles.text}>Submit</Text>
          </Pressable>
            <Pressable style={styles.button} onPress={logOut}>
                <Text style={styles.text}>Log Out</Text>
          </Pressable>
        </View>
    </View>
  )
}

const styles=StyleSheet.create({

  ProfileContainer:{
    backgroundColor:"white",
   width:'100%',
   height:'100%',
   alignItems: 'center',
 },
 profileFooter:{
  flexDirection: 'row',
  justifyContent: 'space-around',
  width:'100%',
  top:'80%',
  position: 'absolute',

 },
 image:{
   width:"38%",
   height:"20%",
   borderWidth:1,
   padding:2,
   borderColor:"#F76C6B",
   borderRadius:100,
 },
 name:{
   width:'92%',
   padding:10,
   height:60,
   marginTop:10,
   borderRadius:10,
   borderColor:"black",
   backgroundColor:"#b5b5b5",
   color:'black',
   fontSize:25,
  fontWeight: 'bold',
  elevation: 10,
  
},
age:{
  width:'92%',
  padding:10,
  height:50,
   marginTop:10,
   borderRadius:10,
   borderColor:"black",
   backgroundColor:"#b5b5b5",
   color:'black',
   fontSize:20,
   elevation: 10,
  },
gender:{
  width:'92%',
  padding:10,
  height:50,
   marginTop:10,
   borderRadius:10,
   borderColor:"black",
   backgroundColor:"#b5b5b5",
   color:'black',
   fontSize:20,
   elevation: 10,
  },
  bio:{
    width:'92%',
    padding:10,
    height:100,
    marginTop:10,
    borderRadius:10,
    borderColor:"black",
    backgroundColor:"#b5b5b5",
    color:'black',
    fontSize:20,
    elevation: 10,
  },
  button: {
    width:140,
    alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 15,
  paddingHorizontal: 5,
  borderRadius: 30,
  elevation: 3,
  backgroundColor: '#F76C6B',
},
text: {
  fontSize: 16,
  lineHeight: 21,
  fontWeight: 'bold',
  letterSpacing: 0.25,
  color: 'white',
},
textt:{
  width:'92%',
  marginTop:20,
  fontSize: 20,
  fontWeight: 'bold',
  color: 'black',

}
})
export default ProfileScreen;