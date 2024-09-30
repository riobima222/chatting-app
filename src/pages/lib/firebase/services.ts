import {db, auth} from "@/pages/lib/firebase/config"
import { collection, getDocs, query, where } from "firebase/firestore";


export const getFriend = async (email: string) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));

        const querySnapshot = await getDocs(q);
        const results: any[] = [];
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
        return results;
    } catch (err) {
        return false;
    }
}