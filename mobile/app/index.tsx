import {useClerk} from "@clerk/clerk-expo";
import { View, Text,Button } from 'react-native';
import React from 'react'

const HomeScreen = () => {
    const {signOut}=useClerk();
  return (
    <View>
        
        <Text>Home</Text>
        <Button onPress={()=> signOut()} title="logout"></Button>
      </View>
  )
}

export default HomeScreen