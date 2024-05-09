const inputText = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const debounce_delay = 400;

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

import { fetchCountries } from './fetchCountries';
async function handleSearch(name) {
  try {
    const countries = await fetchCountries(name);

    if (countries.length > 10) {
      clearMarkup(countryList);
      clearMarkup(countryInfo);
      Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (countries.length <= 10) {
      displayCountries(countries);
    } else if (countries.length === 1) {
      displayCountryInfo(countries[0]);
    }
  } catch (error) {
    Notify.failure('Oops, there is no country with that name.');
  }
}

function displayCountries(countries) {
  clearMarkup(countryList);
  countries.forEach(country => {
    const li = document.createElement('li');
    li.textContent = country.name.official;
    li.addEventListener('click', () => displayCountryInfo(country));
    countryList.appendChild(li);
  });
}

function displayCountryInfo(country) {
  clearMarkup(countryInfo);
  const div = document.createElement('div');
  const languages = country.languages;

  let languagesString = '';

  // Iterujemy po kluczach i wartościach obiektu country.languages
  for (const lang in languages) {
    // Dodajemy nazwę języka do ciągu znaków
    languagesString += `${languages[lang]} `;
  }
  div.innerHTML = `
    <h2>${country.name.official}</h2>
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <img src="${country.flags.png}" 
    alt="Flag of ${country.name.official}" width="200" height="100">
    <p>Languages: ${languagesString}</p>
  `;

  countryInfo.appendChild(div);
}

inputText.addEventListener('input', debounce(inputHandler, debounce_delay));
