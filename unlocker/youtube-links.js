// List of your YouTube video links (regular YouTube URLs)
const youtubeLinks = [
    "https://www.youtube.com/watch?v=511NHJjsIO8",
    "https://www.youtube.com/watch?v=Hc_jIS73koo",
    "https://www.youtube.com/watch?v=T_wXp-PFJOU",
    "https://www.youtube.com/watch?v=FQs26dXww1w",
    "https://www.youtube.com/watch?v=dMnNytZFxeU",
    "https://www.youtube.com/watch?v=GiTcVJNX8vk",
    "https://www.youtube.com/watch?v=B_1DcBi3tko",
];

// Function to convert a YouTube watch URL to an embed URL
function convertToEmbedUrl(watchUrl) {
    if (watchUrl.includes("youtube.com/watch?v=")) {
        return watchUrl.replace("watch?v=", "embed/");
    } else if (watchUrl.includes("youtu.be/")) {
        return watchUrl.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return watchUrl; // Return as-is if already in embed format
}

// Function to get a random YouTube embed link
function getRandomYouTubeLink() {
    const randomIndex = Math.floor(Math.random() * youtubeLinks.length);
    return youtubeLinks[randomIndex];
}