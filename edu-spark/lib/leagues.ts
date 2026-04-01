export interface League {
    name: string;
    icon: string;
    color: string;
    minXp: number;
}

export const leagues: League[] = [
    { name: 'Bronze', icon: '🥉', color: 'bg-amber-600', minXp: 0},
    { name: 'Silver', icon: '🏅', color: 'bg-amber-600', minXp: 0},
    { name: 'Gold', icon: '🥇', color: 'bg-amber-600', minXp: 0},
    { name: 'Platinum', icon: '💎', color: 'bg-amber-600', minXp: 0},
    { name: 'Diamond', icon: '🔷', color: 'bg-amber-600', minXp: 0}
];

export const getLeague = (xp: number): League => {
    for (let i = leagues.length -1; i >= 0; i--) {
        if (xp >= leagues[i].minXp) return leagues[i];
    } 
    return leagues[0];
}