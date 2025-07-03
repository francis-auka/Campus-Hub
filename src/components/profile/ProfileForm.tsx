
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadProfilePicture } from "@/utils/fileUpload";
import { useToast } from "@/hooks/use-toast";
import { profileUpdateLimiter, fileUploadLimiter } from "@/utils/rateLimiter";

interface ProfileData {
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

interface ProfileFormProps {
  userData: ProfileData;
  setUserData: (data: ProfileData) => void;
  onSave: (profilePicUrl?: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  userId: string;
}

const ProfileForm = ({ 
  userData, 
  setUserData, 
  onSave, 
  onCancel, 
  isLoading,
  userId 
}: ProfileFormProps) => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size and type
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPG or PNG image",
          variant: "destructive",
        });
        return;
      }
      
      setProfilePic(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting for profile updates
    if (!profileUpdateLimiter.isAllowed(userId)) {
      const remainingTime = Math.ceil(profileUpdateLimiter.getRemainingTime(userId) / 1000 / 60);
      toast({
        title: "Too many updates",
        description: `Please wait ${remainingTime} minutes before updating again`,
        variant: "destructive",
      });
      return;
    }
    
    let updatedProfilePicUrl = userData.profilePicUrl;
    
    if (profilePic) {
      // Check rate limiting for file uploads
      if (!fileUploadLimiter.isAllowed(userId)) {
        const remainingTime = Math.ceil(fileUploadLimiter.getRemainingTime(userId) / 1000);
        toast({
          title: "Upload limit exceeded",
          description: `Please wait ${remainingTime} seconds before uploading again`,
          variant: "destructive",
        });
        return;
      }
      
      setIsUploading(true);
      const uploadResult = await uploadProfilePicture(profilePic, userId);
      setIsUploading(false);
      
      if (!uploadResult.success) {
        toast({
          title: "Upload failed",
          description: uploadResult.error,
          variant: "destructive",
        });
        return;
      }
      
      updatedProfilePicUrl = uploadResult.filePath || userData.profilePicUrl;
    }
    
    await onSave(updatedProfilePicUrl);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            value={userData.name} 
            onChange={(e) => setUserData({...userData, name: e.target.value.trim()})}
            required
            maxLength={100}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={userData.email} 
            readOnly 
            className="bg-gray-100"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input 
            id="age" 
            type="number"
            min="13"
            max="100"
            value={userData.age} 
            onChange={(e) => setUserData({...userData, age: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            type="tel"
            value={userData.phone} 
            onChange={(e) => setUserData({...userData, phone: e.target.value.trim()})}
            maxLength={20}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="school">School/University</Label>
          <Input 
            id="school" 
            value={userData.school} 
            onChange={(e) => setUserData({...userData, school: e.target.value.trim()})}
            maxLength={200}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="course">Course/Major</Label>
          <Input 
            id="course" 
            value={userData.course} 
            onChange={(e) => setUserData({...userData, course: e.target.value.trim()})}
            maxLength={200}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year of Study</Label>
          <Select 
            value={userData.year} 
            onValueChange={(value) => setUserData({...userData, year: value})}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">First Year</SelectItem>
              <SelectItem value="2">Second Year</SelectItem>
              <SelectItem value="3">Third Year</SelectItem>
              <SelectItem value="4">Fourth Year</SelectItem>
              <SelectItem value="5">Fifth Year</SelectItem>
              <SelectItem value="6">Graduate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sex">Gender</Label>
          <Select 
            value={userData.sex} 
            onValueChange={(value) => setUserData({...userData, sex: value})}
          >
            <SelectTrigger id="sex">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile">Profile Picture</Label>
          <Input 
            id="profile" 
            type="file" 
            accept=".jpg,.jpeg,.png"
            onChange={handleProfilePicChange}
          />
          {profilePic && (
            <p className="text-sm text-gray-600">
              Selected: {profilePic.name}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Max file size: 5MB. Supported formats: JPG, PNG
          </p>
        </div>
        
        <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
          <Button 
            type="button"
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading || isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading || isUploading}
          >
            {(isLoading || isUploading) ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
