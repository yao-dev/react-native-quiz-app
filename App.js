import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import EndGameScreen from './screens/EndGame';
import GameScreen from './screens/Game';
import HomeScreen from './screens/Home';
import LoadCategoryScreen from './screens/LoadCategory';
import SelectCategoryScreen from './screens/SelectCategory';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Game: GameScreen,
    EndGame: EndGameScreen,
    SelectCategory: SelectCategoryScreen,
    LoadCategory: LoadCategoryScreen
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default App = () => {
  return (
    <AppContainer />
  );
};