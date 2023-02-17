import { View, Text, Pressable, StyleSheet, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';
import { getNotesData, storeNotesData, getFormatedDate, saveToRemote } from '../utils'



const Notes = [
  {
    id: 1,
    title: 'Note 1',
    description: 'This is note 1',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum nec velit in vulputate. Cras quis eros nec mi convallis imperdiet. Sed vel tempus massa. Donec id nibh lorem. Praesent sit amet aliquam est. Maecenas varius lacus lorem, vulputate gravida risus rhoncus eget. Nunc congue sem non aliquam iaculis. Donec consequat arcu sapien, at dictum leo suscipit et. Nullam lacinia felis ac rhoncus ultrices ',
    date: '2021-01-01'
  },
  {
    id: 2,
    title: 'Note 2',
    description: 'This is note 2',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum nec velit in vulputate. Cras quis eros nec mi convallis imperdiet. Sed vel tempus massa. Donec id nibh lorem. Praesent sit amet aliquam est. Maecenas varius lacus lorem, vulputate gravida risus rhoncus eget. Nunc congue sem non aliquam iaculis. Donec consequat arcu sapien, at dictum leo suscipit et. Nullam lacinia felis ac rhoncus ultrices ',
    date: '1914-05-11'
  },
  {
    id: 3,
    title: 'Note 3',
    description: 'This is note 3',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum nec velit in vulputate. Cras quis eros nec mi convallis imperdiet. Sed vel tempus massa. Donec id nibh lorem. Praesent sit amet aliquam est. Maecenas varius lacus lorem, vulputate gravida risus rhoncus eget. Nunc congue sem non aliquam iaculis. Donec consequat arcu sapien, at dictum leo suscipit et. Nullam lacinia felis ac rhoncus ultrices ',
    date: '2000-07-05'
  },
  {
    id: 4,
    title: 'Note 4',
    description: 'This is note 4This is note 4This is note 4 This is note 4 This is note 4',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum nec velit in vulputate. Cras quis eros nec mi convallis imperdiet. Sed vel tempus massa. Donec id nibh lorem. Praesent sit amet aliquam est. Maecenas varius lacus lorem, vulputate gravida risus rhoncus eget. Nunc congue sem non aliquam iaculis. Donec consequat arcu sapien, at dictum leo suscipit et. Nullam lacinia felis ac rhoncus ultrices ',
    date: '1894-11-25'
  },
]

const HomeScreen = ({ navigation }: any) => {

  const [allActiveNotesFetched, setAllActiveNotesFetched] = useState<any[]>([]);
  const [allNotesFetched, setAllNotesFetched] = useState<any>();
  const [isNoteUpdating, setIsNoteUpdating] = useState(false);
  const isFocused = useIsFocused();



  useEffect(() => {

    let fetchNotes = async () => {
      return await getNotesData();
    }

    fetchNotes().then((res) => {

      if (res) {
        let activeNotes: any[] = res?.activeNotes;

        activeNotes.sort(function (a, b) {
          return (b.date < a.date) ? -1 : ((b.date > a.date) ? 1 : 0);
        });
        setAllActiveNotesFetched(activeNotes)
        setAllNotesFetched(res)
      }
    })




  }, [isFocused])

  //Confirm Delete Note
  const showAlert = (noteId: any) =>
    Alert.alert(
      'Confirm',
      'Do you want to delete the selected note?',
      [
        {
          text: 'Yes',
          onPress: () => {

            if (noteId) {

              let notesList = allActiveNotesFetched,
                remainingNotes = notesList.filter((obj: any) => obj.id !== noteId),
                notesObj: any = { ...allActiveNotesFetched };

              notesObj.activeNotes = remainingNotes
              setAllActiveNotesFetched(remainingNotes)
              storeNotesData(notesObj)
              initiateRemoteUpdate(notesObj)
            }

          },
          style: 'cancel',
        },
        {
          text: 'Cancel',
        },
      ],
      {
        cancelable: true
      },
    );
  
  //Do Remote Update
  const initiateRemoteUpdate = (data: any) => {
    setIsNoteUpdating(true)
    saveToRemote(data).then((res: any) => {
      console.log("ress is ", res)
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.deleteMsg}>Press and hold down note to delete</Text>
      <ScrollView style={styles.content}>

        {/* Load All notes */}
        {allActiveNotesFetched.length >= 1 &&
          <View>
            {
              allActiveNotesFetched.map((note) => (
                <View key={note.id}

                >
                  <Pressable style={styles.noteContainer}
                    onPress={() => navigation.navigate('NoteScreen', { note, isEdit: true })}
                    // Long Press to Delete
                    onLongPress={() => {
                      showAlert(note.id)
                    }}


                  >
                    <View>
                      <View style={styles.noteHeader}>
                        <Text style={styles.noteTitle}>{note.title}</Text>
                        <Text> {getFormatedDate(note.date, null, true)} </Text>
                      </View>
                      <Text>{note.description}</Text>
                    </View>

                  </Pressable>
                </View>
              ))
            }

          </View>
        }
      </ScrollView>
      {/* Create New Note */}
      <View style={styles.footer}>

        <Pressable style={styles.button} onPress={() =>
          navigation.navigate('NoteScreen', { name: 'Jane' })
        }>
          <FontAwesome name='plus' size={30} color='white' />
        </Pressable>
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 10,
  },
  deleteMsg: {
    fontStyle: 'italic',
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'right',
    color: '#85929E'
  },


  content: { overflow: 'scroll' },
  footer: { width: '100%', alignItems: 'center', marginBottom: 10 },
  button: { backgroundColor: '#F8696A', width: 60, height: 60, padding: 10, borderRadius: 30, position: 'absolute', right: 10, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  buttonText: { textAlign: 'center', color: 'white', fontSize: 16 },
  noteContainer: { position: 'relative', backgroundColor: '#FDE69A', height: 60, width: '100%', marginBottom: 20, paddingVertical: 5, paddingHorizontal: 10, justifyContent: 'space-between' },
  noteHeader: { width: '100%', justifyContent: 'space-between', flexDirection: 'row' },
  noteTitle: { fontSize: 18, fontWeight: '700' }
})