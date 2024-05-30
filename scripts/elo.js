import players from './playersData.js';

export async function fetchEloData() {
    const title = "age2";
    for (const player of players) {
        const profile_names = player.steamId; 
        const eloApiUrl = "https://aoe-api.reliclink.com/community/leaderboard/GetPersonalStat"; 
        const params = {
            title,
            profile_names
        };

        try {
            const response = await fetch(eloApiUrl, {params});
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(`Error fetching elo for ${player.name}: `, error);
        }
    }
}
