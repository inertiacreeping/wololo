import players from './playersData.js';
import { shuffle } from "./util.js";

export function appendAds(ads, containerId) {
    const twitchLinks = players.map(player => player.twitch);
    const container = document.getElementById(containerId);
    ads.forEach(ad => {
        const randomTwitchLink = twitchLinks[Math.floor(Math.random() * twitchLinks.length)];
        const adElement = document.createElement('div');
        adElement.className = 'promo-box';
        adElement.innerHTML = `
            <h3>${ad.title}</h3>
            <p>${ad.description}</p>
            <p><a href="${randomTwitchLink}">${ad.website}</a></p>
        `;
        container.appendChild(adElement);
    });
}

export async function fetchAdsData() {
    try {
        const response = await fetch('data/ads.json');
        const ads = await response.json();
        const shuffledAds = shuffle(ads);
        const leftAds = shuffledAds.slice(0, 2);
        const rightAds = shuffledAds.slice(2, 4);
        appendAds(leftAds, 'side-content-left');
        appendAds(rightAds, 'side-content-right');
    } catch (error) {
        console.error("Error fetching ads: ", error);
    }
}
