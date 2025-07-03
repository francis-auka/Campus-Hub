
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPublicImageUrl } from "@/utils/fileUpload";

interface ProfileAvatarProps {
  name: string;
  profilePicUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

const ProfileAvatar = ({ name, profilePicUrl, size = "md" }: ProfileAvatarProps) => {
  const displayName = name || "User";
  const initials = displayName.substring(0, 2).toUpperCase();
  
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 sm:h-10 sm:w-10 text-sm",
    lg: "h-12 w-12 sm:h-16 sm:w-16 text-base"
  };
  
  // Only generate URL if we have a valid, non-empty profile pic path
  const imageUrl = profilePicUrl && profilePicUrl.trim() !== "" ? 
    (profilePicUrl.startsWith('http') ? 
      profilePicUrl : 
      getPublicImageUrl(profilePicUrl)) 
    : undefined;
  
  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage 
        src={imageUrl} 
        alt={displayName}
        onError={() => console.log("Failed to load avatar image")}
      />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
