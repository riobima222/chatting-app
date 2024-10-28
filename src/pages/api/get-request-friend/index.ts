import { getRequestFriends } from "@/lib/firebase/services";
import { apiResponse } from "@/utils/apiResponse";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { friendIds, currentUserId } = req.body;
  const response = await getRequestFriends(friendIds, currentUserId);
  return apiResponse(
    res,
    response,
    "berhasil mendapatkan friends request",
    response
  );
}
