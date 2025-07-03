
import { formatDistanceToNow } from "date-fns";
import ProfileAvatar from "./ProfileAvatar";

interface MessageItemProps {
  message: {
    id: string;
    created_at: string;
    message: string;
    sender_id: string;
    read: boolean;
  };
  senderName: string;
  senderProfilePic?: string;
  hustleTitle?: string;
  isCurrentUser: boolean;
  onClick?: () => void;
}

const MessageItem = ({ 
  message, 
  senderName, 
  senderProfilePic, 
  hustleTitle, 
  isCurrentUser, 
  onClick 
}: MessageItemProps) => {
  const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
  
  if (onClick) {
    return (
      <div 
        className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer ${
          !message.read && !isCurrentUser ? 'bg-gray-50' : ''
        }`}
        onClick={onClick}
      >
        <div className="flex items-start space-x-3">
          <ProfileAvatar name={senderName} profilePicUrl={senderProfilePic} />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm sm:text-base truncate flex items-center">
              {senderName}
              {!message.read && !isCurrentUser && (
                <span className="ml-2 inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-hustle-600 text-white">
                  New
                </span>
              )}
            </div>
            {hustleTitle && (
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                {isCurrentUser ? `About: ${hustleTitle}` : `Re: ${hustleTitle}`}
              </div>
            )}
            <div className="text-xs sm:text-sm text-gray-500 mt-1 truncate max-w-full">
              {message.message}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {timeAgo}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[85%] sm:max-w-[80%] md:max-w-[70%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${
          isCurrentUser
            ? "bg-hustle-600 text-white"
            : "bg-gray-100"
        }`}
      >
        {!isCurrentUser && (
          <div className="font-medium text-xs mb-1">{senderName}</div>
        )}
        <div className="text-xs sm:text-sm md:text-base break-words">{message.message}</div>
        <div className={`text-xs mt-1 ${
          isCurrentUser
            ? "text-hustle-100"
            : "text-gray-500"
        }`}>
          {timeAgo}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
