import { Router } from './routes';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import defaultConfig from '@tamagui/config';
import { useColorScheme } from 'react-native';
import { RecoilRoot } from 'recoil';
import { createTamagui, TamaguiProvider } from 'tamagui';

const config = createTamagui(defaultConfig);

function App() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TamaguiProvider config={config}>
        <RecoilRoot>
          <Router />
        </RecoilRoot>
      </TamaguiProvider>
    </ThemeProvider>
  );
}

export default App;
