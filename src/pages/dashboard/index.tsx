import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/pages/lib/firebase/config";
import Layout from "@/components/layout";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/router";

const DashboardPage: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Layout title="Dashboard">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">
            Welcome, {user.displayName}!
          </h1>
          <p>Select a chat from the sidebar or start a new conversation.</p>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
