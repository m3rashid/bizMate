import { LoggedInStackParamsList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'tamagui';

export function Home({}: NativeStackScreenProps<LoggedInStackParamsList, 'home'>) {
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}
