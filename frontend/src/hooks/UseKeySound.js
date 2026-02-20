const keyStrokeSounds = [
    new Audio("/sound/keystroke1.mp3"),
    new Audio("/sound/keystroke2.mp3"),
    new Audio("/sound/keystroke3.mp3"),
    new Audio("/sound/keystroke4.mp3"),
]

function useKeyboard() {
    const playRandomKeyStrokeSound = ()=>{
        const RandomSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];

        RandomSound.currentTime = 0;
        RandomSound.play().catch((err)=> console.log("Audio play failed", err))
    }
    return {playRandomKeyStrokeSound}
}

export default useKeyboard;