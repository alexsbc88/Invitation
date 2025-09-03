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

  // ✅ Send RSVP to Google Sheets
  fetch("https://script.google.com/macros/s/AKfycbxeJiPgj70kZnKBih-VzabR7gAg9gUPzCPph71gQ-ZYEiNWq1fR-liLUqHIT5eUk_T_/exec", {
    method: "POST",
    body: JSON.stringify({ name, workEnd, partyTime: partyTimeString }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(data => console.log("RSVP stored:", data))
  .catch(err => console.error("Error sending RSVP:", err));

  // Show confirmation
  showInvitation(name, partyTimeString, workEnd);
  launchConfetti();
};
