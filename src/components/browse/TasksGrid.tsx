
import { Task } from "@/utils/taskDataFetcher";
import TaskCard from "@/components/TaskCard";
import PayNowButton from "@/components/browse/PayNowButton";

interface TasksGridProps {
  tasks: Task[];
  onBid: (task: Task) => void;
  onViewBids: (task: Task) => void;
  onOpenChat: (task: Task) => void;
  onPayNow: (task: Task) => void;
}

const TasksGrid = ({ tasks, onBid, onViewBids, onOpenChat, onPayNow }: TasksGridProps) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'tech', label: 'Tech' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'other', label: 'Other' }
  ];

  const statusColors = {
    'open': 'bg-green-100 text-green-800',
    'in progress': 'bg-yellow-100 text-yellow-800',
    'finished': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={{
            ...task,
            user: {
              ...task.user,
              trustScore: task.user.profile_pic_url ? 4 : 3 // Default trust score
            }
          }}
          categories={categories}
          onChatClick={() => onOpenChat(task)}
          onBidClick={() => onBid(task)}
          onViewBidsClick={() => onViewBids(task)}
          onFinishClick={() => {}}
          isOwner={false}
          statusColors={statusColors}
          actionButton={
            task.status === "in progress" && (
              <PayNowButton task={task} onPayNow={onPayNow} />
            )
          }
        />
      ))}
    </div>
  );
};

export default TasksGrid;
