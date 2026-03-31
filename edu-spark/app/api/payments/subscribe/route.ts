/**
 * Implment subscription plans using Paystack's recurring charge API
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../src/app/api/auth/[...nextauth]/route";
import Paystack from "paystack-node";

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan } = await req.json(); // monthly or yearly
    const amount = plan === 'monthly' ? 5000 * 100 : 49900 * 100; // in kobo
    const interval  = plan === 'monthly' ? 'monthly' : 'annually';
    
    const response = await paystack.initializeTransaction({
        email: session.user.email,
        amount, 
        reference: `sub_${Date.now()}_${session.user.id}`,
        callback_url: `${process.env.NEXTAUTH_URL}/dashboard`,
        plan: process.env.PAYSTACK_PLAN_CODE, // optional; we can create plan in dashboard
        metadata: { user_id: session.user.id, plan }
    });

    if (response.status) {
        return NextResponse.json({ authorization_url: response.data.authorization_url });
    } else {
        return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
    }
}