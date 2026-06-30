document.addEventListener('DOMContentLoaded', () => {
  const projects = Array.from(document.querySelectorAll('.project'));
  const modal = document.getElementById('modal');
  const modalNum = document.getElementById('modal-num');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalGallery = document.getElementById('modal-gallery');
  const aboutPortrait = document.querySelector('.about__portrait');
  const closeButtons = Array.from(document.querySelectorAll('[data-close]'));
  const navButtons = Array.from(document.querySelectorAll('[data-nav]'));
  let currentIndex = 0;
  let currentGalleryType = 'project';

  function getAboutGalleryImages() {
    const basePath = 'images/about';
    return [
      `${basePath}/portrait.png`,
      `${basePath}/01.png`,
      `${basePath}/02.png`,
      `${basePath}/03.png`,
      `${basePath}/04.png`,
      `${basePath}/05.png`,
      `${basePath}/06.png`
    ];
  }

  function renderGallery(images, title, meta) {
    modalNum.textContent = '';
    modalTitle.textContent = title;
    modalMeta.textContent = meta;
    modalGallery.innerHTML = '';

    images.forEach((imagePath) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const img = document.createElement('img');
      img.src = imagePath;
      img.alt = `${title} image`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => item.remove();
      item.appendChild(img);
      modalGallery.appendChild(item);
    });

    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function openAboutGallery() {
    currentGalleryType = 'about';
    modal.classList.add('modal--about');
    renderGallery(getAboutGalleryImages(), 'Portrait gallery', 'About');
  }

  function updateActiveProject(index) {
    projects.forEach((project, idx) => {
      project.classList.toggle('is-active', idx === index);
    });
  }

  function getGalleryImages(projectId) {
    const basePath = `images/projects/project-${projectId}`;
    return [1, 2, 3, 4].map((num) => `${basePath}/${String(num).padStart(2, '0')}.png`);
  }

  function openModal(index) {
    currentGalleryType = 'project';
    modal.classList.remove('modal--about');
    currentIndex = index;
    const project = projects[currentIndex];
    const projectId = project.dataset.project;
    const title = project.dataset.title;
    const year = project.dataset.year;
    const tag = project.dataset.tag;

    modalNum.textContent = project.dataset.num || projectId;
    modalTitle.textContent = title;
    modalMeta.textContent = `${tag} · ${year}`;
    modalGallery.innerHTML = '';

    getGalleryImages(projectId).forEach((imagePath) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const img = document.createElement('img');
      img.src = imagePath;
      img.alt = `${title} gallery image`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => item.remove();
      item.appendChild(img);
      modalGallery.appendChild(item);
    });

    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    modal.classList.remove('modal--about');
    modal.setAttribute('aria-hidden', 'true');
  }

  function showNextProject(delta) {
    if (currentGalleryType !== 'project') return;
    const nextIndex = (currentIndex + delta + projects.length) % projects.length;
    openModal(nextIndex);
  }

  if (projects.length) {
    updateActiveProject(0);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const project = entry.target;
        const index = projects.indexOf(project);
        if (entry.isIntersecting) {
          project.classList.add('is-active');
          currentIndex = index;
        }
      });
    }, { threshold: 0.35 });

    projects.forEach((project) => observer.observe(project));
  }

  projects.forEach((project, index) => {
    const button = project.querySelector('.project__cta');
    const image = project.querySelector('.project__img');
    if (button) {
      button.addEventListener('click', () => openModal(index));
    }
    if (image) {
      image.addEventListener('click', () => openModal(index));
    }
  });

  if (aboutPortrait) {
    aboutPortrait.addEventListener('click', openAboutGallery);
    aboutPortrait.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openAboutGallery();
      }
    });
  }

  closeButtons.forEach((button) => button.addEventListener('click', closeModal));
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const dir = button.dataset.nav;
      if (dir === 'prev') {
        showNextProject(-1);
      } else if (dir === 'next') {
        showNextProject(1);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowRight') showNextProject(1);
    if (event.key === 'ArrowLeft') showNextProject(-1);
  });

  /* ---- Mobile navigation (hamburger menu) ------------------------------- */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');

  function setNavOpen(open) {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      setNavOpen(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('.nav__links a').forEach((link) => {
      link.addEventListener('click', () => setNavOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setNavOpen(false);
      }
    });
  }
});
