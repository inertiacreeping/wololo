export function shuffle(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

export function playAudioFile(audio) {
    audio.volume = 0.3; // Set volume to 30%
    audio.play().catch(error => console.error("Audio play failed: ", error));
}
