'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

const slider = document.querySelector('.slider');

const dotsContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// // Page navigation
btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////////////////////////////////
// Event delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////////////////////////////////
// // Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  const tabClicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!tabClicked) return;

  // Active tab
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  tabClicked.classList.add('operations__tab--active');

  // Activate content area
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${tabClicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////////////////////////////////
// // Menu fade animation

const handleOver = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });

    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', e => handleOver(e, 0.5));
nav.addEventListener('mouseout', e => handleOver(e, 1));

// // Sticky Navigation: Intersection Observer API
const header = document.querySelector('.header');
const navHeight = `${-nav.getBoundingClientRect().height}px`;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: navHeight,
});
headerObserver.observe(header);

////////////////////////////////////////////////////
// // Reveal sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

////////////////////////////////////////////////////

// // Lazy loading images
const allFeaturesImages = document.querySelectorAll('.features__img');
// const img = document.createElement('img');
// img;
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};
const featureImageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-100px',
});

allFeaturesImages.forEach(img => {
  featureImageObserver.observe(img);
});

////////////////////////////////////////////////////

// // Slider component

const initSlideComponent = function () {
  const maxSlide = slides.length - 1;
  let currentSlide = 0;

  // Create the Dots with the length of the array of slides
  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();

  // Selecting the active dot
  const activateDot = function (curSlide) {
    // Remove the className in all the dots
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // Add the className to the current slide
    document
      .querySelector(`.dots__dot[data-slide="${curSlide}"]`)
      .classList.add('dots__dot--active');
  };

  // Change the slide to the user's preference
  const goToSlide = function (curSlide) {
    slides.forEach(
      (slide, i) =>
        (slide.style.transform = `translateX(${(i - curSlide) * 100}%)`)
    );
    activateDot(curSlide);
  };
  goToSlide(currentSlide);

  // Change to the next slide
  const nextSlide = function () {
    currentSlide === maxSlide ? (currentSlide = 0) : currentSlide++;
    goToSlide(currentSlide);
  };

  // Change to the previous slide
  const prevSlide = function () {
    currentSlide === 0 ? (currentSlide = maxSlide) : currentSlide--;
    goToSlide(currentSlide);
  };

  // // Adding the Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });
};
initSlideComponent();

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

/* // // Selecting, Creating and Deleting Elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

console.log(allSections);

document.getElementById('section--1');

const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

const allButtonsClass = document.getElementsByClassName('btn');
console.log(allButtonsClass);

// // Creating and inserting elements
// .insetAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent = 'We use cookies for improve functionality and analytics.';
message.innerHTML =
  'We use cookies for improve functionality and analytics. <button class="btn btn-close--cookie">Got it</button>';

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));
// header.before(message);
// header.after(message);

// // Delete Elements
document.querySelector('.btn-close--cookie').addEventListener('click', () => {
  message.remove();
  // message.parentNode.removeChild(message);
});
 */

////////////////////////////////////////////////////

/* // // Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

console.log(message.style.height);

document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

// Non standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.getAttribute('src'));
console.log(logo.src);

const link = document.querySelector('.nav__link--btn');
console.log(link.getAttribute('href'));
console.log(link.href);

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');

// Don't use (Only one class and delete all the classes before)
logo.className = 'jonas'; */

////////////////////////////////////////////////////

////////////////////////////////////////////////////

/* // // Event Handlers
const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
};

h1.addEventListener('mouseenter', alertH1);
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('onMouseenter: Great! You are reading the heading :D');
// };
 */

////////////////////////////////////////////////////

/* // // Event propagation
// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  // Stop propagation
  e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, this);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target);
    console.log(this === e.currentTarget);
  },
  true
); */

////////////////////////////////////////////////////

/* // // DOM Tranversing 

const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (element) {
  if (element !== h1) element.style.transform = 'scale(0.5)';
});
 */

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e);
// });

// Don't abuse about this event handler

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
