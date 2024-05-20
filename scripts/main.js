import { triggerFireworks } from "./fireworks.js";
import { toggleBlueTheme } from "./theme.js";
import { playAudioFile } from "./util.js";
import { generatePlayerList } from "./players.js";
import { checkLiveStatus } from "./status.js";
import { fetchAdsData } from "./ads.js";
import { fetchEloData } from "./elo.js";

window.playAudio = function() {
    const audio = document.getElementById('wololo-audio');
    if (audio) {
        playAudioFile(audio);
        triggerFireworks();
        toggleBlueTheme();
    } else {
        console.error("Audio element not found.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    generatePlayerList();
    fetchEloData();
    checkLiveStatus();
    setInterval(checkLiveStatus, 120000); // Check every 2 mins
    fetchAdsData();
});
