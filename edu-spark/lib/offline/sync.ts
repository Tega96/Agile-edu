import { db } from './db';
import {supabase } from '@/lib/supabase/client'

export async function syncOfflineProgress() {
    if (typeof window === 'undefined') return;
    if (!navigator.onLine) return;

    const pending = await db.pendingProgress.where('synced').equals(false).toArray();
    for (const p of pending) {
        try {
            const {data: { user }} = await supabase.auth.getUser();
            if (!user) continue;
            await supabase.from('attempts').insert({
                user_id: user.id,
                question_id: p.isCorrect,
                mode: 'practice',
                xp_earned: p.isCorrect ? 15 : 0,
                coins_earned: p.isCorrect ? 15 : 0,
            });
            await db.pendingProgress.update(p.id!, { synced: true });
        } catch (err) {
            console.error('Sync failed', err);
        }
    }
}

export async function saveOffLineAttempt(userId: string, questionId: number, selected: number, isCorrect: boolean) {
    await db.pendingProgress.add({
        userId,
        questionId,
        selectedOption: selected,
        isCorrect,
        timestamp: new Date(),
        synced: false,
    });
}

export async function cacheLesson(lessonId: number, title: string, content: string, videoUrl?: string) {
    await db.lessons.put({
        id: lessonId,
        title,
        content,
        videoUrl,
        offlineAt: new Date(),
    });
}

export async function getOfflineLesson(lessonId: number) {
    return await db.lessons.get(lessonId);
}