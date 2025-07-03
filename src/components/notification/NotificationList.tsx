
import { Card, CardContent } from "@/components/ui/card";
import NotificationItem from "./NotificationItem";
import { Notification } from "@/types/notifications";

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  isLoading: boolean;
}

const NotificationList = ({ 
  notifications, 
  onNotificationClick, 
  isLoading 
}: NotificationListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-6 sm:py-8">
            <div className="h-6 w-6 sm:h-8 sm:w-8 mx-auto animate-spin rounded-full border-b-2 border-hustle-600"></div>
            <p className="mt-2 text-xs sm:text-sm text-gray-500">Loading notifications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">No notifications to display</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={onNotificationClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationList;
