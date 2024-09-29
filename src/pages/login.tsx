import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth } from "@/pages/lib/firebase/config";
import { setCookie } from "nookies";

// Sweet Alert
import Swal from "sweetalert2";
import { LoginSuccessContext } from "@/context/loginSuccess";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginSuccess }: any = useContext(LoginSuccessContext);
  const [error, setError] = useState(false);
  const router = useRouter();


  useEffect(() => {
    if (loginSuccess) {
      Swal.fire({
        title: "Register Berhasil !",
        text: "",
        timer: 2000,
        icon: "success",
        confirmButtonText: "Close",
      });
    }
  }, [loginSuccess]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    try {
      const userCredential: any = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const accessToken = await userCredential.user.getIdToken();
      setCookie(null, "token", accessToken, {
        maxAge: 30 * 24 * 60 * 60, // Contoh: cookies akan berlaku selama 30 hari
        path: "/", // Lokasi cookies
        secure: true, // Secure cookies hanya berlaku di HTTPS
        sameSite: "strict", // Proteksi dari CSRF
      });
      router.push("/");
    } catch (err: any) {
      setTimeout(() => {
        setError(true);
      }, 300);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm tracking-wider text-center">
              Email or password is incorrect
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Login
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-red-600 hover:text-red-500"
            >
              Daftar di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
