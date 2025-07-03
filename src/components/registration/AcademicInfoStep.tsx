
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RegistrationFormData } from "@/types/auth";

interface AcademicInfoStepProps {
  formData: RegistrationFormData;
  onChange: (name: string, value: string) => void;
  onSelectChange: (name: string, value: string) => void;
  onSchoolIdChange: (file: File | null) => void;
  schoolId: File | null;
  onNext: () => void;
  onBack: () => void;
}

const AcademicInfoStep = ({
  formData,
  onChange,
  onSelectChange,
  onSchoolIdChange,
  schoolId,
  onNext,
  onBack,
}: AcademicInfoStepProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSchoolIdChange(e.target.files[0]);
    }
  };

  const validateStep = () => {
    if (!schoolId) {
      toast({
        title: "School ID required",
        description: "Please upload your school ID to proceed",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="school">School/University</Label>
        <Input
          id="school"
          name="school"
          value={formData.school}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="course">Course/Major</Label>
        <Input
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="year">Year of Study</Label>
        <Select 
          value={formData.year} 
          onValueChange={(value) => onSelectChange("year", value)}
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
          value={formData.sex} 
          onValueChange={(value) => onSelectChange("sex", value)}
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
        <Label htmlFor="schoolId">Upload School ID*</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 mt-1">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2 flex text-sm text-gray-600 justify-center">
              <label
                htmlFor="schoolId"
                className="relative cursor-pointer rounded-md font-medium text-hustle-600 hover:text-hustle-500"
              >
                <span>Upload a file</span>
                <Input
                  id="schoolId"
                  name="schoolId"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={handleFileChange}
                  required
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PDF, JPG, or PNG up to 5MB
            </p>
          </div>
          {schoolId && (
            <div className="mt-4 flex items-center justify-center text-sm text-hustle-600">
              <span className="truncate max-w-xs">
                {schoolId.name}
              </span>
              <button
                type="button"
                className="ml-2 text-hustle-500 hover:text-hustle-700"
                onClick={() => onSchoolIdChange(null)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          We need to verify you're a student. Your ID will be stored securely.
        </p>
      </div>

      <div className="flex justify-between mt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </div>
    </>
  );
};

export default AcademicInfoStep;
