/* ===================================
   ERHAD – JavaScript complet
   =================================== */

'use strict';

// ===================================
// NAVBAR – scroll effect + burger menu
// ===================================
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Fermer le menu mobile au clic sur un lien
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===================================
// SCROLL SMOOTH pour les ancres
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const y = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// ===================================
// SCROLL ANIMATIONS (AOS maison)
// ===================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay basé sur la position dans le parent
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 100, 400);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
  observer.observe(el);
});

// ===================================
// FORMULAIRE DEVIS – Multi-steps
// ===================================
let currentStep = 1;
const totalSteps = 2;

function showStep(step) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.getElementById('step' + step).classList.add('active');

  // Mise à jour des dots
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i + 1 <= step);
  });
}

function nextStep() {
  // Validation étape 1 : service requis
  const serviceSelected = document.querySelector('input[name="service"]:checked');
  if (!serviceSelected) {
    showFormError('Veuillez sélectionner un type de prestation.');
    return;
  }
  currentStep = 2;
  showStep(2);
  document.getElementById('step2').scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Update dot 2
  document.getElementById('dot2').classList.add('active');
}

function prevStep() {
  currentStep = 1;
  showStep(1);
}

// Expose globally (appelé inline dans HTML)
window.nextStep = nextStep;
window.prevStep = prevStep;

// ===================================
// FORMULAIRE – Soumission
// ===================================
const devisForm = document.getElementById('devisForm');

devisForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Validation basique
  const prenom = devisForm.querySelector('input[name="prenom"]').value.trim();
  const nom = devisForm.querySelector('input[name="nom"]').value.trim();
  const tel = devisForm.querySelector('input[name="telephone"]').value.trim();

  if (!prenom || !nom || !tel) {
    showFormError('Merci de remplir tous les champs obligatoires (*).');
    return;
  }

  if (!isValidPhone(tel)) {
    showFormError('Veuillez entrer un numéro de téléphone valide.');
    return;
  }

  // Simulation envoi (à connecter à votre backend / Formspree / EmailJS)
  const submitBtn = devisForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Envoi en cours…';

  // Simuler un délai réseau (remplacer par fetch réel)
  setTimeout(() => {
    // Afficher la confirmation
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.getElementById('stepDone').classList.add('active');

    // Mettre le prénom dans le message de confirmation
    document.getElementById('confirmPrenom').textContent = prenom;

    // Faire défiler vers le message de succès
    document.getElementById('stepDone').scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Reset bouton (en cas de réutilisation)
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    // Masquer les dots
    document.querySelector('.step-indicator').style.display = 'none';

    // Envoyer les données (à décommenter avec votre endpoint)
    // sendFormData(new FormData(devisForm));
  }, 1800);
});

// Envoi réel (Formspree ou autre)
async function sendFormData(formData) {
  try {
    await fetch('https://formspree.io/f/VOTRE_ID', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
  } catch (err) {
    console.error('Erreur envoi formulaire:', err);
  }
}

// ===================================
// VALIDATION TÉLÉPHONE
// ===================================
function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\.\-\(\)]/g, '');
  return /^(\+33|0033|0)[1-9]\d{8}$/.test(cleaned);
}

// ===================================
// ERREURS FORMULAIRE
// ===================================
function showFormError(msg) {
  // Supprimer l'erreur précédente
  const existing = document.querySelector('.form-error-msg');
  if (existing) existing.remove();

  const err = document.createElement('div');
  err.className = 'form-error-msg';
  err.textContent = msg;
  err.style.cssText = `
    background: rgba(255,60,60,0.12);
    border: 1px solid rgba(255,60,60,0.25);
    color: #ff6060;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    margin-bottom: 16px;
    animation: fadeIn 0.3s ease;
  `;

  const activeStep = document.querySelector('.form-step.active');
  activeStep.insertBefore(err, activeStep.firstChild);

  // Auto-supprimer après 4s
  setTimeout(() => err.remove(), 4000);
}

// ===================================
// UPLOAD PHOTOS – Prévisualisation
// ===================================
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const fileUpload = document.getElementById('fileUpload');

if (photoInput) {
  photoInput.addEventListener('change', function () {
    photoPreview.innerHTML = '';
    const files = Array.from(this.files).slice(0, 8); // Max 8 photos

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'photo-thumb';
        img.alt = file.name;
        img.title = file.name;
        photoPreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });

    if (files.length > 0) {
      fileUpload.style.borderColor = 'var(--accent)';
      fileUpload.querySelector('span').textContent = `${files.length} photo(s) sélectionnée(s)`;
    }
  });

  // Drag and drop
  fileUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUpload.style.borderColor = 'var(--accent)';
    fileUpload.style.background = 'rgba(245,200,0,0.04)';
  });

  fileUpload.addEventListener('dragleave', () => {
    fileUpload.style.borderColor = '';
    fileUpload.style.background = '';
  });

  fileUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUpload.style.borderColor = '';
    fileUpload.style.background = '';
    photoInput.files = e.dataTransfer.files;
    photoInput.dispatchEvent(new Event('change'));
  });
}

// ===================================
// SÉLECTION SERVICE – Highlight auto
// ===================================
document.querySelectorAll('input[name="service"]').forEach(radio => {
  radio.addEventListener('change', () => {
    // Mettre à jour les styles (géré par CSS :checked, mais on peut enrichir ici)
    console.log('Service sélectionné :', radio.value);
  });
});

// ===================================
// COMPTEUR ANIMÉ pour les stats hero
// ===================================
function animateCounter(el, start, end, duration, suffix) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const val = Math.floor(progress * (end - start) + start);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Observer pour déclencher les compteurs quand visibles
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Les stats sont textuelles ici, pas numériques, mais on peut animer si besoin
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

// ===================================
// ACTIVE NAV LINK au scroll
// ===================================
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
  const navH = 80;
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= navH + 50) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.style.color = '';
    const href = link.getAttribute('href');
    if (href === '#' + current) {
      link.style.color = 'var(--white)';
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });

// ===================================
// GALLERY – Slider avant/après interactif
// ===================================
// Optionnel: survol pour effet "reveal"
document.querySelectorAll('.gallery-item').forEach(item => {
  const before = item.querySelector('.gallery-before');
  const after = item.querySelector('.gallery-after');

  if (!before || !after) return;

  item.addEventListener('mouseenter', () => {
    before.style.transform = 'scale(1.02)';
    after.style.transform = 'scale(1.02)';
    after.style.boxShadow = '0 0 20px rgba(245,200,0,0.1)';
  });

  item.addEventListener('mouseleave', () => {
    before.style.transform = '';
    after.style.transform = '';
    after.style.boxShadow = '';
  });
});

// ===================================
// KEYBOARD TRAP – Accessibilité menu mobile
// ===================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// ===================================
// CTA STICKY – Afficher un CTA fixe après scroll
// ===================================
let ctaBanner = null;

function createCtaBanner() {
  if (ctaBanner) return;
  ctaBanner = document.createElement('div');
  ctaBanner.id = 'ctaBanner';
  ctaBanner.innerHTML = `
    <span>Devis gratuit sous 2h</span>
    <a href="#devis" class="btn btn-primary" id="ctaBannerBtn" style="padding:10px 20px;font-size:14px;">
      Demander un devis →
    </a>
    <button id="closeCta" aria-label="Fermer">✕</button>
  `;
  ctaBanner.style.cssText = `
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: rgba(15,15,15,0.97);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(245,200,0,0.2);
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    z-index: 980;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: #f0ede8;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  `;
  document.body.appendChild(ctaBanner);

  // Animation d'entrée
  setTimeout(() => {
    ctaBanner.style.transform = 'translateY(0)';
  }, 100);

  // Lien
  ctaBanner.querySelector('#ctaBannerBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const devis = document.getElementById('devis');
    devis.scrollIntoView({ behavior: 'smooth' });
    hideCta();
  });

  // Fermer
  ctaBanner.querySelector('#closeCta').style.cssText = `
    background: none; border: none; color: #888; font-size: 16px;
    cursor: pointer; padding: 4px 8px; line-height: 1;
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
  `;
  ctaBanner.querySelector('#closeCta').addEventListener('click', hideCta);
}

function hideCta() {
  if (!ctaBanner) return;
  ctaBanner.style.transform = 'translateY(100%)';
  setTimeout(() => {
    ctaBanner.remove();
    ctaBanner = null;
    ctaShown = true;
  }, 400);
}

let ctaShown = false;
let ctaScrollThreshold = false;

window.addEventListener('scroll', () => {
  if (ctaShown) return;

  const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);

  // Afficher après 30% de scroll
  if (scrollPct > 0.3 && !ctaScrollThreshold) {
    ctaScrollThreshold = true;
    // Vérifier que le formulaire n'est pas visible
    const devisSection = document.getElementById('devis');
    const rect = devisSection.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      createCtaBanner();
    }
  }

  // Masquer quand la section devis est visible
  const devisSection = document.getElementById('devis');
  const rect = devisSection.getBoundingClientRect();
  if (rect.top < window.innerHeight && ctaBanner) {
    hideCta();
  }
}, { passive: true });

// ===================================
// INIT
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('%cERHAD – Site chargé ✓', 'color:#f5c800;font-size:14px;font-weight:bold;');

  // S'assurer que le step 1 est actif
  showStep(1);

  // Lazy load images (si vraies images ajoutées plus tard)
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  }
});
