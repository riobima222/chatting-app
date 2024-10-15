import { db } from "@/pages/lib/firebase/config";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
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
