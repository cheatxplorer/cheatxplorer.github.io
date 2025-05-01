document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Elements
    const linkForm = document.getElementById('link-form');
    const originalLinkInput = document.getElementById('original-link');
    
    // Toggle options
    const showLinkOption = document.getElementById('show-link-option');
    const showCodeOption = document.getElementById('show-code-option');
    const linkInputSection = document.getElementById('link-input-section');
    const codeInputSection = document.getElementById('code-input-section');
    
    // Code editor elements
    const luaCodeDisplay = document.getElementById('lua-code-display');
    const luaCodeInput = document.getElementById('lua-code');
    const codeEditorCount = document.querySelector('.code-editor-count');
    
    // Social media buttons
    const enableYoutubeBtn = document.getElementById('enable-youtube');
    const enableDiscordBtn = document.getElementById('enable-discord');
    const enableFacebookBtn = document.getElementById('enable-facebook');
    const enableTiktokBtn = document.getElementById('enable-tiktok');
    
    // Social media fields
    const youtubeField = document.getElementById('youtube-field');
    const discordField = document.getElementById('discord-field');
    const facebookField = document.getElementById('facebook-field');
    const tiktokField = document.getElementById('tiktok-field');
    
    // Social media inputs
    const youtubeLinkInput = document.getElementById('youtube-link');
    const discordLinkInput = document.getElementById('discord-link');
    const facebookLinkInput = document.getElementById('facebook-link');
    const tiktokLinkInput = document.getElementById('tiktok-link');
    
    // Other elements
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const generatedLinkContainer = document.getElementById('generated-link-container');
    const generatedLink = document.getElementById('generated-link');
    const copyBtn = document.getElementById('copy-btn');
    
    // State to track which option is active (link or code)
    let activeOption = 'link'; // 'link' or 'code'
    
    // State of social media buttons
    const socialMediaState = {
        youtube: false,
        discord: false,
        facebook: false,
        tiktok: false
    };
    
    // Initially hide the generated link container and loading spinner
    generatedLinkContainer.style.display = 'none';
    loadingSpinner.style.display = 'none';
    
    // Toggle between link and code options
    showLinkOption.addEventListener('click', function() {
        if (activeOption !== 'link') {
            activeOption = 'link';
            showLinkOption.classList.add('active');
            showCodeOption.classList.remove('active');
            linkInputSection.style.display = 'block';
            codeInputSection.style.display = 'none';
            originalLinkInput.setAttribute('required', '');
            luaCodeInput.removeAttribute('required');
        }
    });
    
    showCodeOption.addEventListener('click', function() {
        if (activeOption !== 'code') {
            activeOption = 'code';
            showCodeOption.classList.add('active');
            showLinkOption.classList.remove('active');
            codeInputSection.style.display = 'block';
            linkInputSection.style.display = 'none';
            luaCodeInput.setAttribute('required', '');
            originalLinkInput.removeAttribute('required');
        }
    });
    
    // Make the entire code box clickable
    const codeEditorContainer = document.querySelector('.code-editor-container');
    codeEditorContainer.addEventListener('click', function(e) {
        // Focus the code editor when clicking anywhere in the container
        if (e.target === this || !luaCodeDisplay.contains(e.target)) {
            luaCodeDisplay.focus();
        }
    });

    // Lua Code Editor functionality
    luaCodeDisplay.addEventListener('input', function() {
        // Sync with hidden textarea for form submission
        luaCodeInput.value = this.textContent;
        
        // Update character count
        const charCount = this.textContent.length;
        codeEditorCount.textContent = `${charCount.toLocaleString()} characters`;
        
        // Check if max limit is reached (300 characters)
        if (charCount > 300) {
            this.textContent = this.textContent.substring(0, 300);
            luaCodeInput.value = this.textContent;
            codeEditorCount.textContent = `300 characters (max reached)`;
            codeEditorCount.style.color = '#ff0000';
        } else {
            codeEditorCount.style.color = '';
            // Apply syntax highlighting only if we're not at the limit
            applyLuaSyntaxHighlighting(this);
        }
    });
    
    // Function to display Lua code without syntax highlighting
    // We're removing the syntax highlighting completely to avoid issues with span tags
    function applyLuaSyntaxHighlighting(element) {
        // Do nothing - we're no longer applying syntax highlighting
        // This keeps the raw code as-is without adding any HTML tags
        // The user can still edit and paste code without any interference
    }
    
    // Toggle YouTube field visibility
    enableYoutubeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        socialMediaState.youtube = !socialMediaState.youtube;
        youtubeField.style.display = socialMediaState.youtube ? 'block' : 'none';
        
        if (socialMediaState.youtube) {
            enableYoutubeBtn.classList.add('active');
            enableYoutubeBtn.innerHTML = '<i class="fas fa-times"></i> Remove YouTube Channel';
        } else {
            enableYoutubeBtn.classList.remove('active');
            enableYoutubeBtn.innerHTML = '<i class="fab fa-youtube"></i> YouTube Channel';
            youtubeLinkInput.value = '';
        }
        
        console.log("YouTube button clicked, state: ", socialMediaState.youtube);
    });
    
    // Toggle Discord field visibility
    enableDiscordBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        socialMediaState.discord = !socialMediaState.discord;
        discordField.style.display = socialMediaState.discord ? 'block' : 'none';
        
        if (socialMediaState.discord) {
            enableDiscordBtn.classList.add('active');
            enableDiscordBtn.innerHTML = '<i class="fas fa-times"></i> Remove Discord Link';
        } else {
            enableDiscordBtn.classList.remove('active');
            enableDiscordBtn.innerHTML = '<i class="fab fa-discord"></i> Discord Link';
            discordLinkInput.value = '';
        }
        
        console.log("Discord button clicked, state: ", socialMediaState.discord);
    });
    
    // Toggle Facebook field visibility
    enableFacebookBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        socialMediaState.facebook = !socialMediaState.facebook;
        facebookField.style.display = socialMediaState.facebook ? 'block' : 'none';
        
        if (socialMediaState.facebook) {
            enableFacebookBtn.classList.add('active');
            enableFacebookBtn.innerHTML = '<i class="fas fa-times"></i> Remove Facebook Page';
        } else {
            enableFacebookBtn.classList.remove('active');
            enableFacebookBtn.innerHTML = '<i class="fab fa-facebook"></i> Facebook Page';
            facebookLinkInput.value = '';
        }
        
        console.log("Facebook button clicked, state: ", socialMediaState.facebook);
    });
    
    // Toggle TikTok field visibility
    enableTiktokBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        socialMediaState.tiktok = !socialMediaState.tiktok;
        tiktokField.style.display = socialMediaState.tiktok ? 'block' : 'none';
        
        if (socialMediaState.tiktok) {
            enableTiktokBtn.classList.add('active');
            enableTiktokBtn.innerHTML = '<i class="fas fa-times"></i> Remove TikTok Profile';
        } else {
            enableTiktokBtn.classList.remove('active');
            enableTiktokBtn.innerHTML = '<i class="fab fa-tiktok"></i> TikTok Profile';
            tiktokLinkInput.value = '';
        }
        
        console.log("TikTok button clicked, state: ", socialMediaState.tiktok);
    });
    
    // Encryption functions to protect against AI detection
    function generateRandomKey(length = 12) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    // XOR encryption for obfuscation
    function xorEncrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    }
    
    // Scramble the URL to make it harder for AI to detect patterns
    function scrambleUrl(url) {
        const key = generateRandomKey();
        const encrypted = xorEncrypt(url, key);
        const encoded = btoa(encrypted);
        return encoded + '.' + btoa(key);
    }
    
    // URL validation functions
    function isValidYouTubeUrl(url) {
        return url === '' || /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
    }
    
    function isValidDiscordUrl(url) {
        return url === '' || /^https:\/\/(www\.)?(discord\.gg|discord\.com)\/.+/.test(url);
    }
    
    function isValidFacebookUrl(url) {
        return url === '' || /^https:\/\/(www\.)?(facebook\.com|fb\.com)\/.+/.test(url);
    }
    
    function isValidTikTokUrl(url) {
        return url === '' || /^https:\/\/(www\.)?tiktok\.com\/.+/.test(url);
    }
    
    // Validate inputs before form submission
    function validateInputs() {
        let isValid = true;
        
        // If YouTube is enabled, validate YouTube input
        if (socialMediaState.youtube) {
            if (!isValidYouTubeUrl(youtubeLinkInput.value.trim())) {
                youtubeLinkInput.setCustomValidity('Please enter a valid YouTube URL');
                isValid = false;
            } else {
                youtubeLinkInput.setCustomValidity('');
            }
        }
        
        // If Discord is enabled, validate Discord input
        if (socialMediaState.discord) {
            if (!isValidDiscordUrl(discordLinkInput.value.trim())) {
                discordLinkInput.setCustomValidity('Please enter a valid Discord invite URL');
                isValid = false;
            } else {
                discordLinkInput.setCustomValidity('');
            }
        }
        
        // If Facebook is enabled, validate Facebook input
        if (socialMediaState.facebook) {
            if (!isValidFacebookUrl(facebookLinkInput.value.trim())) {
                facebookLinkInput.setCustomValidity('Please enter a valid Facebook URL');
                isValid = false;
            } else {
                facebookLinkInput.setCustomValidity('');
            }
        }
        
        // If TikTok is enabled, validate TikTok input
        if (socialMediaState.tiktok) {
            if (!isValidTikTokUrl(tiktokLinkInput.value.trim())) {
                tiktokLinkInput.setCustomValidity('Please enter a valid TikTok URL');
                isValid = false;
            } else {
                tiktokLinkInput.setCustomValidity('');
            }
        }
        
        return isValid;
    }
    
    // Handle form submission
    linkForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validate inputs
        if (!validateInputs()) {
            return; // Stop if validation fails
        }
        
        // Get social links (if they're enabled)
        const youtubeLink = socialMediaState.youtube ? (youtubeLinkInput?.value.trim() || "") : "";
        const discordLink = socialMediaState.discord ? (discordLinkInput?.value.trim() || "") : "";
        const facebookLink = socialMediaState.facebook ? (facebookLinkInput?.value.trim() || "") : "";
        const tiktokLink = socialMediaState.tiktok ? (tiktokLinkInput?.value.trim() || "") : "";
        
        // Show loading, hide button
        generateBtn.style.display = 'none';
        loadingSpinner.style.display = 'flex';
        
        // Simulate a brief loading state (remove in production)
        setTimeout(() => {
            let params = '';
            
            // Handle different content types (link or code)
            if (activeOption === 'link') {
                const originalLink = originalLinkInput.value.trim();
                if (!originalLink) return;
                
                // Use our encryption function to obfuscate the link
                const scrambledLink = scrambleUrl(originalLink);
                params = `data=${encodeURIComponent(scrambledLink)}&type=link`;
            } else if (activeOption === 'code') {
                const luaCode = luaCodeInput.value;
                if (!luaCode) return;
                
                // Use encryption to make it harder for AI to extract the code
                const scrambledCode = scrambleUrl(luaCode);
                params = `data=${encodeURIComponent(scrambledCode)}&type=code`;
            }
            
            // Add social links to parameters
            if (youtubeLink) {
                params += `&yt=${encodeURIComponent(youtubeLink)}`;
            }
            
            if (discordLink) {
                params += `&dc=${encodeURIComponent(discordLink)}`;
            }
            
            if (facebookLink) {
                params += `&fb=${encodeURIComponent(facebookLink)}`;
            }
            
            if (tiktokLink) {
                params += `&tt=${encodeURIComponent(tiktokLink)}`;
            }
            
            // Generate the custom link with all parameters
            const redirectUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}redirect.html?${params}`;
            
            // Update and show the generated link
            generatedLink.href = redirectUrl;
            generatedLink.textContent = redirectUrl;
            generatedLinkContainer.style.display = 'block';
            
            // Hide loading, show button
            loadingSpinner.style.display = 'none';
            generateBtn.style.display = 'inline-flex';
            
            // Scroll to the generated link
            generatedLinkContainer.scrollIntoView({ behavior: 'smooth' });
        }, 800);
    });
    
    // Input validation event listeners
    youtubeLinkInput.addEventListener('input', function() {
        this.setCustomValidity(isValidYouTubeUrl(this.value.trim()) ? '' : 'Please enter a valid YouTube URL');
    });
    
    discordLinkInput.addEventListener('input', function() {
        this.setCustomValidity(isValidDiscordUrl(this.value.trim()) ? '' : 'Please enter a valid Discord invite URL');
    });
    
    facebookLinkInput.addEventListener('input', function() {
        this.setCustomValidity(isValidFacebookUrl(this.value.trim()) ? '' : 'Please enter a valid Facebook URL');
    });
    
    tiktokLinkInput.addEventListener('input', function() {
        this.setCustomValidity(isValidTikTokUrl(this.value.trim()) ? '' : 'Please enter a valid TikTok URL');
    });
    
    // Copy to clipboard functionality
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(generatedLink.textContent).then(() => {
            // Update button text temporarily
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('copied');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });
});