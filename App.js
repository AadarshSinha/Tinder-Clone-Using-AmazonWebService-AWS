import React, {useEffect, useState} from 'react';
import {
  Text,
  Safe,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  setInterval,
  clearInterval,
  View,
} from 'react-native';

import {Amplify, Hub, Auth, DataStore} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native';
import HomeScreen from './src/HomeScreen';
import LoginPage from './src/LoginPage';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});
const App = () => {
  const [loading, setLoading] = useState(true);
  const [curUser, setCurUser] = useState(undefined);
  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: false,
      });
      setCurUser(authUser);
    } catch (e) {
      setCurUser(null);
    }
  };
  useEffect(() => {
    checkUser();
  }, []);
  useEffect(() => {
    const listener = data => {
      if (data.payload.event === 'signIn' || data.payload.event === 'signOut'){
        checkUser();
      }
    };
    Hub.listen('auth', listener);
    return () => Hub.remove('auth', listener);
  }, []);
  if (curUser === undefined) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <SafeAreaView style={style.home}>
      {curUser ? (
        <HomeScreen />
      ) : (
        <LoginPage setLoading={setLoading} />
      )}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  home: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});
// export default withAuthenticator(App);
export default App;
