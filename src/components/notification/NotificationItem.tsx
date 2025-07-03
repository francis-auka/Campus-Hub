
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ProfileAvatar from "@/components/ProfileAvatar";
import { Notification } from "@/types/notifications";

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });
  
  return (
    <div 
      className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer ${
        !notification.read ? 'bg-gray-50' : ''
      }`}
      onClick={() => onClick(notification)}
    >
      <div className="flex items-start space-x-3">
        <ProfileAvatar 
          name={notification.sender_name || "Unknown User"} 
          profilePicUrl={notification.sender_profile_pic} 
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <span className="font-medium text-sm sm:text-base truncate">
              {notification.sender_name || "Unknown User"}
            </span>
            {!notification.read && (
              <Badge variant="secondary" className="ml-2 bg-hustle-600 text-white">
                New
              </Badge>
            )}
          </div>
          
          {notification.hustle_title && (
            <div className="text-xs sm:text-sm text-gray-700 mt-1">
              Re: {notification.hustle_title}
            </div>
          )}
          
          <div className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
            {notification.message}
          </div>
          
          <div className="text-xs text-gray-400 mt-1">
            {timeAgo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
