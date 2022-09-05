import { navItem } from "aws-amplify";
import React from "react";
import { View,Text, StyleSheet } from "react-native";
const ChatMessage = ({item,from,to}) => {

  return(
    <View style={styles.container}>
        <Text style={{color:'black'}}>{item.message}</Text>
    </View>
  )
}
const styles=StyleSheet.create({
    container:{
        color:'black',
        height:200,
        backgroundColor:'white',
        maxWidth:'70%',
        marginBottom:15,
        elevation:10,
        borderRadius:20,
        // maxWidth:'70%'
    }
})
export default ChatMessage;