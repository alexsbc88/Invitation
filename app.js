document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('invite-form');
  const resetBtn = document.getElementById('reset-btn');
  const invitationDiv = document.getElementById('invitation');
  const partyTimeMessage = document.getElementById('party-time-message');

  // ---- Function: Show invitation confirmation ----
  function showInvitation(name, partyTime) {
    partyTimeMessage.textContent = `${name}, your party starts at ${partyTime}!`;
    invitationDiv.style.display = 'block';
  }

  // ---- Function: Launch confetti ----
  function launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // ---- Submit RSVP ----
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const workEnd = document.getElementById('work-end').value;

    if (!name || !workEnd) {
      alert("Please fill in all fields.");
      return;
    }

    // Calculate party time: 30 minutes after work end
    const [workHour, workMin] = workEnd.split(':').map(Number);
    const partyDate = new Date();
    partyDate.setHours(workHour);
    partyDate.setMinutes(workMin + 30);

    // Format time
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

    // ---- Send RSVP to Google Sheets ----
    // Note: Make sure your Google Apps Script is deployed as "Anyone, even anonymous"
    fetch("https://script.google.com/macros/s/AKfycbxeJiPgj70kZnKBih-VzabR7gAg9gUPzCPph71gQ-ZYEiNWq1fR-liLUqHIT5eUk_T_/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, workEnd, partyTime: partyTimeString })
    })
    .then(res => res.json())
    .then(data => {
      console.log("RSVP stored:", data);
      showInvitation(name, partyTimeString);
      launchConfetti();
    })
    .catch(err => {
      console.error("Error sending RSVP:", err);
      alert("Failed to send RSVP. Make sure your Google Apps Script is deployed as 'Anyone, even anonymous'.");
      showInvitation(name, partyTimeString); // Optional: show invitation even if fetch fails
      launchConfetti();
    });
  });

  // ---- Reset RSVP ----
  resetBtn.addEventListener('click', () => {
    localStorage.removeItem('invitee');
    invitationDiv.style.display = 'none';
    form.reset();
  });

  // ---- Auto-load existing RSVP if any ----
  const savedInvite = localStorage.getItem('invitee');
  if (savedInvite) {
    const { name, partyTime } = JSON.parse(savedInvite);
    showInvitation(name, partyTime);
  }
});
