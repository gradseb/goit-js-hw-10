const inputText = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const debounce = require('lodash.debounce');
const notiflix = require('notiflix');

const clearMarkup = ref => (ref.innerHTML = '');

const inputHandler = debounce(txt => {
  const textInput = txt.target.value.trim();

  if (!textInput) {
    clearMarkup(countryList);
    clearMarkup(countryInfo);
    return;
  }

  handleSearch(textInput);
}, 300);

inputText.addEventListener('input', inputHandler);

const { fetchCountries } = require('./fetchCountries');
async function handleSearch(countryName) {
  try {
    const countries = await fetchCountries(countryName);

    if (countries.length > 10) {
      notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    } else if (countries.length <= 10) {
      displayCountries(countries);
    } else if (countries.length === 1) {
      displayCountryInfo(countries[0]);
    }
  } catch (error) {
    notiflix.Notify.failure('Oops, there is no country with that name.');
  }
}

function displayCountries(countries) {
  clearMarkup(countryList);
  countries.forEach(country => {
    const li = document.createElement('li');
    li.textContent = country.name.official;
    li.addEventListener('click', () => displayCountryInfo(div.innerHTML));
    countryList.appendChild(li);
  });
}

function displayCountryInfo(country) {
  clearMarkup(countryInfo);
  const div = document.createElement('div');
  div.innerHTML = `
        <h2>${country.name.official}</h2>
        <p>Capital: ${country.capital}</p>
        <p>Population: ${country.population}</p>
        <img src="${country.flags.png}" alt="Flag of ${country.name.official}">
        <p>Languages: ${Object.values(languages)}</p>
        `;
  countryInfo.appendChild(div);
}
