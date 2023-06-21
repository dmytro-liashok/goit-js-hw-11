import { fetchHits } from './api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

const searchQueryEl = document.querySelector('[name="searchQuery"]');
const submitBtnEl = document.querySelector('[type="submit"]');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
let page = 1;
let perPage = 100;
let isEndOfCollection = false;

submitBtnEl.addEventListener('click', clickOnSubmit);

function clickOnSubmit(e) {
  e.preventDefault();
  const valueInputUser = searchQueryEl.value;
  galleryEl.innerHTML = '';

  console.log(valueInputUser);
  console.log(page);

  fetchHits(valueInputUser, page, perPage)
    .then(responData => {
      if (valueInputUser.trim() === '' || responData.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      markupGallery(responData.hits);
      let gallery = new SimpleLightbox('.gallery a');
      window.addEventListener('scroll', throttle(infityScroll, 500));

      console.log(galleryEl.childElementCount);

      Notiflix.Notify.success(
        `Hooray! We found ${responData.totalHits} images.`
      );
      console.log(responData);
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    });
}

function markupGallery(arrayHits) {
  let strHTML = ``;

  arrayHits.forEach(hit => {
    let strMarkup = `<div class="photo-card">
 <a href="${hit.largeImageURL}"><img src="${hit.webformatURL}" alt="${hit.type}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${hit.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${hit.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${hit.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${hit.downloads}</b>
    </p>
  </div>
</div>`;
    strHTML += strMarkup;
  });
  galleryEl.insertAdjacentHTML('beforeend', strHTML);
}

function infityScroll() {
  if (isEndOfCollection) {
    window.removeEventListener('scroll', throttle(infityScroll, 500));
    return;
  }

  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

  if (!endOfPage) {
    return;
  }
  page += 1;

  const valueInputUser = searchQueryEl.value;

  console.log(valueInputUser);
  console.log(page);
  fetchHits(valueInputUser, page, perPage)
    .then(responData => {
      if (valueInputUser.trim() === '' || responData.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      markupGallery(responData.hits);
      let gallery = new SimpleLightbox('.gallery a');

      if (responData.totalHits <= galleryEl.childElementCount + perPage) {
        isEndOfCollection = true;
        window.removeEventListener('scroll', throttle(infityScroll, 1000));
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
      window.addEventListener('scroll', throttle(infityScroll, 500));

      console.log(galleryEl.childElementCount);
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    });
}
// import { fetchHits } from './api';
// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import throttle from 'lodash.throttle';

// const searchQueryEl = document.querySelector('[name="searchQuery"]');
// const submitBtnEl = document.querySelector('[type="submit"]');
// const galleryEl = document.querySelector('.gallery');
// const loadMoreBtnEl = document.querySelector('.load-more');
// let page = 1;
// let isEndOfCollection = false;

// submitBtnEl.addEventListener('click', clickOnSubmit);

// function clickOnSubmit(e) {
//   e.preventDefault();
//   const valueInputUser = searchQueryEl.value;
//   galleryEl.innerHTML = '';

//   fetchHits(valueInputUser)
//     .then(responData => {
//       if (valueInputUser.trim() === '' || responData.total === 0) {
//         Notiflix.Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//         return;
//       }

//       markupGallery(responData.hits);
//       let gallery = new SimpleLightbox('.gallery a');
//       window.addEventListener('scroll', throttle(infityScroll, 500));

//       Notiflix.Notify.success(
//         `Hooray! We found ${responData.totalHits} images.`
//       );
//     })
//     .catch(error => {
//       Notiflix.Notify.failure(
//         'Oops! Something went wrong! Try reloading the page!'
//       );
//     });
// }

// function markupGallery(arrayHits) {
//   let strHTML = ``;

//   arrayHits.forEach(hit => {
//     let strMarkup = `<div class="photo-card">
//  <a href="${hit.largeImageURL}"><img src="${hit.webformatURL}" alt="${hit.type}" loading="lazy" /></a>
//   <div class="info">
//     <p class="info-item">
//       <b>Likes ${hit.likes}</b>
//     </p>
//     <p class="info-item">
//       <b>Views ${hit.views}</b>
//     </p>
//     <p class="info-item">
//       <b>Comments ${hit.comments}</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads ${hit.downloads}</b>
//     </p>
//   </div>
// </div>`;
//     strHTML += strMarkup;
//   });
//   galleryEl.insertAdjacentHTML('beforeend', strHTML);
// }

// function infityScroll() {
//   // if (isEndOfCollection) {
//   //   Notiflix.Notify.failure(
//   //     "We're sorry, but you've reached the end of search results."
//   //   );
//   //   console.log(123);
//   //   return;
//   // }

//   const endOfPage =
//     window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

//   if (!endOfPage) {
//     return;
//   }
//   page += 1;

//   const valueInputUser = searchQueryEl.value;
//   fetchHits(valueInputUser, page)
//     .then(responData => {
//       if (valueInputUser.trim() === '' || responData.total === 0) {
//         Notiflix.Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//         return;
//       }

//       // console.log(responData.hits.length);

//       // if (responData.hits.length === 0) {
//       //   isEndOfCollection = true;
//       //   console.log(responData.hits.length);
//       //   window.removeEventListener('scroll', throttle(infityScroll, 500));
//       //   Notiflix.Notify.failure(
//       //     "We're sorry, but you've reached the end of search results."
//       //   );
//       //   return;
//       // }

//       markupGallery(responData.hits.length);
//       let gallery = new SimpleLightbox('.gallery a');
//     })
//     .catch(error => {
//       Notiflix.Notify.failure(
//         'Oops! Something went wrong! Try reloading the page!'
//       );
//     });
// }
