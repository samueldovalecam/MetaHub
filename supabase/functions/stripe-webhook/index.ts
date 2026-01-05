
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
    const signature = req.headers.get("Stripe-Signature");
    const body = await req.text();
    const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    let event;

    try {
        if (!signature || !endpointSecret) {
            throw new Error("Missing Stripe signature or secret");
        }
        event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            endpointSecret,
            undefined,
            cryptoProvider
        );
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(err.message, { status: 400 });
    }

    console.log(`🔔 Event received: ${event.type}`);

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            case "customer.subscription.updated":
            case "customer.subscription.deleted":
                await handleSubscriptionUpdated(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error("Error handling event:", error);
        return new Response("Internal Server Error", { status: 500 });
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
    });
});

async function handleCheckoutSessionCompleted(session: any) {
    const userId = session.client_reference_id; // Passado no Metadata ou ClientReferenceId
    const subscriptionId = session.subscription;
    const customerId = session.customer;

    // Se não tiver user_id no client_reference_id, tentamos buscar pelo email ou metadata
    // Nota: Para Payment Links, é importante configurar o client_reference_id ou usar email matching.
    // Aqui vamos assumir que o email bate.

    if (!userId) {
        // Fallback: tentar achar user pelo email
        const email = session.customer_details?.email;
        if (email) {
            // Warning: This is risky if emails can change, but OK for MVP
            // Better: Update Payment Link to include client_reference_id? 
            // Payment Links support client_reference_id as a query param pre-fill but it's complex.
            // Let's rely on email update for now or just metadata if we could set it.
            // For simple Payment Link, matching by Email is common strategy if Auth is enforced.

            const { data: profiles } = await supabase
                .from("profiles")
                .select("id")
                .eq("email", email)
                .single();

            if (profiles) {
                await updateUserProfile(profiles.id, customerId, subscriptionId, 'active');
            }
        }
    } else {
        await updateUserProfile(userId, customerId, subscriptionId, 'active');
    }
}

async function handleSubscriptionUpdated(subscription: any) {
    const customerId = subscription.customer;
    const status = subscription.status; // active, past_due, canceled, unpaid

    // Find user by stripe_customer_id
    const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

    if (profile) {
        await supabase.from("profiles").update({
            subscription_status: status,
            // Map stripe status to app plan
            plan: status === 'active' ? 'basic' : 'free'
        }).eq("id", profile.id);
    }
}

async function updateUserProfile(userId: string, customerId: string, subscriptionId: string, status: string) {
    await supabase.from("profiles").update({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: status,
        plan: status === 'active' ? 'basic' : 'free'
    }).eq("id", userId);
}
