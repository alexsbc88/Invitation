document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('invite-form');
  const nameInput = document.getElementById('name');
  const workEndInput = document.getElementById('work-end');
  const resetBtn = document.getElementById('reset-btn');

  form.onsubmit = function(e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const workEnd = workEndInput.value;

    if (!name || !workEnd) return alert("Please fill out both fields!");

    // Calculate party time: 30 minutes after work end
    const [workHour, workMin] = workEnd.split(':').map(Number);
    const partyDate = new Date();
    partyDate.setHours(workHour);
    partyDate.setMinutes(workMin + 30);

    let hours = partyDate.getHours();
    let minutes = partyDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const partyTimeString = `${hours}:${minutes} ${ampm}`;

    // Save locally
    localStorage.setItem('invitee', JSON.stringify({
      name,
      workEnd,
      partyTime: partyTimeString
    }));

    console.log("Form submitted!", { name, workEnd, partyTime: partyTimeString });

    // Send to Google Sheets via GET to avoid CORS
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzywjfc8GTid7lAt8MGMlyczGHPZE18S1o1FBRFZEINlwovNKJDFYcbHrpXpskDus4/exec";
    const url = `${scriptUrl}?name=${encodeURIComponent(name)}&workEnd=${workEnd}&partyTime=${encodeURIComponent(partyTimeString)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => console.log("Sheets response:", data))
      .catch(err => console.error("Error sending RSVP:", err));

    // Show invitation
    showInvitation(name, partyTimeString, workEnd);

    // Launch confetti
    launchConfetti();

    // Clear inputs for debugging
    nameInput.value = '';
    workEndInput.value = '';
  };

  // Reset button
  resetBtn.onclick = function() {
    localStorage.removeItem('invitee');
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('invitation').style.display = 'none';
    nameInput.value = '';
    workEndInput.value = '';
  };
});

// Show invitation
function showInvitation(name, partyTime, workEnd) {
  document.getElementById('form-container').style.display = 'none';
  document.getElementById('invitation').style.display = 'block';
  document.getElementById('party-time-message').textContent =
    `The firework watching party is at ${partyTime}. See you then, ${name}!`;

  document.getElementById('open-issue-link').href =
    `https://github.com/alexsbc88/Invitation/issues/new?title=RSVP:%20${encodeURIComponent(name)}&body=Work%20End%20Time:%20${workEnd}%0AParty%20Time:%20${partyTime}`;
}

// Confetti animation
function launchConfetti() {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  const end = Date.now() + 2000;

  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// Load saved invite
window.onload = function() {
  const invitee = localStorage.getItem('invitee');
  if (invitee) {
    const obj = JSON.parse(invitee);
    showInvitation(obj.name, obj.partyTime, obj.workEnd);
  }
};
