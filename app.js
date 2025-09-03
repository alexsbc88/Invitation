// Replace this with your actual token (for demo only)
// In production, NEVER expose your token publicly
const GITHUB_TOKEN = "YOUR_PERSONAL_ACCESS_TOKEN";
const REPO_OWNER = "alexsbc88";
const REPO_NAME = "firework-invitation";
const FILE_PATH = "invites.json";
const BRANCH = "main";

async function saveInviteToRepo(inviteeData) {
    // Get the current file content and SHA
    const getUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const getResp = await fetch(getUrl, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const fileData = await getResp.json();
    const sha = fileData.sha;
    // Parse current invites
    let invites = [];
    try {
        invites = JSON.parse(atob(fileData.content));
    } catch (e) {}
    // Add the new invite
    invites.push(inviteeData);

    // Prepare new content
    const updatedContent = btoa(JSON.stringify(invites, null, 2));
    // Commit the new file content
    const commitResp = await fetch(getUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            message: `Add new invite from ${inviteeData.name}`,
            content: updatedContent,
            sha: sha,
            branch: BRANCH
        })
    });
    return commitResp.ok;
}

document.getElementById('invite-form').onsubmit = async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const workEnd = document.getElementById('work-end').value;

    // Calculate party time (30 min after workEnd)
    const [workHour, workMin] = workEnd.split(':').map(Number);
    const partyTime = new Date();
    partyTime.setHours(workHour);
    partyTime.setMinutes(workMin + 30);

    let hours = partyTime.getHours();
    let minutes = partyTime.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const partyTimeString = `${hours}:${minutes} ${ampm}`;

    const inviteeData = {
        name,
        workEnd,
        partyTime: partyTimeString,
        submittedAt: new Date().toISOString()
    };

    // Save to repo
    const success = await saveInviteToRepo(inviteeData);
    if (success) {
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('invitation').style.display = 'block';
        document.getElementById('party-time-message').textContent =
            `The firework watching party is at ${partyTimeString}. See you then, ${name}!`;
    } else {
        alert("Failed to save your RSVP. Please try again.");
    }
    document.getElementById('reset-btn').onclick = function() {
    localStorage.removeItem('invitee');
    location.reload();
};
};
