import { fetchHits } from './api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchQueryEl = document.querySelector('[name="searchQuery"]');
const submitBtnEl = document.querySelector('[type="submit"]');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

submitBtnEl.addEventListener('click', clickOnSubmit);

function clickOnSubmit(e) {
  e.preventDefault();
  const valueInputUser = searchQueryEl.value;
  const arrayHits = fetchHits(valueInputUser)
    .then(responData => {
      data = responData.hits;
      if (valueInputUser.trim() !== '') {
        console.log(responData);
        booleanResultAPI(data);
        markupGallery(data);
        let gallery = new SimpleLightbox('.gallery a');
        Notiflix.Notify.success(
          `Hooray! We found ${responData.totalHits} images.`
        );
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
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
 <a href="${hit.largeImageURL}"> <img src="${hit.webformatURL}" alt=">${hit.type}" loading="lazy" /></a>
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
  galleryEl.innerHTML = strHTML;
}

function booleanResultAPI(arrayHits) {
  if (arrayHits.length > 0) {
    loadMoreBtnEl.classList.remove('hidden');
    return;
  } else {
    loadMoreBtnEl.classList.add('hidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
