const players = [{
  name: 'inertiacreeping',
  twitch: 'https://www.twitch.tv/inertiacreeping',
  discordName: 'Low ELO Legends',
  discordLink: 'https://discord.gg/XXvQE4uY2m',
  steamID: '/steam/76561198067966567'
},
{
  name: 'shiderplays',
  twitch: 'https://www.twitch.tv/shiderplays',
  discordName: 'ShiderPlays',
  discordLink: 'https://discord.gg/dzXthPsvKQ',
  steamID: '/steam/76561198151727332'
},
{
  name: 'tambow',
  twitch: 'https://www.twitch.tv/ttambow',
  discordName: 'tambourine town',
  discordLink: 'https://discord.gg/yfyw3ZRUua',
  steamID: '/steam/76561198040642066'
},
{
  name: 'chestnutplace77',
  twitch: 'https://www.twitch.tv/chestnutplace77',
  discordName: 'the nutshack',
  discordLink: 'https://discord.gg/BGEA4HxY8u',
  steamID: '/steam/76561198403361404'
}];

let fireworksInstance;

function playAudio() {
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function generatePlayerList() {
  const shuffledPlayers = shuffleArray(players);
  const playerListContainer = document.getElementById('player-list');
  playerListContainer.innerHTML = '';
  
  const playerPromises = shuffledPlayers.map(async player => {
    const playerElement = await createPlayerElement(player);
    return playerElement;
  });

  const playerElements = await Promise.all(playerPromises);
  playerElements.forEach(playerElement => {
    playerListContainer.appendChild(playerElement);
  });
}

async function createPlayerElement(player) {
  try {
    const response = await fetch('player-template.html')
    const template = await response.text();
    const playerHTML = template
      .replace('{{playerName}}', player.name)
      .replace('{{steamID}}', player.steamID)
      .replace('{{twitch}}', player.twitch)
      .replace('{{discordLink}}', player.discordLink)
      .replace('{{discordName}}', player.discordName);
        
    const playerElement = document.createElement('div');
    playerElement.classList.add('player');
    playerElement.innerHTML = playerHTML;
    return playerElement;
  } catch(error) {
    console.error("Error creating player element: ", error);
    throw error;
  }
}

async function fetchEloData() {
  try {
    const response = await fetch('/elo_data.json');
    const data = await response.json();
    data.forEach(playerData => {
      document.getElementById(`elo-1v1-${playerData.steamID}`).textContent = `1v1 ELO: ${playerData.elo1v1}`;
      document.getElementById(`elo-team-${playerData.steamID}`).textContent = `Team ELO: ${playerData.eloTeam}`;
    });
  } catch (error) {
    console.error('Error fetching ELO data:', error);
    players.forEach(player => {
      document.getElementById(`elo-1v1-${player.steamID}`).textContent = '1v1 ELO: N/A';
      document.getElementById(`elo-team-${player.steamID}`).textContent = 'Team ELO: N/A';
    });
  }
}

async function checkLiveStatus() {
  for (const player of players) {
    const statusElement = document.getElementById(`twitch-${player.name}`);
    if (!statusElement) {
      console.error(`Element with ID twitch-${player.name} not found`);
    continue;
  }
  try {
    const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${player.name}`, {
      headers: {
        'Client-ID': 'wsp888x940dnqxdecdjmcrrz5kflb5',
        'Authorization': `Bearer oy5z377gdk6qjwrswqh3usp034gof7`
      }
    });
    const data = await response.json();
    console.log(`Streamer: ${player.name}`, data); // Log the data for each streamer
    const statusSpan = statusElement.querySelector('.live-text');
    if (data.data && data.data.length > 0 && data.data[0].type === 'live') {
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
  setInterval(checkLiveStatus, 30000); // Check every 30 seconds
});
