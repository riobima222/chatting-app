// src/pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { auth, db } from "@/pages/lib/firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { username, email, age, gender, password } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Simpan informasi tambahan ke Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      age: age,
      gender: gender,
    });

    // Perbarui profil dengan username
    await updateProfile(user, {
      displayName: username,
    });

    // Kirim respon sukses
    return res
      .status(200)
      .json({ success: true, message: "Registrasi berhasil" });
  } catch (error: any) {
    if (
      error.message ===
      "Firebase: Password should be at least 6 characters (auth/weak-password)."
    ) {
      return res
        .status(500)
        .json({
          success: false,
          message: "password tidak kuat, buatkan dengan kombinasi angka",
        });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Email sudah digunakan" });
    }
  }
}
