import players from "../data/players.json" with { type: 'json' };

let fireworksInstance;

window.playAudio = function() {
    const audio = document.getElementById('wololo-audio');
    audio.volume = 0.3; // Set the volume to 30%
    audio.play().catch(error => console.error('Audio play failed:', error));
    triggerFireworks();
    toggleBlueTheme();
}

function triggerFireworks() {
    const container = document.getElementById('fireworks-container');
    if (!fireworksInstance) {
        fireworksInstance = new Fireworks(container, {
            maxRockets: 15, // max # of rockets to spawn
            rocketSpawnInterval: 150, // milliseconds to check if new rockets should spawn
            numParticles: 100, // number of particles to spawn when rocket explodes
            explosionMinHeight: 0.2,
            explosionMaxHeight: 0.9,
            explosionChance: 0.08 // chance in each tick the rocket will explode
        });
    }
    
    fireworksInstance.start();

    setTimeout(() => {
        fireworksInstance.stop();
    }, 10000);
}

function toggleBlueTheme() {
    document.body.classList.toggle('blue-theme');
}

function shuffle(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)  
}

function generatePlayerList() {
    const shuffledPlayers = shuffle(players);
    const playerListContainer = document.getElementById('player-list');
    playerListContainer.innerHTML = '';
    shuffledPlayers.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.classList.add('player');
        playerElement.innerHTML = `
        <div class="player-info">
        <div>
            <h2>${player.name}</h2>
            <p class="elo" id="elo-1v1-${player.steamId}">1v1 ELO: Loading...</p>
            <p class="elo" id="elo-team-${player.steamId}">Team ELO: Loading...</p>
        </div>
        <div>
            <a href="${player.twitch}" target="_blank" class="twitch-button offline" id="twitch-${player.name}">
            <img src="media/twitch.png" class="icon" alt="Twitch">
            <span class="live-text">OFFLINE</span>
            </a>
        </div>
        <div>
            <a href="${player.discordLink}" target="_blank" class="discord-button">
            <img src="media/discord.png" class="icon" alt="Discord">
            <span>${player.discordName}</span>
            </a>
        </div>
        </div>
        `;
        playerListContainer.appendChild(playerElement);
    });
 }

async function fetchEloData() {
try {
    const response = await fetch('../data/elo_data.json');
    const data = await response.json();
    data.forEach(playerData => {
        document.getElementById(`elo-1v1-${playerData.steamId}`).textContent = `1v1 ELO: ${playerData.elo1v1}`;
        document.getElementById(`elo-team-${playerData.steamId}`).textContent = `Team ELO: ${playerData.eloTeam}`;
    });
} catch (error) {
    console.error('Error fetching ELO data:', error);
    players.forEach(player => {
        document.getElementById(`elo-1v1-${player.steamId}`).textContent = '1v1 ELO: N/A';
        document.getElementById(`elo-team-${player.steamId}`).textContent = 'Team ELO: N/A';
    });
}}

async function checkLiveStatus() {
    for (const player of players) {
        const statusElement = document.getElementById(`twitch-${player.name}`);
        if (!statusElement) {
            console.error(`Element with ID twitch-${player.name} not found`);
            continue;
        }

        const twitchUserName = player.twitch.slice(player.twitch.lastIndexOf('/') + 1);
        const twitchApiUrl = `https://flutes.nz/checkTwitchUsersLiveStatus?userName=${twitchUserName}`;
        try {
            const response = await fetch(twitchApiUrl);
            const data = await response.json();
            console.log(data.status);
            const statusSpan = statusElement.querySelector('.live-text');
            if (data.status === 'live') {
                statusSpan.textContent = 'LIVE';
                statusSpan.classList.add('flash');
                statusElement.classList.remove('offline');
                statusElement.classList.add('live');
            } else {
                statusSpan.textContent = 'OFFLINE';
                statusSpan.classList.remove('flash');
                statusElement.classList.remove('live');
                statusElement.classList.add('offline');
            }
        } catch (error) {
            console.error(`Error fetching status for ${player.name}:`, error);
            const statusSpan = statusElement.querySelector('.live-text');
            statusSpan.textContent = 'ERROR';
            statusSpan.classList.remove('flash');
            statusElement.classList.remove('live', 'offline');
            statusElement.style.color = 'orange';
    }}
}
document.addEventListener('DOMContentLoaded', () => {
    generatePlayerList();
    fetchEloData();
    checkLiveStatus();
    setInterval(checkLiveStatus, 60000); // Check every 1min
});
