import { Text, View } from 'react-native-animatable';
import { LoggedInStackParamsList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export function Home({}: NativeStackScreenProps<LoggedInStackParamsList, 'home'>) {
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}
