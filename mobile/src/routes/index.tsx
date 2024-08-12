import { useAuthValue } from '../atoms/auth';
import { Home } from './loggedIn/home';
import { Welcome } from './loggedOut/welcome';
import { LoggedInStackParamsList, LoggedOutStackParamsList } from './types';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const LoggedInStack = createNativeStackNavigator<LoggedInStackParamsList>();

function LoggedInStackRoutes(): React.JSX.Element {
  return (
    <LoggedInStack.Navigator initialRouteName="home" screenOptions={{ headerShown: false }}>
      <LoggedInStack.Screen name="home" component={Home} />
    </LoggedInStack.Navigator>
  );
}

const LoggedOutStack = createNativeStackNavigator<LoggedOutStackParamsList>();
function LoggedOutStackRoutes(): React.JSX.Element {
  return (
    <LoggedOutStack.Navigator initialRouteName="welcome" screenOptions={{ headerShown: false }}>
      <LoggedOutStack.Screen name="welcome" component={Welcome} />
    </LoggedOutStack.Navigator>
  );
}

export function Router(): React.JSX.Element {
  const { isAuthenticated } = useAuthValue();

  return <NavigationContainer>{isAuthenticated ? <LoggedInStackRoutes /> : <LoggedOutStackRoutes />}</NavigationContainer>;
}
