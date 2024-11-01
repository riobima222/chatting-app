import { sendMessage } from "@/lib/firebase/services";
import { apiResponse } from "@/utils/apiResponse";
import { verifyToken } from "@/utils/verifyToken";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler (req: NextApiRequest,res: NextApiResponse) {
    if(req.method === "POST") {
        return verifyToken(req,res, async () => {
            const data = req.body;
            const response = await sendMessage(data);
            return apiResponse(res, response, "pesan terkirim", []);
        })
    } else {
        return res.status(500).json({status: false, message: "Method salah"})
    }

}