import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>NoteBlue App</Text>
      <Text style={styles.description}>A simple note-taking app with a blue and black theme</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#2962FF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    color: '#FFFFFF',
    marginTop: 10,
  },
});
