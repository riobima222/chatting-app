import { db } from "@/lib/firebase/config";
import { cekChatRoom } from "@/lib/firebase/services";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler (req: NextApiRequest,res: NextApiResponse) {
    if(req.method === "POST") {
        const id = req.body;
        const roomId = [id.user1, id.user2].sort().join("_");
        await cekChatRoom(roomId, id)
        return res.status(200).json({status: true, message: "Berhasil"})
    } else {
        return res.status(500).json({status: false, message: "Method salah"})
    }

}