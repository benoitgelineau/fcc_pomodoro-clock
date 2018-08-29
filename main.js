const clock = document.querySelector('.time'),
      spinner = document.querySelector('.spinner'),
      sessionTime = document.getElementById('session-time'),
      breakTime = document.getElementById('break-time'),
      arrButton = document.getElementsByTagName('button');
let sLength = 25,
    bLength = 5,
    t,
    count = inSeconds(sLength),
    lap = 0,
    firstClick = true,
    running = false;

window.onload = function () {
  display();
  sessionTime.textContent = sLength;
  breakTime.textContent = bLength;
};

document.querySelector('.wrapper').addEventListener('click', function () {
  if (!running) {
    if (firstClick) { // Avoids too much waiting time before starting
      firstClick = false;
      countdown();
    } else {
      setTimeout(countdown, 1000);
    }
    spinner.classList.add('spin');
  } else {
    pause();
    spinner.classList.remove('spin');
  }
});

const buttonListening = (index) => {
  arrButton[index].addEventListener('click', () => {
    firstClick = true; // Avoids too much waiting time before starting
    pause();
    reset(arrButton[index].classList[0], arrButton[index].classList[1]);
  });
};

for (let i = 0; i < arrButton.length; i++) {
  buttonListening(i);
}

function inSeconds(x) {
  return x * 60;
}

function parse(seconds) { // does the same job as parseInt truncates the float
  return {
    'minutes': (seconds / 60) | 0,
    'seconds': (seconds % 60) | 0,
  };
}

function format(minutes, seconds) {
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  clock.textContent = minutes + ':' + seconds;
}

function display() {
  format(parse(count).minutes, parse(count).seconds);
}

function setClock(restart, session) {
  if (restart) {
    if (lap % 2 === 0) { // Restarts the clock with correct period
      count = inSeconds(bLength);
      spinner.style.borderColor = 'red';
    } else {
      count = inSeconds(sLength);
      spinner.style.borderColor = '#0c4';
    }
  } else {
    if (lap % 2 !== 0 && !session) { // Reset time for correct period button onClick
      count = inSeconds(bLength);
    } else if (lap % 2 === 0 && session) {
      count = inSeconds(sLength);
    }
  }
}

function countdown() {
  display();
  running = true;
  if (count === 0) { // sets time length when restart
    setClock(true);
    lap++;
    setTimeout(countdown, 1000);
  } else {
    count--;
    t = setTimeout(countdown, 1000); // actual timer
  }
}

function pause() {
  running = false;
  spinner.classList.remove('spin');
  clearTimeout(t);
}

function reset(type, operation) {
  if (type === 'session') {
    if (operation === 'add') {
      sLength++;
    } else if (operation === 'sub' && sLength !== 0) {
      sLength--;
    }
    sessionTime.textContent = sLength;
    setClock(false, true);
  } else if (type === 'break') {
    if (operation === 'add') {
      bLength++;
    } else if (operation === 'sub' && bLength !== 0) {
      bLength--;
    }
    breakTime.textContent = bLength;
    setClock(false, false);
  }
  display();
}
