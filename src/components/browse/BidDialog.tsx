
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/utils/hustleDataFetcher";
import { AlertCircle } from "lucide-react";

interface BidDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSubmitBid: (amount: string, message: string) => Promise<void>;
  isSubmitting?: boolean;
}

const BidDialog = ({
  isOpen,
  onClose,
  task,
  onSubmitBid,
  isSubmitting = false,
}: BidDialogProps) => {
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Reset form when dialog opens with a new task
  useEffect(() => {
    if (isOpen) {
      setBidAmount("");
      setBidMessage("");
      setError(null);
    }
  }, [isOpen, task]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      // Enforce the KSh 50 maximum limit
      const numericValue = parseInt(value || "0");
      if (numericValue <= 50) {
        setBidAmount(value);
        setError(null);
      } else {
        setBidAmount("50");
        setError("Maximum bid amount is KSh 50");
      }
    }
  };

  const handleSubmit = async () => {
    if (!bidAmount || parseInt(bidAmount) <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }
    
    if (!bidMessage.trim()) {
      setError("Please enter a message to the task poster");
      return;
    }
    
    await onSubmitBid(bidAmount, bidMessage);
    // Form will be reset when dialog closes due to the useEffect
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
          <DialogDescription>
            You're bidding on: {task?.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="bidAmount">Your Bid Amount (KSh)</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                KSh
              </span>
              <Input
                id="bidAmount"
                type="number"
                min="1"
                max="50"
                className="pl-12"
                placeholder="Enter amount (max KSh 50)"
                value={bidAmount}
                onChange={handleAmountChange}
              />
            </div>
            <p className="text-xs text-gray-500">
              Maximum bid amount is KSh 50
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bidMessage">Message to the Task Poster</Label>
            <Textarea
              id="bidMessage"
              placeholder="Describe why you're the right person for this task..."
              value={bidMessage}
              onChange={(e) => setBidMessage(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Include details about your experience and when you can complete the task.
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !bidAmount || !bidMessage.trim()}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-b-2 border-white"></div>
                Submitting...
              </span>
            ) : (
              "Submit Bid"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BidDialog;
