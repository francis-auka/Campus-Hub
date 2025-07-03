
import { Button } from "@/components/ui/button";

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

interface ProfileDisplayProps {
  userData: ProfileData;
  onEdit: () => void;
}

const ProfileDisplay = ({ userData, onEdit }: ProfileDisplayProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p className="mt-1 break-words">{userData.email || "Not provided"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Age</h3>
          <p className="mt-1">{userData.age || "Not provided"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
          <p className="mt-1">{userData.phone || "Not provided"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">School/University</h3>
          <p className="mt-1">{userData.school || "Not provided"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Course/Major</h3>
          <p className="mt-1">{userData.course || "Not provided"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Year of Study</h3>
          <p className="mt-1">{userData.year ? `Year ${userData.year}` : "Not provided"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Gender</h3>
          <p className="mt-1">{userData.sex || "Not provided"}</p>
        </div>
      </div>
      <div className="mt-6">
        <Button 
          onClick={onEdit}
          size="sm"
          className="md:size-default"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileDisplay;
