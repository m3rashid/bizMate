import { LoggedOutStackParamsList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native-animatable';

export function Welcome({}: NativeStackScreenProps<LoggedOutStackParamsList, 'welcome'>) {
  return (
    <View>
      <Text>Welcome</Text>
    </View>
  );
}
