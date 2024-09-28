import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { LoginSuccessContext } from "@/context/loginSuccess";

// Sweet Alert

const Register = () => {
  const [passConfirm, setPassConfirm] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setLoginSuccess }: any = useContext(LoginSuccessContext);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPassConfirm(false);
    setErr(false);
    setErrorMessage("");
    const form = e.target as HTMLFormElement;
    const dataRegister = {
      username: form.username.value,
      email: form.email.value,
      age: form.age.value,
      gender: form.gender.value,
      password: form.password.value,
    };
    if (form.password.value !== form.confirmPassword.value) {
      setTimeout(() => {
        setPassConfirm(true);
      }, 500);
      form.confirmPassword.value = "";
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(dataRegister),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await res.json();
    console.log(response);
    if (response.success === false) {
      setErr(true);
      setErrorMessage(response.message);
      form.email.value = "";
      form.password.value = "";
      form.confirmPassword.value = "";
      return;
    }
    setLoginSuccess(true);
    setTimeout(() => {
      setLoginSuccess(false);
    }, 2500);
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full h-[30em] overflow-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Daftar
        </h2>
        <form onSubmit={handleRegister} className="space-y-4 text-black">
          <div className="flex flex-col">
            {err && (
              <span className="ms-3 text-red-400 text-sm tracking-wider text-center">
                {errorMessage}
              </span>
            )}
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

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
              required
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Umur
            </label>
            <input
              id="age"
              type="number"
              name="age"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            >
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
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
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
            {passConfirm && (
              <span className="ms-3 text-red-400 text-sm tracking-wider">
                password not match
              </span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Daftar
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="font-medium text-red-600 hover:text-red-500"
            >
              Masuk di sini
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
