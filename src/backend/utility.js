import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { _storeData, _retrieveData } from './AsyncFuncs';
import moment from 'moment';
import Toast from 'react-native-simple-toast'
import { getCurrentUserId } from './auth';

export async function getAllOfCollection(collection) {
  let data = [];
  let querySnapshot = await firebase
    .firestore()
    .collection(collection)
    .get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      //console.log(doc.data());
      data.push(doc.data());
    } else {
      console.log('No document found!');
    }
  });
  return data;
}
export function parseDate(rawDate) {
  let hours;
  let day;
  let month;
  let minutes;

  if (rawDate.getHours().toString().length === 1) {
    hours = `0${rawDate.getHours()}`;
  } else {
    hours = `${rawDate.getHours()}`;
  }
  if (rawDate.getMinutes().toString().length === 1) {
    minutes = `0${rawDate.getMinutes()}`;
  } else {
    minutes = `${rawDate.getMinutes()}`;
  }

  if (rawDate.getUTCDate().toString().length === 1) {
    day = `0${rawDate.getUTCDate()}`;
  } else {
    day = `${rawDate.getUTCDate()}`;
  }

  if (rawDate.getUTCMonth().toString().length === 1) {
    month = `0${rawDate.getUTCMonth() + 1}`;
  } else {
    month = `${rawDate.getUTCMonth() + 1}`;
  }

  return `${month}/${day}/${rawDate.getFullYear()}`;
};
export function monthAdd(date, month) {
  return moment(date).add(month, 'months').format('ll')
}
export function monthSub(date, month) {
  return moment(date).subtract(month, 'months').format('ll')
}
export function weekSub(date, week) {
  return moment(date).subtract(week, 'days').format('ll')
}
export function weekAdd(date, week) {
  return moment(date).add(week, 'days').format('ll')
}
export async function daysAdd(date, days) {
  return moment(date).add(days, 'days').format('ll')
}
export function daysSub(date, days) {
  return moment(date).subtract(days, 'days').format('ll')
}
export function hourAddWithIso(date, hours) {
  return moment(date).add(hours, 'hours').toISOString()
}


export function convertToUTC(date) {
  return moment(date).format('ll')
}

export function getData(collection, doc, objectKey) {
  // check if data exists on the given path
  if (objectKey === undefined) {
    return firebase
      .firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          return false;
        }
      });
  } else {
    return firebase
      .firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(function (doc) {
        if (doc.exists && doc.data()[objectKey] != undefined) {
          return doc.data()[objectKey];
        } else {
          return false;
        }
      });
  }
}

export async function getDocByDesc(collection, key) {
  let data = [];
  let querySnapshot = await firebase
    .firestore()
    .collection(collection)
    .orderBy(key, 'desc')
    .get();
  await querySnapshot.forEach(function (doc) {
    data.push(doc.data());
  });
  return data;
}

export async function uploadProfileImage(uri, name) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref =
      storage()
        .ref(name);
    const task = ref.put(blob);
    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        () => { },
        err => {
          reject(err);
        },

        async () => {
          const url = await task.snapshot.ref.getDownloadURL();
          resolve(url);
        },
      );
    });
  } catch (err) {
    console.log('uploadImage error: ' + err.message);
  }
}

export async function uploadChatImage(uri, name, setProgress) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage().ref('/chats/' + name);
    const task = ref.put(blob);
    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        (snapshot) => {
          setProgress(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000)
        },
        err => {
          reject(err);
        },

        async () => {
          const url = await task.snapshot.ref.getDownloadURL();
          resolve(url);
        },
      );
    });
  } catch (err) {
    console.log('uploadImage error: ' + err.message);
  }
}

export function getDataOrderBy(collection, doc, objectKey) {
  // check if data exists on the given path
  if (objectKey === undefined) {
    return firebase
      .firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          return false;
        }
      });
  } else {
    return firebase
      .firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(function (doc) {
        if (doc.exists && doc.data()[objectKey] != undefined) {
          return doc.data()[objectKey];
        } else {
          return false;
        }
      });
  }
}

export async function getDocRefByKeyValue(collection, key, value) {
  return firebase
    .firestore()
    .collection(collection)
    .where(key, '==', value)
    .get()
    .then(function (querySnapshot) {
      console.log('snap    :', querySnapshot)
      return querySnapshot.docs[0];
    });
}

export async function getDocByKeyValue(collection, key, value) {
  let data = [];
  let querySnapshot = await firebase
    .firestore()
    .collection(collection)
    .where(key, '==', value)
    .get();
  await querySnapshot.forEach(function (doc) {
    data.push(doc.data());
  });
  return data;
}
export async function getFavoritesList(collection, key, value) {
  let data = [];
  let querySnapshot = await firebase
    .firestore()
    .collection(collection)
    .where(key, 'array-contains', value)
    .get();
  await querySnapshot.forEach(function (doc) {
    data.push(doc.data());
  });
  return data;
}
export async function getAllFriends(collection, key, value) {
  let querySnapshot = await firebase
    .firestore()
    .collection(collection)
    .where(key, 'array-contains', value)
    .get();
  let data = await querySnapshot?.docs?.map((doc) => {
    return { ...doc.data() }
  })
  return data;
}

export async function getDocWithIdByKeyValue(collection, key, value) {
  let data = [];
  let querySnapshot = await firebase
    .firestore()
    .collection(collection)
    .where(key, '==', value)
    .get();
  await querySnapshot.forEach(function (doc) {
    let obj = doc.data();
    obj.id = doc.id;
    data.push(obj);
  });
  return data;
}

export async function getDocWithinRange(collection, doc, strSearch) {
  let strlength = strSearch.length;
  let strFrontCode = strSearch.slice(0, strlength - 1);
  let strEndCode = strSearch.slice(strlength - 1, strSearch.length);

  let startcode = strSearch;
  let endcode =
    strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

  return firebase
    .firestore()
    .collection(collection)
    .where(doc, '>=', startcode)
    .where(doc, '<', endcode)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.data());
      });
    });
}

export async function saveData(collection, doc, jsonObject) {
  const success =
    await firebase.firestore()
      .collection(collection)
      .doc(doc)
      .set(jsonObject, { merge: true }).then(() => {
        return true;
      }).catch(function (error) {
        Toast.show(error.message)
        return false;
      });
}

export async function saveDataWithDocId(collection, doc, jsonObject) {
  return firebase
    .firestore()
    .collection(collection)
    .doc(doc)
    .set(jsonObject, { merge: true })
    .then(async function () {
      console.log('Document successfully written!');
      return true;
    })
    .catch(function (error) {
      console.error('Error writing document: ', error);
    });
}

export async function saveDataWithoutDocId(collection, jsonObject) {
  let docRef = await firebase
    .firestore()
    .collection(collection)
    .doc();
  docRef.set(jsonObject);
  return docRef;
}

export async function calculateNumberOfDaysBetweenDates(old, today) {
  let old_date = moment(old)
  let today_date = moment(today)
  let days = old_date.diff(today_date, 'days')
  return days
}

export async function addToArray(collection, doc, array, value) {
  let success = true
  let docRef = await firebase
    .firestore()
    .collection(collection)
    .doc(doc);
  let docData = await docRef.get();

  if (docData.exists && docData.data()[array] != undefined) {
    docRef.update({
      [array]: firebase.firestore.FieldValue.arrayUnion(value),
    });
    success = true
  } else {
    saveData(collection, doc, { [array]: [value] });
    success = false
  }
  return success
}

export async function addToArrayCustom(collection, doc, array, value) {
  let success = true
  let docRef = await firebase
    .firestore()
    .collection(collection)
    .doc(doc);
  let docData = await docRef.get();

  if (docData.exists && docData.data()[array] != undefined) {
    docRef.update({
      [array]: firebase.firestore.FieldValue.arrayUnion(value),
      last_message_time: value.createdAt
    });
    success = true
  } else {
    success = false
  }
  return success
}

export async function addNotification(doc, id, image, note, createdAt, jsonObject, collection, subcollection) {
  return await firebase
    .firestore()
    .collection(collection ? collection : 'Users')
    .doc(doc)
    .collection(subcollection ? subcollection : 'Notification')
    .add({
      id: id,
      image: image,
      note: note,
      createdAt: createdAt
    }, jsonObject)
    .then(async function () {
      console.log('`Notification` successfully written!');
      return true;
    })
    .catch(function (error) {
      console.error('Error writing Notification: ', error);
    });
}

export async function getAllNotification(collection, subcollection) {
  let data = [];
  let user_id = getCurrentUserId()
  let querySnapshot = await firebase
    .firestore()
    .collection(collection ? collection : 'Users')
    .doc(user_id)
    .collection(subcollection ? subcollection : 'Notification')
    .orderBy('createdAt', 'desc')
    .get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      //console.log(doc.data());
      data.push(doc.data());
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export async function updateArray(collection, doc, array, value, index) {
  let docRef = await firebase
    .firestore()
    .collection(collection)
    .doc(doc);
  let docData = await docRef.get();

  if (docData.exists && docData.data()[array][index] != undefined) {
    docRef
      .update({
        [array]: firebase.firestore.FieldValue.arrayRemove(
          docData.data()[array][index],
        ),
      })
      .then(async () => {
        let docRef1 = await firebase
          .firestore()
          .collection(collection)
          .doc(doc);
        let docData1 = await docRef1.get();
        if (docData1.exists && docData1.data()[array] != undefined) {
          docRef1.update({
            [array]: firebase.firestore.FieldValue.arrayUnion(value),
          });
        }
      });
  }
}
export async function removeItemfromArray(collection, doc, array, index) {
  let docRef = await firebase
    .firestore()
    .collection(collection)
    .doc(doc);
  let docData = await docRef.get();

  if (docData.exists && docData.data()[array][index] != undefined) {
    docRef.update({
      [array]: firebase.firestore.FieldValue.arrayRemove(
        docData.data()[array][index],
      ),
    });
  }
}

// washingtonRef.update({
//   regions: firebase.firestore.FieldValue.arrayUnion("greater_virginia")
// });

export async function addElementToNestedArray(collection, doc, array, obj) {
  let db = firebase.firestore();

  db.collection(collection)
    .doc(doc)
    .update({
      [array]: firebase.firestore.FieldValue.arrayUnion(obj),
    });
}

export async function removeElementFromNestedArray(
  collection,
  doc,
  array,
  obj,
) {
  let db = firebase.firestore();

  db.collection(collection)
    .doc(doc)
    .update({
      [array]: firebase.firestore.FieldValue.arrayRemove(obj),
    });
}

export async function addToArrayUpdate(collection, doc, array, value) {
  let docRef = await firebase
    .firestore()
    .collection(collection)
    .doc(doc);
  let docData = await docRef.get();
  if (docData.exists && docData.data()[array] != undefined) {
    docRef.set({
      [array]: firebase.firestore.FieldValue.arrayUnion(value),
    });
  }
}

export async function deleteField(collection, doc, field) {
  let db = firebase.firestore();
  const fruitRef = db.collection(collection).doc(doc);
  // Remove the 'apple' field from the document
  const removeFruit = fruitRef.update({
    [field]: firebase.firestore.FieldValue.delete(),
  });
  return removeFruit;
  // let docRef = await firebaseData.child(collection).child(doc).child([field])
  // return firebase.database().ref(collection).doc(doc).child([field]).remove();
}

export function uniqueID() {
  // this.setState({indicator: true});
  function chr4() {
    return Math.random()
      .toString(16)
      .slice(-4);
  }
  return (
    chr4() +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    chr4() +
    chr4()
  );
}

export async function deleteDocument(collection, doc, field) {
  let db = firebase.firestore();

  db.collection(collection)
    .doc(doc)
    .delete()
    .then(function () {
      console.log('Document successfully deleted!');
    })
    .catch(function (error) {
      console.error('Error removing document: ', error);
    });
}

export default firebase;



// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;