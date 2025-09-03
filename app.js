document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('invite-form');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload

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

    // Send RSVP to Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbxeJiPgj70kZnKBih-VzabR7gAg9gUPzCPph71gQ-ZYEiNWq1fR-liLUqHIT5eUk_T_/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, workEnd, partyTime: partyTimeString })
    })
    .then(res => res.json())
    .then(data => {
      console.log("RSVP stored:", data);
      // Show confirmation only after successful submission
      showInvitation(name, partyTimeString, workEnd);
      launchConfetti();
    })
    .catch(err => {
      console.error("Error sending RSVP:", err);
      alert("Failed to send RSVP. Please try again.");
    });
  });
});
