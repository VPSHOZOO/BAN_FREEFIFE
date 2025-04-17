// Reference to the database
const database = firebase.database();
const reportsRef = database.ref('freeFireReports');

// Form submission
document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const playerId = document.getElementById('playerId').value;
    const playerName = document.getElementById('playerName').value;
    const reason = document.getElementById('reason').value;
    const evidence = document.getElementById('evidence').value;
    const reporter = document.getElementById('reporter').value;
    
    // Create new report
    const newReportRef = reportsRef.push();
    newReportRef.set({
        playerId: playerId,
        playerName: playerName || 'Unknown',
        reason: reason,
        evidence: evidence,
        reporter: reporter || 'Anonymous',
        status: 'pending',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert('Report submitted successfully!');
        document.getElementById('reportForm').reset();
    }).catch((error) => {
        console.error('Error submitting report:', error);
        alert('Error submitting report. Please try again.');
    });
});

// Load reports
reportsRef.orderByChild('timestamp').limitToLast(10).on('value', (snapshot) => {
    const reportsTable = document.getElementById('reportsTable');
    reportsTable.innerHTML = '';
    
    snapshot.forEach((childSnapshot) => {
        const report = childSnapshot.val();
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${report.playerId}</td>
            <td>${report.playerName}</td>
            <td>${formatReason(report.reason)}</td>
            <td class="status-${report.status}">${report.status}</td>
            <td>${formatDate(report.timestamp)}</td>
        `;
        
        reportsTable.prepend(row);
    });
});

// Helper functions
function formatReason(reason) {
    const reasons = {
        'hacking': 'Hacking',
        'teamkill': 'Team Killing',
        'abuse': 'Verbal Abuse',
        'bot': 'Bot Account',
        'other': 'Other'
    };
    return reasons[reason] || reason;
}

function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
}
