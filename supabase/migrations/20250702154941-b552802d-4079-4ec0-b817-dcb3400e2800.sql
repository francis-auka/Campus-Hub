
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  school TEXT,
  course TEXT,
  year TEXT,
  sex TEXT,
  age INTEGER,
  profile_pic_url TEXT,
  trust_score NUMERIC DEFAULT 3.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hustles table for tasks/jobs
CREATE TABLE public.hustles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  offer_type TEXT NOT NULL CHECK (offer_type IN ('cash', 'trade')),
  offer_amount TEXT,
  trade_deal TEXT,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in progress', 'finished')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bids table for hustle bids
CREATE TABLE public.bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hustle_id UUID NOT NULL REFERENCES hustles(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bid_amount TEXT NOT NULL,
  message TEXT NOT NULL,
  bidder_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table for messaging
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hustle_id UUID NOT NULL REFERENCES hustles(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_intents table for payments
CREATE TABLE public.payment_intents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES hustles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL DEFAULT 'mpesa',
  reference TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hustles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Hustles policies
CREATE POLICY "Anyone can view hustles" ON public.hustles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own hustles" ON public.hustles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own hustles" ON public.hustles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own hustles" ON public.hustles FOR DELETE USING (auth.uid() = user_id);

-- Bids policies
CREATE POLICY "Anyone can view bids" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Users can insert their own bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);
CREATE POLICY "Users can update their own bids" ON public.bids FOR UPDATE USING (auth.uid() = bidder_id);

-- Chat messages policies
CREATE POLICY "Users can view their own messages" ON public.chat_messages 
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.chat_messages 
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their received messages" ON public.chat_messages 
  FOR UPDATE USING (auth.uid() = recipient_id);

-- Payment intents policies
CREATE POLICY "Users can view their own payment intents" ON public.payment_intents 
  FOR SELECT USING (auth.uid() = payer_id OR auth.uid() = payee_id);
CREATE POLICY "Users can create payment intents" ON public.payment_intents 
  FOR INSERT WITH CHECK (auth.uid() = payer_id);
CREATE POLICY "Users can update payment status" ON public.payment_intents 
  FOR UPDATE USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'name', 'Anonymous User'),
    new.email
  );
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_hustles_user_id ON public.hustles(user_id);
CREATE INDEX idx_hustles_status ON public.hustles(status);
CREATE INDEX idx_hustles_category ON public.hustles(category);
CREATE INDEX idx_bids_hustle_id ON public.bids(hustle_id);
CREATE INDEX idx_bids_bidder_id ON public.bids(bidder_id);
CREATE INDEX idx_chat_messages_hustle_id ON public.chat_messages(hustle_id);
CREATE INDEX idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX idx_chat_messages_recipient_id ON public.chat_messages(recipient_id);
CREATE INDEX idx_payment_intents_task_id ON public.payment_intents(task_id);
CREATE INDEX idx_payment_intents_payer_id ON public.payment_intents(payer_id);
CREATE INDEX idx_payment_intents_payee_id ON public.payment_intents(payee_id);
