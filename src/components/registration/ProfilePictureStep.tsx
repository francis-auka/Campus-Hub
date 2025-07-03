
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface ProfilePictureStepProps {
  profilePic: File | null;
  onProfilePicChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void; // Changed this type to accept a form event
  onBack: () => void;
  isLoading: boolean;
  isUploading: boolean;
}

const ProfilePictureStep = ({
  profilePic,
  onProfilePicChange,
  onSubmit,
  onBack,
  isLoading,
  isUploading,
}: ProfilePictureStepProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onProfilePicChange(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="profilePic">Profile Picture (Optional)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 mt-1">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2 flex text-sm text-gray-600 justify-center">
              <label
                htmlFor="profilePic"
                className="relative cursor-pointer rounded-md font-medium text-hustle-600 hover:text-hustle-500"
              >
                <span>Upload a file</span>
                <Input
                  id="profilePic"
                  name="profilePic"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              JPG or PNG up to 5MB
            </p>
          </div>
          {profilePic && (
            <div className="mt-4 flex items-center justify-center text-sm text-hustle-600">
              <span className="truncate max-w-xs">
                {profilePic.name}
              </span>
              <button
                type="button"
                className="ml-2 text-hustle-500 hover:text-hustle-700"
                onClick={() => onProfilePicChange(null)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
        >
          Back
        </Button>
        
        <Button 
          type="submit" 
          disabled={isLoading || isUploading}
          onClick={(e) => onSubmit(e)} // Pass the event to the onSubmit function
        >
          {(isLoading || isUploading) ? "Creating account..." : "Create account"}
        </Button>
      </div>
    </>
  );
};

export default ProfilePictureStep;
