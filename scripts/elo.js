export async function fetchEloData() {
    try {
        const response = await fetch('../data/elo_data.json');
        const data = await response.json();
        data.forEach(playerData => {
            document.getElementById(`elo-1v1-${playerData.steamId}`).textContent = `1v1 ELO: ${playerData.elo1v1}`;
            document.getElementById(`elo-team-${playerData.steamId}`).textContent = `Team ELO: ${playerData.eloTeam}`;
        });
    } catch (error) {
        console.error("Error fetching ELO data: ", error);
        players.forEach(player => {
            document.getElementById(`elo-1v1-${player.steamId}`).textContent = "1v1 ELO: N/A";
            document.getElementById(`elo-team-${player.steamId}`).textContent = "Team ELO: N/A";
        });
    }
}