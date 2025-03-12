// Generate hacker code animation
const hackerBackground = document.getElementById("hacker-background");

// Define lines of code for the animation
const codeLines = [
    "Initializing system...",
    "Accessing database...",
    "Decrypting files...",
    "Bypassing firewalls...",
    "Error: Unauthorized Access!",
    "Login successful...",
    "Loading resources...",
    "Running diagnostics...",
    "Establishing remote connection...",
    "Waiting for commands..."
];

// Create the code element and add it to the background
const codeElement = document.createElement("div");
codeElement.id = "hacker-code";

// Function to generate and display hacker code
function generateHackerCode() {
    for (let i = 0; i < 100; i++) {
        let randomLine = codeLines[Math.floor(Math.random() * codeLines.length)];
        let line = document.createElement("p");
        line.innerText = randomLine;
        codeElement.appendChild(line);
    }

    // Append the hacker code element to the body
    hackerBackground.appendChild(codeElement);
}

// Run the code generation function
generateHackerCode();
