const HomeComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-6">
      {/* Container utama */}
      <div className="bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-xl shadow-lg text-center max-w-md w-full space-y-4 transform transition-transform hover:scale-105">
        {/* Ilustrasi SVG */}
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            className="text-indigo-200 drop-shadow-md animate-[bounce_2s_ease-in-out_infinite]"
            fill="currentColor"
          >
            <path d="M12 2a10 10 0 1 0 6.32 18.02l3.73.98a1 1 0 0 0 1.23-1.23l-.98-3.73A10 10 0 0 0 12 2zm4.13 15.13-1.9-.5a1 1 0 0 0-.92.26A7.95 7.95 0 0 1 12 20a8 8 0 1 1 8-8 7.95 7.95 0 0 1-3.11 6.31 1 1 0 0 0-.26.92l.5 1.9-1.9-.5a1 1 0 0 0-.92.26A7.95 7.95 0 0 1 12 20a8 8 0 1 1 8-8 7.95 7.95 0 0 1-3.11 6.31 1 1 0 0 0-.26.92l.5 1.9-1.9-.5a1 1 0 0 0-.92.26A7.95 7.95 0 0 1 12 20a8 8 0 1 1 8-8 7.95 7.95 0 0 1-3.11 6.31 1 1 0 0 0-.26.92l.5 1.9-1.9-.5z" />
          </svg>
        </div>

        {/* Teks Sambutan */}
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          Welcome to Erchat
        </h1>
        <p className="text-white text-sm text-opacity-80 leading-relaxed">
          Connect with friends around the world. Start chatting and stay
          connected with just a click away!
        </p>
      </div>

      {/* Footer */}
      <footer className="text-center mt-8 text-sm text-white text-opacity-50">
        <p>ChatApp © {new Date().getFullYear()} | Bringing People Together</p>
      </footer>
    </div>
  );
};
export default HomeComponent;
