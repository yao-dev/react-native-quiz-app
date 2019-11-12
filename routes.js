import { createAppContainer } from 'react-navigation';
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


const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Game: GameScreen,
    EndGame: EndGameScreen,
    SelectCategory: SelectCategoryScreen,
    LoadCategory: LoadCategoryScreen,
    NewPlayer: {
      screen: NewPlayerScreen,
      path: 'game/:gameId',
    },
    InvitePlayer: InvitePlayerScreen,
    WaitPlayer: WaitPlayerScreen,
    Splash: SplashScreen
  },
  {
    initialRouteName: 'Splash',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
