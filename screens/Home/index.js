import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Dimensions, Image, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const buttonStyles = {
  button: {
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6c63ff',
    width: '80%',
    maxWidth: '80%',
    paddingVertical: 10,
    borderRadius: 50
  },
  text: {
    textTransform: 'capitalize',
    color: '#FFF',
    fontSize: 25,
    fontWeight: 'bold',
  }
}

const Button = ({ style = {}, children, ...restProps }) => {
  return (
    <TouchableOpacity {...restProps} style={[buttonStyles.button, style]}>
      <Text style={buttonStyles.text}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = {
  safeAreaView: {
    flex: 1,
    marginTop: Constants.statusBarHeight
  },
  title: {
    marginTop: 50,
    fontSize: 50,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#6c63ff',
  },
  image: {
    marginTop: 25,
    width: width,
    height: 250
  },
  imageContainer: {
    flex: 1,
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBottom: {
    marginBottom: 10
  },
  modalTitle: {
    marginTop: Constants.statusBarHeight + 50,
    fontSize: 40,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#6c63ff',
  },
  input: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    maxWidth: '80%',
    padding: 10,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#6c63ff',
    color: '#6c63ff',
    backgroundColor: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  }
}

const Home = ({ navigation, ...props }) => {
  const [modal, setModal] = useState(false);
  const [gameId, setGameId] = useState();

  const joinGame = () => {
    setModal(false)
    navigation.navigate('NewPlayer', { gameId })
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* TITLE */}
      <Text style={styles.title}>quiz</Text>
      {/* QUIZ IMAGE */}
      <View style={styles.imageContainer}>
        <Image resizeMode='contain' style={styles.image} source={require('../../assets/home-quiz.png')} />
      </View>
      {/* BUTTONS */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.navigate('SelectCategory')}
          style={styles.spaceBottom}
        >
          single player
        </Button>
        <Button
          style={styles.spaceBottom}
          onPress={() => navigation.navigate('SelectCategory', { mode: 'MULTI_PLAYER' })}
        >
          multi player
        </Button>
        <Button onPress={() => setModal(true)}>
          join game
        </Button>
      </View>

      <Modal
        // animationType="slide"
        transparent={false}
        visible={modal}
        onRequestClose={() => {}}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.modalTitle}>join game</Text>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
              placeholder='GAME ID'
              style={styles.input}
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={setGameId}
              onSubmitEditing={joinGame}
            />
            <Button
              onPress={joinGame}
            >
              join
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

Home.navigationOptions = {
  header: null
}

export default Home;
