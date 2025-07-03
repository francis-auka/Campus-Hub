
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Code, PenTool, DollarSign, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Open Tasks", value: "50", icon: BookOpen },
    { label: "Tech Tasks", value: "24", icon: Code },
    { label: "Academic Tasks", value: "18", icon: PenTool },
    { label: "Average Offer", value: "KSh 400", icon: DollarSign },
    { label: "Completed This Week", value: "32", icon: Clock },
  ];

  return (
    <Layout>
      <div className="container py-12 px-4 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-hustle-800">Campus Hustle Hub</h1>
          <p className="text-xl mb-8 text-gray-600 max-w-3xl mx-auto">
            Connect with fellow students, trade skills, and solve cash problems. Post tasks, 
            bid on opportunities, and build your campus reputation!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="hustle-gradient text-white font-bold py-6 px-8 text-lg"
              onClick={() => navigate("/post")}
            >
              Post a Hustle
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-hustle-600 text-hustle-700 font-bold py-6 px-8 text-lg"
              onClick={() => navigate("/browse")}
            >
              Browse Tasks
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-hustle-800">Platform Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border-hustle-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <stat.icon className="h-5 w-5 text-hustle-600" />
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-hustle-700">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <Card className="border-hustle-100">
            <CardHeader>
              <CardTitle className="text-2xl text-hustle-800">How It Works</CardTitle>
              <CardDescription>Get started in just three simple steps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-hustle-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-hustle-700">1</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Post Your Task</h3>
                  <p className="text-gray-600">Describe what you need help with and how much you're willing to offer.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-hustle-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-hustle-700">2</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Get Bids</h3>
                  <p className="text-gray-600">Fellow students will send you offers to complete your task.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-hustle-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-hustle-700">3</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Complete the Hustle</h3>
                  <p className="text-gray-600">Choose the best offer, communicate, and mark the task as complete.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-hustle-800">Ready to Get Started?</h2>
          <p className="text-lg mb-6 text-gray-600">Join hundreds of students already hustling on campus!</p>
          <Button 
            size="lg" 
            className="hustle-gradient text-white font-bold py-6 px-8 text-lg"
            onClick={() => navigate("/register")}
          >
            Sign Up Now
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
