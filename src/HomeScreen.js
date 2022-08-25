import React,{useState} from 'react';
import {Text,View,StyleSheet,Pressable} from 'react-native';
import DisplayScreen from './DisplayScreen'
import MatchScreen from './MatchScreen'
import ChatScreen from './ChatScreen'
import ProfileScreen from './ProfileScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const HomeScreen = () => {
  const [screen,setScreen]=useState("display");
  const defaultColor="#b5b5b5"
  const activeColor = '#F76C6B';

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
      <View style={styles.bottomNavigation}>
        <AntDesign name="heart" size={40} color="#4FCC94" style={styles.button}/>
        <Entypo name="cross" size={40} color="#A65CD2" style={styles.button}/>
      </View>
      {screen==="display" && <DisplayScreen/>}
      {screen==="match" && <MatchScreen/>}
      {screen==="chat" && <ChatScreen/>}
      {screen==="profile" && <ProfileScreen/>}
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
        padding: 20,
        backgroundColor:"white"
    },
    bottomNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 10,
        position: 'absolute',
        bottom: 30,
    },
    button: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
      },
});

export default HomeScreen;
