// Create a simulated 'hacker' code effect
const hackerBackground = document.getElementById("hacker-background");

// Create random code for the effect
const codeLines = [
    "Initializing System...",
    "Accessing User Data...",
    "Decrypting Files...",
    "Bypassing Security...",
    "Loading Resources...",
    "Running Diagnostics...",
    "Connecting to Remote Server...",
    "Error: Unauthorized Access!",
    "Password: ********",
    "Login Successful...",
    "Running Modifications..."
];

// Function to generate the hacker code animation
function generateHackerCode() {
    const codeElement = document.createElement("code");
    for (let i = 0; i < codeLines.length; i++) {
        let randomLine = codeLines[Math.floor(Math.random() * codeLines.length)];
        codeElement.innerHTML += randomLine + "<br/>";
    }

    hackerBackground.appendChild(codeElement);
}

generateHackerCode();
