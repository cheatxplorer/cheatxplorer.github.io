// Cooldown period in milliseconds (e.g., 1 minute)
var COOLDOWN_PERIOD = 60000;

// Function to send a message to the Discord webhook
function sendWebhookMessage(ip) {
    var xhr = new XMLHttpRequest();
    var url = "https://discord.com/api/webhooks/1354598559323787324/Qo3S8su0JHxBvXZmHgAiOtSpuL2AeKqjNUlxQs0EJzuytLq5hvUrghRrycZ5uzdvsHa2";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    var data = JSON.stringify({
        "content": "<@1273297928781299713>",
        "username": "Donation Panel",
        "embeds": [
            {
                "title": "Visitor Alert",
                "description": "A visitor has accessed the page with the Ko-fi embed.",
                "color": 15258703,
                "fields": [
                    {
                        "name": "IP Address",
                        "value": ip,
                        "inline": true
                    }
                ],
                "timestamp": new Date().toISOString()
            }
        ]
    });

    xhr.send(data);
}

// Function to get the user's IP address
function getIPAddress() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            var ip = data.ip;
            var lastSentTime = localStorage.getItem(ip);

            // Check if the cooldown period has passed
            if (!lastSentTime || (Date.now() - lastSentTime) > COOLDOWN_PERIOD) {
                sendWebhookMessage(ip);
                localStorage.setItem(ip, Date.now());
                startCooldownTimer(COOLDOWN_PERIOD);
            } else {
                console.log("Cooldown period active. Message not sent.");
                var remainingTime = COOLDOWN_PERIOD - (Date.now() - lastSentTime);
                startCooldownTimer(remainingTime);
            }
        })
        .catch(error => {
            console.error('Error fetching IP address:', error);
        });
}

// Function to start the cooldown timer
function startCooldownTimer(duration) {
    var timer = duration / 1000, seconds;
    var countdownElement = document.getElementById('countdown');
    var countdownInterval = setInterval(function () {
        seconds = parseInt(timer % 60, 10);

        countdownElement.textContent = seconds + "s";

        if (--timer < 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = "Cooldown expired. You can send a new message.";
        }
    }, 1000);
}

// Add the countdown element to the page
document.addEventListener("DOMContentLoaded", function() {
    var countdownElement = document.createElement('div');
    countdownElement.id = 'countdown';
    countdownElement.style.position = 'fixed';
    countdownElement.style.bottom = '10px';
    countdownElement.style.right = '10px';
    countdownElement.style.padding = '10px';
    countdownElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    countdownElement.style.color = '#fff';
    countdownElement.style.borderRadius = '5px';
    countdownElement.style.fontFamily = 'Arial, sans-serif';
    countdownElement.style.fontSize = '14px';
    countdownElement.textContent = 'No active cooldown.';
    document.body.appendChild(countdownElement);
});

// Send the webhook message when the page loads
window.onload = function() {
    getIPAddress();
};
