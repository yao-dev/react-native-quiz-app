// This import loads the firebase namespace along with all its type information.
import * as admin from 'firebase/app';
// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

admin.initializeApp({
  databaseURL: 'https://react-native-quiz-app-7ac3e.firebaseio.com/',
  projectId: 'react-native-quiz-app-7ac3e',
  apiKey: 'AIzaSyBPs1uIrj3ricUbECVlA3KtpdM0CLqcwkk',
});

const database = admin.database()

export const fs = admin.firestore();
export const db = database;
