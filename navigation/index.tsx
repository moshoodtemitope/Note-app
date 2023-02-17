
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Button, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import NoteScreen from '../screens/NoteScreen';

import { RootStackParamList } from '../types';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Notes' }} />
      <Stack.Screen
        name="NoteScreen"
        component={NoteScreen}

        options={({ navigation, route }) => ({
          headerTitle: (props) => <Text> New Note</Text>,
          // Add a placeholder button without the `onPress` to avoid flicker
          // headerRight: () => (
          //   <Button
          //     title="Done"
          //     color="#fff"
          //   />
          // ),
        })}

      />
    </Stack.Navigator>
  );
}
