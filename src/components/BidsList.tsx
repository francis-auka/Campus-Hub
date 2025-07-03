
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ProfileAvatar from "@/components/ProfileAvatar";
import { assignBid } from "@/utils/taskDataFetcher";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

interface Bid {
  id: string;
  bidder_id: string;
  bid_amount: string;
  message: string;
  created_at: string;
  bidder_name: string;
  bidder_profile_pic?: string;
}

interface BidsListProps {
  hustleId: string;
  bids: Bid[];
  onBidAssigned: () => void;
  isLoading: boolean;
}

const BidsList = ({ hustleId, bids, onBidAssigned, isLoading }: BidsListProps) => {
  const [assigningBid, setAssigningBid] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAssignBid = async (bid: Bid) => {
    try {
      setAssigningBid(bid.id);
      
      const { success, error } = await assignBid(hustleId, bid.bidder_id);
      
      if (!success) throw new Error(error || "Failed to assign bid");
      
      toast({
        title: "Task assigned successfully!",
        description: `You've assigned this task to ${bid.bidder_name}`,
      });
      
      onBidAssigned();
    } catch (error) {
      console.error("Error assigning bid:", error);
      toast({
        title: "Error",
        description: "Failed to assign bid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAssigningBid(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-6">
            <div className="h-6 w-6 mx-auto animate-spin rounded-full border-b-2 border-hustle-600"></div>
            <p className="mt-2 text-sm text-gray-500">Loading bids...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bids.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-6 text-gray-500">No bids have been placed yet</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Bids ({bids.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {bids.map((bid) => (
              <div key={bid.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <ProfileAvatar 
                    name={bid.bidder_name} 
                    profilePicUrl={bid.bidder_profile_pic} 
                    size="md" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{bid.bidder_name}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{new Date(bid.created_at).toLocaleString()}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md mt-2 text-gray-700">
                          {bid.message}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-lg text-hustle-700">{bid.bid_amount}</span>
                        <Button
                          className="mt-2"
                          onClick={() => handleAssignBid(bid)}
                          disabled={assigningBid === bid.id}
                        >
                          {assigningBid === bid.id ? (
                            <span className="flex items-center">
                              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-b-2 border-white"></div>
                              Assigning...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Assign Task
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BidsList;
