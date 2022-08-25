import React from 'react'
import { Text,Safe, SafeAreaView,StyleSheet } from 'react-native'
import { Amplify,Auth ,Analytics,API } from 'aws-amplify'
import awsconfig from './src/aws-exports'
import { withAuthenticator } from 'aws-amplify-react-native';
import HomeScreen from './src/HomeScreen';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

const App = () => {
  return(
    <SafeAreaView style={style.home}>
      <HomeScreen/>
    </SafeAreaView>
  )
}
const style =StyleSheet.create({
  home:{
    width:'100%',
    height:'100%',
    backgroundColor: '#b5b5b5',
  },
})
// export default App;
export default withAuthenticator(App);
