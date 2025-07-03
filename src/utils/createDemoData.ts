
import { supabase } from "@/integrations/supabase/client";
import { RegistrationFormData, HustleFormData } from "@/types/auth";

export const registerDemoUser = async (userData: RegistrationFormData) => {
  try {
    // Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
        },
      },
    });

    if (signUpError) throw signUpError;

    // Update the profile with additional information
    if (authData.user) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          age: parseInt(userData.age), // Convert string to number
          phone: userData.phone,
          school: userData.school,
          course: userData.course,
          year: userData.year,
          sex: userData.sex,
        })
        .eq('id', authData.user.id);

      if (updateError) throw updateError;
    }

    return authData.user;
  } catch (error) {
    console.error("Error creating demo user:", error);
    throw error;
  }
};

export const createDemoHustle = async (userId: string, hustleData: HustleFormData) => {
  try {
    const { error } = await supabase
      .from('hustles')
      .insert({
        user_id: userId,
        title: hustleData.title,
        description: hustleData.description,
        category: hustleData.category,
        offer_type: hustleData.offerType,
        offer_amount: hustleData.offerType === 'cash' ? hustleData.offerAmount : null,
        trade_deal: hustleData.offerType === 'trade' ? hustleData.tradeDeal : null,
        deadline: hustleData.deadline.toISOString(),
        status: 'open'
      });

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error creating demo hustle:", error);
    throw error;
  }
};

export const createDemoAccounts = async () => {
  // Define demo users
  const demoUsers = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      confirmPassword: "password123",
      age: "21",
      phone: "0712345678",
      school: "University of Nairobi",
      course: "Computer Science",
      year: "3",
      sex: "Male"
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "password123",
      confirmPassword: "password123",
      age: "22",
      phone: "0723456789",
      school: "Kenyatta University",
      course: "Business Administration",
      year: "4",
      sex: "Female"
    },
    {
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      password: "password123",
      confirmPassword: "password123",
      age: "20",
      phone: "0734567890",
      school: "Strathmore University",
      course: "Economics",
      year: "2",
      sex: "Male"
    }
  ];

  // Define demo hustles
  const demoHustles = [
    {
      title: "Help with Python Assignment",
      description: "I need help with a Python programming assignment that involves data analysis and visualization.",
      category: "tech",
      offerType: "cash",
      offerAmount: "1000",
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    },
    {
      title: "Math Tutoring Needed",
      description: "Looking for help with Calculus. Need help understanding derivatives and integrals.",
      category: "academic",
      offerType: "cash",
      offerAmount: "500",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    {
      title: "Design a Logo for Club",
      description: "Need a creative person to design a logo for our new tech club.",
      category: "creative",
      offerType: "trade",
      tradeDeal: "Will help with your programming assignments for a month",
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
    },
    {
      title: "Need Notes for Economics Class",
      description: "Missed classes last week due to illness. Need notes for Macroeconomics.",
      category: "academic",
      offerType: "cash",
      offerAmount: "300",
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    },
    {
      title: "Help Moving to New Dorm",
      description: "Need help moving my stuff to a new dorm. Not too many items, just need an extra pair of hands.",
      category: "services",
      offerType: "cash",
      offerAmount: "700",
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    },
    {
      title: "Photography for Event",
      description: "Looking for someone with a good camera to take photos at our club event next week.",
      category: "creative",
      offerType: "trade",
      tradeDeal: "Free entry to the event and food",
      deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 6 days from now
    }
  ];

  const createdUsers = [];
  
  try {
    // Create demo users
    for (const userData of demoUsers) {
      const user = await registerDemoUser(userData as RegistrationFormData);
      if (user) {
        createdUsers.push(user);
      }
    }

    // Create demo hustles
    if (createdUsers.length > 0) {
      let hustleIndex = 0;
      for (let i = 0; i < demoHustles.length; i++) {
        const userIndex = i % createdUsers.length;
        const userId = createdUsers[userIndex].id;
        await createDemoHustle(userId, demoHustles[hustleIndex] as HustleFormData);
        hustleIndex = (hustleIndex + 1) % demoHustles.length;
      }
    }

    return true;
  } catch (error) {
    console.error("Error creating demo data:", error);
    throw error;
  }
};
