import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Modal, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import actions from '../../redux/actions/game';
import { db } from '../../utils/firebase';

const { width, height } = Dimensions.get('window');

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
  const [gameId, setGameId] = useState('');

  const gameNotFound = () => {
    // Game doesn't exist
    return Alert.alert(
      'Not Found',
      'The game ID may not exist',
      [
        {text: 'OK', onPress: () => true},
      ],
    );
  }

  const joinGame = () => {
    try {
      db.ref('/games').child(gameId).once('value', (snapshot) => {
        if (!snapshot.val()) return gameNotFound()

        setModal(false)
        props.setGameId(gameId)
        navigation.navigate('NewPlayer', { gameId })

      })
    } catch (e) {
      console.log(e)
      return gameNotFound()
    }
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
          background='purple'
          color='white'
          onPress={() => navigation.navigate('SelectCategory')}
          style={styles.spaceBottom}
        >
          single player
        </Button>
        <Button
          background='purple'
          color='white'
          style={styles.spaceBottom}
          onPress={() => navigation.navigate('SelectCategory', { mode: 'MULTI_PLAYER' })}
        >
          multi player
        </Button>
        <Button
          background='purple'
          color='white'
          onPress={() => setModal(true)}
        >
          join game
        </Button>
      </View>

      <Modal
        // animationType="slide"
        transparent={false}
        visible={modal}
        onRequestClose={() => setModal(false)}
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
              background='purple'
              color='white'
              onPress={joinGame}
            >
              join
            </Button>
          </View>

          <TouchableOpacity
            onPress={() => setModal(false)}
            style={{
              width: 75,
              height: 75,
              borderRadius: 75,
              backgroundColor: '#6c63ff',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: 40,
              ...Platform.select({
                ios: {
                  shadowOffset: {
                    width: 4,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                },
                android: {
                  elevation: 5,
                }
              }),
            }}
          >
            <Text
              style={{
                color: '#FFF',
                fontSize: 30,
              }}
            >
              X
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

Home.navigationOptions = {
  header: null
}

mapDispatchToProps = (dispatch) => {
  return {
    setGameId: (gameId) => dispatch(actions.setGameId(gameId))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Home);
