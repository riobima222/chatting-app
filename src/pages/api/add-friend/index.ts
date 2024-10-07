import admin from "@/pages/lib/firebase/firebase-admin";
import { verifyToken } from "@/utils/verifyToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;
    console.log(data);
    return verifyToken(req, res, async (decode) => {
      return res
        .status(200)
        .json({ status: true, message: "Semua berjalan dengan lancar" });
    });
  }
}
