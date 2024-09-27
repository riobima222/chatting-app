import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/pages/lib/firebase/config";
import { addContact } from "../utils/db";
import Layout from "@/components/layout";

const AddContactPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await addContact(user.uid, email);
        router.push("/dashboard");
      } catch (err) {
        setError("Failed to add contact");
        console.error(err);
      }
    }
  };

  return (
    <Layout title="Add Contact">
      <div className="max-w-md mx-auto mt-8">
        <form
          onSubmit={handleAddContact}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Contact Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Contact Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddContactPage;
