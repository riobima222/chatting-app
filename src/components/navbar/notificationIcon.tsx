import { ChatAppearContext } from "@/context/chatAppear";
import { NotificationAppearContext } from "@/context/notificationAppear";
import { SearchAppearContext } from "@/context/searchAppear";
import { useContext } from "react";
import { FaBell } from "react-icons/fa";

interface NotificationIconProps {
  notificationCount?: number; // jumlah notifikasi yang diterima
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  notificationCount = 2,
}) => {
  // CONTEXT
  const { setNotificationAppear }: any = useContext(NotificationAppearContext);
  const { setChatAppear }: any = useContext(ChatAppearContext);
  const { setSearchAppear }: any = useContext(SearchAppearContext);

  const handleClick = () => {
    setNotificationAppear(true);
    setChatAppear(false);
    setSearchAppear(false);
  };

  return (
    <div onClick={handleClick} className="relative inline-block">
      {/* Icon Notification */}
      <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white p-2 rounded-full hover:bg-gradient-to-r hover:from-red-400 hover:via-pink-400 hover:to-purple-400 transition-colors duration-300 ease-in-out cursor-pointer">
        <FaBell className="w-4 h-4 text-white" />
      </div>

      {/* Badge Notification */}
      {notificationCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 border-2 border-white rounded-full transform translate-x-1/2 -translate-y-1/2">
          {notificationCount}
        </span>
      )}
    </div>
  );
};

export default NotificationIcon;
