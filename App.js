import * as React from 'react';
import { SafeAreaView, LogBox } from 'react-native';
import Navigations from './src/services/navigations';
import store from './src/redux/index'
import { Provider } from 'react-redux';
import { MenuProvider } from 'react-native-popup-menu';

LogBox.ignoreAllLogs();

const App = () => {
  return (
    <Provider store={store}>
      <MenuProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Navigations />
        </SafeAreaView>
      </MenuProvider>
    </Provider>
  );
}
export default App;

