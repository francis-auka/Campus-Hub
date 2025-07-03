
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, Star } from "lucide-react";
import ProfileAvatar from "@/components/ProfileAvatar";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    offer: string;
    category: string;
    status: "open" | "in progress" | "finished";
    deadline: string;
    assigned_to?: string;
    user: {
      id: string;
      name: string;
      trustScore: number;
    };
    bids: number;
  };
  categories: { value: string; label: string }[];
  onChatClick: () => void;
  onBidClick: () => void;
  onViewBidsClick?: () => void;
  onFinishClick?: () => void;
  isOwner?: boolean;
  statusColors: Record<string, string>;
  actionButton?: React.ReactElement;
}

const TaskCard = ({ 
  task, 
  categories, 
  onChatClick, 
  onBidClick, 
  onViewBidsClick, 
  onFinishClick,
  isOwner = false,
  statusColors,
  actionButton
}: TaskCardProps) => {
  // Format the deadline to a more readable format
  const formattedDeadline = new Date(task.deadline).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const categoryLabel = categories.find(c => c.value === task.category)?.label || task.category;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={`${statusColors[task.status]} transition-colors`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
          <Badge variant="outline" className="bg-gray-100">
            {categoryLabel}
          </Badge>
        </div>
        <h3 className="text-xl font-semibold">{task.title}</h3>
        <div className="flex items-center text-sm mt-1 text-gray-600">
          <div className="flex items-center">
            <ProfileAvatar 
              name={task.user.name} 
              size="sm" 
              profilePicUrl={null} 
            />
            <span className="ml-2">Posted by {task.user.name}</span>
          </div>
          <span className="flex items-center ml-2">
            {renderStars(task.user.trustScore)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="text-gray-700 text-sm line-clamp-3">{task.description}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Due: {formattedDeadline}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{task.bids} {task.bids === 1 ? 'bid' : 'bids'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 border-t">
        <div className="font-semibold text-lg">{task.offer}</div>
        <div className="flex space-x-2">
          {actionButton}
          {isOwner ? (
            <>
              {task.status === "open" && (
                <Button
                  variant="outline"
                  onClick={onViewBidsClick}
                  className="transition-colors"
                >
                  View Bids
                </Button>
              )}
              {task.status === "in progress" && (
                <Button
                  onClick={onFinishClick}
                  className="transition-colors"
                >
                  Mark Complete
                </Button>
              )}
            </>
          ) : (
            <>
              <Button 
                variant="outline"
                onClick={onChatClick}
                disabled={task.status !== "open"}
                className="transition-colors"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button 
                onClick={onBidClick}
                disabled={task.status !== "open"}
                className="transition-colors"
              >
                {task.status === "open" ? "Place Bid" : "Closed"}
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

const renderStars = (score: number) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(score)
              ? "text-yellow-500 fill-yellow-500"
              : i < score
              ? "text-yellow-500 fill-yellow-500 opacity-50"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default TaskCard;
