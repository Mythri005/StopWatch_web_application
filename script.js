let milliseconds = 0, seconds = 0, minutes = 0;
let timer = null;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');
const lapsList = document.getElementById('laps');

// Load saved laps on page load
window.onload = function () {
  const savedLaps = JSON.parse(localStorage.getItem('laps')) || [];
  savedLaps.forEach((lap, index) => {
    addLapToDisplay(lap, index);
  });
};

function startStopwatch() {
  if (!timer) {
    timer = setInterval(() => {
      milliseconds += 10;
      if (milliseconds === 1000) {
        milliseconds = 0;
        seconds++;
      }
      if (seconds === 60) {
        seconds = 0;
        minutes++;
      }
      updateDisplay();
    }, 10);
  }
}

function pauseStopwatch() {
  clearInterval(timer);
  timer = null;
}

function resetStopwatch() {
  clearInterval(timer);
  timer = null;
  milliseconds = seconds = minutes = 0;
  updateDisplay();
  lapsList.innerHTML = '';
  localStorage.removeItem('laps'); // Clear saved laps
}

function lapStopwatch() {
  const lapTime = `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds / 10)}`;
  addLapToDisplay(lapTime);
  saveLap(lapTime);
}

function updateDisplay() {
  millisecondsDisplay.textContent = pad(milliseconds / 10);
  secondsDisplay.textContent = pad(seconds);
  minutesDisplay.textContent = pad(minutes);
}

function pad(num) {
  return num < 10 ? `0${Math.floor(num)}` : `${Math.floor(num)}`;
}

function addLapToDisplay(lapTime, index) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${lapTime}</span>
    <button class="delete-lap" data-index="${index}">Delete</button>
  `;
  lapsList.appendChild(li);

  // Attach delete functionality to the button
  li.querySelector('.delete-lap').addEventListener('click', function () {
    deleteLap(index);
  });
}

function saveLap(lapTime) {
  const savedLaps = JSON.parse(localStorage.getItem('laps')) || [];
  savedLaps.push(lapTime);
  localStorage.setItem('laps', JSON.stringify(savedLaps));
}

function deleteLap(index) {
  const savedLaps = JSON.parse(localStorage.getItem('laps')) || [];
  savedLaps.splice(index, 1); // Remove the lap at the given index
  localStorage.setItem('laps', JSON.stringify(savedLaps));

  // Refresh the lap list
  lapsList.innerHTML = '';
  savedLaps.forEach((lap, i) => {
    addLapToDisplay(lap, i);
  });
}

document.getElementById('start').addEventListener('click', startStopwatch);
document.getElementById('pause').addEventListener('click', pauseStopwatch);
document.getElementById('reset').addEventListener('click', resetStopwatch);
document.getElementById('lap').addEventListener('click', lapStopwatch);
