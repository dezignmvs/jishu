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

  // Attach event listeners to open buttons
  openModalTriggers.forEach((btn, index) => {
    if (!btn) return;
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Pick matching default select option based on button
      let defaultService = '';
      if (btn.id === 'heroConsultBtn') {
        defaultService = 'consultation';
      } else if (btn.id === 'aboutConnectBtn') {
        defaultService = 'coaching';
      }
      openModal(defaultService);
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
});
