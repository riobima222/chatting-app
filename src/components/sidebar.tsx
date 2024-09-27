import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "@/pages/lib/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { getContacts, getOrCreateChat } from "../utils/db";

const Sidebar: React.FC = () => {
  const [user] = useAuthState(auth);
  const [contacts, setContacts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchContacts = async () => {
        const contactList = await getContacts(user.uid);
        setContacts(contactList);
      };
      fetchContacts();
    }
  }, [user]);

  const handleContactClick = async (contactId: string) => {
    if (user) {
      const chatId = await getOrCreateChat(user.uid, contactId);
      router.push(`/chat/${chatId}`);
    }
  };

  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Contacts</h2>
      </div>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id} className="mb-2">
            <button
              onClick={() => handleContactClick(contact.id)}
              className="block w-full text-left p-2 hover:bg-gray-200 rounded"
            >
              {contact.contactEmail}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Link
          href="/add-contact"
          className="block w-full bg-blue-500 text-white p-2 rounded text-center hover:bg-blue-600"
        >
          Add Contact
        </Link>
      </div>
      <div className="mt-auto">
        {user && (
          <button
            onClick={() => auth.signOut()}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
