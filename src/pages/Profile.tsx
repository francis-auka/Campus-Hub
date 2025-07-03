
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileDisplay from "@/components/profile/ProfileDisplay";
import { getPublicImageUrl } from "@/utils/fileUpload";

interface UserData {
  name: string;
  email: string;
  age: string;
  phone: string;
  school: string;
  course: string;
  year: string;
  sex: string;
  profilePicUrl: string;
  trustScore: number;
}

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    age: "",
    phone: "",
    school: "",
    course: "",
    year: "",
    sex: "",
    profilePicUrl: "",
    trustScore: 3.0
  });

  // Mock posted tasks
  const [tasks] = useState([
    {
      id: 1,
      title: "Help with Programming Assignment",
      description: "Need help with a Python assignment due in three days.",
      offer: "KSh 500",
      deadline: "2023-06-15",
      status: "Open",
      category: "Academic"
    },
    {
      id: 2,
      title: "Design a simple logo",
      description: "Need a logo for my student club.",
      offer: "KSh 300",
      deadline: "2023-06-20",
      status: "In Progress",
      category: "Design"
    }
  ]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error("Profile fetch error:", error);
          throw error;
        }
        
        if (data) {
          setUserData({
            name: data.name || "",
            email: user.email || "",
            age: data.age ? data.age.toString() : "",
            phone: data.phone || "",
            school: data.school || "",
            course: data.course || "",
            year: data.year || "",
            sex: data.sex || "",
            profilePicUrl: data.profile_pic_url || "",
            trustScore: data.trust_score || 3.0
          });
        }
      } catch (error: any) {
        toast({
          title: "Error loading profile",
          description: "Could not load your profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);

  const handleSaveProfile = async (profilePicUrl?: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const updateData = {
        name: userData.name,
        age: userData.age ? parseInt(userData.age) : null,
        phone: userData.phone,
        school: userData.school,
        course: userData.course,
        year: userData.year,
        sex: userData.sex,
        profile_pic_url: profilePicUrl || userData.profilePicUrl,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        profilePicUrl: profilePicUrl || prev.profilePicUrl
      }));
      
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully."
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Error updating profile",
        description: "Could not update your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isLoading && !isEditing) {
    return (
      <Layout>
        <div className="container py-8 flex justify-center items-center" style={{ minHeight: "70vh" }}>
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-hustle-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl py-4 md:py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-hustle-800 mb-4 md:mb-8">My Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4 md:mb-6 w-full overflow-x-auto flex">
            <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">My Tasks</TabsTrigger>
            <TabsTrigger value="school-id" className="flex-1">School ID</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 md:p-6">
                <div>
                  <CardTitle className="mb-1">Personal Information</CardTitle>
                  <CardDescription>Manage your profile details</CardDescription>
                </div>
                <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                  <Avatar className="h-16 w-16 md:h-20 md:w-20">
                    <AvatarImage 
                      src={userData.profilePicUrl ? getPublicImageUrl(userData.profilePicUrl) : ""} 
                      alt={userData.name} 
                    />
                    <AvatarFallback className="bg-hustle-100 text-hustle-800 text-xl">
                      {userData.name ? userData.name.split(' ').map(n => n?.[0] || '').join('') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-2 md:ml-4">
                    <p className="text-xl md:text-2xl font-semibold">{userData.name || "User"}</p>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`h-4 w-4 md:h-5 md:w-5 ${i < Math.floor(userData.trustScore) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600 text-sm md:text-base">{userData.trustScore.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {isEditing ? (
                  <ProfileForm
                    userData={userData}
                    setUserData={setUserData}
                    onSave={handleSaveProfile}
                    onCancel={handleCancelEdit}
                    isLoading={isLoading}
                    userId={user?.id || ""}
                  />
                ) : (
                  <ProfileDisplay
                    userData={userData}
                    onEdit={() => setIsEditing(true)}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>Tasks you've posted on Campus Hustle</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.map(task => (
                      <Card key={task.id} className="overflow-hidden">
                        <div className={`h-2 ${
                          task.status === 'Open' 
                            ? 'bg-green-500' 
                            : task.status === 'In Progress' 
                              ? 'bg-yellow-500' 
                              : 'bg-blue-500'
                        }`} />
                        <CardContent className="p-3 md:p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <div>
                              <h3 className="text-base md:text-lg font-semibold">{task.title}</h3>
                              <p className="text-sm text-gray-500">{task.description}</p>
                              <div className="flex flex-wrap mt-2 items-center gap-2 md:gap-4">
                                <span className="text-xs md:text-sm px-2 py-1 bg-gray-100 rounded">{task.category}</span>
                                <span className="text-xs md:text-sm font-medium text-hustle-600">{task.offer}</span>
                                <span className="text-xs text-gray-500">Due: {task.deadline}</span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              task.status === 'Open' 
                                ? 'bg-green-100 text-green-800' 
                                : task.status === 'In Progress' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            {task.status === 'In Progress' && (
                              <Button size="sm">Mark Complete</Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <p className="text-gray-500 mb-4">You haven't posted any tasks yet.</p>
                    <Button size="sm" className="md:size-default">Post Your First Hustle</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="school-id">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle>School ID Verification</CardTitle>
                <CardDescription>Your school ID is used to verify you are a student</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="border rounded-md p-4 md:p-6 text-center">
                  <p className="text-gray-500 mb-4 text-sm md:text-base">
                    School ID verification is not yet implemented. This feature will be available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
