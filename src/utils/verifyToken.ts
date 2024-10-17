import admin from "@/lib/firebase/firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

export const verifyToken = async (
  req: NextApiRequest,
  res: NextApiResponse,
  callback: (decoded: any) => void
) => {
  const token: any = req.headers.authorization?.split(" ")[1];
  if (token) {
    const decodeToken = await admin.auth().verifyIdToken(token);
    if (!decodeToken)
      return res
        .status(401)
        .json({ status: false, message: "Token tidak valid" });
    callback(decodeToken);
  } else {
    res.status(401).json({ message: "tidak ada token" });
  }
};
