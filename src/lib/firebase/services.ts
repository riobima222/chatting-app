import { db } from "@/lib/firebase/config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FriendInter } from "./interface";

// FRIEND

export const getFriend = async (email: string) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));

    const snapshot = await getDocs(q);
    const results: any[] = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
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
      const snapshot = await getDoc(doc(collection(db, "users"), id)); // Ambil dokumen berdasarkan ID
      results.push({ ...snapshot.data() });
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
