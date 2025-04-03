
const state = {
  allGames: [], 
  freeGames: [], 
  donatorGames: [], 
  freeCurrentPage: 1,
  donatorCurrentPage: 1,
  gamesPerPage: 20,
  searchTerm: '',
  currentSection: 'free-mods', 
  editingGame: null, 
  highlightedGame: null, 
  freeSortOption: 'alphabetical', 
  donatorSortOption: 'alphabetical' 
};

const elementsCache = {};

function $(selector) {
  if (!elementsCache[selector]) {
    elementsCache[selector] = document.querySelector(selector);
  }
  return elementsCache[selector];
}


function loadGames() {
  let localStorageAvailable = false;
  try {
    localStorage.setItem('localStorage_test', 'test');
    localStorage.removeItem('localStorage_test');
    localStorageAvailable = true;
  } catch (e) {
    console.warn('localStorage is not available:', e);
  }

  if (state.currentSection === 'admin') {
    if (localStorageAvailable) {
      try {
        const savedAdminGames = localStorage.getItem('cheatxplorer_admin_games');
        if (savedAdminGames) {
          state.allGames = JSON.parse(savedAdminGames);
        } else {
          state.allGames = [];
        }
      } catch (error) {
        console.error('Failed to load admin games:', error);
        state.allGames = [];  
      }
    } else {
      state.allGames = [];
      console.warn('Admin game data cannot be saved - localStorage not available');
    }
  } else {
    try {
      state.allGames = [...GAME_DATA];
    } catch (error) {
      console.error('Error loading game data:', error);
      state.allGames = [];
    }
  }

  filterGamesByStatus();
}

function saveGames() {
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

function filterGamesByStatus() {
  state.freeGames = state.allGames.filter(game => game.status === 'free');
  state.donatorGames = state.allGames.filter(game => game.status === 'exclusive');

  if (state.highlightedGame) {
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get('game');

    if (gameParam && !gameParam.includes('/')) {
      const inFreeGames = state.freeGames.some(game => game.packageName === state.highlightedGame);
      const inDonatorGames = state.donatorGames.some(game => game.packageName === state.highlightedGame);

      if (inFreeGames && state.currentSection !== 'free-mods') {
        setTimeout(() => switchSection('free-mods'), 0);
      } else if (inDonatorGames && state.currentSection !== 'donator-mods') {
        setTimeout(() => switchSection('donator-mods'), 0);
      }
    }
  }
}

function filterGamesBySearch(games) {
  if (!state.searchTerm) {
    return games;
  }

  return games.filter(game => {
    return game.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
           game.packageName.toLowerCase().includes(state.searchTerm.toLowerCase());
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('clearSearch') === 'true') {
    $('#search-input').value = '';
    state.searchTerm = '';
    sessionStorage.removeItem('clearSearch');
  }

  checkUrlParameters();

  loadGames();

  initEventListeners();

  renderFreeGames();
});

function checkUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const gameParam = urlParams.get('game');
  const section = urlParams.get('section');

  if (gameParam) {
    if (gameParam.includes('/')) {
      const [category, packageName] = gameParam.split('/');
      state.highlightedGame = packageName;

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
      state.highlightedGame = gameParam;
    }
  }

  if (section === 'donator') {
    setTimeout(() => {
      switchSection('donator-mods');
      $('#donator-mods-btn').classList.add('active');
      $('#free-mods-btn').classList.remove('active');
      $('#admin-btn').classList.remove('active');
    }, 100);
  }
}

function sortGames(games, sortOption) {
  if (!games || games.length === 0) return games;
  
  let sortedGames = [...games]; 
  
  switch(sortOption) {
    case 'alphabetical':
      sortedGames.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'newest':
      sortedGames.sort((a, b) => b.id - a.id);
      break;
    case 'latest':
      sortedGames.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));
      break;
    case 'outdated':
      sortedGames = sortedGames.filter(game => game.version === 'OUTDATED');
      sortedGames.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'not-working':
      sortedGames = sortedGames.filter(game => game.version === 'NOT WORKING');
      sortedGames.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'patched':
      sortedGames = sortedGames.filter(game => game.version === 'PATCHED');
      sortedGames.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      sortedGames.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  return sortedGames;
}

function initEventListeners() {
  $('#free-mods-btn').addEventListener('click', () => {
    state.highlightedGame = null;

    $('#search-input').value = '';
    state.searchTerm = '';

    if (window.history && window.history.pushState) {
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    switchSection('free-mods');
  });

  $('#donator-mods-btn').addEventListener('click', () => {
    state.highlightedGame = null;

    $('#search-input').value = '';
    state.searchTerm = '';

    if (window.history && window.history.pushState) {
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    switchSection('donator-mods');
  });

  $('#admin-btn').addEventListener('click', () => {
    state.highlightedGame = null;

    $('#search-input').value = '';
    state.searchTerm = '';

    if (window.history && window.history.pushState) {
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    switchSection('admin');
  });

  $('#search-input').addEventListener('input', handleSearch);
  $('#search-btn').addEventListener('click', handleSearch);

  $('#clear-form-btn').addEventListener('click', clearGameForm);
  $('#save-game-btn').addEventListener('click', saveGameData);
  $('#export-games-btn').addEventListener('click', exportGames);
  $('#import-games-btn').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', importGames);
  
  $('#no-link-btn').addEventListener('click', () => {
    $('#game-download').value = 'NO_LINK';
  });
  
  $('#clear-games-btn').addEventListener('click', () => {
    const messageElement = $('#form-success-message');
    messageElement.textContent = 'Are you sure you want to clear ALL games from the list? This cannot be undone.';
    messageElement.className = 'warning-message';
    messageElement.style.display = 'inline-block';
    
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

  $('#add-feature-btn').addEventListener('click', addFeature);
  $('#new-feature-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  });

  $('#game-id').addEventListener('input', updateSaveButtonText);

  function setPhilippinesDate() {
    const now = new Date();
    
    const philippinesTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
    const philippinesDate = philippinesTime.toISOString().split('T')[0];
    
    $('#game-updated').value = philippinesDate;
  }
  
  if (!$('#game-updated').value) {
    setPhilippinesDate();
  }

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

  $('#game-version').addEventListener('input', () => {
    resetVersionButtons();
  });

  $('#free-sort-options').addEventListener('change', (e) => {
    state.freeSortOption = e.target.value;
    state.freeCurrentPage = 1;
    renderFreeGames();
  });
  
  $('#donator-sort-options').addEventListener('change', (e) => {
    state.donatorSortOption = e.target.value;
    state.donatorCurrentPage = 1;
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

function switchSection(sectionId) {
  state.currentSection = sectionId;
  
  state.freeCurrentPage = 1;
  state.donatorCurrentPage = 1;

  $('#free-mods-section').style.display = 'none';
  $('#donator-mods-section').style.display = 'none';
  $('#admin-section').style.display = 'none';

  $('#free-mods-btn').classList.remove('active');
  $('#donator-mods-btn').classList.remove('active');
  $('#admin-btn').classList.remove('active');

  loadGames(); 

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

function handleSearch() {
  state.searchTerm = $('#search-input').value.toLowerCase();
  state.freeCurrentPage = 1; 
  state.donatorCurrentPage = 1;

  if (state.currentSection === 'free-mods') {
    renderFreeGames();
  } else if (state.currentSection === 'donator-mods') {
    renderDonatorGames();
  }
}

function renderFreeGames() {
  let filteredGames = filterGamesBySearch(state.freeGames);

  if (state.highlightedGame) {
    const highlightedGame = filteredGames.find(game => game.packageName === state.highlightedGame);
    if (highlightedGame) {
      filteredGames = [highlightedGame];
      state.freeCurrentPage = 1; 
    }
  } else {
    filteredGames = sortGames(filteredGames, state.freeSortOption);
    
    $('#free-sort-options').value = state.freeSortOption;
  }

  renderGamesList(filteredGames, $('#free-games-grid'), $('#free-pagination'), state.freeCurrentPage, 'free');
}

function renderDonatorGames() {
  let filteredGames = filterGamesBySearch(state.donatorGames);

  if (state.highlightedGame) {
    const highlightedGame = filteredGames.find(game => game.packageName === state.highlightedGame);
    if (highlightedGame) {
      filteredGames = [highlightedGame];
      state.donatorCurrentPage = 1;
    }
  } else {
    filteredGames = sortGames(filteredGames, state.donatorSortOption);
    
    $('#donator-sort-options').value = state.donatorSortOption;
  }

  renderGamesList(filteredGames, $('#donator-games-grid'), $('#donator-pagination'), state.donatorCurrentPage, 'exclusive');
}

function renderGamesList(games, gridElement, paginationElement, currentPage, status) {
  gridElement.innerHTML = '';

  if (games.length === 0) {
    gridElement.innerHTML = `
      <div class="empty-state">
        <h3>No Games Found</h3>
        <p>Try adjusting your search.</p>
      </div>
    `;
    paginationElement.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(games.length / state.gamesPerPage);
  const startIndex = (currentPage - 1) * state.gamesPerPage;
  const endIndex = startIndex + state.gamesPerPage;
  const currentGames = games.slice(startIndex, endIndex);

  currentGames.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';

    const playStoreUrl = `https://play.google.com/store/apps/details?id=${game.packageName}`;

    const tagClass = status === 'free' ? 'free-tag' : 'exclusive-tag';
    const tagText = status === 'free' ? 'FREE' : 'EXCLUSIVE';

    let videoId = game.youtubeId;

    if (videoId && videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
      if (videoId.includes('v=')) {
        videoId = videoId.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
      } else if (videoId.includes('youtu.be/')) {
        videoId = videoId.split('youtu.be/')[1];
      } else if (videoId.includes('embed/')) {
        videoId = videoId.split('embed/')[1];
      }
    }

    let formattedVersion;
    if (!game.version || game.version === '') {
      formattedVersion = '∞ Latest';
    } else if (game.version === 'OUTDATED' || game.version === 'NOT WORKING' || game.version === 'PATCHED') {
      formattedVersion = `<span class="version-${game.version.toLowerCase().replace(' ', '-')}">${game.version}</span>`;
    } else {
      formattedVersion = game.version.startsWith('v') ? game.version : `v${game.version}`;
    }

    gameCard.setAttribute('data-package', game.packageName);

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

    const previewBtn = gameCard.querySelector('.preview-btn');
    const downloadBtn = gameCard.querySelector('.download-btn');

    if (!game.youtubeId) {
      previewBtn.style.display = 'none';
      downloadBtn.classList.add('download-btn-full');
    } else {
      previewBtn.addEventListener('click', () => {
        openYoutubeModal(game.title, videoId);
      });
    }

    const copyLinkBtn = gameCard.querySelector('.copy-link-btn');
    copyLinkBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      const currentUrl = new URL(window.location.href);

      const category = status === 'free' ? 'free' : 'donator';
      currentUrl.search = `?game=${category}/${game.packageName}`;
      const directLink = currentUrl.toString();

      navigator.clipboard.writeText(directLink).then(() => {
        copyLinkBtn.classList.add('success');
        setTimeout(() => {
          copyLinkBtn.classList.remove('success');
        }, 1500);

        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Link copied to clipboard!';
        
        const rect = copyLinkBtn.getBoundingClientRect();
        notification.style.top = `${rect.top - 30}px`;
        notification.style.left = `${rect.left}px`;
        
        document.body.appendChild(notification);
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 2000);
      }).catch(err => {
        console.error('Could not copy link: ', err);
        
        const notification = document.createElement('div');
        notification.className = 'copy-notification error';
        notification.textContent = 'Failed to copy link. Please try again.';
        
        const rect = copyLinkBtn.getBoundingClientRect();
        notification.style.top = `${rect.top - 30}px`;
        notification.style.left = `${rect.left}px`;
        
        document.body.appendChild(notification);
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 2000);
      });
    });

    gridElement.appendChild(gameCard);
  });

  renderPaginationControls(games, paginationElement, currentPage, status);
}

function renderPaginationControls(games, paginationElement, currentPage, status) {
  const totalPages = Math.ceil(games.length / state.gamesPerPage);
  paginationElement.innerHTML = '';

  if (totalPages <= 1) return;

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

function renderAdminGameTable() {
  const tableBody = $('#games-table-body');
  tableBody.innerHTML = '';

  const tableHeader = $('#games-table thead tr');
  tableHeader.innerHTML = `
    <th>ID</th>
    <th>Title</th>
    <th>Date</th>
    <th>Version</th>
    <th>Status</th>
    <th>Actions</th>
  `;

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
    
    if (game.isNewSave) {
      row.classList.add('new-save-row');
    }
    
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

    row.querySelector('[data-action="edit"]').addEventListener('click', () => editGame(game.id));
    row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteGame(game.id));

    tableBody.appendChild(row);
  });
}

function updateSaveButtonText() {
  const saveBtn = $('#save-game-btn');
  const gameId = $('#game-id').value;

  if (gameId) {
    saveBtn.textContent = 'Update Game';
  } else {
    saveBtn.textContent = 'Add Game';
  }
}

function addFeature() {
  const featureInput = $('#new-feature-input');
  const featureText = featureInput.value.trim();

  if (!featureText) {
    return; 
  }

  const featuresContainer = $('#features-container');
  const featureItem = document.createElement('div');
  featureItem.className = 'feature-item';

  featureItem.innerHTML = `
    <span class="feature-text">${featureText}</span>
    <button class="remove-feature" title="Remove this feature">&times;</button>
  `;

  featureItem.querySelector('.remove-feature').addEventListener('click', () => {
    featuresContainer.removeChild(featureItem);
  });

  featuresContainer.appendChild(featureItem);

  featureInput.value = '';
  featureInput.focus();
}

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

function resetVersionButtons() {
  $('#version-latest').classList.remove('active');
  $('#version-outdated').classList.remove('active');
  $('#version-not-working').classList.remove('active');
  $('#version-patched').classList.remove('active');
}

function clearGameForm() {
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

  $('#game-updated').value = currentDate;
  $('#game-status').value = currentStatus;

  $('#features-container').innerHTML = '';
  
  resetVersionButtons();
  
  const successMsg = $('#form-success-message');
  if (successMsg) successMsg.style.display = 'none';

  state.editingGame = null;
  updateSaveButtonText();
}

function editGame(id) {
  const game = state.allGames.find(g => g.id === id);
  if (!game) return;

  $('#game-title').value = game.title;
  $('#game-version').value = game.version;
  $('#game-package').value = game.packageName;
  $('#game-updated').value = game.updatedDate;
  $('#game-thumbnail').value = game.imageUrl;
  $('#game-youtube').value = game.youtubeId;
  $('#game-download').value = game.downloadUrl;
  $('#game-status').value = game.status;
  $('#game-id').value = game.id;

  $('#features-container').innerHTML = '';
  game.features.forEach(feature => {
    const featureItem = document.createElement('div');
    featureItem.className = 'feature-item';

    featureItem.innerHTML = `
      <span class="feature-text">${feature}</span>
      <button class="remove-feature" title="Remove this feature">&times;</button>
    `;

    featureItem.querySelector('.remove-feature').addEventListener('click', () => {
      $('#features-container').removeChild(featureItem);
    });

    $('#features-container').appendChild(featureItem);
  });

  state.editingGame = game;
  updateSaveButtonText();

  $('#game-title').scrollIntoView({ behavior: 'smooth' });
}

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


  if (version && !version.startsWith('v') && 
      version !== 'OUTDATED' && version !== 'NOT WORKING' && version !== 'PATCHED') {
    version = 'v' + version;
  }

  const game = {
    title,
    version,
    packageName,
    updatedDate: updatedDate || new Date(new Date().getTime() + (8 * 60 * 60 * 1000)).toISOString().slice(0, 10),
    imageUrl,
    youtubeId,
    downloadUrl,
    features,
    status,
    isNewSave: true 
  };
  
  state.allGames.forEach(g => {
    g.isNewSave = false;
  });

  if (gameId && state.editingGame) {
    game.id = parseInt(gameId);

    const index = state.allGames.findIndex(g => g.id === game.id);
    if (index !== -1) {
      state.allGames[index] = game;
    }
  } else {
    game.id = Math.max(0, ...state.allGames.map(g => g.id)) + 1;
    state.allGames.push(game);
  }

  saveGames();
  filterGamesByStatus();
  renderAdminGameTable();
  clearGameForm();

  messageElement.textContent = `Game "${title}" ${gameId ? 'updated' : 'added'} successfully!`;
  messageElement.className = 'success-message';
  messageElement.style.display = 'inline-block';
  
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 3000);
}

function exportGames() {
  const messageElement = $('#form-success-message');
  messageElement.textContent = 'Choose export format:';
  messageElement.className = 'warning-message';
  messageElement.style.display = 'inline-block';
  
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
  
  jsFormatBtn.addEventListener('click', () => {
    exportInFormat('js');
  });
  
  jsonFormatBtn.addEventListener('click', () => {
    exportInFormat('json');
  });
  
  cancelBtn.addEventListener('click', () => {
    messageElement.style.display = 'none';
  });
  
  function exportInFormat(exportFormat) {
    let dataStr, mimeType, fileName;

    if (exportFormat === 'js') {
      dataStr = `// Game data for CheatXplorer
// This file can be generated from the admin panel and uploaded to GitHub
const GAME_DATA = ${JSON.stringify(state.allGames, null, 2)};`;
      mimeType = 'application/javascript';
      fileName = `gamedata.js`;
    } else {
      dataStr = JSON.stringify(state.allGames, null, 2);
      mimeType = 'application/json';
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
      }, 7000); 
    } else {
      messageElement.removeChild(actionDiv);
      messageElement.className = 'success-message';
      messageElement.textContent = `Game data exported as JSON successfully!`;
      
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 3000);
    }
  }
}

function openYoutubeModal(gameTitle, youtubeId) {
  $('#modal-game-title').textContent = gameTitle;

  let videoId = youtubeId;
  if (videoId && (videoId.includes('youtube.com') || videoId.includes('youtu.be'))) {
    if (videoId.includes('v=')) {
      videoId = videoId.split('v=')[1];
      const ampersandPosition = videoId.indexOf('&');
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
      }
    } else if (videoId.includes('youtu.be/')) {
      videoId = videoId.split('youtu.be/')[1];
    } else if (videoId.includes('embed/')) {
      videoId = videoId.split('embed/')[1];
    }
  }

  const iframe = $('#youtube-iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}`;

  $('#youtube-modal').style.display = 'block';

  document.body.style.overflow = 'hidden';
}

function closeYoutubeModal() {
  $('#youtube-modal').style.display = 'none';

  const iframe = $('#youtube-iframe');
  iframe.src = '';

  document.body.style.overflow = 'auto';
}

function importGames(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      let games;
      const fileContent = e.target.result;

      if (fileContent.includes('const GAME_DATA =') || fileContent.includes('var GAME_DATA =')) {
        const startIndex = fileContent.indexOf('[');
        const endIndex = fileContent.lastIndexOf(']') + 1;

        if (startIndex === -1 || endIndex === -1) {
          throw new Error('Invalid gamedata.js format: Cannot find the game data array');
        }

        const jsonContent = fileContent.substring(startIndex, endIndex);
        games = JSON.parse(jsonContent);
      } else {
        games = JSON.parse(fileContent);
      }

      if (!Array.isArray(games)) {
        throw new Error('Invalid format: expected an array of games');
      }

      const isValid = games.every(game => 
        game.title && game.packageName && 
        Array.isArray(game.features) && game.features.length > 0 &&
        (game.status === 'free' || game.status === 'exclusive')
      );

      if (!isValid) {
        throw new Error('Invalid format: some games are missing required fields');
      }

      const messageElement = $('#form-success-message');
      messageElement.textContent = `Import ${games.length} games? This will replace all existing games in the admin panel.`;
      messageElement.className = 'warning-message';
      messageElement.style.display = 'inline-block';
      
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
        }, 5000); 
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
