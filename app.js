document.getElementById('invite-form').onsubmit = function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const workEnd = document.getElementById('work-end').value;

  // Calculate party time: 30 minutes after work end
  const [workHour, workMin] = workEnd.split(':').map(Number);
  const partyDate = new Date();
  partyDate.setHours(workHour);
  partyDate.setMinutes(workMin + 30);

  let hours = partyDate.getHours();
  let minutes = partyDate.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const partyTimeString = `${hours}:${minutes} ${ampm}`;

  // Store locally so you can show the result instantly (does not save to repo)
  localStorage.setItem('invitee', JSON.stringify({
    name,
    workEnd,
    partyTime: partyTimeString
  }));

  // Show confirmation
  document.getElementById('form-container').style.display = 'none';
  document.getElementById('invitation').style.display = 'block';
  document.getElementById('party-time-message').textContent =
    `The firework watching party is at ${partyTimeString}. See you then, ${name}!`;

  // Give link to submit via GitHub Issue
  document.getElementById('open-issue-link').href =
    `https://github.com/alexsbc88/Invitation/issues/new?title=RSVP:%20${encodeURIComponent(name)}&body=Work%20End%20Time:%20${workEnd}%0AParty%20Time:%20${partyTimeString}`;
};

// On page load: show RSVP info if already submitted
window.onload = function() {
  const invitee = localStorage.getItem('invitee');
  if (invitee) {
    const obj = JSON.parse(invitee);
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('invitation').style.display = 'block';
    document.getElementById('party-time-message').textContent =
      `The firework watching party is at ${obj.partyTime}. See you then, ${obj.name}!`;
  }
};

// Reset button for testing
document.getElementById('reset-btn').onclick = function() {
  localStorage.removeItem('invitee');
  location.reload();
};
