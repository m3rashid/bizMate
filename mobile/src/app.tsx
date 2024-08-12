import { Router } from './routes';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { ThemeProvider as MagnusThemeProvider } from 'react-native-magnus';
import { RecoilRoot } from 'recoil';

function App() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <MagnusThemeProvider>
        <RecoilRoot>
          <Router />
        </RecoilRoot>
      </MagnusThemeProvider>
    </ThemeProvider>
  );
}

export default App;
