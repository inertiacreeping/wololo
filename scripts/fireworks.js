export let fireworksInstance;

export function triggerFireworks() {
    const container = document.getElementById('fireworks-container');
    if (!fireworksInstance) {
        fireworksInstance = new Fireworks(container, {
            maxRockets: 15,
            rocketSpawnInterval: 150,
            numParticles: 100,
            explosionMinHeight: 0.2,
            explosionMaxHeight: 0.9,
            explosionChance: 0.08
        });
    }

    fireworksInstance.start();

    setTimeout(() => {
        fireworksInstance.stop();
    }, 10000);
}