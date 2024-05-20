import players from './playersData.js';
import { shuffle } from "./util.js";

export function generatePlayerList() {
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
                    <p class="elo" id="elo-1v1-${player.steamId}"><span class="bold-text">1v1 ELO:</span> Loading...</p>
                    <p class="elo" id="elo-team-${player.steamId}"><span class="bold-text">Team ELO:</span> Loading...</p>
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