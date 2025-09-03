// 🎉 Main JS for Firework Invitation
document.addEventListener('DOMContentLoaded', () => {

  // Form submit
  document.getElementById('invite-form').onsubmit = function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
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

    // Save locally for confirmation
    localStorage.setItem('invitee', JSON.stringify({
      name,
      workEnd,
      partyTime: partyTimeString
    }));

    // Debug: log form submission
    console.log("Form submitted!", { name, workEnd, partyTime: partyTimeString });

    // Optional: send to Google Sheets (uncomment if needed)
    /*
    fetch("https://script.google.com/macros/s/AKfycbxeJiPgj70kZnKBih-VzabR7gAg9gUPzCPph71gQ-ZYEiNWq1fR-liLUqHIT5eUk_T_/exec", {
      method: "POST",
      body: JSON.stringify({ name, workEnd, partyTime: partyTimeString }),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => console.log("RSVP stored:", data))
    .catch(err => console.error("Error sending RSVP:", err));
    */

    // Show confirmation & launch confetti
    showInvitation(name, partyTimeString, workEnd);
    launchConfetti();
  };

  // Reset button
  document.getElementById('reset-btn').onclick = function() {
    localStorage.removeItem('invitee');
    location.reload();
  };

});

// Show invitation UI
function showInvitation(name, partyTime, workEnd) {
  document.getElementById('form-container').style.display = 'none';
  document.getElementById('invitation').style.display = 'block';
  document.getElementById('party-time-message').textContent =
    `The firework watching party is at ${partyTime}. See you then, ${name}!`;

  // Update GitHub Issue link
  document.getElementById('open-issue-link').href =
    `https://github.com/alexsbc88/Invitation/issues/new?title=RSVP:%20${encodeURIComponent(name)}&body=Work%20End%20Time:%20${workEnd}%0AParty%20Time:%20${partyTime}`;
}

// 🎆 Confetti animation
function launchConfetti() {
  // Burst effect
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Small fireworks every 300ms
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// On page load: show saved invite if exists
window.onload = function() {
  const invitee = localStorage.getItem('invitee');
  if (invitee) {
    const obj = JSON.parse(invitee);
    showInvitation(obj.name, obj.partyTime, obj.workEnd);
  }
};
