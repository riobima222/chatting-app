import { db } from "@/lib/firebase/config";
import { Unsubscribe, collection, onSnapshot } from "firebase/firestore";

export const retriveMessages = (
  userId: string,
  friendsList: any[],
  callback: (updatedList: any[]) => void
): (() => void) => {
  const unsubscribes: Unsubscribe[] = [];

  const updatedFriendsList = [...friendsList];

  friendsList.forEach((friend, index) => {
    const roomId = [userId, friend.id].sort().join("_");
    const messagesRef = collection(db, "chats", roomId, "messages");

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const messageFilter = messages.filter(
        (mess: any) => mess.senderId !== userId && mess.isRead === false
      );

      updatedFriendsList[index] = {
        ...updatedFriendsList[index],
        messages: messageFilter || [],
      };

      callback([...updatedFriendsList]);
    });

    unsubscribes.push(unsubscribe);
  });

  // Return cleanup function
  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
};
