/**
 * CheatXplorer Game Data
 * 
 * This file contains all game mod listings for the Android Mods page.
 * You can easily add, edit, or remove games in this file.
 * 
 * FORMAT:
 * {
 *     id: unique number,
 *     title: "Game Title",
 *     thumbnail: null, // Keep as null for auto-fetching from Play Store
 *     playStoreUrl: "https://play.google.com/store/apps/details?id=com.package.name",
 *     packageName: "com.package.name", // Must match the Play Store URL
 *     version: "1.2.3", // Current mod version
 *     features: [ // List of mod features
 *         "Feature 1",
 *         "Feature 2"
 *     ],
 *     downloadUrl: "https://yourdomain.com/download-link", // Direct download link
 *     previewUrl: "https://www.youtube.com/embed/VIDEO_ID" // YouTube embed URL (optional)
 * }
 */

const gameData = [
    {
        id: 1,
        title: "Minecraft",
        // Direct hard-coded icon URL that we know works
        thumbnail: "https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP=s280",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.mojang.minecraftpe",
        packageName: "com.mojang.minecraftpe",
        version: "1.20.30.24",
        features: [
            "Unlocked Premium Features",
            "God Mode",
            "Unlimited Resources",
            "All Skins Unlocked",
            "Anti-Ban Protection"
        ],
        downloadUrl: "https://modsfire.com/example-minecraft-mod",
        previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 2,
        title: "PUBG Mobile",
        // Direct hard-coded icon URL that we know works
        thumbnail: "https://play-lh.googleusercontent.com/JRd05pyBH41qjgsJuWduRJpDeZG0Hnb0yjf6AEOlVvqv4FJ0Gw2Oybaru5yFJaz_cqE=s280",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.tencent.ig",
        packageName: "com.tencent.ig",
        version: "2.7.0",
        features: [
            "Aimbot",
            "No Recoil",
            "ESP Hack",
            "Speed Boost",
            "Wallhack"
        ],
        downloadUrl: "https://modsfire.com/example-pubg-mod",
        previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 3,
        title: "Clash of Clans",
        // Direct hard-coded icon URL that we know works
        thumbnail: "https://play-lh.googleusercontent.com/akv2Bdp7i5Vv-sl9FuP3-T8vdT7Lambda972HmK-7RTh6jAbyEVfM_Uvcbx0huVN_GKFTHQ=s280",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.supercell.clashofclans",
        packageName: "com.supercell.clashofclans",
        version: "15.83.22",
        features: [
            "Unlimited Gems",
            "Instant Build",
            "Max Level Troops",
            "Private Server",
            "Resource Generator"
        ],
        downloadUrl: "https://modsfire.com/example-coc-mod",
        previewUrl: null
    },
    {
        id: 4,
        title: "Subway Surfers",
        // Direct hard-coded icon URL that we know works
        thumbnail: "https://play-lh.googleusercontent.com/SWoqt9rh_SnLPNNBxmFYzqXytEJrn4bGvY1HPejtcX_Z8e7CjmCQUvLAhCnpyuYR_lc=s280",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.kiloo.subwaysurf",
        packageName: "com.kiloo.subwaysurf",
        version: "3.15.0",
        features: [
            "Unlimited Coins",
            "Unlimited Keys",
            "All Characters Unlocked",
            "High Score Hack",
            "No Ads"
        ],
        downloadUrl: "https://modsfire.com/example-subway-mod",
        previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 5,
        title: "Candy Crush Saga",
        // Direct hard-coded icon URL that we know works
        thumbnail: "https://play-lh.googleusercontent.com/HmkoR83K_xBSC2FKs9wYn5wbQZ7B_qn7dWbGZCpZOILRbGrEiAFJ_HiRhlvQQPzK_g=s280",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.king.candycrushsaga",
        packageName: "com.king.candycrushsaga",
        version: "1.233.0.3",
        features: [
            "Unlimited Lives",
            "Unlimited Boosters",
            "All Episodes Unlocked",
            "No Waiting Time",
            "Ad-Free Experience"
        ],
        downloadUrl: "https://modsfire.com/example-candycrush-mod",
        previewUrl: null
    },
    {
        id: 6,
        title: "Call of Duty Mobile",
        // Direct hard-coded icon URL that we know works
        thumbnail: "https://play-lh.googleusercontent.com/aUqNpfk3l5Bv8d70xgExPsF_C3xYEuGQnaYWs-a-vAYZCYkAJZUbcwQQb1ddaadBSg=s280",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter",
        packageName: "com.activision.callofduty.shooter",
        version: "1.0.33",
        features: [
            "Aimbot Light",
            "No Recoil",
            "Radar Hack",
            "Speed Increase",
            "All Weapons Unlocked"
        ],
        downloadUrl: "https://modsfire.com/example-cod-mod",
        previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];
