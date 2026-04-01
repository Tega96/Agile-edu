export const cn = (...classes: (string | undefined | false)[]) => {
    return classes.filter(Boolean).join(' ');

}

export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const shuffleArray = <T>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const getRandomItems = <T>(arr: T[], count: number): T[] => {
    const shuffled = shuffleArray(arr);
    return shuffled.slice(0, count);
}