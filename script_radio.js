const radio = document.getElementById('radio');
const stationName = document.getElementById('station-name');
const stationButtons = document.querySelectorAll('.station-button');
const volumeUpButton = document.getElementById('volume-up');
const volumeDownButton = document.getElementById('volume-down');
const playPauseButton = document.getElementById('play-pause');
const addRadioForm = document.querySelector('.add-radio-form');
const stationButtonsContainer = document.querySelector('.station-buttons');
const volumeValue = document.getElementById('volume-value');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');

let isPlaying = false;
let currentStationIndex = 0;

stationButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const stationUrl = button.getAttribute('data-url');
        const stationTitle = button.getAttribute('data-name');
        switchStation(currentStationIndex);

        radio.src = stationUrl;
        stationName.textContent = stationTitle;

        radio.load(); // Load the new audio source
        if (isPlaying) {
            radio.play(); // Start playing if it was playing before
        }
    });
});

volumeValue.textContent = Math.round(radio.volume * 100);

volumeUpButton.addEventListener('click', () => {
    radio.volume = Math.min(1, radio.volume + 0.05);
    updateVolumeValue();
});

volumeDownButton.addEventListener('click', () => {
    radio.volume = Math.max(0, radio.volume - 0.05);
    updateVolumeValue();
});

playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        radio.pause(); // Pause if it's currently playing
        playPauseButton.innerHTML = '<i class="fa-solid fa-play fa-2xl" style="color: #ebedef;"></i>';
    } else {
        radio.play(); // Play if it's currently paused
        playPauseButton.innerHTML = '<i class="fa-solid fa-pause fa-2xl" style="color: #ebedef;"></i>';
    }
    isPlaying = !isPlaying; // Toggle the play/pause state
});

function updateVolumeValue() {
    const roundedVolume = Math.round(radio.volume * 100);
    volumeValue.textContent = roundedVolume;
}

radio.addEventListener('volumechange', () => {
    updateVolumeValue();
});

previousButton.addEventListener('click', () => {
    switchStation(currentStationIndex - 1);
});

nextButton.addEventListener('click', () => {
    switchStation(currentStationIndex + 1);
});

function switchStation(index) {
    if (index >= 0 && index < stationButtons.length) {
        const button = stationButtons[index];
        const stationUrl = button.getAttribute('data-url');
        const stationTitle = button.getAttribute('data-name');

        radio.src = stationUrl;
        stationName.textContent = stationTitle;

        currentStationIndex = index;
        radio.load();
        if (isPlaying) {
            radio.play();
        }
    }
}

function addRadio() {
    const radioNameInput = document.getElementById('radio-name');
    const streamingLinkInput = document.getElementById('streaming-link');

    const radioName = radioNameInput.value;
    const streamingLink = streamingLinkInput.value;

    if (radioName && streamingLink) {
        // Create a new button for the added radio
        const newRadioButton = document.createElement('button');
        newRadioButton.classList.add('station-button');
        newRadioButton.setAttribute('data-url', streamingLink);
        newRadioButton.setAttribute('data-name', radioName);
        newRadioButton.textContent = radioName;

        // Add a click event listener to the new button
        newRadioButton.addEventListener('click', () => {
            radio.src = streamingLink;
            stationName.textContent = radioName;
            radio.load();
            if (isPlaying) {
                radio.play();
            }
        });

        // Append the new button to the container
        stationButtonsContainer.appendChild(newRadioButton);

        // Clear the form inputs
        radioNameInput.value = '';
        streamingLinkInput.value = '';
    }
}

// Add event listener for form submission
addRadioForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting traditionally
    addRadio(); // Call the function to add the radio
});