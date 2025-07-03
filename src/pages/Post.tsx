import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";

const categories = [
  { value: "tech", label: "Tech & Coding" },
  { value: "academic", label: "Academic" },
  { value: "creative", label: "Creative" },
  { value: "services", label: "Services" },
  { value: "other", label: "Other" },
];

const Post = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offerAmount: "",
    offerType: "cash", // 'cash' or 'trade'
    tradeDeal: "",
    category: "",
  });
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle character limits
    if (name === "title" && value.length > 50) return;
    if (name === "description" && value.length > 200) return;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deadline) {
      toast({
        title: "Deadline required",
        description: "Please select a deadline for your hustle.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Construct the final offer
      const finalOffer = formData.offerType === "cash" 
        ? `KSh ${formData.offerAmount}` 
        : `Trade: ${formData.tradeDeal}`;
      
      // Insert hustle into Supabase
      const { error } = await supabase
        .from('hustles')
        .insert({
          user_id: user?.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          offer_type: formData.offerType,
          offer_amount: formData.offerType === "cash" ? formData.offerAmount : null,
          trade_deal: formData.offerType === "trade" ? formData.tradeDeal : null,
          deadline: deadline.toISOString(),
          status: "open"
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Hustle posted!",
        description: "Your hustle has been successfully posted.",
      });
      
      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        offerAmount: "",
        offerType: "cash",
        tradeDeal: "",
        category: "",
      });
      setDeadline(undefined);
      
      // Redirect to browse page
      navigate("/browse");
    } catch (error) {
      console.error("Post error:", error);
      toast({
        title: "Error",
        description: "Failed to post your hustle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Post a Hustle</h1>
        <p className="text-gray-600 mb-8 text-center">
          Share what you need help with and find fellow students to assist you
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Hustle Details</CardTitle>
            <CardDescription>
              Tell us what you need help with
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g., Need help with Java programming assignment"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <div className="flex justify-end">
                  <span className="text-xs text-gray-500">
                    {formData.title.length}/50 characters
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what you need in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
                <div className="flex justify-end">
                  <span className="text-xs text-gray-500">
                    {formData.description.length}/200 characters
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>
                  Offer Type <span className="text-red-500">*</span>
                </Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="cash"
                      name="offerType"
                      value="cash"
                      checked={formData.offerType === "cash"}
                      onChange={() => handleSelectChange("offerType", "cash")}
                      className="h-4 w-4 text-hustle-600"
                    />
                    <Label htmlFor="cash" className="text-sm font-normal">
                      Cash
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="trade"
                      name="offerType"
                      value="trade"
                      checked={formData.offerType === "trade"}
                      onChange={() => handleSelectChange("offerType", "trade")}
                      className="h-4 w-4 text-hustle-600"
                    />
                    <Label htmlFor="trade" className="text-sm font-normal">
                      Trade/Skill Exchange
                    </Label>
                  </div>
                </div>
              </div>
              
              {formData.offerType === "cash" ? (
                <div className="space-y-2">
                  <Label htmlFor="offerAmount">
                    Amount (KSh) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      KSh
                    </span>
                    <Input
                      id="offerAmount"
                      name="offerAmount"
                      type="number"
                      min="0"
                      placeholder="500"
                      className="pl-12"
                      value={formData.offerAmount}
                      onChange={handleInputChange}
                      required={formData.offerType === "cash"}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="tradeDeal">
                    What are you offering? <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tradeDeal"
                    name="tradeDeal"
                    placeholder="E.g., 2 hours of math tutoring"
                    value={formData.tradeDeal}
                    onChange={handleInputChange}
                    required={formData.offerType === "trade"}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label>
                  Deadline <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Posting..." : "Post Hustle"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 bg-hustle-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Tips for a successful hustle post:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>Be clear and specific about what you need</li>
            <li>Set a reasonable price or fair trade offer</li>
            <li>Respond quickly to bids and questions</li>
            <li>Be respectful and professional in all communications</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Post;
