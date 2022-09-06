import { navItem } from "aws-amplify";
import React from "react";
import { View,Text, StyleSheet } from "react-native";
import moment from "moment";

const ChatMessage = ({item,from,to}) => {
  const isMyMessage = () => {
    return item.from === from.sub;
  }
  return(
    <View style={[styles.container,{marginLeft:isMyMessage()?'27%':'3%'}]}>
        <Text style={styles.content}>{item.message}</Text>
        <Text style={styles.name}>{isMyMessage()?from.name:to.name}</Text>
        <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>
    </View>
  )
}
const styles=StyleSheet.create({
    container:{
        color:'black',
        // height:200,
        backgroundColor:'lightblue',
        maxWidth:'70%',
        marginBottom:10,
        elevation:5,
        borderRadius:20,
        padding:10,
        // margin:10,
    },
    content:{
      color:'white',
      fontSize:25,
      fontWeight:'500'
    },
    name:{
      color:'grey',
      fontSize:15,
      fontWeight:'500',
      marginTop:10,
    },
    time:{
      color:'grey',
      fontSize:10,
      bottom:10,
      position:'absolute',
      right:10,
      marginTop:10,
    }
})
export default ChatMessage;