// Game data comes from the gamedata.js file which defines GAME_DATA
// No default games needed here

// Application state
const state = {
  allGames: [], // All games from localStorage or default
  freeGames: [], // Filtered free games
  donatorGames: [], // Filtered donator (exclusive) games
  freeCurrentPage: 1,
  donatorCurrentPage: 1,
  gamesPerPage: 20,
  searchTerm: '',
  currentSection: 'free-mods', // Current active section: 'free-mods', 'donator-mods', 'admin'
  editingGame: null, // Game being edited in the admin panel
  highlightedGame: null, // Store highlighted game when accessed via direct link
  freeSortOption: 'alphabetical', // Default sort for free games
  donatorSortOption: 'alphabetical' // Default sort for donator games
};

// DOM Elements cache for performance
const elementsCache = {};

// Utility function to get DOM elements with caching
function $(selector) {
  if (!elementsCache[selector]) {
    elementsCache[selector] = document.querySelector(selector);
  }
  return elementsCache[selector];
}

// Load games from GAME_DATA in gamedata.js for public viewing
// In admin mode, load games from localStorage (separate from public display)
function loadGames() {
  // Test if localStorage is available and working (Firefox compatibility fix)
  let localStorageAvailable = false;
  try {
    localStorage.setItem('localStorage_test', 'test');
    localStorage.removeItem('localStorage_test');
    localStorageAvailable = true;
  } catch (e) {
    console.warn('localStorage is not available:', e);
    // Will proceed with default behavior
  }

  if (state.currentSection === 'admin') {
    // For admin mode, load from localStorage admin games if available
    if (localStorageAvailable) {
      try {
        const savedAdminGames = localStorage.getItem('cheatxplorer_admin_games');
        if (savedAdminGames) {
          state.allGames = JSON.parse(savedAdminGames);
        } else {
          // Start with empty admin games if nothing saved
          state.allGames = [];
        }
      } catch (error) {
        console.error('Failed to load admin games:', error);
        state.allGames = [];  // Start with empty array if error
      }
    } else {
      // If localStorage is not available, use empty array
      state.allGames = [];
      console.warn('Admin game data cannot be saved - localStorage not available');
    }
  } else {
    // For public viewing (free and donator sections), always use GAME_DATA
    // This ensures all users see the same games from the gamedata.js file
    try {
      state.allGames = [...GAME_DATA];
    } catch (error) {
      console.error('Error loading game data:', error);
      state.allGames = []; // Use empty array if GAME_DATA is not available or valid
    }
  }

  // Filter games by status
  filterGamesByStatus();
}

// Save admin games to localStorage - doesn't affect display games
function saveGames() {
  // First check if localStorage is available (Firefox compatibility)
  let localStorageAvailable = false;
  try {
    localStorage.setItem('localStorage_test', 'test');
    localStorage.removeItem('localStorage_test');
    localStorageAvailable = true;
  } catch (e) {
    console.warn('localStorage is not available:', e);
    alert('Your browser has localStorage disabled or in private browsing mode. Game data cannot be saved.');
    return;
  }

  if (localStorageAvailable) {
    try {
      localStorage.setItem('cheatxplorer_admin_games', JSON.stringify(state.allGames));
    } catch (error) {
      console.error('Failed to save admin games to localStorage:', error);
      alert('Failed to save games. Your browser may have localStorage disabled, in private browsing mode, or storage is full.');
    }
  }
}

// Filter games by status (free vs exclusive/donator)
function filterGamesByStatus() {
  state.freeGames = state.allGames.filter(game => game.status === 'free');
  state.donatorGames = state.allGames.filter(game => game.status === 'exclusive');

  // If there's a highlighted game, auto-switch to the right section
  // Note: This is only used for legacy URL format support without category prefix
  // New URL format (free/packageName or donator/packageName) handles section switching directly
  if (state.highlightedGame) {
    // Get URL parameters to check if we're using the new or old format
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get('game');

    // Only perform auto-section detection for legacy URLs (without category prefix)
    if (gameParam && !gameParam.includes('/')) {
      const inFreeGames = state.freeGames.some(game => game.packageName === state.highlightedGame);
      const inDonatorGames = state.donatorGames.some(game => game.packageName === state.highlightedGame);

      if (inFreeGames && state.currentSection !== 'free-mods') {
        // Defer execution to avoid loops
        setTimeout(() => switchSection('free-mods'), 0);
      } else if (inDonatorGames && state.currentSection !== 'donator-mods') {
        // Defer execution to avoid loops
        setTimeout(() => switchSection('donator-mods'), 0);
      }
    }
  }
}

// Filter games based on search term
function filterGamesBySearch(games) {
  if (!state.searchTerm) {
    return games;
  }

  return games.filter(game => {
    return game.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
           game.packageName.toLowerCase().includes(state.searchTerm.toLowerCase());
  });
}

// Theme Switcher Functions
function toggleTheme() {
  const body = document.body;
  const themeSwitcher = document.getElementById('theme-switcher');
  const switcherText = themeSwitcher.querySelector('.switcher-text');
  
  if (body.classList.contains('comic-theme')) {
    // Switch to original cyberpunk theme
    body.classList.remove('comic-theme');
    body.classList.add('cyberpunk-theme');
    switcherText.textContent = 'Switch to Comic Style';
    localStorage.setItem('theme', 'cyberpunk');
  } else {
    // Switch to new comic theme
    body.classList.remove('cyberpunk-theme');
    body.classList.add('comic-theme');
    switcherText.textContent = 'Switch to Cyberpunk Style';
    localStorage.setItem('theme', 'comic');
  }
}

// Load saved theme from localStorage
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  const body = document.body;
  const themeSwitcher = document.getElementById('theme-switcher');
  const switcherText = themeSwitcher.querySelector('.switcher-text');
  
  if (savedTheme === 'cyberpunk') {
    // Load original cyberpunk theme
    body.classList.remove('comic-theme');
    body.classList.add('cyberpunk-theme');
    switcherText.textContent = 'Switch to Comic Style';
  } else {
    // Default is comic theme or if 'comic' is saved
    body.classList.remove('cyberpunk-theme');
    body.classList.add('comic-theme');
    switcherText.textContent = 'Switch to Cyberpunk Style';
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Check if we need to clear the search (after navigation refresh)
  if (sessionStorage.getItem('clearSearch') === 'true') {
    // Clear the search input
    $('#search-input').value = '';
    state.searchTerm = '';
    // Reset the flag
    sessionStorage.removeItem('clearSearch');
  }

  // Check for game in URL parameters
  checkUrlParameters();

  // Load games
  loadGames();
  
  // Load saved theme
  loadSavedTheme();
  
  // Add event listener for theme switcher
  document.getElementById('theme-switcher').addEventListener('click', toggleTheme);

  // Initialize event listeners
  initEventListeners();

  // Render initial game cards (free games)
  renderFreeGames();
});

// Check URL parameters for direct game link
function checkUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const gameParam = urlParams.get('game');
  const section = urlParams.get('section');

  if (gameParam) {
    // Check if the game parameter has the new format (free/packageName or donator/packageName)
    if (gameParam.includes('/')) {
      const [category, packageName] = gameParam.split('/');
      state.highlightedGame = packageName;

      // Auto-switch to the correct section based on category
      if (category === 'free') {
        setTimeout(() => {
          switchSection('free-mods');
          $('#free-mods-btn').classList.add('active');
          $('#donator-mods-btn').classList.remove('active');
          $('#admin-btn').classList.remove('active');
        }, 100);
      } else if (category === 'donator') {
        setTimeout(() => {
          switchSection('donator-mods');
          $('#donator-mods-btn').classList.add('active');
          $('#free-mods-btn').classList.remove('active');
          $('#admin-btn').classList.remove('active');
        }, 100);
      }
    } else {
      // Legacy format support (just packageName without category)
      state.highlightedGame = gameParam;
      // Will check after games are loaded which section it belongs to
    }
  }

  // If the URL has a section parameter, switch to that section
  if (section === 'donator') {
    // After short delay, switch to donator section
    setTimeout(() => {
      switchSection('donator-mods');
      // Select the donator tab
      $('#donator-mods-btn').classList.add('active');
      $('#free-mods-btn').classList.remove('active');
      $('#admin-btn').classList.remove('active');
    }, 100);
  }
}

// Sort games based on selected option
function sortGames(games, sortOption) {
  if (!games || games.length === 0) return games;
  
  let sortedGames = [...games]; // Create a copy to avoid mutating the original array
  
  switch(sortOption) {
    case 'alphabetical':
      // Sort alphabetically by title (A-Z)
      sortedGames.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'newest':
      // Sort by ID (newest first)
      sortedGames.sort((a, b) => b.id - a.id);
      break;
    case 'latest':
      // Sort by date (latest first) - assuming the date is in format YYYY-MM-DD
      sortedGames.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));
      break;
    case 'outdated':
      // Filter to show only OUTDATED games first, then sort alphabetically
      sortedGames = sortedGames.filter(game => game.version === 'OUTDATED');
      sortedGames.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'not-working':
      // Filter to show only NOT WORKING games first, then sort alphabetically
      sortedGames = sortedGames.filter(game => game.version === 'NOT WORKING');
      sortedGames.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'patched':
      // Filter to show only PATCHED games first, then sort alphabetically
      sortedGames = sortedGames.filter(game => game.version === 'PATCHED');
      sortedGames.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      // Default to alphabetical
      sortedGames.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  return sortedGames;
}

// Initialize all event listeners
function initEventListeners() {
  // Navigation between sections
  $('#free-mods-btn').addEventListener('click', () => {
    // Clear the highlighted game when navigating
    state.highlightedGame = null;

    // Clear search bar and reset search state
    $('#search-input').value = '';
    state.searchTerm = '';

    // Clear URL parameters
    if (window.history && window.history.pushState) {
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    switchSection('free-mods');
  });

  $('#donator-mods-btn').addEventListener('click', () => {
    // Clear the highlighted game when navigating
    state.highlightedGame = null;

    // Clear search bar and reset search state
    $('#search-input').value = '';
    state.searchTerm = '';

    // Clear URL parameters
    if (window.history && window.history.pushState) {
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    switchSection('donator-mods');
  });

  $('#admin-btn').addEventListener('click', () => {
    // Clear the highlighted game when navigating
    state.highlightedGame = null;

    // Clear search bar and reset search state
    $('#search-input').value = '';
    state.searchTerm = '';

    // Clear URL parameters
    if (window.history && window.history.pushState) {
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    switchSection('admin');
  });

  // Search functionality
  $('#search-input').addEventListener('input', handleSearch);
  $('#search-btn').addEventListener('click', handleSearch);

  // Admin panel functionality
  $('#clear-form-btn').addEventListener('click', clearGameForm);
  $('#save-game-btn').addEventListener('click', saveGameData);
  $('#export-games-btn').addEventListener('click', exportGames);
  $('#import-games-btn').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', importGames);
  
  // New functionality for No Link button and Clear Game List
  $('#no-link-btn').addEventListener('click', () => {
    $('#game-download').value = 'NO_LINK';
  });
  
  $('#clear-games-btn').addEventListener('click', () => {
    const messageElement = $('#form-success-message');
    messageElement.textContent = 'Are you sure you want to clear ALL games from the list? This cannot be undone.';
    messageElement.className = 'warning-message';
    messageElement.style.display = 'inline-block';
    
    // Create temporary action buttons
    const actionDiv = document.createElement('div');
    actionDiv.className = 'message-actions';
    
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Yes, Clear All Games';
    confirmBtn.className = 'admin-btn danger-btn';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'admin-btn';
    
    actionDiv.appendChild(confirmBtn);
    actionDiv.appendChild(cancelBtn);
    messageElement.appendChild(actionDiv);
    
    confirmBtn.addEventListener('click', () => {
      state.allGames = [];
      saveGames();
      renderAdminGameTable();
      
      messageElement.textContent = 'All games cleared successfully!';
      messageElement.className = 'success-message';
      messageElement.removeChild(actionDiv);
      
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 3000);
    });
    
    cancelBtn.addEventListener('click', () => {
      messageElement.style.display = 'none';
    });
  });

  // Features form functionality
  $('#add-feature-btn').addEventListener('click', addFeature);
  $('#new-feature-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  });

  // Update button text based on edit state
  $('#game-id').addEventListener('input', updateSaveButtonText);

  // Function to get the current date in Philippines timezone (UTC+8)
  function setPhilippinesDate() {
    // Create a date object with the current time
    const now = new Date();
    
    // Convert to Philippines timezone (UTC+8)
    const philippinesTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
    // Format as YYYY-MM-DD for the date input
    const philippinesDate = philippinesTime.toISOString().split('T')[0];
    
    // Set the date field value
    $('#game-updated').value = philippinesDate;
  }
  
  // Date picker default to today in Philippines timezone
  if (!$('#game-updated').value) {
    setPhilippinesDate();
  }

  // Version buttons functionality
  $('#version-latest').addEventListener('click', () => {
    $('#game-version').value = '';
    resetVersionButtons();
    $('#version-latest').classList.add('active');
  });

  $('#version-outdated').addEventListener('click', () => {
    $('#game-version').value = 'OUTDATED';
    resetVersionButtons();
    $('#version-outdated').classList.add('active');
  });

  $('#version-not-working').addEventListener('click', () => {
    $('#game-version').value = 'NOT WORKING';
    resetVersionButtons();
    $('#version-not-working').classList.add('active');
  });
  
  $('#version-patched').addEventListener('click', () => {
    $('#game-version').value = 'PATCHED';
    resetVersionButtons();
    $('#version-patched').classList.add('active');
  });

  // When typing in the version field, remove active class from buttons
  $('#game-version').addEventListener('input', () => {
    resetVersionButtons();
  });

  // Sorting controls
  $('#free-sort-options').addEventListener('change', (e) => {
    state.freeSortOption = e.target.value;
    state.freeCurrentPage = 1; // Reset to first page when changing sort
    renderFreeGames();
  });
  
  $('#donator-sort-options').addEventListener('change', (e) => {
    state.donatorSortOption = e.target.value;
    state.donatorCurrentPage = 1; // Reset to first page when changing sort
    renderDonatorGames();
  });

  // YouTube modal close button
  $('.close-modal').addEventListener('click', closeYoutubeModal);

  // Close modal when clicking outside of it
  window.addEventListener('click', (event) => {
    const modal = $('#youtube-modal');
    if (event.target === modal) {
      closeYoutubeModal();
    }
  });
}

// Switch between the main sections (free mods, donator mods, admin)
function switchSection(sectionId) {
  // Update state
  state.currentSection = sectionId;
  
  // Reset to page 1 when switching sections
  state.freeCurrentPage = 1;
  state.donatorCurrentPage = 1;

  // Hide all sections
  $('#free-mods-section').style.display = 'none';
  $('#donator-mods-section').style.display = 'none';
  $('#admin-section').style.display = 'none';

  // Remove active class from all navigation buttons
  $('#free-mods-btn').classList.remove('active');
  $('#donator-mods-btn').classList.remove('active');
  $('#admin-btn').classList.remove('active');

  // Load the right data depending on the section
  loadGames(); // This now loads from GAME_DATA for display, or from localStorage for admin

  // Show selected section and update active button
  switch (sectionId) {
    case 'free-mods':
      $('#free-mods-section').style.display = 'block';
      $('#free-mods-btn').classList.add('active');
      renderFreeGames();
      break;
    case 'donator-mods':
      $('#donator-mods-section').style.display = 'block';
      $('#donator-mods-btn').classList.add('active');
      renderDonatorGames();
      break;
    case 'admin':
      $('#admin-section').style.display = 'block';
      $('#admin-btn').classList.add('active');
      renderAdminGameTable();
      break;
  }
}

// Handle search input
function handleSearch() {
  state.searchTerm = $('#search-input').value.toLowerCase();
  state.freeCurrentPage = 1; // Reset to first page on new search
  state.donatorCurrentPage = 1;

  // Render the current section
  if (state.currentSection === 'free-mods') {
    renderFreeGames();
  } else if (state.currentSection === 'donator-mods') {
    renderDonatorGames();
  }
}

// Render free games
function renderFreeGames() {
  let filteredGames = filterGamesBySearch(state.freeGames);

  // If there's a highlighted game, only show that game
  if (state.highlightedGame) {
    // Check if the highlighted game is in this section
    const highlightedGame = filteredGames.find(game => game.packageName === state.highlightedGame);
    if (highlightedGame) {
      filteredGames = [highlightedGame];
      state.freeCurrentPage = 1; // Reset to first page
    }
  } else {
    // Apply sorting (skip if highlighting a specific game)
    filteredGames = sortGames(filteredGames, state.freeSortOption);
    
    // Update the sort select to match the current state
    $('#free-sort-options').value = state.freeSortOption;
  }

  renderGamesList(filteredGames, $('#free-games-grid'), $('#free-pagination'), state.freeCurrentPage, 'free');
}

// Render donator games
function renderDonatorGames() {
  let filteredGames = filterGamesBySearch(state.donatorGames);

  // If there's a highlighted game, only show that game
  if (state.highlightedGame) {
    // Check if the highlighted game is in this section
    const highlightedGame = filteredGames.find(game => game.packageName === state.highlightedGame);
    if (highlightedGame) {
      filteredGames = [highlightedGame];
      state.donatorCurrentPage = 1; // Reset to first page
    }
  } else {
    // Apply sorting (skip if highlighting a specific game)
    filteredGames = sortGames(filteredGames, state.donatorSortOption);
    
    // Update the sort select to match the current state
    $('#donator-sort-options').value = state.donatorSortOption;
  }

  renderGamesList(filteredGames, $('#donator-games-grid'), $('#donator-pagination'), state.donatorCurrentPage, 'exclusive');
}

// Generic function to render a list of games
function renderGamesList(games, gridElement, paginationElement, currentPage, status) {
  // Clear current content
  gridElement.innerHTML = '';

  // Show empty state if no games match
  if (games.length === 0) {
    gridElement.innerHTML = `
      <div class="empty-state">
        <h3>No Games Found</h3>
        <p>Try adjusting your search.</p>
      </div>
    `;
    // Hide pagination when no results
    paginationElement.innerHTML = '';
    return;
  }

  // Calculate pagination
  const totalPages = Math.ceil(games.length / state.gamesPerPage);
  const startIndex = (currentPage - 1) * state.gamesPerPage;
  const endIndex = startIndex + state.gamesPerPage;
  const currentGames = games.slice(startIndex, endIndex);

  // Render each game card
  currentGames.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';

    // Generate play store url from package name
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${game.packageName}`;

    // Set tag class based on status
    const tagClass = status === 'free' ? 'free-tag' : 'exclusive-tag';
    const tagText = status === 'free' ? 'FREE' : 'EXCLUSIVE';

    // Extract YouTube video ID if full URL is provided
    let videoId = game.youtubeId;

    // Check if it's a YouTube URL
    if (videoId && videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
      // Extract video ID from different YouTube URL formats
      if (videoId.includes('v=')) {
        // Format: https://www.youtube.com/watch?v=VIDEO_ID
        videoId = videoId.split('v=')[1];
        // Remove additional parameters if any
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
      } else if (videoId.includes('youtu.be/')) {
        // Format: https://youtu.be/VIDEO_ID
        videoId = videoId.split('youtu.be/')[1];
      } else if (videoId.includes('embed/')) {
        // Format: https://www.youtube.com/embed/VIDEO_ID
        videoId = videoId.split('embed/')[1];
      }
    }

    // Format version with special handling
    let formattedVersion;
    if (!game.version || game.version === '') {
      formattedVersion = '∞ Latest';
    } else if (game.version === 'OUTDATED' || game.version === 'NOT WORKING' || game.version === 'PATCHED') {
      formattedVersion = `<span class="version-${game.version.toLowerCase().replace(' ', '-')}">${game.version}</span>`;
    } else {
      formattedVersion = game.version.startsWith('v') ? game.version : `v${game.version}`;
    }

    // Add data-package attribute for linking
    gameCard.setAttribute('data-package', game.packageName);

    // Set highlighted class if this is the game from the URL
    if (state.highlightedGame === game.packageName) {
      gameCard.classList.add('highlighted');
    }

    gameCard.innerHTML = `
      <span class="tag ${tagClass}">${tagText}</span>
      <button class="copy-link-btn" title="Copy direct link to this mod">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </button>
      <a href="${playStoreUrl}" target="_blank" class="game-image" style="background-image: url('${game.imageUrl}');" title="Open ${game.title} on Google Play Store">
        <!-- Game image displayed as background, clickable to Play Store -->
      </a>
      <div class="game-content">
        <h3 class="game-title">${game.title}</h3>
        <div class="game-info">
          <span class="version">${formattedVersion}</span>
          <span class="updated">Updated: ${game.updatedDate}</span>
        </div>
        <div class="mod-features">
          <p class="mod-features-title">MOD FEATURES:</p>
          <ul>
            ${game.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        <div class="card-actions">
          <button class="preview-btn" data-youtube="${videoId}">
            <img src="https://img.icons8.com/material-outlined/16/FFFFFF/play--v1.png" alt="Play">
            Preview
          </button>
          ${game.downloadUrl === 'NO_LINK' ? 
            `<span class="download-btn unavailable-btn">
              <img src="https://img.icons8.com/material-outlined/16/FFFFFF/cancel--v1.png" alt="Not Available">
              NOT AVAILABLE
            </span>` : 
            `<a href="${game.downloadUrl}" target="_blank" class="download-btn">
              <img src="https://img.icons8.com/material-outlined/16/FFFFFF/download--v1.png" alt="Download">
              Download
            </a>`
          }
        </div>
      </div>
    `;

    // Handle YouTube preview button - hide if no YouTube ID
    const previewBtn = gameCard.querySelector('.preview-btn');
    const downloadBtn = gameCard.querySelector('.download-btn');

    if (!game.youtubeId) {
      // Hide preview button if no YouTube ID is available
      previewBtn.style.display = 'none';
      // Make download button take full width
      downloadBtn.classList.add('download-btn-full');
    } else {
      // Add event listener for YouTube preview
      previewBtn.addEventListener('click', () => {
        openYoutubeModal(game.title, videoId);
      });
    }

    // Add event listener for the copy link button
    const copyLinkBtn = gameCard.querySelector('.copy-link-btn');
    copyLinkBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Create the direct link with the game package name and category
      const currentUrl = new URL(window.location.href);

      // Add category prefix based on status (free or donator/exclusive)
      const category = status === 'free' ? 'free' : 'donator';
      currentUrl.search = `?game=${category}/${game.packageName}`;
      const directLink = currentUrl.toString();

      // Copy to clipboard
      navigator.clipboard.writeText(directLink).then(() => {
        // Show a temporary success message
        copyLinkBtn.classList.add('success');
        setTimeout(() => {
          copyLinkBtn.classList.remove('success');
        }, 1500);

        // Create a temporary tooltip-style notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Link copied to clipboard!';
        
        // Position it near the button
        const rect = copyLinkBtn.getBoundingClientRect();
        notification.style.top = `${rect.top - 30}px`;
        notification.style.left = `${rect.left}px`;
        
        // Add it to the body and remove after a delay
        document.body.appendChild(notification);
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 2000);
      }).catch(err => {
        console.error('Could not copy link: ', err);
        
        // Create a temporary error notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification error';
        notification.textContent = 'Failed to copy link. Please try again.';
        
        // Position it near the button
        const rect = copyLinkBtn.getBoundingClientRect();
        notification.style.top = `${rect.top - 30}px`;
        notification.style.left = `${rect.left}px`;
        
        // Add it to the body and remove after a delay
        document.body.appendChild(notification);
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 2000);
      });
    });

    gridElement.appendChild(gameCard);
  });

  // Render pagination
  renderPaginationControls(games, paginationElement, currentPage, status);
}

// Render pagination controls
function renderPaginationControls(games, paginationElement, currentPage, status) {
  const totalPages = Math.ceil(games.length / state.gamesPerPage);
  paginationElement.innerHTML = '';

  if (totalPages <= 1) return;

  // Previous button
  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '&lt;';
    prevBtn.addEventListener('click', () => {
      if (status === 'free') {
        state.freeCurrentPage--;
        renderFreeGames();
      } else {
        state.donatorCurrentPage--;
        renderDonatorGames();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationElement.appendChild(prevBtn);
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;

    pageBtn.addEventListener('click', () => {
      if (i !== currentPage) {
        if (status === 'free') {
          state.freeCurrentPage = i;
          renderFreeGames();
        } else {
          state.donatorCurrentPage = i;
          renderDonatorGames();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    paginationElement.appendChild(pageBtn);
  }

  // Next button
  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '&gt;';
    nextBtn.addEventListener('click', () => {
      if (status === 'free') {
        state.freeCurrentPage++;
        renderFreeGames();
      } else {
        state.donatorCurrentPage++;
        renderDonatorGames();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationElement.appendChild(nextBtn);
  }
}

//
// ADMIN PANEL FUNCTIONALITY - Completely separate from the Mods Page display
//

// Render the admin game table
function renderAdminGameTable() {
  const tableBody = $('#games-table-body');
  tableBody.innerHTML = '';

  // Update table header to include columns
  const tableHeader = $('#games-table thead tr');
  tableHeader.innerHTML = `
    <th>ID</th>
    <th>Title</th>
    <th>Date</th>
    <th>Version</th>
    <th>Status</th>
    <th>Actions</th>
  `;

  // Show message if no games exist
  if (state.allGames.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="6" class="empty-table-message">
        No games added yet. Use the form below to add games or import from a file.
      </td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }

  state.allGames.forEach(game => {
    const row = document.createElement('tr');
    
    // Add new-save class if it's a newly added game
    if (game.isNewSave) {
      row.classList.add('new-save-row');
    }
    
    // Format version display
    let versionDisplay = game.version;
    if (!game.version || game.version === '') {
      versionDisplay = '∞ Latest';
    } else if (game.version === 'OUTDATED' || game.version === 'NOT WORKING' || game.version === 'PATCHED') {
      versionDisplay = `<span class="version-${game.version.toLowerCase().replace(' ', '-')}">${game.version}</span>`;
    }
    
    row.innerHTML = `
      <td>${game.id}</td>
      <td>${game.title}</td>
      <td>${game.updatedDate}</td>
      <td>${versionDisplay}</td>
      <td>${game.status === 'free' ? 'Free' : 'Exclusive'}</td>
      <td class="table-actions">
        <button class="admin-btn" data-action="edit" data-id="${game.id}">Edit</button>
        <button class="admin-btn danger-btn" data-action="delete" data-id="${game.id}">Delete</button>
        ${game.isNewSave ? '<span class="new-save-badge">New Save</span>' : ''}
      </td>
    `;

    // Add event listeners to buttons
    row.querySelector('[data-action="edit"]').addEventListener('click', () => editGame(game.id));
    row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteGame(game.id));

    tableBody.appendChild(row);
  });
}

// Update the Save button text based on whether we're editing or adding
function updateSaveButtonText() {
  const saveBtn = $('#save-game-btn');
  const gameId = $('#game-id').value;

  if (gameId) {
    saveBtn.textContent = 'Update Game';
  } else {
    saveBtn.textContent = 'Add Game';
  }
}

// Function to add a new feature from the input
function addFeature() {
  const featureInput = $('#new-feature-input');
  const featureText = featureInput.value.trim();

  if (!featureText) {
    return; // Don't add empty features
  }

  // Create a new feature item
  const featuresContainer = $('#features-container');
  const featureItem = document.createElement('div');
  featureItem.className = 'feature-item';

  featureItem.innerHTML = `
    <span class="feature-text">${featureText}</span>
    <button class="remove-feature" title="Remove this feature">&times;</button>
  `;

  // Add event listener to remove button
  featureItem.querySelector('.remove-feature').addEventListener('click', () => {
    featuresContainer.removeChild(featureItem);
  });

  // Add the feature to the container
  featuresContainer.appendChild(featureItem);

  // Clear the input for next feature
  featureInput.value = '';
  featureInput.focus();
}

// Get all features from the features container
function getFeatures() {
  const features = [];
  const featureItems = $('#features-container').querySelectorAll('.feature-item');

  featureItems.forEach(item => {
    const featureText = item.querySelector('.feature-text').textContent.trim();
    if (featureText) {
      features.push(featureText);
    }
  });

  return features;
}

// Helper function to reset active state on version buttons
function resetVersionButtons() {
  $('#version-latest').classList.remove('active');
  $('#version-outdated').classList.remove('active');
  $('#version-not-working').classList.remove('active');
  $('#version-patched').classList.remove('active');
}

// Clear the game form
function clearGameForm() {
  // Store the current date and status values
  const currentDate = $('#game-updated').value;
  const currentStatus = $('#game-status').value;

  // Clear all input fields
  $('#game-title').value = '';
  $('#game-version').value = '';
  $('#game-package').value = '';
  $('#game-thumbnail').value = '';
  $('#game-youtube').value = '';
  $('#game-download').value = '';
  $('#game-id').value = '';

  // Restore the date and status
  $('#game-updated').value = currentDate;
  $('#game-status').value = currentStatus;

  // Clear features container
  $('#features-container').innerHTML = '';
  
  // Reset version buttons (remove active class)
  resetVersionButtons();
  
  // Clear any success message
  const successMsg = $('#form-success-message');
  if (successMsg) successMsg.style.display = 'none';

  // Reset state
  state.editingGame = null;
  updateSaveButtonText();
}

// Edit a game
function editGame(id) {
  const game = state.allGames.find(g => g.id === id);
  if (!game) return;

  // Set the form values
  $('#game-title').value = game.title;
  $('#game-version').value = game.version;
  $('#game-package').value = game.packageName;
  $('#game-updated').value = game.updatedDate;
  $('#game-thumbnail').value = game.imageUrl;
  $('#game-youtube').value = game.youtubeId;
  $('#game-download').value = game.downloadUrl;
  $('#game-status').value = game.status;
  $('#game-id').value = game.id;

  // Clear existing features and add each feature from game
  $('#features-container').innerHTML = '';
  game.features.forEach(feature => {
    const featureItem = document.createElement('div');
    featureItem.className = 'feature-item';

    featureItem.innerHTML = `
      <span class="feature-text">${feature}</span>
      <button class="remove-feature" title="Remove this feature">&times;</button>
    `;

    // Add event listener to remove button
    featureItem.querySelector('.remove-feature').addEventListener('click', () => {
      $('#features-container').removeChild(featureItem);
    });

    $('#features-container').appendChild(featureItem);
  });

  state.editingGame = game;
  updateSaveButtonText();

  // Scroll to the form
  $('#game-title').scrollIntoView({ behavior: 'smooth' });
}

// Delete a game
function deleteGame(id) {
  const messageElement = $('#form-success-message');
  const game = state.allGames.find(g => g.id === id);
  
  if (!game) return;
  
  messageElement.textContent = `Are you sure you want to delete "${game.title}"?`;
  messageElement.className = 'warning-message';
  messageElement.style.display = 'inline-block';
  
  // Create temporary action buttons
  const actionDiv = document.createElement('div');
  actionDiv.className = 'message-actions';
  
  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Yes, Delete';
  confirmBtn.className = 'admin-btn danger-btn';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'admin-btn';
  
  actionDiv.appendChild(confirmBtn);
  actionDiv.appendChild(cancelBtn);
  messageElement.appendChild(actionDiv);
  
  confirmBtn.addEventListener('click', () => {
    state.allGames = state.allGames.filter(game => game.id !== id);
    saveGames();
    filterGamesByStatus();
    renderAdminGameTable();
    
    messageElement.textContent = `Game "${game.title}" has been deleted.`;
    messageElement.className = 'success-message';
    messageElement.removeChild(actionDiv);
    
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 3000);
  });
  
  cancelBtn.addEventListener('click', () => {
    messageElement.style.display = 'none';
  });
}

// Save game data from the form
function saveGameData() {
  // Get form values
  const title = $('#game-title').value.trim();
  let version = $('#game-version').value.trim();
  const packageName = $('#game-package').value.trim();
  const updatedDate = $('#game-updated').value.trim();
  const imageUrl = $('#game-thumbnail').value.trim();
  const youtubeId = $('#game-youtube').value.trim();
  const downloadUrl = $('#game-download').value.trim();
  const status = $('#game-status').value;
  const gameId = $('#game-id').value;

  // Get features from the container
  const features = getFeatures();

  // Get success message element for validation messages
  const messageElement = $('#form-success-message');
  
  // Basic validation
  if (!title) {
    messageElement.textContent = 'Please enter a title for the game';
    messageElement.style.display = 'inline-block';
    messageElement.className = 'error-message';
    $('#game-title').focus();
    return;
  }

  if (!packageName) {
    messageElement.textContent = 'Please enter a package name for the game';
    messageElement.style.display = 'inline-block';
    messageElement.className = 'error-message';
    $('#game-package').focus();
    return;
  }

  if (!updatedDate) {
    messageElement.textContent = 'Please select an updated date';
    messageElement.style.display = 'inline-block';
    messageElement.className = 'error-message';
    $('#game-updated').focus();
    return;
  }

  if (!imageUrl) {
    messageElement.textContent = 'Please provide a thumbnail URL';
    messageElement.style.display = 'inline-block';
    messageElement.className = 'error-message';
    $('#game-thumbnail').focus();
    return;
  }

  if (!downloadUrl) {
    messageElement.textContent = 'Please provide a download URL';
    messageElement.style.display = 'inline-block';
    messageElement.className = 'error-message';
    $('#game-download').focus();
    return;
  }

  if (features.length === 0) {
    messageElement.textContent = 'Please add at least one mod feature';
    messageElement.style.display = 'inline-block';
    messageElement.className = 'error-message';
    $('#new-feature-input').focus();
    return;
  }

  // Format version for display when needed
  // Note: version can be empty (will display as "∞ Latest")
  if (version && !version.startsWith('v') && 
      version !== 'OUTDATED' && version !== 'NOT WORKING' && version !== 'PATCHED') {
    version = 'v' + version;
  }

  // Create game object with the updated format
  const game = {
    title,
    version,
    packageName,
    // Use Philippines timezone date if date wasn't provided
    updatedDate: updatedDate || new Date(new Date().getTime() + (8 * 60 * 60 * 1000)).toISOString().slice(0, 10),
    imageUrl,
    youtubeId,
    downloadUrl,
    features,
    status,
    isNewSave: true // Flag to highlight newly added games
  };
  
  // Remove isNewSave flag from all other games
  state.allGames.forEach(g => {
    g.isNewSave = false;
  });

  // Update existing or add new
  if (gameId && state.editingGame) {
    // Update existing game
    game.id = parseInt(gameId);

    const index = state.allGames.findIndex(g => g.id === game.id);
    if (index !== -1) {
      state.allGames[index] = game;
    }
  } else {
    // Add new game with new ID
    game.id = Math.max(0, ...state.allGames.map(g => g.id)) + 1;
    state.allGames.push(game);
  }

  // Save and update UI
  saveGames();
  filterGamesByStatus();
  renderAdminGameTable();
  clearGameForm();

  // Show confirmation message next to buttons
  messageElement.textContent = `Game "${title}" ${gameId ? 'updated' : 'added'} successfully!`;
  messageElement.className = 'success-message';
  messageElement.style.display = 'inline-block';
  
  // Hide the message after a few seconds
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 3000);
}

// Export games to either gamedata.js or JSON file
function exportGames() {
  // Show export format confirmation message
  const messageElement = $('#form-success-message');
  messageElement.textContent = 'Choose export format:';
  messageElement.className = 'warning-message';
  messageElement.style.display = 'inline-block';
  
  // Create temporary action buttons
  const actionDiv = document.createElement('div');
  actionDiv.className = 'message-actions';
  
  const jsFormatBtn = document.createElement('button');
  jsFormatBtn.textContent = 'gamedata.js (Recommended)';
  jsFormatBtn.className = 'admin-btn save-btn';
  
  const jsonFormatBtn = document.createElement('button');
  jsonFormatBtn.textContent = 'JSON Format';
  jsonFormatBtn.className = 'admin-btn';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'admin-btn';
  
  actionDiv.appendChild(jsFormatBtn);
  actionDiv.appendChild(jsonFormatBtn);
  actionDiv.appendChild(cancelBtn);
  messageElement.appendChild(actionDiv);
  
  // Handler for JS format export
  jsFormatBtn.addEventListener('click', () => {
    exportInFormat('js');
  });
  
  // Handler for JSON format export
  jsonFormatBtn.addEventListener('click', () => {
    exportInFormat('json');
  });
  
  // Handler for cancel
  cancelBtn.addEventListener('click', () => {
    messageElement.style.display = 'none';
  });
  
  // Function to handle the export in the chosen format
  function exportInFormat(exportFormat) {
    let dataStr, mimeType, fileName;

    if (exportFormat === 'js') {
      // Export as gamedata.js with proper JavaScript syntax
      dataStr = `// Game data for CheatXplorer
// This file can be generated from the admin panel and uploaded to GitHub
const GAME_DATA = ${JSON.stringify(state.allGames, null, 2)};`;
      mimeType = 'application/javascript';
      fileName = `gamedata.js`;
    } else {
      // Export as regular JSON
      dataStr = JSON.stringify(state.allGames, null, 2);
      mimeType = 'application/json';
      // Use Philippines timezone for the date in the filename
      const philippinesDate = new Date(new Date().getTime() + (8 * 60 * 60 * 1000)).toISOString().slice(0, 10);
      fileName = `cheatxplorer_games_${philippinesDate}.json`;
    }

    const dataUri = `data:${mimeType};charset=utf-8,${encodeURIComponent(dataStr)}`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', fileName);
    linkElement.style.display = 'none';
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);

    if (exportFormat === 'js') {
      messageElement.removeChild(actionDiv);
      messageElement.className = 'success-message';
      messageElement.innerHTML = `
        <p>gamedata.js file has been exported. To update your website:</p>
        <ol>
          <li>Upload this file to your GitHub repository</li>
          <li>Replace the existing gamedata.js file</li>
          <li>All users will see the updated game list when they visit your site</li>
        </ol>
      `;
      
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 7000); // Longer display time for instructions
    } else {
      // For JSON format, just show a simple success message
      messageElement.removeChild(actionDiv);
      messageElement.className = 'success-message';
      messageElement.textContent = `Game data exported as JSON successfully!`;
      
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 3000);
    }
  }
}

// YouTube Modal Functions
function openYoutubeModal(gameTitle, youtubeId) {
  // Set the game title in the modal
  $('#modal-game-title').textContent = gameTitle;

  // Process YouTube ID if it's a full URL
  let videoId = youtubeId;
  if (videoId && (videoId.includes('youtube.com') || videoId.includes('youtu.be'))) {
    // Extract video ID from different YouTube URL formats
    if (videoId.includes('v=')) {
      // Format: https://www.youtube.com/watch?v=VIDEO_ID
      videoId = videoId.split('v=')[1];
      // Remove additional parameters if any
      const ampersandPosition = videoId.indexOf('&');
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
      }
    } else if (videoId.includes('youtu.be/')) {
      // Format: https://youtu.be/VIDEO_ID
      videoId = videoId.split('youtu.be/')[1];
    } else if (videoId.includes('embed/')) {
      // Format: https://www.youtube.com/embed/VIDEO_ID
      videoId = videoId.split('embed/')[1];
    }
  }

  // Set the YouTube iframe src
  const iframe = $('#youtube-iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}`;

  // Display the modal
  $('#youtube-modal').style.display = 'block';

  // Prevent scrolling on the body
  document.body.style.overflow = 'hidden';
}

function closeYoutubeModal() {
  // Hide the modal
  $('#youtube-modal').style.display = 'none';

  // Stop the video by clearing the iframe src
  const iframe = $('#youtube-iframe');
  iframe.src = '';

  // Re-enable scrolling on the body
  document.body.style.overflow = 'auto';
}

// Import games from gamedata.js or JSON file
function importGames(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      let games;
      const fileContent = e.target.result;

      // Check if this is a gamedata.js file by looking for GAME_DATA definition
      if (fileContent.includes('const GAME_DATA =') || fileContent.includes('var GAME_DATA =')) {
        // Extract the JSON part from the JavaScript file
        const startIndex = fileContent.indexOf('[');
        const endIndex = fileContent.lastIndexOf(']') + 1;

        if (startIndex === -1 || endIndex === -1) {
          throw new Error('Invalid gamedata.js format: Cannot find the game data array');
        }

        const jsonContent = fileContent.substring(startIndex, endIndex);
        games = JSON.parse(jsonContent);
      } else {
        // Treat as regular JSON
        games = JSON.parse(fileContent);
      }

      if (!Array.isArray(games)) {
        throw new Error('Invalid format: expected an array of games');
      }

      // Validate required fields
      const isValid = games.every(game => 
        game.title && game.packageName && 
        Array.isArray(game.features) && game.features.length > 0 &&
        (game.status === 'free' || game.status === 'exclusive')
      );

      if (!isValid) {
        throw new Error('Invalid format: some games are missing required fields');
      }

      // Get message element for displaying import confirmation
      const messageElement = $('#form-success-message');
      messageElement.textContent = `Import ${games.length} games? This will replace all existing games in the admin panel.`;
      messageElement.className = 'warning-message';
      messageElement.style.display = 'inline-block';
      
      // Create temporary action buttons
      const actionDiv = document.createElement('div');
      actionDiv.className = 'message-actions';
      
      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = 'Yes, Import Games';
      confirmBtn.className = 'admin-btn save-btn';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.className = 'admin-btn';
      
      actionDiv.appendChild(confirmBtn);
      actionDiv.appendChild(cancelBtn);
      messageElement.appendChild(actionDiv);
      
      confirmBtn.addEventListener('click', () => {
        // Clear any isNewSave flags before importing
        games.forEach(game => {
          game.isNewSave = false;
        });
        
        state.allGames = games;
        saveGames();
        filterGamesByStatus();
        renderAdminGameTable();
        
        messageElement.textContent = `Games imported successfully! Remember: These changes are only visible in the admin panel. To make them public, export as gamedata.js and upload to GitHub.`;
        messageElement.className = 'success-message';
        messageElement.removeChild(actionDiv);
        
        setTimeout(() => {
          messageElement.style.display = 'none';
        }, 5000); // Longer display time for this important message
      });
      
      cancelBtn.addEventListener('click', () => {
        messageElement.style.display = 'none';
      });
    } catch (error) {
      const messageElement = $('#form-success-message');
      messageElement.textContent = `Error importing games: ${error.message}`;
      messageElement.className = 'error-message';
      messageElement.style.display = 'inline-block';
      
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 5000);
    }
  };
  reader.readAsText(file);

  // Reset the input
  event.target.value = '';
}
