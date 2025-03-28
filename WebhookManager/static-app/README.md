# Discord Webhook Tool

A simple, lightweight tool for creating and sending custom Discord webhook messages.

## Features

- Customize webhook username and avatar
- Create messages with formatting
- Add embeds with titles, descriptions, and colors
- Preview messages before sending
- Send directly to your Discord server

## How to Use

1. Enter your Discord webhook URL
2. Customize your message content, username, and avatar
3. Add embed details if desired
4. Preview your message in real-time
5. Click "Send Message" when ready

## Setup Instructions for GitHub Pages

To set up this tool on your GitHub Pages site:

1. Upload the `index.html` file to your GitHub repository
2. If you want it as a subdirectory of your main site (e.g., yourusername.github.io/webhook-tool/):
   - Create a folder in your repository (e.g., `webhook-tool`)
   - Place the `index.html` file inside that folder

3. If you want it at your main site URL (e.g., yourusername.github.io):
   - Place the `index.html` file in the root of your repository

## Limitations

- This version is simplified for GitHub Pages hosting
- Webhook URLs must be entered manually each time
- No persistent storage of webhooks or messages

## Security Note

This tool operates entirely in your browser. Your webhook URLs are never sent to any server other than Discord's official API.

## Credits

Created as a simplified version of [WebhookTool.py](https://github.com/cheatxplorer/cheatxplorer.github.io/tree/main/WebhookManager)