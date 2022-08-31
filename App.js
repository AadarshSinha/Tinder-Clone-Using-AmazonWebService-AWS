import React, {useEffect, useState} from 'react';
import {
  Text,
  Safe,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  setInterval,
  clearInterval,
} from 'react-native';
import {Amplify, Hub,Auth, DataStore} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native';
import HomeScreen from './src/HomeScreen';
import Loading from './src/Loading';
Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});
const App = () => {
  const [isUserLoading, setIsUserLoading] = useState(true);


  return (
    <SafeAreaView style={style.home}>
      {!isUserLoading ? <Loading /> : <HomeScreen />}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  home: {
    width: '100%',
    height: '100%',
    // backgroundColor: '#b5b5b5',
    backgroundColor: 'white',
  },
});
export default withAuthenticator(App);














// export default App;
{
  /* {!isUserLoading &&  <HomeScreen />} */
}
{
  /* {isUserLoading &&  <ActivityIndicator style={{flex: 1}}/>} */
}

{
  /* <HomeScreen/> */
}
{
  /* {display()} */
}
// useEffect(()  =>  {
//   // Create listener
//   const listener =  Hub.listen('datastore', async hubData => {
//     const {event, data} =  hubData.payload;
//     if (event === 'modelSynced' && data?.model?.name === 'User') {
//       console.log('User Model has finished syncing');
//       setIsUserLoading(false);
//     }
//   });
//   return () => listener();
// }, []);
// const listener = Hub.listen('datastore', async hubData => {
//   const {event, data} = hubData.payload;
//   if (event === 'modelSynced' && data?.model?.name === 'User') {
//     console.log('User Model has finished syncing');
//     setIsUserLoading(false);
//   }
// });
// const display = () => {
//   Amplify.DataStore.observeQuery(MyEntity.classType).listen((event) => {
//     if (event.isSynced) {//boolean value
//       print("Synced Successfully!");
//       // even you can get synced data here also
//       <HomeScreen/>
//     } else {
//       //Show ProgressBar Here
//       print("Fetching Data From Cloud");
//     }
//   });
// // }
// const interval = setInterval(() => {
//   console.log('This will run every second!');
//   // setIsUserLoading(false)
// }, 3000);
