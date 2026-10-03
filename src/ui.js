/**
 * ui.js - Manages the DOM interface: header, counter, speech bubble,
 * ticket card, 140-char textarea, pill submit button, shortcuts, themes,
 * desk actions (Bell, Coffee, Random Complaint, Shred), and the Void Ledger history.
 */

import { isAudioMuted, toggleAudio, playUiClick, playClerkMurmur } from './audio.js';

export function initUI({
  onSubmit,
  onThemeChange,
  onBellRing,
  onCoffeeSip,
  onRandomComplaint,
  onShred,
  onDownloadSlip
}) {
  // DOM Elements
  const fallbackEl = document.getElementById('webgl-fallback');
  const counterEl = document.getElementById('counter-num');
  const speechBubble = document.getElementById('clerk-speech');
  const ticketCard = document.getElementById('ticket-card');
  const ticketNumberEl = document.getElementById('ticket-number');
  const ticketStatusEl = document.getElementById('ticket-status');
  const ticketMemoEl = document.getElementById('ticket-memo');
  const ticketQuoteEl = document.getElementById('ticket-quote');

  const textarea = document.getElementById('complaint-input');
  const charCountEl = document.getElementById('char-count');
  const submitBtn = document.getElementById('submit-btn');
  const themeButtons = document.querySelectorAll('[data-theme-choice]');

  // New Interactive Elements
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const bellActionBtn = document.getElementById('action-bell');
  const coffeeActionBtn = document.getElementById('action-coffee');
  const randomActionBtn = document.getElementById('action-random');
  const shredActionBtn = document.getElementById('action-shred');
  const downloadSlipBtn = document.getElementById('download-slip-btn');
  const historyToggleBtn = document.getElementById('history-toggle-btn');
  const historyDrawer = document.getElementById('history-drawer');
  const historyCloseBtn = document.getElementById('history-close-btn');
  const historyList = document.getElementById('history-list');
  const historyClearBtn = document.getElementById('history-clear-btn');

  let speechTimeout = null;
  let processedCount = 0;

  // 1. Textarea Character Counter (140 max limit)
  function updateCharCount() {
    const len = textarea.value.length;
    charCountEl.textContent = `${len} / 140`;

    if (len >= 140) {
      charCountEl.className = 'char-counter limit';
    } else if (len >= 120) {
      charCountEl.className = 'char-counter warning';
    } else {
      charCountEl.className = 'char-counter';
    }
  }

  textarea.addEventListener('input', updateCharCount);

  // 2. Keyboard shortcut: Ctrl+Enter or Cmd+Enter submits
  textarea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleFormSubmit();
    }
  });

  // 3. Submit Button
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    playUiClick();
    handleFormSubmit();
  });

  function handleFormSubmit() {
    if (submitBtn.disabled) return;
    const text = textarea.value.trim();
    onSubmit(text);
  }

  // 4. Quick Desk Action Buttons
  if (bellActionBtn) {
    bellActionBtn.addEventListener('click', () => {
      if (onBellRing) onBellRing();
    });
  }

  if (coffeeActionBtn) {
    coffeeActionBtn.addEventListener('click', () => {
      if (onCoffeeSip) onCoffeeSip();
    });
  }

  if (randomActionBtn) {
    randomActionBtn.addEventListener('click', () => {
      playUiClick();
      if (onRandomComplaint) {
        const randText = onRandomComplaint();
        if (randText) {
          textarea.value = randText;
          updateCharCount();
          textarea.focus();
        }
      }
    });
  }

  if (shredActionBtn) {
    shredActionBtn.addEventListener('click', () => {
      playUiClick();
      if (onShred) onShred();
    });
  }

  if (downloadSlipBtn) {
    downloadSlipBtn.addEventListener('click', () => {
      playUiClick();
      if (onDownloadSlip) onDownloadSlip();
    });
  }

  // 5. Audio Toggle
  function syncAudioIcon() {
    if (!audioToggleBtn) return;
    const muted = isAudioMuted();
    audioToggleBtn.setAttribute('aria-pressed', muted ? 'false' : 'true');
    audioToggleBtn.title = muted ? 'Sound muted (Click to enable)' : 'Sound enabled (Click to mute)';
    audioToggleBtn.innerHTML = muted
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg><span>Muted</span>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg><span>Sound On</span>`;
  }

  if (audioToggleBtn) {
    syncAudioIcon();
    audioToggleBtn.addEventListener('click', () => {
      toggleAudio();
      syncAudioIcon();
      playUiClick();
    });
  }

  // 6. Void Ledger History Storage & Drawer
  let grievanceHistory = [];
  try {
    const saved = localStorage.getItem('complaintdesk_ledger');
    if (saved) grievanceHistory = JSON.parse(saved);
  } catch (e) {
    grievanceHistory = [];
  }

  function renderHistory() {
    if (!historyList) return;
    if (grievanceHistory.length === 0) {
      historyList.innerHTML = `<div class="history-empty">No filings recorded in this sector yet.<br>The void remains undisturbed.</div>`;
      return;
    }

    historyList.innerHTML = grievanceHistory.map(item => `
      <div class="history-item" style="--badge-color: ${item.color || '#8c4320'}">
        <div class="history-item-header">
          <span class="history-ticket-num">#${String(item.ticketNum).padStart(5, '0')}</span>
          <span class="history-badge" style="background: ${item.color}22; color: ${item.color}; border: 1px solid ${item.color}44;">
            ${item.outcomeName}
          </span>
          <span class="history-time">${item.date || ''}</span>
        </div>
        <div class="history-grievance">"${item.text}"</div>
        <div class="history-memo">Memo: ${item.memo}</div>
      </div>
    `).join('');
  }

  function saveToHistory(record) {
    grievanceHistory.unshift(record);
    if (grievanceHistory.length > 50) grievanceHistory.pop();
    try {
      localStorage.setItem('complaintdesk_ledger', JSON.stringify(grievanceHistory));
    } catch (e) {}
    renderHistory();
  }

  if (historyToggleBtn && historyDrawer) {
    historyToggleBtn.addEventListener('click', () => {
      playUiClick();
      renderHistory();
      historyDrawer.classList.toggle('open');
    });

    if (historyCloseBtn) {
      historyCloseBtn.addEventListener('click', () => {
        playUiClick();
        historyDrawer.classList.remove('open');
      });
    }

    if (historyClearBtn) {
      historyClearBtn.addEventListener('click', () => {
        playUiClick();
        grievanceHistory = [];
        localStorage.removeItem('complaintdesk_ledger');
        renderHistory();
      });
    }
  }

  // 7. Theme Switcher (System / Light / Dark)
  let currentTheme = localStorage.getItem('complaint-desk-theme') || 'system';

  function applyTheme(choice) {
    currentTheme = choice;
    if (choice === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', choice);
    }

    themeButtons.forEach(btn => {
      const active = btn.getAttribute('data-theme-choice') === choice;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    localStorage.setItem('complaint-desk-theme', choice);

    if (onThemeChange) {
      requestAnimationFrame(() => onThemeChange(choice));
    }
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiClick();
      applyTheme(btn.getAttribute('data-theme-choice'));
    });
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'system' && onThemeChange) {
      requestAnimationFrame(() => onThemeChange('system'));
    }
  });

  applyTheme(currentTheme);

  // Return Controller API
  return {
    getComplaintText() {
      return textarea.value.trim();
    },

    setComplaintText(val) {
      textarea.value = val;
      updateCharCount();
    },

    clearInput() {
      textarea.value = '';
      updateCharCount();
    },

    setSubmitting(isSubmitting) {
      submitBtn.disabled = isSubmitting;
      textarea.disabled = isSubmitting;
      if (bellActionBtn) bellActionBtn.disabled = isSubmitting;
      if (coffeeActionBtn) coffeeActionBtn.disabled = isSubmitting;
      if (randomActionBtn) randomActionBtn.disabled = isSubmitting;
      if (shredActionBtn) shredActionBtn.disabled = isSubmitting;

      if (isSubmitting) {
        submitBtn.innerHTML = `<span>Processing...</span>`;
      } else {
        submitBtn.innerHTML = `<span>File Complaint</span>`;
      }
    },

    showSpeechBubble(text, duration = 3800) {
      if (!speechBubble) return;
      if (speechTimeout) clearTimeout(speechTimeout);

      speechBubble.textContent = text;
      speechBubble.classList.add('visible');

      // Vocal murmur blip
      playClerkMurmur();

      if (duration > 0) {
        speechTimeout = setTimeout(() => {
          speechBubble.classList.remove('visible');
        }, duration);
      }
    },

    hideSpeechBubble() {
      if (speechTimeout) clearTimeout(speechTimeout);
      speechBubble.classList.remove('visible');
    },

    triggerInputError(errorMessage) {
      textarea.classList.add('input-error');
      textarea.focus();
      this.showSpeechBubble(errorMessage, 3500);

      setTimeout(() => {
        textarea.classList.remove('input-error');
      }, 500);
    },

    updateTicketCard(ticketNum, outcome, complaintText = '') {
      ticketNumberEl.textContent = `#${String(ticketNum).padStart(5, '0')}`;
      ticketStatusEl.textContent = outcome.name;
      ticketMemoEl.textContent = `"${outcome.memo}"`;
      ticketQuoteEl.textContent = `Barnaby: "${outcome.clerkLine}"`;

      ticketCard.style.setProperty('--ticket-accent-color', outcome.color);
      if (downloadSlipBtn) {
        downloadSlipBtn.style.display = 'inline-flex';
      }

      // Add to Void Ledger
      saveToHistory({
        ticketNum,
        outcomeName: outcome.name,
        color: outcome.color,
        memo: outcome.memo,
        text: complaintText || textarea.value.trim() || 'Form 27-B/6 submission',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    },

    incrementCounter() {
      processedCount++;
      counterEl.textContent = processedCount;
      return processedCount;
    },

    showFallback() {
      if (fallbackEl) fallbackEl.style.display = 'flex';
      submitBtn.disabled = true;
    }
  };
}
