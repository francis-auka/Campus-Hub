
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RegistrationFormData, STORAGE_BUCKETS } from "@/types/auth";

// Import our new components
import PersonalInfoStep from "@/components/registration/PersonalInfoStep";
import AcademicInfoStep from "@/components/registration/AcademicInfoStep";
import ProfilePictureStep from "@/components/registration/ProfilePictureStep";
import RegistrationStepper from "@/components/registration/RegistrationStepper";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    phone: "",
    school: "",
    course: "",
    year: "1",
    sex: "Prefer not to say",
  });
  const [schoolId, setSchoolId] = useState<File | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { signUp, isLoading } = useAuth();
  const { toast } = useToast();

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const uploadFiles = async () => {
    let schoolIdUrl = "";
    let profilePicUrl = "";
    
    try {
      setIsUploading(true);
      
      // Upload school ID to private bucket
      if (schoolId) {
        const fileExt = schoolId.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKETS.PRIVATE_DOCUMENTS)
          .upload(filePath, schoolId);
          
        if (uploadError) throw uploadError;
        
        schoolIdUrl = filePath;
      }
      
      // Upload profile picture to public bucket if provided
      if (profilePic) {
        const fileExt = profilePic.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKETS.PUBLIC_MEDIA)
          .upload(filePath, profilePic);
          
        if (uploadError) throw uploadError;
        
        profilePicUrl = filePath;
      }
      
      return { schoolIdUrl, profilePicUrl };
    } catch (error: any) {
      toast({
        title: "Error uploading files",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { schoolIdUrl: "", profilePicUrl: "" };
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { schoolIdUrl, profilePicUrl } = await uploadFiles();
      
      const userData = {
        name: formData.name,
        age: formData.age,
        phone: formData.phone,
        school: formData.school,
        course: formData.course,
        year: formData.year,
        sex: formData.sex,
        profile_pic_url: profilePicUrl,
        school_id_url: schoolIdUrl
      };
      
      await signUp(formData.email, formData.password, userData);
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Campus Hustle Hub and start connecting with fellow students
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <RegistrationStepper step={step}>
            {step === 1 && (
              <PersonalInfoStep
                formData={formData}
                onChange={handleChange}
                onNext={nextStep}
              />
            )}
            
            {step === 2 && (
              <AcademicInfoStep
                formData={formData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onSchoolIdChange={setSchoolId}
                schoolId={schoolId}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            
            {step === 3 && (
              <ProfilePictureStep
                profilePic={profilePic}
                onProfilePicChange={setProfilePic}
                onSubmit={(e) => handleSubmit(e)}
                onBack={prevStep}
                isLoading={isLoading}
                isUploading={isUploading}
              />
            )}
          </RegistrationStepper>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-hustle-600 font-medium hover:text-hustle-800">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
