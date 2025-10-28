// Deno-deploy-specific imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@11.1.0?target=deno";

// FIX: Add type declaration for Deno to resolve TypeScript errors in non-Deno environments.
declare const Deno: any;

// Initialize Stripe client
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2022-11-15",
});

// Set up CORS headers for API responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle preflight CORS requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Get the authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("User not found. Please log in.");
    }

    // Check if the user already has a Stripe customer ID
    const { data: subscription } = await supabaseClient
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    // If no customer ID exists, create one in Stripe
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      
      // Store the new customer ID in the subscriptions table
      await supabaseClient
        .from("subscriptions")
        .upsert({ user_id: user.id, stripe_customer_id: customerId, status: 'new', plan_name: 'Pro' });
    }
    
    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: Deno.env.get("STRIPE_PRO_PLAN_PRICE_ID")!, // e.g., price_12345
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${Deno.env.get("SITE_URL")!}/#/subscribe/success`,
      cancel_url: `${Deno.env.get("SITE_URL")!}/#/subscribe/Pro`,
      client_reference_id: user.id, // Pass user ID to webhook
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: { message: err.message } }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});