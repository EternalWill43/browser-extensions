log("-----------------------LOADING TIME EXTENSION---------------------------");

function log(message) {
    console.log("YT-SPEED: " + message);
}

function handleTimeDisplay() {
    let timeDisplay = document.querySelector(".ytp-time-display");
    if (timeDisplay) {
        let timeDisplayChildren = timeDisplay.childNodes;
        let currentTime = timeDisplayChildren[1].childNodes[0].innerText;
        let durationTime = timeDisplayChildren[1].childNodes[2].innerText;
        console.log(currentTime + ": " + durationTime);
    }
}

function updateRemainingTimeDisplay() {
    let timeDisplay = document.querySelector(".ytp-time-display");
    if (!timeDisplay) return;

    let currentTimeText = timeDisplay.querySelector('.ytp-time-current').innerText;
    let durationTimeText = timeDisplay.querySelector('.ytp-time-duration').innerText;

    // Convert time strings (formatted as hh:mm:ss or mm:ss) to seconds
    let currentTimeSeconds = convertTimeToSeconds(currentTimeText);
    let durationTimeSeconds = convertTimeToSeconds(durationTimeText);

    // Calculate remaining time in seconds
    let video = document.querySelector('video');
    let remainingTimeSeconds = (durationTimeSeconds - currentTimeSeconds) / video.playbackRate;

    // Convert seconds back to time format
    let remainingTimeFormatted = convertSecondsToTime(Math.round(remainingTimeSeconds));

    // Update or create the display for speed and remaining time
    let speedAndTimeDisplay = document.querySelector('#speedAndRemainingTime');
    if (!speedAndTimeDisplay) {
        speedAndTimeDisplay = document.createElement('span');
        speedAndTimeDisplay.id = 'speedAndRemainingTime';
        speedAndTimeDisplay.style.marginLeft = '8px';
        timeDisplay.appendChild(speedAndTimeDisplay);
    }
    speedAndTimeDisplay.textContent = `(${video.playbackRate.toFixed(2)}x) ${remainingTimeFormatted}`;
}

function convertTimeToSeconds(time) {
    const parts = time.split(':').map(Number);
    return parts.reduce((acc, part) => acc * 60 + part, 0);
}

function convertSecondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;
    return [
        hours, minutes, secondsLeft
    ].map(part => part.toString().padStart(2, '0')).filter((part, index) => part !== '00' || index > 0).join(':');
}

function insertSpeedSlider() {
    const controls = document.querySelector('.ytp-right-controls');
    const speedSliderEl = document.querySelector(".speed-slider");
    if (controls && !speedSliderEl) {
        const speedSlider = document.createElement('input');
        speedSlider.setAttribute('type', 'range');
        speedSlider.setAttribute('id', 'customSpeedControl');
        speedSlider.setAttribute('min', '0.25');
        speedSlider.setAttribute('max', '2');
        speedSlider.setAttribute('step', '0.05');
        speedSlider.setAttribute('value', '1');
        speedSlider.title = 'Playback Speed';
        speedSlider.style.cssText = "position:relative; bottom: 45%; margin-right: 8px;";
        speedSlider.classList.add("speed-slider");

        controls.insertBefore(speedSlider, controls.firstChild);
        speedSlider.addEventListener('input', handleSpeedChange);
    }
}

function handleSpeedChange(event) {
    const video = document.querySelector('video');
    if (video) {
        video.playbackRate = event.target.value;
        updateRemainingTimeDisplay();  // Update the remaining time display when speed changes
    }
}

const video = document.querySelector('video');
if (video) {
    video.addEventListener('timeupdate', updateRemainingTimeDisplay);
    video.addEventListener('ratechange', updateRemainingTimeDisplay); // Update when speed changes
}

const observer = new MutationObserver(() => {
    insertSpeedSlider(); // Re-insert slider if controls are reloaded
});

const targetNode = document.querySelector('.ytp-right-controls'); // Common parent container for YouTube's video player
if (targetNode) {
    log("Target node found");
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
} else {
    console.error('Target node for mutation observer not found.');
}

const style = document.createElement('style');
style.textContent = `
    #customSpeedControl {
        -webkit-appearance: none;
        width: 80px;
        height: 6px;
        margin-bottom: 23px;
        display: inline-block;
        box-sizing: border-box;
        border-radius: 5px;
        background: #fff;
        outline: none;
        opacity: 0.7;
        transition: opacity .2s;
    }
    #customSpeedControl:hover {
        opacity: 1;
    }
    #customStepControl::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #4CAF50;
        cursor: pointer;
    }
    #customSpeedControl::-moz-range-thumb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #4CAF50;
        cursor: pointer;
    }
`;
document.head.appendChild(style);
