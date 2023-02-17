import AsyncStorage from '@react-native-async-storage/async-storage';


export const storeNotesData = async (value: any) => {
    try {
        const jsonValue = JSON.stringify(value)

        await AsyncStorage.setItem('new_note_app', jsonValue)
    } catch (e) {
        // saving error
        return e;
    }
}

export const getNotesData = async () => {
    try {
        // let initNotesObj: any = {
        //     activeNotes: [],
        //     deletedNotes: []
        // }
        // initNotesObj = JSON.stringify(initNotesObj)

        const jsonValue = await AsyncStorage.getItem('new_note_app')



        return jsonValue != null ? JSON.parse(jsonValue) : null;
        // return jsonValue != null ? JSON.parse(jsonValue) : JSON.parse(initNotesObj);
    } catch (e) {
        // error reading value
        return e;
    }
}



export const getFormatedDate = (isoDate: any, isYMD?: any, isReadable?: any) => {
    let months: any = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date: any = isoDate ? new Date(isoDate) : new Date(),
        year: any = !isYMD ? date.getFullYear().toString() : date.getFullYear(),
        month: any = date.getMonth() + 1,
        dt: any = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }



    if (!isReadable) {
        month = !isYMD ? months[month - 1] : month;
        return !isYMD ? `${dt}-${month}-${year}` : `${year}-${month < 10 ? '0' + month : month}-${dt}`
    } else {
        month = months[month - 1];
        return `${month} ${dt}, ${year} ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
    }
}

export const saveToRemote = async (notesToSave:any) => {
    try {
        const response = await fetch('https://httpbin.org/post', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notesToSave),
        });
        const json = await response.json();
        return {
            status:"success",
            response: JSON.parse(json.data)
        };
    } catch (error) {
        return {
            status:"error",
            response: error
        }
        console.error(error);
    }
}

export const createUUID = () => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

