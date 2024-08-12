import { LoggedOutStackParamsList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'tamagui';

export function Welcome({}: NativeStackScreenProps<LoggedOutStackParamsList, 'welcome'>) {
  return (
    <View>
      <Text>Welcome</Text>
    </View>
  );
}
