import { db } from "@/lib/firebase/config"
import { collection, onSnapshot, query, where } from "firebase/firestore"

export const retriveFriendsList = (currentUserId: string, callback: Function ) => {
    const q1 = query(collection(db, "friends"), where("user1", "==", currentUserId), where("status", "==", "accepted"));
    const q2 = query(collection(db, "friends"), where("user2", "==", currentUserId), where("status", "==", "accepted"));
    onSnapshot(q1, (snapshot1) => {
        onSnapshot(q2, (snapshot2) => {
            const results = [...snapshot1.docs, ...snapshot2.docs];
            const friendsList = results.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            const friendIds: string[] = []
            friendsList.map((doc: any) => {
                if(doc.user1 === currentUserId) {
                    friendIds.push(doc.user2)
                } else {
                    friendIds.push(doc.user1)
                }
            })
            const retriveFriends = async () => {
              const res = await fetch("/api/get-request-friend", {
                method: "POST",
                body: JSON.stringify({ friendIds }),
                headers: {
                  "Content-Type": "application/json",
                },
                cache: "no-store",
              })
              const response = await res.json();
              callback(response.data);
            };
            retriveFriends();
        })
    })
} 