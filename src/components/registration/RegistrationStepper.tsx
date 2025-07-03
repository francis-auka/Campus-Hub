
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface RegistrationStepperProps {
  step: number;
  children: React.ReactNode;
}

const RegistrationStepper = ({ step, children }: RegistrationStepperProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register - Step {step} of 3</CardTitle>
        <CardDescription>
          {step === 1 && "Create your account and set a password"}
          {step === 2 && "Tell us about yourself and verify your student status"}
          {step === 3 && "Upload your profile picture and complete registration"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default RegistrationStepper;
