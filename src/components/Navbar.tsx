import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  X, 
  Home, 
  Search, 
  PlusCircle, 
  User, 
  Info, 
  LogOut,
  Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isAuthenticated = !!user;

  const navigation = [
    { name: "Home", path: "/", icon: Home },
    { name: "Browse Tasks", path: "/browse", icon: Search },
    { name: "Post a Hustle", path: "/post", icon: PlusCircle },
    { name: "Messages", path: "/messages", icon: User },
    { name: "Profile", path: "/profile", icon: User },
    { name: "About", path: "/about", icon: Info },
  ];

  useEffect(() => {
    if (!user) return;
    
    fetchNotifications();
    
    // Subscribe to realtime notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `recipient_id=eq.${user.id}`
        }, 
        (payload) => {
          fetchNotifications();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      // Fetch unread messages
      const { data: messageData, error: messageError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('recipient_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (messageError) throw messageError;
      
      // Extract unique sender and hustle IDs
      const senderIds = [...new Set(messageData?.map(msg => msg.sender_id) || [])];
      const hustleIds = [...new Set(messageData?.map(msg => msg.hustle_id) || [])];
      
      // Fetch profile data for senders
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, profile_pic_url')
        .in('id', senderIds);
        
      if (profilesError) throw profilesError;
      
      // Create a map for easy profile lookup
      const profileMap = new Map();
      profilesData?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
      
      // Fetch hustle data
      const { data: hustlesData, error: hustlesError } = await supabase
        .from('hustles')
        .select('id, title')
        .in('id', hustleIds);
        
      if (hustlesError) throw hustlesError;
      
      // Create a map for easy hustle lookup
      const hustleMap = new Map();
      hustlesData?.forEach(hustle => {
        hustleMap.set(hustle.id, hustle);
      });
      
      // Combine data into notifications
      const enrichedNotifications = messageData?.map(msg => ({
        ...msg,
        profiles: profileMap.get(msg.sender_id) || { name: 'Unknown', profile_pic_url: null },
        hustles: hustleMap.get(msg.hustle_id) || { title: 'Unknown Hustle' }
      })) || [];
      
      setNotifications(enrichedNotifications);
      setUnreadCount(enrichedNotifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      
      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const viewNotification = (hustleId: string, senderId: string) => {
    // Mark the notification as read
    markAsRead(hustleId);
    // Navigate to messages
    navigate('/messages');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-hustle-800 font-bold text-xl">
                Campus<span className="text-hustle-600">Hustle</span>
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(item.path)
                        ? "bg-hustle-50 text-hustle-700"
                        : "text-gray-700 hover:text-hustle-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 bg-hustle-600 text-white text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="border-b border-gray-200 px-4 py-3">
                    <h3 className="text-sm font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className="p-4 hover:bg-gray-50 cursor-pointer"
                            onClick={() => viewNotification(notification.id, notification.sender_id)}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3">
                                <div className="h-8 w-8 rounded-full bg-hustle-100 flex items-center justify-center text-hustle-600">
                                  {notification.profiles?.name?.charAt(0) || '?'}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.profiles?.name || 'Unknown user'}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  Sent a message about: {notification.hustles?.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200 p-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-hustle-600 text-xs"
                      onClick={() => navigate('/notifications')}
                    >
                      View all notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-gray-700 border-gray-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="hustle-gradient text-white" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex justify-between items-center">
                      <span className="text-hustle-800 font-bold text-xl">
                        Campus<span className="text-hustle-600">Hustle</span>
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4 mt-4">
                  <div className="space-y-1">
                    {isAuthenticated && navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                          isActive(item.path)
                            ? "bg-hustle-50 text-hustle-700"
                            : "text-gray-700 hover:text-hustle-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                    {isAuthenticated && (
                      <Link
                        to="/notifications"
                        className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                          isActive("/notifications")
                            ? "bg-hustle-50 text-hustle-700"
                            : "text-gray-700 hover:text-hustle-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Bell className="mr-3 h-5 w-5" />
                        Notifications
                        {unreadCount > 0 && (
                          <Badge className="ml-2 bg-hustle-600 text-white">
                            {unreadCount}
                          </Badge>
                        )}
                      </Link>
                    )}
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      {isAuthenticated ? (
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-gray-700 border-gray-300"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-5 w-5 mr-3" />
                          Logout
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <Link 
                              to="/login" 
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Login
                            </Link>
                          </Button>
                          <Button className="hustle-gradient text-white w-full justify-start" asChild>
                            <Link 
                              to="/register" 
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Sign Up
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
