import { Linking } from 'expo';
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import { Clipboard, Dimensions, Image, SafeAreaView, Share, Text, TouchableOpacity, Vibration, View } from 'react-native';
import Toast from 'react-native-root-toast';

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
    fontSize: 40,
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
  gameIdContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    width: '80%',
    maxWidth: '80%',
    marginBottom: 10,
  },
  gameId: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#f5f6fa',
    color: '#6c63ff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstButton: {
    marginBottom: 10
  }
}

const InvitePlayer = ({ navigation, ...props }) => {
  const [gameId, setGameId] = useState();
  const [shareUrl, setShareUrl] = useState('');
  const [toastVisible, setToastVisible] = useState();
  const toastRef = useRef()

  // Generate Game ID
  useEffect(() => {
    setGameId(navigation.state.params.id)
    const deepUrl = Linking.makeUrl('quiz-app://game/' + navigation.state.params.id)
    setShareUrl(deepUrl)
    // console.log(deepUrl)
  }, [])

  const copyToClipboard = () => {
    if (toastRef.current) clearInterval(toastRef.current)
    Clipboard.setString(gameId);
    Vibration.vibrate(200);
    setToastVisible(true)
    toastRef.current = setInterval(() => {
      setToastVisible(false)
    }, 2000)
  }

  const onShare = async () => {
    try {
      const message = [
        'Would you like to play a Quiz game with me? 😁.',
        'Click on the link below to start 👇',
        `Let's play: ${shareUrl} 🎮🕹`
      ].join('\n')
      const result = await Share.share({ message });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* TITLE */}
      <Text style={styles.title}>invite friends</Text>
      {/* QUIZ IMAGE */}
      <View style={styles.imageContainer}>
        <Image resizeMode='contain' style={styles.image} source={require('../../assets/share-game.png')} />
      </View>
      {/* INPUT & BUTTON */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={copyToClipboard}
          style={styles.gameIdContainer}
        >
          <Text style={styles.gameId}>{gameId}</Text>
        </TouchableOpacity>
        <Button
          onPress={onShare}
          style={styles.firstButton}
        >
          share
        </Button>
        <Button
          onPress={() => navigation.navigate('WaitPlayer', { gameId })}
        >
          Next 🎮🕹
        </Button>
      </View>
      <Toast
        visible={toastVisible}
        position={0}
        duration={Toast.durations.SHORT}
        shadow={false}
        animation={false}
        hideOnPress={true}
      >
        Copied to clipboard
      </Toast>
    </SafeAreaView>
  );
}

InvitePlayer.navigationOptions = {
  header: null
}

export default InvitePlayer;
