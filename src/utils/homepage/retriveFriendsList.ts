import { db } from "@/lib/firebase/config"
import { collection, onSnapshot, query, where } from "firebase/firestore"

export const retriveFriendsList = (currentUserId: string, callback: any ) => {
    const q1 = query(collection(db, "friends"), where("user1", "==", currentUserId), where("status", "==", "accepted"));
    const q2 = query(collection(db, "friends"), where("user2", "==", currentUserId), where("status", "==", "accepted"));
    
    const unsubscribe = onSnapshot(q1, (snapshot1) => {
      onSnapshot(q2, (snapshot2) => {
        const results = [...snapshot1.docs, ...snapshot2.docs];
        const friendIds = results.map((doc) =>
          doc.data().user1 === currentUserId
            ? doc.data().user2
            : doc.data().user1
        );

        const retriveFriends = async () => {
          const res = await fetch("/api/get-request-friend", {
            method: "POST",
            body: JSON.stringify({ friendIds, currentUserId }),
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          });
          const response = await res.json();
          callback(response.data);
        };
        retriveFriends();
      });
    });

    return unsubscribe;
} 