import React from 'react'
import { View, StyleSheet } from 'react-native'
import auth from '@react-native-firebase/auth'
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin'
import Config from 'react-native-config'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#151718',
  },
})

const LoginScreen = () => {
  // Init google sign in
  GoogleSignin.configure({
    webClientId: Config.CLIENT_ID,
  })

  const handleLogin = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)

      return auth().signInWithCredential(googleCredential)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        // style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleLogin}
      />
    </View>
  )
}

export default LoginScreen
