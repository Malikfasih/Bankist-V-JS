'use strict';
//////////////////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsOperation = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal); // better/clean way of doing
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
////////////////////////////////////////

// button scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log('Current Scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling

  // old school of doing this

  // window.scrollTo(s1coords.left, s1coords.top); // as this works only when the viewport is at begining,
  // we need to get to the element where ever we click the button, so we will add
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset // current position + current scroll
  // );
  // by doing this we basically determine the absolute position of the element(section1)

  // ohter smooth way of doing this scroll, by creating an object
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // }); // but this is not working in my chrome

  // modern way of doing this
  section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////////////////

// page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// }); // this will unnessary way of doing as it cause bugs if there will be many events

// other clean way // adding event delegation
// 1). Add event listener to a common parent element
// 2). Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching stragety
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
/////////////////////////////////////////////////

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Remove activated classes
  tabsOperation.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////////////////////////////

// Menu fade animation
const handleHover = function (e) {
  // console.log(this, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "arguments" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////////////////

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// // console.log(initialCoords);
// window.addEventListener('scroll', function () {
//   // console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky navigation : Intersection observer API
// This callback fuction here will get called each time that the observed element i.e 'section1' is intersecting the root element at thershold that we defined
// or in this current eg when ever our target here 'section1' intersects the viewport at 10%
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, // viewport
//   threshold: [0, 0.2], // this is the % of intersection at which the observer callback will be called
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // rootMargin: '-90px',
  rootMargin: `-${navHeight}px`, // its also the height of navigation and this box will be applied outside/before the target element
});
headerObserver.observe(header);

// Reveal section
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return; //guard clause
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // as this will not after its was observed once
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// lazy loading image
const imgTarget = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;

  // Replacing src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // rootMargin: '-200px',
  rootMargin: '200px',
});
imgTarget.forEach(img => imageObserver.observe(img));

/////////////////////////////////////////////

// SLider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const maxSlide = slides.length;
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;

  // just practiced to make all slides visible
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.3) translateX(-800px)';
  // slider.style.overflow = 'visible';

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class ="dots__dot" data-slide ="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const previousSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide); // -100%, 0%, 100%, 200%
  btnLeft.addEventListener('click', previousSlide);
  document.addEventListener('keydown', function (e) {
    // console.log(e.key);
    if (e.key === 'ArrowLeft') previousSlide(); // or
    e.key === 'ArrowRight' && nextSlide(); // short circuiting
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide; // to make it even better we can use destructuring
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
//////////////////////////////////////////////
/////////////////////////////////////////////
// Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);
// const header = document.querySelector('.header');

// const allSections = document.querySelectorAll('section');
// console.log(allSections);

// console.log(document.getElementById('section--1'));

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
// console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
// const message = document.createElement('div'); //message is an object now
// message.classList.add('cookie-message');
// // message.textContent = 'We add cookies for improved functionality and analytics'// or
// message.innerHTML =
//   'We add cookies for improved functionality and analytics <button class = "btn btn--close--cookie">Got it</button>';

// header.prepend(message)
// header.append(message);
// // header.append(message.cloneNode(true))// this will copy all the child elements

// // header.before(message) // it will add message element before header as sibling of header instead of child
// header.after(message); // it will add message element after

// Deleting elements
// document
//   .querySelector('.btn--close--cookie')
//   .addEventListener('click', function () {
//     message.remove(); // recent method to delete
//     // message.parentElement.removeChild(message); // old method of deleting
//   });

// Styles
// message.style.backgroundColor = 'yellow';
// // message.style.width = '120%';

// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).backgroundColor);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 20 + 'px';
// // we parseFloat to get the value of height without 'px' and add to 20

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// logo.alt = 'Beautiful logo';

// console.log(logo.src); // absolute version
// console.log(logo.getAttribute('src')); // relative version

// logo.setAttribute('company', 'banks'); // it will add new attribute to logo

//Date Attribute
// console.log(logo.dataset.versionNumber);// but its giving undefined

// Classes ]
// as already practiced these before
// logo.classList.add('a','b')
// logo.classList.remove('b')
// logo.classList.toggle('c')
// logo.classList.contains('a')

// types of events

// const h1 = document.querySelector('h1');
// // h1.addEventListener('mouseenter', function (e) {
// //   alert('addEventListener : You read !!');
// // }); //or
// const alertH1 = function (e) {
//   alert('addEventListener : You read !!');
//   // h1.removeEventListener('mouseenter', alertH1); // to remove addeventlistener and it will listen to event at once coz we added next to this
// };
// h1.addEventListener('mouseenter', alertH1);
// // or we can remover event listener with other pattern like seeting Time out
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// old way of doing
// h1.onmouseenter = function (e) {
//   alert('mouseListener : You read now !!');
// };

//rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// // console.log(randomInt);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget); // e.target will show the target where we click
//   console.log(e.currentTarget === this); // true
// });

//stop propogation
// e.stopPropagation(); // it will not allow parent element to change there bg color

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget); // e.currentTarget is target that is attached to event listener
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// });

// DOM Traversing

// keep in mind 'querySelector' finds element in a child elements and 'closest' find element in parent elements
// const h1 = document.querySelector('h1');

// Going downwards : Child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// console.log(h1.firstElementChild);
// console.log(h1.lastElementChild);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// Going upwards : parent
// console.log(h1.parentNode);
// console.log(h1.parentElement); // it will be same as parentNode of 'h1'
// console.log(h1.closest('.header'));
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)'; // this will be the same h1 itself

// Going sideways : siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// // not important ones
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children); // this will give all children including 'h1'
// // eg : practicing
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// life cycle DOM events

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
