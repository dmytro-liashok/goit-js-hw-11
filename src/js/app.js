import { fetchHits } from './api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import simpleLightbox from 'simplelightbox';

const searchQueryEl = document.querySelector('[name="searchQuery"]');
const submitBtnEl = document.querySelector('[type="submit"]');
const galleryEl = document.querySelector('.gallery');

let page = 1;
let perPage = 100;
let isEndOfCollection = false;
let gallery;

let scrollHandler = throttle(infityScroll, 500);

submitBtnEl.addEventListener('click', clickOnSubmit);

function clickOnSubmit(e) {
  page = 1;
  e.preventDefault();
  const valueInputUser = searchQueryEl.value;
  galleryEl.innerHTML = '';

  fetchHits(valueInputUser, page, perPage)
    .then(responData => {
      if (valueInputUser.trim() === '' || responData.total === 0) {
        notifErorNoImages();
        return;
      }

      buildGalery(responData.hits);

      Notiflix.Notify.success(
        `Hooray! We found ${responData.totalHits} images.`
      );
      isEndOfCollection = false;
      window.addEventListener('scroll', scrollHandler);
    })
    .catch(error => {
      notifErrorApi();
    });
}

function infityScroll() {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

  if (endOfPage && isEndOfCollection) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    window.removeEventListener('scroll', scrollHandler);
    return;
  }

  if (!endOfPage) {
    return;
  }

  page += 1;

  const valueInputUser = searchQueryEl.value;

  fetchHits(valueInputUser, page, perPage)
    .then(responData => {
      if (valueInputUser.trim() === '' || responData.totalHits === 0) {
        notifErorNoImages();
        return;
      }
      if (gallery) {
        gallery.destroy();
      }

      buildGalery(responData.hits);

      if (responData.totalHits <= galleryEl.childElementCount) {
        isEndOfCollection = true;
        return;
      }
    })
    .catch(error => {
      notifErrorApi();
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

function notifErrorApi() {
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page!'
  );
}

function notifErorNoImages() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function buildGalery(dataHits) {
  markupGallery(dataHits);
  gallery = new SimpleLightbox('.gallery a');
}
