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

// Initialize Supabase admin client for server-side operations
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();

  let event;
  try {
    // Verify the event came from Stripe
    event = await stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")!
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(err.message, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.client_reference_id;
  const stripeSubscriptionId = session.subscription;

  if (!userId || !stripeSubscriptionId) {
      console.error("Webhook missing user ID or subscription ID");
      return new Response("Missing required session data", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // Retrieve subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(
          stripeSubscriptionId as string
        );

        // Update the user's subscription status in the database
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "active",
            plan_name: "Pro",
            stripe_subscription_id: stripeSubscriptionId,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("user_id", userId);
        
        if(error) throw error;

        console.log(`Successfully updated subscription for user: ${userId}`);
        break;
      }
      // Future: Handle other events like cancellations or payment failures
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated':
        // Handle subscription changes here
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Error handling webhook:", error.message);
    return new Response(JSON.stringify({ error: "Database or processing error" }), { status: 500 });
  }

  // Acknowledge receipt of the event
  return new Response(JSON.stringify({ received: true }), { status: 200 });
});