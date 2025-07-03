
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from "@/utils/hustleDataFetcher";
import BidsList from "@/components/BidsList";
import { Bid } from "@/types/auth";
import { AlertCircle } from "lucide-react";

interface ViewBidsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  bids: Bid[];
  onBidAssigned: () => void;
  isLoading: boolean;
}

const ViewBidsDialog = ({
  isOpen,
  onClose,
  task,
  bids,
  onBidAssigned,
  isLoading,
}: ViewBidsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Bids for {task?.title}</DialogTitle>
          <DialogDescription>
            Review bids and select someone to complete your task
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 overflow-y-auto flex-grow">
          {bids.length === 0 && !isLoading && (
            <div className="bg-amber-50 text-amber-700 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">No bids yet</p>
                <p className="text-sm mt-1">Check back later or share your task with more people.</p>
              </div>
            </div>
          )}
          
          <BidsList 
            hustleId={task?.id || ''} 
            bids={bids} 
            onBidAssigned={onBidAssigned}
            isLoading={isLoading}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBidsDialog;
