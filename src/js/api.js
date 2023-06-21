import axios from 'axios';

const API_KEY = '10288621-f6b00deda1a1cc64bb1ecec3b';

const BASE_URL =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal&safesearch=true';

export async function fetchHits(nameHits, page = 1, perPage) {
  const responseHits = await axios.get(
    `${BASE_URL}&q=${nameHits}&key=${API_KEY}&page=${page}&per_page=${perPage}`
  );

  return responseHits.data;
}
