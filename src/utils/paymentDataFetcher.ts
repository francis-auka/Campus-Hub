
import { supabase } from "@/integrations/supabase/client";

export interface PaymentIntent {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  taskId: string;
  payerId: string;
  payeeId: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod: "mpesa" | "other";
  reference: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentIntent?: PaymentIntent;
  error?: string;
}

/**
 * Creates a payment intent for a task
 */
export const createPaymentIntent = async (
  taskId: string,
  amount: number,
  payerId: string,
  payeeId: string
): Promise<PaymentResponse> => {
  try {
    // Generate a reference number - combination of date and random string
    const reference = `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    const { data, error } = await supabase
      .from('payment_intents')
      .insert({
        task_id: taskId,
        amount: amount,
        status: 'pending',
        payer_id: payerId,
        payee_id: payeeId,
        payment_method: 'mpesa',
        reference: reference
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      paymentIntent: {
        id: data.id,
        amount: data.amount,
        status: data.status as "pending" | "processing" | "completed" | "failed",
        taskId: data.task_id,
        payerId: data.payer_id,
        payeeId: data.payee_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        paymentMethod: data.payment_method as "mpesa" | "other",
        reference: data.reference
      }
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return {
      success: false,
      error: "Failed to create payment intent"
    };
  }
};

/**
 * Gets all payment intents for a user (either as payer or payee)
 */
export const getUserPayments = async (userId: string): Promise<PaymentIntent[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_intents')
      .select('*')
      .or(`payer_id.eq.${userId},payee_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      amount: item.amount,
      status: item.status as "pending" | "processing" | "completed" | "failed",
      taskId: item.task_id,
      payerId: item.payer_id,
      payeeId: item.payee_id,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      paymentMethod: item.payment_method as "mpesa" | "other",
      reference: item.reference
    }));
  } catch (error) {
    console.error("Error fetching payment intents:", error);
    return [];
  }
};

/**
 * Gets a specific payment intent
 */
export const getPaymentIntent = async (paymentId: string): Promise<PaymentIntent | null> => {
  try {
    const { data, error } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('id', paymentId)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      amount: data.amount,
      status: data.status as "pending" | "processing" | "completed" | "failed",
      taskId: data.task_id,
      payerId: data.payer_id,
      payeeId: data.payee_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      paymentMethod: data.payment_method as "mpesa" | "other",
      reference: data.reference
    };
  } catch (error) {
    console.error("Error fetching payment intent:", error);
    return null;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  paymentId: string, 
  status: "pending" | "processing" | "completed" | "failed"
): Promise<PaymentResponse> => {
  try {
    const { data, error } = await supabase
      .from('payment_intents')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', paymentId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      paymentIntent: {
        id: data.id,
        amount: data.amount,
        status: data.status as "pending" | "processing" | "completed" | "failed",
        taskId: data.task_id,
        payerId: data.payer_id,
        payeeId: data.payee_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        paymentMethod: data.payment_method as "mpesa" | "other",
        reference: data.reference
      }
    };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return {
      success: false,
      error: "Failed to update payment status"
    };
  }
};

// This placeholder function will be replaced with actual Mpesa integration
export const initiateMpesaPayment = async (
  phoneNumber: string,
  amount: number,
  reference: string
): Promise<PaymentResponse> => {
  try {
    // Simulate a successful Mpesa STK push request
    // This would be replaced with the actual Mpesa Daraja API integration
    console.log(`Initiating Mpesa payment of KSh ${amount} to ${phoneNumber} with reference ${reference}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      paymentIntent: {
        id: "temp-" + Date.now(),
        amount: amount,
        status: "processing",
        taskId: "",
        payerId: "",
        payeeId: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: "mpesa",
        reference: reference
      }
    };
  } catch (error) {
    console.error("Error initiating Mpesa payment:", error);
    return {
      success: false,
      error: "Failed to initiate Mpesa payment"
    };
  }
};
