'use strict';

import { data } from './db_cities.js';
const dataRU = data.RU;
const input = document.getElementById('select-cities');
const label = document.querySelector('.label');
const listDefault = document.querySelector('.dropdown-lists__list--default');
const listSelect = document.querySelector('.dropdown-lists__list--select');
const listAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete');
const dropdown = document.querySelector('.dropdown');
const btnX = document.querySelector('.close-button');
const btnGo = document.querySelector('.button');
// console.log(dataRU);

const renderCountry = (div, countryObj, i) => {
    div.insertAdjacentHTML('beforeend', `<div class="dropdown-lists__total-line" ${String(i) ?  'data-country-num="'+i+'"' : ''}>
                        <div class="dropdown-lists__country">${countryObj.country}</div>
                        <div class="dropdown-lists__count">${countryObj.count}</div>
                        </div>`);   
    
    for (const city of countryObj.cities) {
        div.insertAdjacentHTML('beforeend', `<div class="dropdown-lists__line">
                        <div class="dropdown-lists__city">${city.name}</div>
                        <div class="dropdown-lists__count">${city.count}</div>
                        </div>`);   
    }
};
// 1. default - список стран и тор3 городов
const renderDefault = () => {
    const getDataDefault = () => {
        const arr = JSON.parse(JSON.stringify(dataRU));
        for (const item of arr) {
            item.cities = item.cities.sort((a, b) => +a.count > +b.count ? -1 : 1).splice(0, 3);
        }
        return arr;
    };

    const div = document.createElement('div');
    div.classList.add('dropdown-lists__countryBlock');
    listDefault.insertAdjacentElement('beforeend', div);
    const data = getDataDefault();
    data.forEach((item, i) => {
        renderCountry(div, item, i);
    });
};

// 2. select - информация о всех городах выбранной страны
const renderSelect = (num) => {
    const data = dataRU[num];
    listSelect.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('dropdown-lists__countryBlock');
    renderCountry(div, data);
    listSelect.insertAdjacentElement('beforeend', div);
};

// 3. Автозаполнение
const renderAutocomplite = (elem, data) => {
    elem.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('dropdown-lists__countryBlock');
    elem.insertAdjacentElement('beforeend', div);
    if (data.length === 0) {
        div.insertAdjacentText('beforeend', 'Ничего не найдено');
        return;
    }
    data.forEach((item) => {
        renderCountry(div, item);
    });
};
const autocomplite = (value) => {
    if (value) {
        listDefault.style.display = 'none';
        listSelect.style.display = 'none';
        listAutocomplete.style.display = 'block';

        const getDataAutocomplite = (value) => {
            let arr = JSON.parse(JSON.stringify(dataRU));
            
            arr.forEach(item => {
                item.cities = item.cities.filter(city => city.name.toLowerCase().indexOf(value) === 0);
            });
            arr = arr.filter(item => item.cities.length !== 0 || item.country.toLowerCase().indexOf(value) === 0);
            return arr;
        };
        const data = getDataAutocomplite(value);

        renderAutocomplite(listAutocomplete, data);
    } else {
        listDefault.style.display = 'block';
        listSelect.style.display = 'none';
        listAutocomplete.style.display = 'none';
    }
};
const findLink = (cityClicked) => {
    for (const item of dataRU) {
        for (const city of item.cities) {
            if (city.name === cityClicked) {
                return city.link;
            }
        }
    }
};

input.addEventListener('focus', () => {
    listDefault.style.display = 'block';
    listSelect.style.display = 'none';
    listAutocomplete.style.display = 'none';
});

listDefault.addEventListener('click', (e) => {
    const clickCountry = e.target.closest('.dropdown-lists__total-line');
    if (clickCountry) {
        listDefault.style.display = 'none';
        listSelect.style.display = 'block';
    
        renderSelect(clickCountry.dataset.countryNum);
    }
});

listSelect.addEventListener('click', (e) => {
    if (e.target.closest('.dropdown-lists__total-line')) {
        listDefault.style.display = 'block';
        listSelect.style.display = 'none';
    }
});

input.addEventListener('input', (e) => {
    autocomplite(e.target.value.trim().toLowerCase());
});

dropdown.addEventListener('click', (e) => {
    if (e.target.closest('.dropdown-lists__line')) {
        const city = e.target.closest('.dropdown-lists__line').firstElementChild.textContent;
        label.textContent = '';
        input.value = e.target.closest('.dropdown-lists__line').firstElementChild.textContent;
        btnX.style.display = 'block';
    
        btnGo.disabled = 'false';
        btnGo.href = findLink(city);
    }
});

btnX.addEventListener('click', () => {
    input.value = '';
    label.textContent = 'Страна или город';
    btnX.style.display = 'none';
    btnGo.href = '#';
    btnGo.disabled = 'true';
});

renderDefault();