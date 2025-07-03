
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createPaymentIntent, initiateMpesaPayment } from "@/utils/paymentDataFetcher";
import { Loader2, SmartphoneCharging, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Task } from "@/utils/taskDataFetcher";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onPaymentComplete: () => void;
}

const formatPhoneNumber = (input: string): string => {
  // Only allow numbers
  const cleaned = input.replace(/\D/g, '');
  
  // Apply Kenyan phone format (+254)
  if (cleaned.length > 0) {
    if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else {
      return '254' + cleaned;
    }
  }
  
  return cleaned;
};

const PaymentModal = ({
  isOpen,
  onClose,
  task,
  onPaymentComplete,
}: PaymentModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'input' | 'processing' | 'success' | 'error'>('input');
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
  };

  const resetModal = () => {
    setStep('input');
    setPhoneNumber("");
    setErrorMessage("");
  };

  const handleClose = () => {
    onClose();
    // Reset after animation completes
    setTimeout(resetModal, 300);
  };

  const handlePayment = async () => {
    if (!task || !user) return;
    
    // Basic phone number validation
    if (phoneNumber.length < 12) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Kenyan phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setStep('processing');
    
    try {
      // 1. Create payment intent in our database
      const amount = task.offer_type === "cash" && task.offer_amount 
        ? parseInt(task.offer_amount, 10) 
        : 0;
      
      const { success: intentSuccess, paymentIntent, error: intentError } = await createPaymentIntent(
        task.id,
        amount,
        user.id,
        task.user.id
      );
      
      if (!intentSuccess || !paymentIntent) {
        throw new Error(intentError || "Failed to create payment record");
      }
      
      // 2. Initiate M-Pesa payment
      const { success: mpesaSuccess, error: mpesaError } = await initiateMpesaPayment(
        phoneNumber,
        amount,
        paymentIntent.reference
      );
      
      if (!mpesaSuccess) {
        throw new Error(mpesaError || "Failed to initiate M-Pesa payment");
      }
      
      // Show success state
      setStep('success');
      
      toast({
        title: "Payment initiated",
        description: "Please check your phone for the M-Pesa payment prompt",
      });
      
      // Close after showing success for a moment
      setTimeout(() => {
        onPaymentComplete();
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error("Payment error:", error);
      setStep('error');
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
      
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-12 w-12 text-green-500 animate-spin mb-4" />
            <p className="text-center font-medium">Processing your payment request...</p>
            <p className="text-center text-sm text-gray-500 mt-2">
              This usually takes just a few seconds
            </p>
          </div>
        );
        
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-10">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-center font-medium text-lg">M-Pesa request sent successfully!</p>
            <p className="text-center text-sm text-gray-500 mt-2">
              Please check your phone for the M-Pesa prompt
            </p>
          </div>
        );
        
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-center font-medium text-lg">Payment failed</p>
            <p className="text-center text-sm text-red-500 mt-2 mb-6">
              {errorMessage}
            </p>
            <Button onClick={() => setStep('input')}>Try Again</Button>
          </div>
        );
        
      default:
        return (
          <>
            <div className="py-4">
              <p className="text-sm text-gray-700 mb-4">
                Task: <span className="font-medium">{task?.title}</span>
              </p>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    +
                  </span>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="254700000000"
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Format: 254XXXXXXXXX (Kenyan phone number)
                </p>
              </div>
              
              {task?.offer_type === "cash" && task.offer_amount && (
                <div className="mt-4 bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium">Payment Details:</p>
                  <p className="text-sm">Amount: <span className="font-bold">KSh {task.offer_amount}</span></p>
                  <div className="mt-2 text-xs text-green-600 flex items-center">
                    <SmartphoneCharging className="h-3 w-3 mr-1" />
                    Payment via M-Pesa
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex space-x-2 sm:justify-between">
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                onClick={handlePayment} 
                disabled={isSubmitting || !phoneNumber || phoneNumber.length < 12}
                className="bg-green-600 hover:bg-green-700"
              >
                <SmartphoneCharging className="h-4 w-4 mr-2" />
                Pay with M-Pesa
              </Button>
            </DialogFooter>
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'input' && "Make Payment with M-Pesa"}
            {step === 'processing' && "Processing Payment"}
            {step === 'success' && "Payment Initiated"}
            {step === 'error' && "Payment Failed"}
          </DialogTitle>
          <DialogDescription>
            {step === 'input' && "Enter your M-Pesa phone number to complete the payment"}
          </DialogDescription>
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
