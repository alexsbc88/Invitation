document.getElementById('invite-form').onsubmit = function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const workEnd = document.getElementById('work-end').value;
    if (!name || !workEnd) return;

    // Save to "database" (for demo: localStorage)
    localStorage.setItem('invitee', JSON.stringify({ name, workEnd }));

    // Hide the form
    document.getElementById('form-container').style.display = 'none';

    // Calculate party time (30 min after workEnd)
    const [workHour, workMin] = workEnd.split(':').map(Number);
    const partyTime = new Date();
    partyTime.setHours(workHour);
    partyTime.setMinutes(workMin + 30);

    // Format party time as hh:mm AM/PM
    let hours = partyTime.getHours();
    let minutes = partyTime.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const partyTimeString = `${hours}:${minutes} ${ampm}`;

    function showInvite() {
        document.getElementById('invitation').style.display = 'block';
        document.getElementById('party-time-message').textContent =
            `The firework watching party is at ${partyTimeString}. See you then, ${name}!`;
    }

    // Show invite now or after delay
    const now = new Date();
    if (now >= partyTime) {
        showInvite();
    } else {
        setTimeout(showInvite, partyTime - now);
    }
};

window.onload = function() {
    const invitee = JSON.parse(localStorage.getItem('invitee') || 'null');
    if (invitee) {
        document.getElementById('form-container').style.display = 'none';
        const [workHour, workMin] = invitee.workEnd.split(':').map(Number);
        const partyTime = new Date();
        partyTime.setHours(workHour);
        partyTime.setMinutes(workMin + 30);

        let hours = partyTime.getHours();
        let minutes = partyTime.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const partyTimeString = `${hours}:${minutes} ${ampm}`;

        if (new Date() >= partyTime) {
            document.getElementById('invitation').style.display = 'block';
            document.getElementById('party-time-message').textContent =
                `The firework watching party is at ${partyTimeString}. See you then, ${invitee.name}!`;
        }
    }
};
