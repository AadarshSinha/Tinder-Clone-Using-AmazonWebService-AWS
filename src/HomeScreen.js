import React,{useEffect, useState} from 'react';
import {Text,View,StyleSheet,Pressable} from 'react-native';
import DisplayScreen from './DisplayScreen'
import MatchScreen from './MatchScreen'
import ChatScreen from './ChatScreen'
import ProfileScreen from './ProfileScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {Auth, DataStore, Storage} from 'aws-amplify';
import {User} from './models/';

const HomeScreen = () => {
  const [screen,setScreen]=useState("display");
  const [user,setUser]=useState(null);
  const defaultColor="#b5b5b5"
  const activeColor = '#F76C6B';
  

  useEffect(() => {
    const getCurrentUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', authUser.attributes.sub),
        );
        if (!dbUsers || dbUsers.length === 0) {
          setScreen("profile")
          return;
      }
      setUser(dbUsers[0]);
    };
    getCurrentUser();
  }, []);
  return(
    <View style={styles.Homescreen}>
      <View style={styles.topNavigation}>
        <Pressable onPress={()=>{setScreen("display")}}>
           <Entypo name="home" size={35} color={screen==="display"?activeColor:defaultColor} />
        </Pressable>
        <Pressable onPress={()=>{setScreen("match")}}>
           <AntDesign name="star" size={35} color={screen==="match"?activeColor:defaultColor} />
        </Pressable>
        <Pressable onPress={()=>{setScreen("chat")}}>
           <AntDesign name="wechat" size={35} color={screen==="chat"?activeColor:defaultColor} />
        </Pressable>
        <Pressable onPress={()=>{setScreen("profile")}}>
           <MaterialCommunityIcons name="account" size={35} color={screen==="profile"?activeColor:defaultColor} />
        </Pressable>
      </View>
      
      {screen==="display" && <DisplayScreen/>}
      {screen==="match" && <MatchScreen sub={user.sub}/>}
      {screen==="chat" && <ChatScreen/>}
      {screen==="profile" && <ProfileScreen />}
    </View>
  );
};
const styles=StyleSheet.create({
    Homescreen:{
       position:'relative',
       width:'100%',
       height:'100%'
    },
    topNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        height:80,
        padding: 20,
        backgroundColor:"white"
    },
    
});

export default HomeScreen;
