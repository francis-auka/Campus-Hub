
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import BrowseHeader from "@/components/browse/BrowseHeader";
import FilterBar from "@/components/browse/FilterBar";
import TasksGrid from "@/components/browse/TasksGrid";
import EmptyTasksView from "@/components/browse/EmptyTasksView";
import LoadingView from "@/components/browse/LoadingView";
import ViewBidsDialog from "@/components/browse/ViewBidsDialog";
import BidDialog from "@/components/browse/BidDialog";
import ChatDialog from "@/components/browse/ChatDialog";
import PaymentModal from "@/components/PaymentModal";
import { useBrowseTasks } from "@/hooks/useBrowseTasks";
import { useBrowseFilters } from "@/hooks/useBrowseFilters";
import { useBrowseBids } from "@/hooks/useBrowseBids";
import { useBrowseBidActions } from "@/hooks/useBrowseBidActions";
import { useBrowseChatActions } from "@/hooks/useBrowseChatActions";
import { usePaymentActions } from "@/hooks/usePaymentActions";
import { useAuth } from "@/context/AuthContext";

const Browse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/browse' } });
    }
  }, [user, navigate]);
  
  // Task hooks
  const { tasks, filteredTasks, isLoading, loadError, loadTasks, filterTasks, setFilteredTasks } = useBrowseTasks();
  
  // Filter hooks - now passing all required arguments
  const { filterOptions, handleApplyFilters, handleResetFilters } = useBrowseFilters(
    filterTasks,
    tasks,
    setFilteredTasks,
    loadTasks,
    loadError
  );
  
  // Apply filters when filter options change
  useEffect(() => {
    if (tasks.length > 0) {
      filterTasks(tasks, filterOptions);
    }
  }, [filterOptions, tasks, filterTasks]);
  
  // Bid viewing hooks
  const { 
    bids, 
    isLoadingBids, 
    selectedTask: bidsTask, 
    isViewBidsDialogOpen, 
    setIsViewBidsDialogOpen,
    handleViewBids
  } = useBrowseBids();
  
  // Bid actions hooks
  const { 
    isDialogOpen: isBidDialogOpen, 
    selectedTask: bidTask, 
    isSubmittingBid,
    setIsDialogOpen: setIsBidDialogOpen,
    handleOpenBidDialog,
    handleSubmitBid
  } = useBrowseBidActions(tasks, loadTasks, filteredTasks, setFilteredTasks);
  
  // Chat hooks
  const { 
    isChatDialogOpen, 
    selectedTask: chatTask, 
    isSubmittingMessage,
    setIsChatDialogOpen,
    handleOpenChatDialog,
    handleSendInitialMessage
  } = useBrowseChatActions();
  
  // Payment hooks
  const {
    isPaymentModalOpen,
    selectedTask: paymentTask,
    setIsPaymentModalOpen,
    handleOpenPaymentModal,
    handlePaymentComplete
  } = usePaymentActions();

  // Handle bid assigned
  const handleBidAssigned = () => {
    loadTasks();
    setIsViewBidsDialogOpen(false);
  };
  
  if (!user) {
    return null; // Prevent rendering while redirecting
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'tech', label: 'Tech' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-4 px-4 md:py-6">
        <BrowseHeader />
        
        <FilterBar 
          initialFilters={filterOptions}
          categories={categories}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
        
        {isLoading ? (
          <LoadingView />
        ) : loadError ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">Error loading hustles</h3>
            <p className="text-gray-500 mt-2">{loadError}</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyTasksView onResetFilters={handleResetFilters} />
        ) : (
          <TasksGrid 
            tasks={filteredTasks}
            onBid={(task) => handleOpenBidDialog(task)} 
            onViewBids={(task) => user && handleViewBids(task, user.id)}
            onOpenChat={(task) => user && handleOpenChatDialog(task, user.id)}
            onPayNow={(task) => handleOpenPaymentModal(task)}
          />
        )}
        
        {/* Bid dialog */}
        <BidDialog
          isOpen={isBidDialogOpen}
          onClose={() => setIsBidDialogOpen(false)}
          task={bidTask}
          onSubmitBid={(amount, message) => user && handleSubmitBid(amount, message, user.id, user.email || '')}
          isSubmitting={isSubmittingBid}
        />
        
        {/* View bids dialog */}
        <ViewBidsDialog
          isOpen={isViewBidsDialogOpen}
          onClose={() => setIsViewBidsDialogOpen(false)}
          task={bidsTask}
          bids={bids}
          onBidAssigned={handleBidAssigned}
          isLoading={isLoadingBids}
        />
        
        {/* Chat dialog */}
        <ChatDialog 
          isOpen={isChatDialogOpen}
          onClose={() => setIsChatDialogOpen(false)}
          task={chatTask}
          onSendMessage={(message) => user && handleSendInitialMessage(message, user.id)}
          isSubmitting={isSubmittingMessage}
        />
        
        {/* Payment modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          task={paymentTask}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    </Layout>
  );
};

export default Browse;
