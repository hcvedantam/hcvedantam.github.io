// Create and append a style tag with all our CSS
const style = document.createElement('style');
style.textContent = `
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background: black;
    font-family: Arial, sans-serif;
    perspective: 1000px;
    overflow: hidden;
  }

  .background-fire {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }

  .fire {
    position: absolute;
    width: 20px;
    height: 100px;
    background: radial-gradient(circle, #ff4500 10%, #ff6347 50%, transparent 70%);
    border-radius: 50%;
    animation: flicker 2s infinite alternate ease-in-out, rise 3s infinite linear;
    opacity: 0.8;
  }

  @keyframes flicker {
    from {
      transform: scale(1);
      opacity: 0.8;
    }
    to {
      transform: scale(1.2);
      opacity: 1;
    }
  }

  @keyframes rise {
    from {
      transform: translateY(100vh);
      opacity: 0.8;
    }
    to {
      transform: translateY(-10vh);
      opacity: 0;
    }
  }

  .calendar-envelope {
    width: 300px;
    height: 400px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 1.5s;
    z-index: 1;
  }

  .calendar-envelope.open {
    transform: rotateX(180deg);
  }

  .front, .back {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    backface-visibility: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .front {
    background: #e74c3c;
    transform-origin: bottom;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .back {
    background: #c0392b;
    transform: rotateX(180deg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .calendar-header {
    width: 100%;
    background: #c0392b;
    color: white;
    text-align: center;
    padding: 10px 0;
    border-radius: 10px 10px 0 0;
    font-size: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .month-year {
    flex: 1;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }

  .nav-button {
    font-size: 24px;
    color: white;
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px 10px;
    font-weight: bold;
    z-index: 10;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    padding: 10px;
    background: white;
    width: calc(100% - 20px);
  }

  .calendar-day {
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .calendar-day.weekend {
    background: #f8f9fa;
  }

  .calendar-day.today {
    background: #e74c3c;
    color: white;
    font-weight: bold;
  }

  .countdown {
    font-size: 36px;
    color: white;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 2;
    position: relative;
  }
`;
document.head.appendChild(style);

let currentMonth = new Date();

// Function to calculate days until June 1
function daysUntilJune1() {
  const now = new Date();
  const target = new Date(now.getFullYear(), 5, 1); // June 1
  if (now > target) {
    target.setFullYear(target.getFullYear() + 1);
  }
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

// Function to create calendar grid
function createCalendar(targetDate) {
  const calendar = document.createElement('div');
  calendar.className = 'calendar-grid';

  // Add day headers
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days.forEach((day) => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day';
    dayHeader.style.fontWeight = 'bold';
    dayHeader.textContent = day;
    calendar.appendChild(dayHeader);
  });

  // Get first day of month
  const firstDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
  const lastDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

  // Add blank spaces for days before first of month
  for (let i = 0; i < firstDay.getDay(); i++) {
    const blank = document.createElement('div');
    blank.className = 'calendar-day';
    calendar.appendChild(blank);
  }

  // Add days of month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    const currentDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), i);

    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      dayElement.classList.add('weekend');
    }

    if (
      currentDate.getDate() === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear()
    ) {
      dayElement.classList.add('today');
    }

    dayElement.textContent = i;
    calendar.appendChild(dayElement);
  }

  return calendar;
}

// Function to create fire animation in the background
function createBackgroundFire() {
  const fireContainer = document.createElement('div');
  fireContainer.className = 'background-fire';

  for (let i = 0; i < 100; i++) {
    const fire = document.createElement('div');
    fire.className = 'fire';
    fire.style.left = `${Math.random() * 100}vw`;
    fire.style.animationDelay = `${Math.random() * 3}s`;
    fireContainer.appendChild(fire);
  }

  document.body.appendChild(fireContainer);
}

// Function to render the calendar
function renderCalendar() {
  const monthYear = document.querySelector('.month-year');
  monthYear.textContent = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendar = document.querySelector('.calendar-grid');
  const newCalendar = createCalendar(currentMonth);
  calendar.replaceWith(newCalendar);
}

// Create basic HTML structure
function createElements() {
  const envelope = document.createElement('div');
  envelope.className = 'calendar-envelope';

  // Create front of envelope with calendar
  const front = document.createElement('div');
  front.className = 'front';

  const header = document.createElement('div');
  header.className = 'calendar-header';

  const monthYear = document.createElement('div');
  monthYear.className = 'month-year';
  header.appendChild(monthYear);

  const prevButton = document.createElement('button');
  prevButton.className = 'nav-button';
  prevButton.textContent = '<';
  prevButton.onclick = (e) => {
    e.stopPropagation(); // Prevent flipping
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
  };

  const nextButton = document.createElement('button');
  nextButton.className = 'nav-button';
  nextButton.textContent = '>';
  nextButton.onclick = (e) => {
    e.stopPropagation(); // Prevent flipping
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
  };

  header.appendChild(prevButton);
  header.appendChild(monthYear);
  header.appendChild(nextButton);

  const calendar = createCalendar(currentMonth);
  front.appendChild(header);
  front.appendChild(calendar);

  // Create back of envelope with countdown
  const back = document.createElement('div');
  back.className = 'back';

  const countdown = document.createElement('div');
  countdown.className = 'countdown';
  back.appendChild(countdown);

  // Assemble envelope
  envelope.appendChild(front);
  envelope.appendChild(back);

  envelope.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-button')) {
      envelope.classList.toggle('open');
      if (envelope.classList.contains('open')) {
        countdown.textContent = `${daysUntilJune1()} Days Until June 1`;
      }
    }
  });

  document.body.appendChild(envelope);

  // Initialize month name
  renderCalendar();
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
  createBackgroundFire(); // Add the background fire animation
  createElements();       // Add the calendar envelope
});
