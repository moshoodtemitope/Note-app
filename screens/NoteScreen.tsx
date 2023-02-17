import { View, Text, Pressable, StyleSheet, TextInput, Button, Keyboard } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesome } from '@expo/vector-icons';

import { getNotesData, storeNotesData, saveToRemote, createUUID } from '../utils'

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
    description: 'This is note 1',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum nec velit in vulputate. Cras quis eros nec mi convallis imperdiet. Sed vel tempus massa. Donec id nibh lorem. Praesent sit amet aliquam est. Maecenas varius lacus lorem, vulputate gravida risus rhoncus eget. Nunc congue sem non aliquam iaculis. Donec consequat arcu sapien, at dictum leo suscipit et. Nullam lacinia felis ac rhoncus ultrices ',
    date: '1914-05-11'
  },
  {
    id: 3,
    title: 'Note 3',
    description: 'This is note 1',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum nec velit in vulputate. Cras quis eros nec mi convallis imperdiet. Sed vel tempus massa. Donec id nibh lorem. Praesent sit amet aliquam est. Maecenas varius lacus lorem, vulputate gravida risus rhoncus eget. Nunc congue sem non aliquam iaculis. Donec consequat arcu sapien, at dictum leo suscipit et. Nullam lacinia felis ac rhoncus ultrices ',
    date: '2000-07-05'
  },
  {
    id: 4,
    title: 'Note 4',
    description: 'This is note 1',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum nec velit in vulputate. Cras quis eros nec mi convallis imperdiet. Sed vel tempus massa. Donec id nibh lorem. Praesent sit amet aliquam est. Maecenas varius lacus lorem, vulputate gravida risus rhoncus eget. Nunc congue sem non aliquam iaculis. Donec consequat arcu sapien, at dictum leo suscipit et. Nullam lacinia felis ac rhoncus ultrices ',
    date: '1894-11-25'
  },
]




const NoteScreen = ({ navigation, route }: any) => {
  const [noteId, setNoteId] = useState(route?.params?.note?.id || '');
  const [noteTitle, setNoteTitle] = useState(route?.params?.note?.title || '');
  const [noteMsg, setNoteMsg] = useState(route?.params?.note?.note || '');
  const [noteDesc, setNoteDesc] = useState(route?.params?.note?.description || '');
  
  const [isNoteUpdating, setIsNoteUpdating] = useState(false);
  const [remoteUpdateStatus, setRemoteUpdateStatus] = useState<any>();

  const [noteData, setNoteData] = useState<any>(route?.params?.note);
  const titleElement = useRef<TextInput>(null);
  const descElement = useRef<TextInput>(null);
  const noteElement = useRef<TextInput>(null);

 

  useEffect(() => {
    if (!noteId) {
      setNoteId(createUUID())
    }

  }, []);

  useEffect(() => {


    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => {
          Keyboard.dismiss()
        }}
          title="Done"
          color="#fff"
        />
      ),
    });
  }, [navigation]);



  useEffect(() => {
    if (noteTitle || noteMsg || noteDesc) {

      let dateUpdated = new Date()
      setNoteData({
        id: noteId,
        title: noteTitle,
        description: noteDesc,
        note: noteMsg,
        date: dateUpdated.toISOString()
      })
    }

  }, [noteTitle, noteMsg, noteDesc]);

  useEffect(() => {
    if (noteData) {
      
      let fetchNotes = async () => {
        return await getNotesData();
      }

      fetchNotes().then((res) => {
        
        if (res) {
          let allNotes = { ...res },
            activeNotes: any[] = allNotes?.activeNotes;
          activeNotes = activeNotes.filter((obj: any) => obj.id !== noteId);

          activeNotes.push(noteData)
          allNotes.activeNotes = activeNotes;

          storeNotesData(allNotes)
          initiateRemoteUpdate(allNotes)
        }
      })
    }

  }, [noteData]);


  const initiateRemoteUpdate = (data:any)=>{
    setIsNoteUpdating(true)
    saveToRemote(data).then((res:any)=>{
      console.log("ress is ", res)
    })
  }



  return (
    <View style={styles.container}>
 
      <View style={styles.content}>
        <TextInput
          style={styles.titleTxt}
          placeholder="Title"
          onChangeText={inputText => setNoteTitle(inputText)}
          defaultValue={noteTitle}
          placeholderTextColor="#F2F3F4"
          ref={titleElement}

        />
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.descTxt}
          placeholder="What is your note about?"
          onChangeText={inputText => setNoteDesc(inputText)}
          defaultValue={noteDesc}
          placeholderTextColor="#D5DBDB"
          multiline={true}
          numberOfLines={5}
          ref={noteElement}

        />
      </View>
      <View style={styles.content}>
        <TextInput
          autoFocus={true}
          style={styles.noteTxt}
          placeholder="Type your notes here"
          onChangeText={inputText => setNoteMsg(inputText)}
          defaultValue={noteMsg}
          multiline={true}
          numberOfLines={30}
          ref={descElement}
        />
      </View>
      <View style={styles.footer}>

        {/* <Pressable style={styles.button} onPress={() => { alert('here now') }}>
          <FontAwesome name='plus' size={30} color='white' />
        </Pressable> */}
      </View>
    </View>
  )
}

export default NoteScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 10
  },
  noteTxt: {
    // borderColor:"red",
    // borderWidth: 1,
    height: "100%",
    color: "#273746"
  },
  titleTxt: {
    color: "#273746",
    borderBottomColor: "#D7DBDD",
    borderBottomWidth: 1,
    width: "100%",
    fontWeight: "800",
    fontSize: 25,
    marginBottom: 10,
    paddingBottom: 10
  },
  descTxt: {
    color: "#273746",
    borderBottomColor: "#D7DBDD",
    borderBottomWidth: 1,
    width: "100%",
    fontWeight: "300",
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
    paddingBottom: 10
  },
  content: {},
  footer: { width: '100%', alignItems: 'center', marginBottom: 10 },
  button: { backgroundColor: '#F8696A', width: 60, height: 60, padding: 10, borderRadius: 30, position: 'absolute', right: 10, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  buttonText: { textAlign: 'center', color: 'white', fontSize: 16 },
  noteContainer: { backgroundColor: '#FDE69A', height: 60, width: '100%', marginBottom: 20, paddingVertical: 5, paddingHorizontal: 10, justifyContent: 'space-between' },
  noteHeader: { width: '100%', justifyContent: 'space-between', flexDirection: 'row' },
  noteTitle: { fontSize: 18, fontWeight: '700' }
})