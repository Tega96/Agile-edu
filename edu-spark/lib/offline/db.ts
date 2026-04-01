import Dexie, { Table } from 'dexie';

export interface LessonContent {
    id: number;
    title: string;
    content: string;
    videoUrl?: string;
    offlineAt: Date;
}

export interface PendingProgress {
    id?: number;
    userId: string;
    questionId: number;
    selectedOption: number;
    isCorrect: boolean;
    timestamp: Date;
    synced: boolean;
}

export class SchoolAppDB extends Dexie {
    lessons!: Table<LessonContent>;
    pendingProgress!: Table<PendingProgress>;

    constructor() {
        super('SchoolAppDB');
        this.version(1).stores({
            lessons: 'id, title, offlineAt',
            pendingProgress: '++id, userId, synced',
        });
    }
}

export const db = new SchoolAppDB();