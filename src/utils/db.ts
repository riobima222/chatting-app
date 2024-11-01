import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const getContacts = async (userId: string) => {
  const contactsRef = collection(db, "contacts");
  const q = query(contactsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addContact = async (userId: string, contactEmail: string) => {
  const contactsRef = collection(db, "contacts");
  await addDoc(contactsRef, {
    userId,
    contactEmail,
    createdAt: serverTimestamp(),
  });
};

export const createChat = async (userId: string, contactId: string) => {
  const chatsRef = collection(db, "chats");
  const chatDoc = await addDoc(chatsRef, {
    users: [userId, contactId],
    createdAt: serverTimestamp(),
  });
  return chatDoc.id;
};

export const getOrCreateChat = async (userId: string, contactId: string) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("users", "array-contains", userId));
  const querySnapshot = await getDocs(q);
  const existingChat = querySnapshot.docs.find((doc) =>
    doc.data().users.includes(contactId)
  );

  if (existingChat) {
    return existingChat.id;
  } else {
    return await createChat(userId, contactId);
  }
};
