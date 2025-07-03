
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const About = () => {
  const founders = [
    {
      name: "Alicia Mbatha",
      role: "Co-founder & CEO",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?fit=crop&w=500&h=500",
      bio: "Computer Science student with a passion for connecting students through technology.",
    },
    {
      name: "Harriet Wambura",
      role: "Co-founder & COO",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?fit=crop&w=500&h=500",
      bio: "Business Administration student focused on creating opportunities for young hustlers.",
    },
    {
      name: "Francis Auka",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=500&h=500",
      bio: "Engineering student who built the platform's tech infrastructure from scratch.",
    },
    {
      name: "Sam Odhiambo",
      role: "Head of Community",
      image: "https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?fit=crop&w=500&h=500",
      bio: "Sociology student passionate about empowering the student community through the gig economy.",
    },
  ];

  return (
    <Layout>
      <div className="container py-8 md:py-12 px-4 mx-auto max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-hustle-800">About Campus Hustle Hub</h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-600 max-w-3xl mx-auto px-2">
            Empowering student hustlers across Kenyan universities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-hustle-800">Our Mission</h2>
            <p className="text-gray-600 mb-3 md:mb-4">
              Campus Hustle Hub was created to solve a simple problem: students have skills to offer and needs to be met, 
              but no easy way to connect with each other.
            </p>
            <p className="text-gray-600 mb-3 md:mb-4">
              We believe in the power of the student community to help each other succeed. Whether you need help with 
              coding an assignment, editing a paper, or designing a poster, there's a fellow student who can help—
              and who could use the opportunity to earn some extra money.
            </p>
            <p className="text-gray-600">
              Our platform is built by students, for students, creating a trusted marketplace where skills can be traded 
              and cash problems solved through collaboration.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop" 
              alt="Students collaborating" 
              className="rounded-lg shadow-lg w-full h-auto md:h-full object-cover"
            />
          </div>
        </div>

        <div className="mb-10 md:mb-16">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center text-hustle-800">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {founders.map((founder, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 md:h-24 md:w-24 mb-3 md:mb-4">
                      <AvatarImage src={founder.image} alt={founder.name} />
                      <AvatarFallback>{founder.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg md:text-xl mb-1">{founder.name}</h3>
                    <p className="text-hustle-600 mb-2 md:mb-3 text-sm md:text-base">{founder.role}</p>
                    <p className="text-gray-600 text-center text-sm md:text-base">{founder.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-hustle-50 rounded-xl p-4 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-hustle-800">Join Our Community</h2>
          <p className="text-base md:text-lg mb-4 md:mb-6 text-gray-600 max-w-3xl mx-auto">
            Campus Hustle Hub is growing every day. Sign up now to become part of our community of 
            student hustlers making campus life better for everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop" 
              alt="Students working together" 
              className="rounded-lg shadow-md w-full max-w-[140px] sm:max-w-[200px] h-auto"
            />
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop" 
              alt="Student working on laptop" 
              className="rounded-lg shadow-md w-full max-w-[140px] sm:max-w-[200px] h-auto"
            />
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop" 
              alt="Laptop on desk" 
              className="rounded-lg shadow-md w-full max-w-[140px] sm:max-w-[200px] h-auto hidden sm:block"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
