document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Elements
    const linkForm = document.getElementById('link-form');
    const originalLinkInput = document.getElementById('original-link');
    
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
        
        const originalLink = originalLinkInput.value.trim();
        if (!originalLink) return;
        
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
            // Create parameter string with all provided social links
            let params = `link=${encodeURIComponent(originalLink)}`;
            
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