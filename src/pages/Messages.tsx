
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage, Hustle } from "@/types/auth";
import ProfileAvatar from "@/components/ProfileAvatar";
import MessageItem from "@/components/MessageItem";
import { fetchProfilesData } from "@/utils/profileDataFetcher";

interface ChatPartner {
  id: string;
  name: string;
  hustleId: string;
  hustleTitle: string;
  profilePic?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

const Messages = () => {
  const [chatPartners, setChatPartners] = useState<ChatPartner[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageProfiles, setMessageProfiles] = useState<Map<string, any>>(new Map());
  const [newMessage, setNewMessage] = useState("");
  const [currentHustle, setCurrentHustle] = useState<Hustle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    fetchChatPartners();
    
    const channel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `recipient_id=eq.${user.id}`
        }, 
        (payload) => {
          fetchChatPartners();
          if (selectedChat === payload.new.sender_id) {
            fetchMessages(selectedChat);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
      markMessagesAsRead(selectedChat);
    }
  }, [selectedChat]);

  const fetchChatPartners = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch all chat messages for the current user
      const { data: chatMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      if (!chatMessages || chatMessages.length === 0) {
        setIsLoading(false);
        setChatPartners([]);
        return;
      }

      // Extract unique partner IDs and hustle IDs
      const partners = new Map<string, ChatPartner>();
      const uniquePartnerIds: string[] = [];
      const uniqueHustleIds: string[] = [];
      
      for (const message of chatMessages) {
        const partnerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        if (!uniquePartnerIds.includes(partnerId)) {
          uniquePartnerIds.push(partnerId);
        }
        if (!uniqueHustleIds.includes(message.hustle_id)) {
          uniqueHustleIds.push(message.hustle_id);
        }
      }
      
      // Fetch profile information using our utility
      const profileMap = await fetchProfilesData(uniquePartnerIds);
      
      // Fetch hustle details
      const { data: hustlesData, error: hustlesError } = await supabase
        .from('hustles')
        .select('id, title, user_id')
        .in('id', uniqueHustleIds);
          
      if (hustlesError) throw hustlesError;
      
      // Create a hustle lookup map
      const hustleMap = new Map();
      hustlesData?.forEach(hustle => {
        hustleMap.set(hustle.id, {
          title: hustle.title || 'Unknown Hustle',
          userId: hustle.user_id
        });
      });
      
      // Process chat messages to create chat partners list
      for (const message of chatMessages) {
        const partnerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        const hustle = hustleMap.get(message.hustle_id);
        
        if (!hustle) continue; // Skip if hustle not found
        
        const mapKey = `${partnerId}-${message.hustle_id}`;
        
        if (!partners.has(mapKey)) {
          const profile = profileMap.get(partnerId);
          
          // Count unread messages
          const { count, error: countError } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', user.id)
            .eq('sender_id', partnerId)
            .eq('hustle_id', message.hustle_id)
            .eq('read', false);

          if (countError) {
            console.error("Error counting unread:", countError);
          }

          partners.set(mapKey, {
            id: partnerId,
            name: profile?.name || 'Unknown User',
            hustleId: message.hustle_id,
            hustleTitle: hustle.title,
            profilePic: profile?.profile_pic_url,
            lastMessage: message.message,
            lastMessageTime: new Date(message.created_at).toLocaleString(),
            unreadCount: count || 0
          });
        }
      }

      setChatPartners(Array.from(partners.values()));
    } catch (error) {
      console.error("Error fetching chat partners:", error);
      toast({
        title: "Error",
        description: "Failed to load your conversations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    if (!user) return;

    try {
      const selectedPartner = chatPartners.find(p => p.id === partnerId);
      if (!selectedPartner) return;

      const hustleId = selectedPartner.hustleId;

      const { data: hustleData, error: hustleError } = await supabase
        .from('hustles')
        .select('*')
        .eq('id', hustleId)
        .single();

      if (hustleError) throw hustleError;
      setCurrentHustle(hustleData);

      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('hustle_id', hustleId)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      
      if (!messagesData) {
        setMessages([]);
        return;
      }
      
      setMessages(messagesData);
      
      // Fetch profiles for message senders
      const uniqueSenderIds = [...new Set(messagesData.map(msg => msg.sender_id))];
      const profileMap = await fetchProfilesData(uniqueSenderIds);
      setMessageProfiles(profileMap);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const markMessagesAsRead = async (partnerId: string) => {
    if (!user) return;

    try {
      const selectedPartner = chatPartners.find(p => p.id === partnerId);
      if (!selectedPartner) return;

      const hustleId = selectedPartner.hustleId;

      const { error } = await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('recipient_id', user.id)
        .eq('sender_id', partnerId)
        .eq('hustle_id', hustleId)
        .eq('read', false);

      if (error) throw error;

      setChatPartners(prev => 
        prev.map(partner => 
          partner.id === partnerId && partner.hustleId === hustleId
            ? { ...partner, unreadCount: 0 }
            : partner
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !selectedChat || !newMessage.trim() || !currentHustle) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          hustle_id: currentHustle.id,
          sender_id: user.id,
          recipient_id: selectedChat,
          message: newMessage.trim(),
          read: false
        });

      if (error) throw error;

      setNewMessage("");
      fetchMessages(selectedChat);
      fetchChatPartners();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Helper to get sender name for a message
  const getSenderName = (senderId: string) => {
    if (senderId === user?.id) {
      return "You";
    }
    
    const profile = messageProfiles.get(senderId);
    return profile?.name || selectedChat ? chatPartners.find(p => p.id === selectedChat)?.name || "Unknown User" : "Unknown User";
  };

  return (
    <Layout>
      <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Messages</h1>
        <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
          Communicate with other users about hustle tasks
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center h-36 sm:h-48 md:h-64">
            <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-b-2 border-hustle-600"></div>
            <p className="ml-2 sm:ml-3 text-gray-500 text-xs sm:text-sm">Loading conversations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="md:col-span-1 order-2 md:order-1">
              <Card className="h-full">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-base sm:text-lg">Conversations</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Select a conversation to view messages
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 max-h-[300px] sm:max-h-[400px] md:max-h-[500px] overflow-y-auto">
                  {chatPartners.length > 0 ? (
                    <div className="divide-y">
                      {chatPartners.map((partner) => (
                        <div
                          key={partner.id + partner.hustleId}
                          className={`p-2 sm:p-3 md:p-4 cursor-pointer hover:bg-gray-50 ${
                            selectedChat === partner.id ? "bg-gray-100" : ""
                          }`}
                          onClick={() => setSelectedChat(partner.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <ProfileAvatar 
                              name={partner.name}
                              profilePicUrl={partner.profilePic}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs sm:text-sm md:text-base truncate">{partner.name}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {partner.hustleTitle}
                              </p>
                              <p className="text-xs text-gray-500 truncate hidden sm:block">
                                {partner.lastMessage}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="text-xs text-gray-500 hidden sm:block">
                                {partner.lastMessageTime}
                              </p>
                              {partner.unreadCount && partner.unreadCount > 0 ? (
                                <div className="bg-hustle-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center mt-1">
                                  {partner.unreadCount}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 sm:py-8 text-center">
                      <p className="text-gray-500 text-xs sm:text-sm">No conversations yet</p>
                      <Button
                        variant="outline"
                        className="mt-3 sm:mt-4 text-xs sm:text-sm"
                        onClick={() => navigate('/browse')}
                      >
                        Browse Tasks
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2 order-1 md:order-2">
              <Card className="h-full flex flex-col">
                {selectedChat ? (
                  <>
                    <CardHeader className="border-b p-3 sm:p-4">
                      <CardTitle className="text-sm sm:text-base md:text-lg">
                        {chatPartners.find(p => p.id === selectedChat)?.name || 'Chat'}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {currentHustle?.title || ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto p-3 sm:p-4 max-h-[250px] sm:max-h-[300px] md:max-h-[400px]">
                      {messages.length > 0 ? (
                        <div className="space-y-2 sm:space-y-3 md:space-y-4">
                          {messages.map((message) => (
                            <MessageItem
                              key={message.id}
                              message={message}
                              senderName={getSenderName(message.sender_id)}
                              senderProfilePic={messageProfiles.get(message.sender_id)?.profile_pic_url}
                              isCurrentUser={message.sender_id === user?.id}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-gray-500 text-xs sm:text-sm">No messages yet</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t p-2 sm:p-3 md:p-4">
                      <div className="flex w-full space-x-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-grow text-xs sm:text-sm resize-none max-h-20 sm:max-h-24"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          className="whitespace-nowrap"
                          size="sm"
                        >
                          Send
                        </Button>
                      </div>
                    </CardFooter>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
                    <div className="text-center">
                      <h3 className="text-sm sm:text-base md:text-lg font-medium mb-2">Select a conversation</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        Choose a conversation from the list to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Messages;
