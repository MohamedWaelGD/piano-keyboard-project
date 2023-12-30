const PianoTypes = {
    LONG: "Long",
    SHORT: "Short"
}

class PianoKey {
    constructor(key, keyType, mainContainer, showKeys = false) {
        this.key = key;
        this.keyType = keyType;
        this.mainContainer = mainContainer;
        this.TIMER_UI_MS = 150;
        this.volume = 1;
        this.showKeys = showKeys;
    }

    makePianoKey() {
        if (this.keyType === PianoTypes.LONG) {
            this.makeLongPianoKey();
        } else {
            this.makeShortPianoKey();
        }
        this.setShowKeys(this.showKeys);
    }

    makeLongPianoKey() {
        const div = document.createElement('div');
        div.classList.add('piano-long-key');
        const span = document.createElement('span');
        span.innerHTML = this.key.toUpperCase();
        div.appendChild(span);
        this.mainContainer.appendChild(div);
        div.addEventListener('click', ()=>{
            this.clickKey();
        });
        this.keyDiv = div;
    }

    makeShortPianoKey() {
        const div = document.createElement('div');
        div.classList.add('piano-short-key');
        const span = document.createElement('span');
        span.innerHTML = this.key.toUpperCase();
        div.appendChild(span);
        this.mainContainer.appendChild(div);
        div.addEventListener('click', ()=>{
            this.clickKey();
        });
        this.keyDiv = div;
    }
    
    clickKey() {
        this.playAudio();
        this.handleUi();
    }

    setVolume(value) {
        this.volume = value;
    }

    playAudio() {
        const audio = new Audio(`/assets/audio/${this.key}.wav`);
        audio.volume = this.volume;
        audio.play();
    }

    handleUi() {
        this.keyDiv.classList.add('active');
        clearInterval(this.timerUi);
        
        this.timerUi = setTimeout(()=>{
            this.keyDiv.classList.remove('active');
        }, this.TIMER_UI_MS)
    }

    setShowKeys(value) {
        this.showKeys = value;
        if (showKeys) {
            this.keyDiv.querySelector('span').classList.remove('opacity-0');
        } else {
            this.keyDiv.querySelector('span').classList.add('opacity-0');
        }
    }
}

const mainLongPianoContainer = document.querySelector('.piano-long-keys-container');
const mainShortPianoContainer = document.querySelector('.piano-short-keys-container');
const longPianosKeys = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"];
const shortPianosKeys = ["w", "e", "t", "y", "u", "o", "p"];
const volumeInp = document.querySelector('#volume');
const VOLUME = "VOLUME";
const circleToggle = document.querySelector('.toggle .circle');
let pianoKeys = [];
let volume = 1;
let volumeStep = 0.1;
let showKeys = false;

(function(){
    pianoKeys = [];
    setupLongPianoKeys();
    setupShortPianoKeys();
    setupKeyboardEvent();
    let localVolume = localStorage.getItem(VOLUME);
    if (localVolume) {
        volume = localVolume;
    }
    setVolume(volume);
})();

function setupLongPianoKeys() {
    for (let i = 0; i < longPianosKeys.length; i++) {
        const key = new PianoKey(longPianosKeys[i], PianoTypes.LONG, mainLongPianoContainer, showKeys);
        key.makePianoKey();
        pianoKeys.push(key);
    }
}

function setupShortPianoKeys() {
    for (let i = 0; i < shortPianosKeys.length; i++) {
        const key = new PianoKey(shortPianosKeys[i], PianoTypes.SHORT, mainShortPianoContainer, showKeys);
        key.makePianoKey();
        pianoKeys.push(key);
    }
}

function setupKeyboardEvent() {
    document.addEventListener('keydown', (e)=>{
        const key = pianoKeys.find(p => p.key.toLowerCase() == e.key.toLowerCase());
        if (key) {
            key.clickKey();
        }

        if (e.key.toLowerCase() === 'pageup') {
            setVolume(volume + volumeStep);
        } else if (e.key.toLowerCase() === 'pagedown') {
            setVolume(volume - volumeStep);
        } else if (e.key.toLowerCase() === 'home') {
            toggleKeys();
        }
    })
}

function setVolume(value) {
    volume = parseFloat(value);
    if (volume < 0) volume = 0;
    if (volume > 1) volume = 1;
    volumeInp.value = volume;
    localStorage.setItem(VOLUME, volume);
    pianoKeys.forEach(e => {
        e.setVolume(volume);
    });
    playClickAudio();
}

function toggleKeys() {
    showKeys = !showKeys;
    pianoKeys.forEach(e => {
        e.setShowKeys(showKeys);
    });
    if (showKeys) {
        circleToggle.classList.add('active');
    } else {
        circleToggle.classList.remove('active');
    }
    playClickAudio();
}

function playClickAudio() {
    const clickAudio = new Audio('/assets/audio/click.mp3');
    clickAudio.play();
}