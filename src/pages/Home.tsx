
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Users, Clock, Award } from "lucide-react";

const Home = () => {
  // Mock statistics - will be replaced with Supabase data
  const stats = {
    tasksThisWeek: 50,
    totalUsers: 120,
    totalCompletedTasks: 250,
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-hustle-600 to-hustle-700 text-white">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Connect, Hustle & Grow <br />on Campus
              </h1>
              <p className="text-lg md:text-xl mb-6 text-hustle-50">
                The platform for Kenyan university students to post tasks,
                help peers and earn money using their skills.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button size="lg" asChild className="bg-white text-hustle-700 hover:bg-hustle-50">
                  <Link to="/post">
                    Post a Hustle <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-hustle-600">
                  <Link to="/browse">
                    Browse Tasks
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80"
                  alt="Students collaborating"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-hustle-50">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
              <div className="rounded-full bg-hustle-100 p-3 mr-4">
                <Briefcase className="h-6 w-6 text-hustle-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tasks This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tasksThisWeek}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
              <div className="rounded-full bg-hustle-100 p-3 mr-4">
                <Users className="h-6 w-6 text-hustle-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Registered Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
              <div className="rounded-full bg-hustle-100 p-3 mr-4">
                <Award className="h-6 w-6 text-hustle-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCompletedTasks}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-gray-900">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Campus Hustle Hub makes it easy to connect with other students and get things done.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-hustle-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-hustle-700">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post Your Task</h3>
              <p className="text-gray-600">
                Share what you need help with and how much you're willing to pay or trade.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-hustle-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-hustle-700">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Review Bids</h3>
              <p className="text-gray-600">
                See who's willing to help, their rates, and check their trust scores.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-hustle-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-hustle-700">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Complete</h3>
              <p className="text-gray-600">
                Chat with your chosen helper, coordinate, and get your task done.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/register">
                Join Campus Hustle Hub Today
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-gray-900">Popular Categories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the most common types of tasks students are posting.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              to="/browse?category=tech"
              className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 mx-auto mb-4 bg-hustle-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hustle-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Tech & Coding</h3>
              <p className="text-sm text-gray-600">Programming, websites, apps</p>
            </Link>

            <Link 
              to="/browse?category=academic"
              className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 mx-auto mb-4 bg-hustle-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hustle-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Academic</h3>
              <p className="text-sm text-gray-600">Assignments, tutoring, research</p>
            </Link>

            <Link 
              to="/browse?category=creative"
              className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 mx-auto mb-4 bg-hustle-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hustle-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Creative</h3>
              <p className="text-sm text-gray-600">Design, writing, photography</p>
            </Link>

            <Link 
              to="/browse?category=services"
              className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 mx-auto mb-4 bg-hustle-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hustle-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Services</h3>
              <p className="text-sm text-gray-600">Errands, delivery, assistance</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-gray-900">What Students Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from other students who have used Campus Hustle Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <img 
                    src="https://randomuser.me/api/portraits/women/32.jpg" 
                    alt="User" 
                    className="h-12 w-12 rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">Amina Njeri</p>
                  <p className="text-sm text-gray-500">Computer Science, UoN</p>
                </div>
              </div>
              <p className="text-gray-600 mb-3">
                "I was able to earn enough money for my semester books by helping other students with their coding assignments."
              </p>
              <div className="flex text-hustle-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <img 
                    src="https://randomuser.me/api/portraits/men/44.jpg" 
                    alt="User" 
                    className="h-12 w-12 rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">David Mwangi</p>
                  <p className="text-sm text-gray-500">Business, Strathmore</p>
                </div>
              </div>
              <p className="text-gray-600 mb-3">
                "I needed a logo for my small business project and found a fellow student who designed it for an affordable price. Great platform!"
              </p>
              <div className="flex text-hustle-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <img 
                    src="https://randomuser.me/api/portraits/women/68.jpg" 
                    alt="User" 
                    className="h-12 w-12 rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold">Esther Wanjiku</p>
                  <p className="text-sm text-gray-500">Literature, Kenyatta University</p>
                </div>
              </div>
              <p className="text-gray-600 mb-3">
                "I help other students with essay writing and proofreading. It's a great way to earn some extra money while doing what I love."
              </p>
              <div className="flex text-hustle-500">
                {[1, 2, 3, 4, 5].map((star, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={i < 4 ? "currentColor" : "none"} stroke="currentColor">
                    {i < 4 ? (
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    )}
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hustle-700 text-white">
        <div className="container px-4 mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start hustling?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join Campus Hustle Hub today and connect with fellow students to earn money and help each other succeed.
          </p>
          <Button size="lg" asChild className="bg-white text-hustle-700 hover:bg-hustle-50">
            <Link to="/register">
              Create Your Account
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
