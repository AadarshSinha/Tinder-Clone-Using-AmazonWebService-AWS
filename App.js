import React from 'react'
import { Text,Safe, SafeAreaView } from 'react-native'
import { Amplify } from 'aws-amplify'
import awsconfig from './src/aws-exports'
import { withAuthenticator } from 'aws-amplify-react-native';
Amplify.configure(awsconfig)

const App = () => {
   return(
    <SafeAreaView>
      <Text>Hello World</Text>
    </SafeAreaView>
   )
}
export default withAuthenticator(App);