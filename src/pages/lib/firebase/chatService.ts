import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";

export const getChatsFromFirestore = async () => {
  const q = query(collection(db, "chats"), orderBy("createdAt", "asc"));
  const querySnapshot = await getDocs(q);

  const chats: any[] = [];
  querySnapshot.forEach((doc) => {
    chats.push({ id: doc.id, ...doc.data() });
  });
  return chats;
};

export const sendChatsToFirestore = async (message: string, userId: string) => {
  await addDoc(collection(db, "chats"), {
    message,
    userId,
    createdAt: Timestamp.now(),
  });
};

export const listenToChats = (callback: (chats: any[]) => any) => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "asc"))
    return onSnapshot(q, (querySnapshot) => {
        const chats: any[] = [];
        querySnapshot.forEach((doc) => {
            chats.push({id: doc.id, ...doc.data()})
        })
        callback(chats);
    })
}
