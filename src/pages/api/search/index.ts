import { getFriend } from "@/pages/lib/firebase/services";
import { apiResponse } from "@/utils/apiResponse";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const {email} = req.body;
    const response = await getFriend(email);
    return apiResponse(res, response, "berhasil mencari friend", response);
}