
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import NotificationList from "@/components/notification/NotificationList";
import { Notification } from "@/types/notifications";
import { 
  fetchUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "@/services/notifications";

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    loadNotifications();
    
    // Setup realtime subscription for new notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `recipient_id=eq.${user.id}`
        }, 
        () => {
          loadNotifications();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const notificationData = await fetchUserNotifications(user.id);
      setNotifications(notificationData);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to update notification",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await markAllNotificationsAsRead(user.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.type === 'message') {
      navigate('/messages');
    } else {
      // For other notification types
      navigate(`/hustle/${notification.hustle_id}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Notifications</h1>
            <p className="text-gray-600 mt-1 text-xs sm:text-sm">
              Stay updated with your latest activity
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm" className="w-full sm:w-auto">
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-3 sm:mb-4 w-full justify-start">
            <TabsTrigger value="all" className="flex-1 sm:flex-none text-xs sm:text-sm">
              All
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">{notifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 sm:flex-none text-xs sm:text-sm">
              Unread
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">{unreadCount}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <NotificationList 
              notifications={notifications} 
              onNotificationClick={handleNotificationClick} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="unread">
            <NotificationList 
              notifications={notifications.filter(n => !n.read)} 
              onNotificationClick={handleNotificationClick} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Notifications;
