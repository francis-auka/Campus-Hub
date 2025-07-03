
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { getUserPayments, PaymentIntent, getPaymentIntent } from "@/utils/paymentDataFetcher";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  SmartphoneCharging, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Payments = () => {
  const [payments, setPayments] = useState<PaymentIntent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "sent" | "received">("all");
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const paymentData = await getUserPayments(user.id);
        setPayments(paymentData);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const refreshPayments = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      const paymentData = await getUserPayments(user.id);
      setPayments(paymentData);
    } catch (error) {
      console.error("Error refreshing payments:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // For updating a specific payment status (for demo purposes)
  const refreshPaymentStatus = async (paymentId: string) => {
    if (!user) return;
    
    try {
      const updatedPayment = await getPaymentIntent(paymentId);
      if (updatedPayment) {
        setPayments(prev => 
          prev.map(p => p.id === paymentId ? updatedPayment : p)
        );
      }
    } catch (error) {
      console.error("Error refreshing payment status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "processing":
        return <Clock className="h-4 w-4 mr-1" />;
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const filteredPayments = () => {
    if (activeTab === "sent") {
      return payments.filter(p => p.payerId === user?.id);
    } else if (activeTab === "received") {
      return payments.filter(p => p.payeeId === user?.id);
    }
    return payments;
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Your Payments</h1>
            <p className="text-gray-600">
              View your payment history and status
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as "all" | "sent" | "received")}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshPayments}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-green-600 rounded-full border-t-transparent"></div>
          </div>
        ) : filteredPayments().length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <SmartphoneCharging className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No payments found</h3>
              <p className="text-gray-500 mt-2 text-center max-w-sm">
                You haven't made or received any payments yet. Payments will appear here when you pay for completed tasks.
              </p>
              <Button 
                className="mt-6"
                onClick={() => navigate('/browse')}
              >
                Browse Tasks
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPayments().map((payment) => (
              <Card key={payment.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {payment.payerId === user?.id ? "Payment Sent" : "Payment Received"}
                      </CardTitle>
                      <CardDescription>
                        Reference: {payment.reference}
                      </CardDescription>
                    </div>
                    <Badge className={`flex items-center ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium">KSh {payment.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span>
                        {format(new Date(payment.createdAt), "MMM dd, yyyy HH:mm")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="flex items-center">
                        <SmartphoneCharging className="h-4 w-4 mr-1 text-green-600" />
                        <span className="capitalize">M-Pesa</span>
                      </span>
                    </div>
                    {payment.status === "pending" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => refreshPaymentStatus(payment.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Check Status
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Payments;
