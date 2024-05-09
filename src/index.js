const inputText = document.querySelector('#search-box');
// Pole tekstowe, gdzie użytkownik wprowadza nazwę kraju
const countryList = document.querySelector('.country-list');
// Lista krajów, która będzie wyświetlana pod polem tekstowym
const countryInfo = document.querySelector('.country-info');
// Element, w którym wyświetlone będą szczegółowe informacje o wybranym kraju

import debounce from 'lodash.debounce';
// Import funkcji debounce z pakietu lodash.debounce, która umożliwia opóźnienie wywołania funkcji obsługującej zdarzenie
import { Notify } from 'notiflix';
// Import klasy Notify z notiflix, która umożliwia wyświetlanie powiadomień na stronie

const debounce_delay = 400;
// Określenie wartości opóźnienia debounce (400ms)

const clearMarkup = ref => (ref.innerHTML = '');
// funkcja clearMarkup, która usuwa zawartość danego elementu HTML

// Funkcja obsługująca zdarzenie input z opóźnieniem
const inputHandler = debounce(txt => {
  const textInput = txt.target.value.trim();
  // Pobranie wprowadzonego tekstu z pola tekstowego i usunięcie białych znaków z początku i końca

  if (!textInput) {
    // Sprawdzenie, czy wprowadzony tekst nie jest pusty
    clearMarkup(countryList); // Usunięcie zawartości listy krajów
    clearMarkup(countryInfo); // Usunięcie zawartości informacji o kraju
    return; // Zakończenie funkcji
  }

  handleSearch(textInput); // Wywołanie funkcji handleSearch, która wyszukuje kraje na podstawie wprowadzonej nazwy
}, 300); // Opóźnienie debounce (300ms)

// Funkcja wyszukująca kraje na podstawie wprowadzonej nazwy
import { fetchCountries } from './fetchCountries';
async function handleSearch(name) {
  try {
    const countries = await fetchCountries(name);
    // Wysłanie żądania do API w celu pobrania danych o krajach na podstawie wprowadzonej nazwy

    if (countries.length > 10) {
      // Sprawdzenie, czy liczba znalezionych krajów przekracza 10
      clearMarkup(countryList);
      clearMarkup(countryInfo);
      Notify.info('Too many matches found. Please enter a more specific name.');
      // Wyświetlenie powiadomienia informującego o zbyt dużej liczbie znalezionych krajów
    } else if (countries.length <= 10) {
      displayCountries(countries); // Wyświetlenie listy krajów
    } else if (countries.length === 1) {
      displayCountryInfo(countries[0]); // Wyświetlenie szczegółowych informacji o jednym kraju
    }
  } catch (error) {
    Notify.failure('Oops, there is no country with that name.');
    // Wyświetlenie powiadomienia informującego o braku kraju o podanej nazwie
  }
}
// Funkcja tworząca listę krajów
function displayCountries(countries) {
  clearMarkup(countryList);
  clearMarkup(countryInfo);
  countries.forEach(country => {
    const li = document.createElement('li'); // Utworzenie elementu listy
    li.textContent = country.name.official; // Ustawienie tekstu elementu listy na nazwę oficjalną kraju
    li.addEventListener('click', () => displayCountryInfo(country));
    // Dodanie nasłuchiwania na kliknięcie, które wyświetli szczegółowe informacje o kraju
    countryList.appendChild(li); // Dodanie elementu listy do listy krajów
  });
}
// Funkcja wyświetlająca szczegółowe informacje o kraju
function displayCountryInfo(country) {
  clearMarkup(countryInfo);

  const div = document.createElement('div'); // Utworzenie elementu div
  const languages = country.languages; // Pobranie języków kraju

  let languagesString = ''; // Inicjalizacja ciągu znaków na listę języków

  // Iteracja po kluczach i wartościach obiektu country.languages
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

  countryInfo.appendChild(div); // Dodanie informacji o kraju do elementu .country-info
}
// Dodanie nasłuchiwania zdarzenia input na polu tekstowym z opóźnieniem debounce
inputText.addEventListener('input', debounce(inputHandler, debounce_delay));
