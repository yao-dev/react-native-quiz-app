import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import EndGameScreen from './screens/EndGame';
import GameScreen from './screens/Game';
import HomeScreen from './screens/Home';
import InvitePlayerScreen from './screens/InvitePlayer';
import LoadCategoryScreen from './screens/LoadCategory';
import NewPlayerScreen from './screens/NewPlayer';
import SelectCategoryScreen from './screens/SelectCategory';
import SplashScreen from './screens/Splash';
import WaitPlayerScreen from './screens/WaitPlayer';

const GameStack = createStackNavigator({
  Game: GameScreen,
})

const LoadCategoryStack = createStackNavigator({
  LoadCategory: LoadCategoryScreen,
})

const EndGameStack = createStackNavigator({
  EndGame: EndGameScreen,
})

const AppStack = createStackNavigator(
  {
    Home: HomeScreen,
    SelectCategory: SelectCategoryScreen,
    NewPlayer: {
      screen: NewPlayerScreen,
      path: 'game/:gameId',
    },
    InvitePlayer: InvitePlayerScreen,
    WaitPlayer: WaitPlayerScreen,
  },
);

const AppContainer = createAppContainer(createSwitchNavigator({
    Splash: SplashScreen,
    GameStack,
    LoadCategoryStack,
    EndGameStack,
    AppStack
  },
  {
    initialRouteName: 'Splash',
  }
));

export default AppContainer;
