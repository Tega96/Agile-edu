/**
 * Webhook handler
 */
import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const paystackKey = process.env.PAYSTACK_SECRET_KEY!
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
    try {
        const payload = await req.text();
        const signature = req.headers.get("x-paystack-signature");
    
        // Verify signature
        const hash = crypto.createHmac("sha512", paystackKey)
            .update(payload)
            .digest("hex");
        if (hash !== signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
    
        const event = JSON.parse(payload);
        const { event: eventType, date } = event;
    
        if (eventType === "charge.success") {
            const metadata = date.metadata;
            const userId = metadata.user_id;
            const plan = metadata.plan;
            const subscriptionCode = date.subscription.code;
    
            // Update user profile to premium
            const expiresAt = plan === 'monthly'
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    
            await supabase.from("profiles").update({
                is_premium: true,
                premium_expires_at: expiresAt.toISOString()
            }).eq("id", userId);
    
            await supabase.from("subscriptions").insert({
                user_id: userId,
                paystack_subscription_code: subscriptionCode,
                status: "active",
                plan,
                start_date: new Date().toISOString(),
                end_date: expiresAt.toISOString()
            });
        } else if (eventType === "subscription.disable") {
            // Handle cancellation
            const subscriptionCode = date.subscription_code;
            const { data: sub } = await supabase.from("subscriptions")
                .select("user_id")
                .eq("paystack_subscription_code", subscriptionCode)
                .single();
            if (sub) {
                await supabase.from("profiles").update({ is_premium: false})
                    .eq("id", sub.user_id);
                await supabase.from("subscriptions").update({status: "cancelled"})
                    .eq("paystack_subscription_code", subscriptionCode);
            }
        }
    
        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Server error"}, { status: 500 });
    }
}