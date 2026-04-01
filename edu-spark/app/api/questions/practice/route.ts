import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {createClient } from "@supabase/supabase-js"
// import { redis } from "@/lib/redis";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { questionId, selectedAnswer } = await req.json();

    // Fetch question
    const { data: question } = await supabase.from("questions").select("*")
        .eq("id", questionId).single();
    const isCorrect = selectedAnswer === question.correct_answer;

    // XP/Coins reward (practice: 15 correct)
    let xpEarned = 0, coinsEarned = 0;
    if (isCorrect) {
        xpEarned = 15;
        coinsEarned = 15;
    }

    // Record attempt
    await supabase.from("attempts").insert({
        user_id: session.user.id,
        question_id: questionId,
        is_correct: isCorrect,
        xp_earned: xpEarned, 
        coins_earned: coinsEarned,
        mode: "practice"
    });

    // Update user XP and coins
    await supabase.rpc("increment_user_xp", {user_id: session.user.id, amount: xpEarned });
    await supabase.rpc("increment_user_coins", { user_id: session.user.id, amount: coinsEarned });

    // Update streak (if daily 10 questions completed - handled separatgely)
    // ...

    return NextResponse.json({ correct: isCorrect, xpEarned, coinsEarned, explanation: question.explanation });

}