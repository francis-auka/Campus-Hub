
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
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/utils/hustleDataFetcher";

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSendMessage: (message: string) => Promise<void>;
  isSubmitting?: boolean;
}

const ChatDialog = ({
  isOpen,
  onClose,
  task,
  onSendMessage,
  isSubmitting = false,
}: ChatDialogProps) => {
  const [chatMessage, setChatMessage] = useState("");

  const handleSendMessage = async () => {
    if (chatMessage.trim()) {
      await onSendMessage(chatMessage);
      setChatMessage("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Task Owner</DialogTitle>
          <DialogDescription>
            Send a message to {task?.user.name} about: {task?.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="chatMessage">Your Message</Label>
            <Textarea
              id="chatMessage"
              placeholder="Introduce yourself and ask questions about the task..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Be specific, professional, and respectful in your communication.
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={isSubmitting || !chatMessage.trim()}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-b-2 border-white"></div>
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
