'use strict';

import { data } from './db_cities.js';
const dataRU = data.RU;
const input = document.getElementById('select-cities');
const listDefault = document.querySelector('.dropdown-lists__list--default');
const listSelect = document.querySelector('.dropdown-lists__list--select');
const listAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete');
// console.log(dataRU);


// 1. default - список стран и тор3 городов
const renderDefault = () => {

    const getDataDefault = () => {
        const arr = JSON.parse(JSON.stringify(dataRU));
        for (const item of arr) {
            item.cities = item.cities.sort((a, b) => +a.count > +b.count ? -1 : 1).splice(0, 3);
        }
        return arr;
    };

    const data = getDataDefault();
    // console.log(data);
    data.forEach((item, i) => {
        const div = document.createElement('div');
        div.classList.add('dropdown-lists__countryBlock');
        // div.dataset.countryNum = i;
        div.insertAdjacentHTML('beforeend', `<div class="dropdown-lists__total-line" data-country-num="${i}">
                            <div class="dropdown-lists__country">${item.country}</div>
                            <div class="dropdown-lists__count">${item.count}</div>
                            </div>`);   
        
        for (const city of item.cities) {
            div.insertAdjacentHTML('beforeend', `<div class="dropdown-lists__line">
                            <div class="dropdown-lists__city">${city.name}</div>
                            <div class="dropdown-lists__count">${city.count}</div>
                            </div>`);   
        }
        listDefault.insertAdjacentElement('beforeend', div);
    });

    // input.addEventListener('blur', () => {
        //     listDefault.style.display = 'none';
        // });
    };
renderDefault();


// 2. select - информация о всех городах выбранной страны
const renderSelect = (num) => {
    const data = dataRU[num];
    console.log(data);
    listSelect.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('dropdown-lists__countryBlock');
    div.insertAdjacentHTML('beforeend', `<div class="dropdown-lists__total-line">
                        <div class="dropdown-lists__country">${data.country}</div>
                        <div class="dropdown-lists__count">${data.count}</div>
                        </div>`);   
    
    for (const city of data.cities) {
        div.insertAdjacentHTML('beforeend', `<div class="dropdown-lists__line">
                        <div class="dropdown-lists__city">${city.name}</div>
                        <div class="dropdown-lists__count">${city.count}</div>
                        </div>`);   
    }
    listSelect.insertAdjacentElement('beforeend', div);
};

input.addEventListener('focus', () => {
    listDefault.style.display = 'block';
    listSelect.style.display = 'none';
    listAutocomplete.style.display = 'none';
});
listDefault.addEventListener('click', (e) => {
    console.log(e.target.closest('.dropdown-lists__total-line').dataset.countryNum);
    listDefault.style.display = 'none';
    listSelect.style.display = 'block';

    renderSelect(e.target.closest('.dropdown-lists__total-line').dataset.countryNum);
});
listSelect.addEventListener('click', (e) => {
    if (e.target.closest('.dropdown-lists__total-line')) {
        listDefault.style.display = 'block';
        listSelect.style.display = 'none';
    }
});

const render = (elem, data) => {
    console.log(data);
    elem.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('dropdown-lists__countryBlock');
    elem.insertAdjacentElement('beforeend', div);
    if (data.length === 0) {
        div.insertAdjacentText('beforeend', 'Ничего не найдено');
        return;
    }
    data.forEach((item, i) => {
        div.insertAdjacentHTML('beforeend', `<div class="dropdown-lists__total-line">
                            <div class="dropdown-lists__country">${item.country}</div>
                            <div class="dropdown-lists__count">${item.count}</div>
                            </div>`);   
        
        for (const city of item.cities) {
            div.insertAdjacentHTML('beforeend', `<div class="dropdown-lists__line">
                            <div class="dropdown-lists__city">${city.name}</div>
                            <div class="dropdown-lists__count">${city.count}</div>
                            </div>`);   
        }
        // elem.insertAdjacentElement('beforeend', div);
    });
}
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

        render(listAutocomplete, data);
    } else {
        listDefault.style.display = 'block';
        listSelect.style.display = 'none';
        listAutocomplete.style.display = 'none';
    }
}
// 3. Автозаполнение
input.addEventListener('input', (e) => {
    autocomplite(e.target.value.trim().toLowerCase());
});

