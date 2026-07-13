import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQPeQLh2IQbI7ooVdgqEDS-vW585xfjyk",
  authDomain: "console-92a8b.firebaseapp.com",
  projectId: "console-92a8b",
  storageBucket: "console-92a8b.firebasestorage.app",
  messagingSenderId: "100288837026",
  appId: "1:100288837026:web:bdbca55cd6d6c047b7aefb",
  measurementId: "G-HQHKX2QH5J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const bookingForm = document.getElementById('bookingForm');
  const modalFormState = document.getElementById('modalFormState');
  const modalSuccessState = document.getElementById('modalSuccessState');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const submitFormBtn = document.getElementById('submitFormBtn');
  
  // Triggers to open the modal
  const openModalTriggers = [
    document.getElementById('headerBookBtn'),
    document.getElementById('heroConsultBtn'),
    document.getElementById('aboutConnectBtn')
  ];

  // Inputs & Errors
  const clientName = document.getElementById('clientName');
  const clientEmail = document.getElementById('clientEmail');
  const serviceType = document.getElementById('serviceType');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const serviceError = document.getElementById('serviceError');

  // --- Modal Open/Close Logic ---

  const openModal = (defaultService = '') => {
    bookingModal.classList.add('active');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
    
    // Auto-select service based on button clicked
    if (defaultService) {
      serviceType.value = defaultService;
    }
    
    // Focus first input
    setTimeout(() => {
      clientName.focus();
    }, 100);
  };

  const closeModal = () => {
    bookingModal.classList.remove('active');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Reset form after transition finishes
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  // Open Jishad's WhatsApp link directly for all booking/consultation triggers
  const whatsappUrl = 'https://api.whatsapp.com/send/?phone=919656141881&text&type=phone_number&app_absent=0';
  openModalTriggers.forEach((btn) => {
    if (!btn) return;
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const a = document.createElement('a');
      a.href = whatsappUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });

  // Close triggers
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

  // Close modal when clicking on the overlay background
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      closeModal();
    }
  });

  // Close modal with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
      closeModal();
    }
  });

  // --- Form Validation & Submission ---

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const clearErrors = () => {
    const groups = bookingForm.querySelectorAll('.form-group');
    groups.forEach(g => g.classList.remove('invalid'));
  };

  const resetForm = () => {
    bookingForm.reset();
    clearErrors();
    modalFormState.classList.remove('hidden');
    modalSuccessState.classList.add('hidden');
    submitFormBtn.classList.remove('loading');
    submitFormBtn.disabled = false;
  };

  // Form Submit Handler
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // Validate Name
    if (!clientName.value.trim()) {
      clientName.parentElement.classList.add('invalid');
      isValid = false;
    }

    // Validate Email
    if (!clientEmail.value.trim() || !validateEmail(clientEmail.value.trim())) {
      clientEmail.parentElement.classList.add('invalid');
      isValid = false;
    }

    // Validate Service Selection
    if (!serviceType.value) {
      serviceType.parentElement.classList.add('invalid');
      isValid = false;
    }

    if (!isValid) {
      // Focus the first invalid element
      const firstInvalid = bookingForm.querySelector('.form-group.invalid input, .form-group.invalid select');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Show loading spinner
    submitFormBtn.classList.add('loading');
    submitFormBtn.disabled = true;

    // Simulate Server Request (1.5 seconds)
    setTimeout(() => {
      // Transition to Success State
      modalFormState.classList.add('hidden');
      modalSuccessState.classList.remove('hidden');
    }, 1500);
  });

  // Dynamic input validation removal on type
  [clientName, clientEmail, serviceType].forEach(element => {
    element.addEventListener('input', () => {
      if (element.value.trim()) {
        if (element === clientEmail) {
          if (validateEmail(element.value.trim())) {
            element.parentElement.classList.remove('invalid');
          }
        } else {
          element.parentElement.classList.remove('invalid');
        }
      }
    });
  });

  // Handle select change validation
  serviceType.addEventListener('change', () => {
    if (serviceType.value) {
      serviceType.parentElement.classList.remove('invalid');
    }
  });

  // --- Stats Counter Animation ---
  const initCounters = () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 120; // Controls speed of count-up
    
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target > 100 ? Math.ceil(target / speed) : 1;
        
        if (count < target) {
          counter.innerText = Math.min(target, count + inc);
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target;
        }
      };
      
      // Trigger count-up only when cards scroll into view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCount();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(counter);
    });
  };
  
  initCounters();

  // --- Insights Contact Form Submission ---
  const insightsForm = document.getElementById('insightsContactForm');
  const contactName = document.getElementById('contactName');
  const contactEmail = document.getElementById('contactEmail');
  const contactMessage = document.getElementById('contactMessage');
  const contactFormInputs = document.getElementById('contactFormInputs');
  const contactFormSuccess = document.getElementById('contactFormSuccess');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');

  if (insightsForm) {
    insightsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      
      // Simple visual check for empty fields
      [contactName, contactEmail, contactMessage].forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#e03131';
          isValid = false;
        } else {
          input.style.borderColor = 'transparent';
        }
      });

      if (!isValid) return;

      // Show loading state
      contactSubmitBtn.disabled = true;
      const btnText = contactSubmitBtn.querySelector('span');
      if (btnText) btnText.textContent = 'Sending...';

      // Save message to Firestore
      addDoc(collection(db, "dmx"), {
        name: contactName.value.trim(),
        email: contactEmail.value.trim(),
        message: contactMessage.value.trim(),
        timestamp: serverTimestamp()
      })
      .then(() => {
        contactFormInputs.classList.add('hidden');
        contactFormSuccess.classList.remove('hidden');
      })
      .catch((error) => {
        console.error("Error sending message to Firestore: ", error);
        alert("Failed to send message. Please try again.");
        contactSubmitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send';
      });
    });

    // Clear red border on input typing
    [contactName, contactEmail, contactMessage].forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = 'transparent';
      });
    });
  }
});

// Force unregister service worker and clear caches to solve live server caching issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister().then(() => {
        console.log("Service Worker unregistered.");
      });
    }
  });
}
if ('caches' in window) {
  caches.keys().then((names) => {
    for (let name of names) {
      caches.delete(name).then(() => {
        console.log("Cache cleared:", name);
      });
    }
  });
}
