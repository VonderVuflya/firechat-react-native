import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator, FlatList } from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import Chat from '../components/Chat'

const styles = StyleSheet.create({
  chatStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%',
    margin: 0,
    padding: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    // overflowY: 'scroll',
  },
  container: {
    height: '100%',
    width: '100%',
    margin: 0,
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    paddingBottom: '15%',
    paddingTop: 0,
    backgroundColor: '#151718',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '100%',
    height: 60,
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 0,
    padding: 0,
    paddingBottom: 0,
    backgroundColor: '#151718',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e2123',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  text: {
    fontWeight: '600',
    fontSize: 20,
    color: '#030303',
    marginRight: 'auto',
    marginLeft: 8,
    padding: 4,
  },
  textContainer: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    margin: 0,
    padding: 8,
    elevation: 6,
    backgroundColor: '#ffa600',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

const ChatScreen = () => {
  const [text, setText] = useState('')
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('createdAt', 'asc')
      .limitToLast(15)
      .onSnapshot(querySnapshot => {
        const chatArr =
          querySnapshot?.docs.map(doc => {
            const id = doc.id
            const data = doc.data()

            return { id, ...data }
          }) || []

        setChats(chatArr)
        setLoading(false)
      })
    return () => {
      unsubscribe()
      setLoading(false)
    }
  }, [])

  const sendMessage = async e => {
    const { uid, photoUrl } = auth().currentUser
    const timestamp = firestore.FieldValue.serverTimestamp()

    // Don't allow empty/large message
    if (text.length > 1 && text.length < 40) {
      try {
        e.preventDefault()
        setLoading(true)

        await firestore().collection('chats').doc().set({
          owner: uid,
          imageUrl: photoUrl,
          text: text,
          createdAt: timestamp,
        })

        setText('')
        setLoading(false)
      } catch (error) {
        setLoading(false)
        Alert.alert('Error', error)
      }
    } else {
      setLoading(false)
      Alert.alert('Chat not sent', 'Must be between 1 and 40 characters')
    }
  }

  if (loading) {
    return <ActivityIndicator />
  }

  const userName = auth().currentUser.displayName

  return (
    <View style={styles.container}>
      <View style={styles.chatStyle}>
        {chats && (
          <FlatList
            data={chats}
            renderItem={({ item }) => <Chat key={item.id} chat={item} />}
          />
        )}
      </View>

      {/* <View style={styles.inputContainer}>
        <Input text={text} setText={setText} />
        <SendButton handleChat={sendMessage} />
      </View> */}
    </View>
  )
}

export default ChatScreen
