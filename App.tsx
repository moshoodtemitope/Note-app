import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { getNotesData, storeNotesData } from './utils'

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  
  if (!isLoadingComplete) {
    return null;
  } else {
    let fetchNotes = async () => {
      return await getNotesData();
    }

    fetchNotes().then((res) => {
      
      if (!res) {
        
        let initNotesObj = {
          activeNotes: [],
          deletedNotes: []
        }
        storeNotesData(initNotesObj)
      } 
    })





    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>

          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}
