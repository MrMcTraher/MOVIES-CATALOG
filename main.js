//настройки
const apiKey = "9845e7d9-ec64-47f2-882d-8bb556659ef3";
const url = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

const options = {
  method: "GET",
  headers: {
    "X-API-KEY": apiKey,
    "Content-Type": "application/json",
  },
};

//DOM элементы
const filmsWrapper = document.querySelector(".films");
const loader = document.querySelector(".loader-wrapper");
const btnShowMore = document.querySelector(".show-more");

btnShowMore.onclick = fetchAndRenderFilms;

//Получение и вывод TOP 250 фильмов
async function fetchData(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

let page = 1;

async function fetchAndRenderFilms() {
  //Show preloader
  loader.classList.remove("none");

  //fetch films data
  /* ?type=CLOSES_RELEASES  === для проверки и смены топа фильмов  */
  const data = await fetchData(url + `collections?page=${page}`, options);
  console.log(data);
  if (data.totalPages > 1) page++;

  //Проверка на доп. страницы и отображние кнопки + отображаем кнопку
  //если страниц больше чем одна
  if (data.totalPages > 1) {
    btnShowMore.classList.remove("none");
  }

  //hide preloader
  loader.classList.add("none");

  //Render films on page
  renderFilms(data.items);

  //Если следующая страница больше общего количества страниц
  //нам необходимо скрыть кнопку, соответственно скрываем
  //кнопку когда находимся на последней странице
  if (page > data.totalPages) btnShowMore.classList.add("none");
}

function renderFilms(films) {
  for (let film of films) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = film.kinopoiskId;

    card.onclick = openFilmDetails;

    const html = `
				<img class="card__img" src=${film.posterUrlPreview} alt="Cover">
				<h3 class="card__title">${film.nameRu}</h3>
				<p class="card__year">${film.year}</p>
				<p class="card__raiting">${film.ratingKinopoisk}</p>
			`;

    card.insertAdjacentHTML("afterbegin", html);

    filmsWrapper.insertAdjacentElement("beforeend", card);
  }
}

async function openFilmDetails(e) {
  //Достаем id фильма
  const id = e.currentTarget.id;
  console.log(id);
  //Получаем данные фильма
  const data = await fetchData(url + id, options);
  console.log(data);

  //отобразить детали фильма на странице
  renderFilmData(data);
}

function renderFilmData(film) {
  console.log("RENDER FILMS");

  //Проверка на открытый фильм и его удаление
  if (document.querySelector(".container-right"))
    document.querySelector(".container-right").remove();

  //1. Отрендерить container-right
  const containerRight = document.createElement("div");
  containerRight.classList.add("container-right");
  document.body.insertAdjacentElement("beforeend", containerRight);

  //2. Кнопка закрытия
  const btnClose = document.createElement("button");
  btnClose.classList.add("btn-close");

  const img = document.createElement("img");
  img.src = "./img/cross.svg";
  img.width = "24";
  img.alt = "close";

  btnClose.insertAdjacentElement("afterbegin", img);
  containerRight.insertAdjacentElement("beforeend", btnClose);

  console.log(containerRight);
  //2.1 Кнопка закрытия по клику - удаление контейнера со страницы
  btnClose.onclick = () => containerRight.remove();
  //3. Детали фильма
  const html = `
	<div class="film">
			<div class="film__title">
				${film.nameRu}
			</div>
			<div class="film__img">
				<img src=${film.posterUrlPreview} alt=${film.nameRu}>
			</div>
			<div class="film__desc">
				<p class="film__details">Год: ${film.year}</p>
				<p class="film__details">Рейтинг: ${film.ratingKinopoisk}</p>
				<p class="film__details">Продолжительность: ${formatTime(film.filmLength)}</p>
				<p class="film__details">Страна:${renderСountries(film.countries)}</p>
				<p class="film__text">${film.description}</p>
			</div>
		</div>`;
  containerRight.insertAdjacentHTML("beforeend", html);
}

function formatTime(filmLength) {
  let length = "";
  const hours = Math.floor(filmLength / 60);
  const minutes = filmLength % 60;
  if (hours > 0) length += hours + " ч. ";
  if (minutes > 0) length += minutes + " мин.";
  return length;
}

console.log(formatTime(141));

function renderСountries(countriesArray) {
  return countriesArray.map((country) => country.country).join(", ");
}

console.log(
  renderСountries([
    { country: "Belarus" },
    { country: "Russia" },
    { country: "China" },
  ])
);

fetchAndRenderFilms().catch((err) => console.log(err + "ERROR!!!"));
