/* =============================================
   Bistroteca & Pizzeria – Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initNavScroll();
  initMenuFilter();
  initTodayHighlight();
  initReservationForm();
});

/* --- Mobile Navigation --- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* --- Nav scroll shadow & background switch --- */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* --- Menu Category Filter --- */
function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  if (!filterBtns.length || !menuItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.filter;

      // Change the active class on the buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter items by adding/removing the .hidden class
      menuItems.forEach(item => {
        const itemCategory = item.dataset.category;
        const show = category === 'all' || itemCategory === category;
        item.classList.toggle('hidden', !show);
      });
    });
  });
}

/* --- Highlight Today's Opening Hours --- */
function initTodayHighlight() {
  const hoursList = document.querySelector('.hours-list');
  if (!hoursList) return;

  // Detect language by URL
  const isEnglish = window.location.pathname.includes('/en/');

  // Days for both Slovak and English (in different formats that could be used in HTML)
  const skDays = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];
  const enDaysLong = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const enDaysShort = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday...

  hoursList.querySelectorAll('li').forEach(li => {
    const dayEl = li.querySelector('.hours-day');
    if (!dayEl) return; 

    const currentDayText = dayEl.textContent.trim().toLowerCase();

    // This checks whether the text in HTML corresponds to today's date in the SK or EN version
    const isTodaySK = !isEnglish && currentDayText.includes(skDays[todayIndex]);
    const isTodayEN = isEnglish && (currentDayText.includes(enDaysLong[todayIndex]) || currentDayText.includes(enDaysShort[todayIndex]));

    if (isTodaySK || isTodayEN) {
      li.classList.add('today');
    }
  });
}
/* --- Helper function for date formatting --- */
function formatDate(dateStr, isEnglish = false) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  
  if (isEnglish) {
    return `${day}.${month}.${year}`; 
  }
  return `${day}.${month}.${year}`;
}

/* --- Reservation Form --- */
function initReservationForm() {
  const form = document.querySelector('.reservation-form');
  if (!form) return;

  const dateInput = form.querySelector('#datum');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Modal window elements from HTML
  const modal = document.getElementById('reservation-modal');
  const modalMessage = document.getElementById('modal-message');
  const closeModalBtn = document.getElementById('close-modal-btn');
  
  // Here look for the icon and title in the modal so that they can be changed later
  const modalIcon = modal ? modal.querySelector('.success-icon') : null;
  const modalTitle = modal ? modal.querySelector('h2') : null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#meno').value.trim();
    const phone = form.querySelector('#telefon').value.trim();
    const guests = form.querySelector('#osoby').value;
    const date = form.querySelector('#datum').value;
    
    // Load the displayed text (e.g. 1:00 PM) instead of value (13:00)
    const timeSelect = form.querySelector('#cas');
    const time = timeSelect.options[timeSelect.selectedIndex] ? timeSelect.options[timeSelect.selectedIndex].text : '';

    // Detect language
    const isEnglish = window.location.pathname.includes('/en/');

    // IF SOMETHING IS MISSING (Error condition)
    if (!name || !phone || !guests || !date || !time) {
      if (modal && modalMessage) {
        // Set the modal appearance to red error
        if (modalIcon) {
          modalIcon.textContent = '✕';
          modalIcon.style.backgroundColor = 'var(--color-red, #c0392b)';
          modalIcon.style.color = '#ffffff';
          modalIcon.style.borderColor = 'var(--color-red, #c0392b)';
        }
        if (modalTitle) {
          modalTitle.textContent = isEnglish ? 'Reservation Error' : 'Chyba v rezervácii';
          modalTitle.style.color = 'var(--color-red, #c0392b)';
        }
        if (closeModalBtn) {
          closeModalBtn.style.backgroundColor = 'var(--color-red, #c0392b)';
          closeModalBtn.style.borderColor = 'var(--color-red, #c0392b)';
          closeModalBtn.textContent = isEnglish ? 'Close' : 'Zavrieť';
        }

        modalMessage.textContent = isEnglish 
          ? 'Please fill in all required fields in the form.\n\nWe cannot complete the reservation without a name, contact information, and date.'
          : 'Prosím, vyplňte všetky povinné polia vo formulári.\n\nBez mena, kontaktu a termínu nevieme rezerváciu dokončiť.';
        
        modal.classList.add('show');
      } else {
        alert(isEnglish ? 'Please fill in all required fields.' : 'Prosím, vyplňte všetky povinné polia.');
      }
      return; // Stop code execution
    }

    // IF EVERYTHING IS COMPLETED (Successful status)
    let messageText = '';
    let successTitleText = '';

    if (isEnglish) {
  
      const guestText = guests === '1' ? 'person' : 'people';
      
      successTitleText = 'Reservation Received!';
      messageText = `Thank you, ${name}!\n\nYour reservation for ${guests} ${guestText} on ${formatDate(date, true)} at ${time} has been received.\n\nWe will contact you shortly to confirm at ${phone}.`;
    } else {
      successTitleText = 'Rezervácia prijatá!';
      messageText = `Ďakujeme, ${name}!\n\nVaša rezervácia na ${guests} osôb dňa ${formatDate(date, false)} o ${time} bola prijatá.\n\nČoskoro vás budeme kontaktovať na čísle ${phone}.`;
    }

    if (modal && modalMessage) {
      
      if (modalIcon) {
        modalIcon.textContent = '✓';
        modalIcon.style.backgroundColor = 'var(--color-olive)';
        modalIcon.style.color = 'var(--color-gold)';
        modalIcon.style.borderColor = 'var(--color-gold)';
      }
      if (modalTitle) {
        modalTitle.textContent = successTitleText;
        modalTitle.style.color = 'var(--color-olive)';
      }
      if (closeModalBtn) {
        closeModalBtn.style.backgroundColor = ''; // It returns the original color from CSS
        closeModalBtn.style.borderColor = '';
        closeModalBtn.textContent = isEnglish ? 'Close' : 'Zavrieť';
      }

      modalMessage.textContent = messageText;
      modal.classList.add('show');
      form.reset(); // The form is cleared only on success, on error it is left filled in
    } else {
      alert(messageText);
      form.reset();
    }
  });

  // Logic for closing the modal window
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  }
}