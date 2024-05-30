import players from './playersData.js';

export function updateStatusElement(statusElement, status) {
    const statusSpan = statusElement.querySelector('.live-text');
    if (status === 'live') {
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
}

export async function checkLiveStatus() {
    for (const player of players) {
        const statusElement = document.getElementById(`twitch-${player.name}`);
        if (!statusElement) {
            console.error(`Element with ID twitch-${player.name} not found.`);
            continue;
        }
        try {
            updateStatusElement(statusElement, player.status);
        } catch (error) {
            console.error(`Error fetching status for ${player.name}: `, error);
            const statusSpan = statusElement.querySelector('.live-text');
            statusSpan.textContent = 'ERROR';
            statusSpan.classList.remove('flash');
            statusElement.classList.remove('live', 'offline');
            statusElement.style.color = 'orange';
        }
    }
}
