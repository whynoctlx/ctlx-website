// pointer light on the card
const card = document.querySelector('.card');
card.addEventListener('pointermove', (e) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', e.clientX - rect.left + 'px');
  card.style.setProperty('--my', e.clientY - rect.top + 'px');
});

// local time in Bratislava
const clock = document.getElementById('clock');
const format = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Bratislava',
  hour: '2-digit',
  minute: '2-digit',
});
const tick = () => (clock.textContent = format.format(new Date()));
tick();
setInterval(tick, 10000);
