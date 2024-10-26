import { db } from "@/lib/firebase/config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FriendInter } from "./interface";

// FRIEND

export const getFriend = async (email: string) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    const results: any = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return results;
  } catch (err) {
    return false;
  }
};

// ADD FRIEND
export const addFriend = async (data: FriendInter) => {
  try {
    await addDoc(collection(db, "friends"), data);
    return true;
  } catch (err) {
    return false;
  }
};

// GETFRIENDSSHIP
export const getFriendsShip = async (userId: string) => {
  try {
    const q = query(collection(db, "friends"), where("userId", "==", userId));
    onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return results;
    });
  } catch (err) {
    return false;
  }
};

// GET REQUEST FRIENDS
export const getRequestFriends = async (friendIds: string[]) => {
  try {
    const results: any[] = [];
    for (const id of friendIds) {
      const snapshot = await getDoc(doc(collection(db, "users"), id));
      results.push({ id: snapshot.id, ...snapshot.data() });
    }
    return results;
  } catch (err) {
    return false;
  }
};

// ACCEPT FRIEND REQUEST
export const acceptFriend = async (friendId: string) => {
  try {
    await updateDoc(doc(db, "friends", friendId), {
      status: "accepted",
    });
    return true;
  } catch (err) {
    return false;
  }
};

// CHATS
export const cekChatRoom = async (
  roomId: string,
  id: { user1: string; user2: string }
) => {
  const chatRoomRef = doc(db, "chats", roomId);
  const snapshot = await getDoc(chatRoomRef);
  if (!snapshot.exists()) {
    await setDoc(chatRoomRef, {
      users: [id.user1, id.user2],
      createdAt: new Date(),
    });
  }
};

export const ambilChats = async (roomId: string, callback: any) => {
  const messagesRef = collection(db, "chats", roomId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));
  onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

export const sendMessage = async (data: {
  message: { senderId: string; text: string; createdAt: Date };
  roomId: string;
}) => {
  try {
    const messageRef = collection(db, "chats", data.roomId, "messages");
    await addDoc(messageRef, data.message);
    return true;
  } catch (err) {
    return false;
  }
};
