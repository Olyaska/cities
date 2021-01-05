'use strict';
const url = './js/db_cities.json';
const input = document.getElementById('select-cities');
const label = document.querySelector('.label');
const wrap = document.querySelector('.wrap');
const listDefault = document.querySelector('.dropdown-lists__list--default');
const listSelect = document.querySelector('.dropdown-lists__list--select');
const listAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete');
const dropdown = document.querySelector('.dropdown');
const btnX = document.querySelector('.close-button');
const btnGo = document.querySelector('.button');

const getData = () => { 
    fetch(url).
    then((response) => {
        if (response.status !== 200) {
            throw new Error('Status network not 200');
        }
        return response.json(); 
    })
    .then((response) => {
        renderDefault(response.RU);
        document.querySelector('.loading-spinner').style.display = 'none';
        document.querySelector('.input-cities').style.display = 'block';
        localStorage.setItem('cities', JSON.stringify(response.RU));
    })
    .catch((error) => console.error(error));
};

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

const renderDefault = (data) => {
    const getDataDefault = () => {
        for (const item of data) {
            item.cities = item.cities.sort((a, b) => +a.count > +b.count ? -1 : 1).splice(0, 3);
        }
        return data;
    };

    const div = document.createElement('div');
    div.classList.add('dropdown-lists__countryBlock');
    listDefault.insertAdjacentElement('beforeend', div);
    const dataDefault = getDataDefault();
    dataDefault.forEach((item, i) => {
        renderCountry(div, item, i);
    });
};

const renderSelect = (num) => {
    const data = JSON.parse(localStorage.getItem('cities'))[num];
    listSelect.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('dropdown-lists__countryBlock');
    renderCountry(div, data);
    listSelect.insertAdjacentElement('beforeend', div);
};

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

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(response => {
            let arr = response.RU;
            arr.forEach(item => {
                item.cities = item.cities.filter(city => city.name.toLowerCase().indexOf(value) === 0);
            });
            arr = arr.filter(item => item.cities.length !== 0 || item.country.toLowerCase().indexOf(value) === 0);

            renderAutocomplite(listAutocomplete, arr);
        });

    } else {
        listDefault.style.display = 'block';
        listSelect.style.display = 'none';
        listAutocomplete.style.display = 'none';
    }
};

const findLink = (cityClicked) => {
    const data = JSON.parse(localStorage.getItem('cities'))
    for (const item of data) {
        for (const city of item.cities) {
            if (city.name === cityClicked) {
                return city.link;
            }
        }
    }
};

const animationSlide = (direction) => {
    let count = 0,
        animInterval;

    const animation = () => {
        animInterval = requestAnimationFrame(animation);
        if (direction === 'left') {
            count = count - 8;
            if (count > -420) {
                wrap.style.marginLeft = count + 'px';
            } else {
                cancelAnimationFrame(animInterval);
            }
        } else {
            count = parseInt(wrap.style.marginLeft);
            count = count + 8;
            if (count < 0) {
                wrap.style.marginLeft = count + 'px';
            } else {
                wrap.style.marginLeft = 0;
                cancelAnimationFrame(animInterval);
            }
        }
    };
    animInterval = requestAnimationFrame(animation);
};

const clearInput = () => {
    input.value = '';
    label.textContent = 'Страна или город';
    btnX.style.display = 'none';
    btnGo.href = '#';
    btnGo.disabled = 'true';
};

input.addEventListener('focus', () => {
    listDefault.style.display = 'block';
    listSelect.style.display = 'block';
    listAutocomplete.style.display = 'none';
});
input.addEventListener('input', (e) => {
    autocomplite(e.target.value.trim().toLowerCase());
});

dropdown.addEventListener('click', (e) => {
    if (e.target.closest('.dropdown-lists__list--default')) {
        const clickCountry = e.target.closest('.dropdown-lists__total-line');
        if (clickCountry) {
            animationSlide('left');
            renderSelect(clickCountry.dataset.countryNum);
        }
    }

    if (e.target.closest('.dropdown-lists__list--select')) {
        if (e.target.closest('.dropdown-lists__total-line')) {
            animationSlide('right');
        }
    }

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
    clearInput();
    if (parseInt(wrap.style.marginLeft)) {
        animationSlide('right');
    }
    listAutocomplete.style.display = 'none';
});

document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('main')) {
        clearInput();
        listDefault.style.display = 'none';
        listSelect.style.display = 'none';
        listAutocomplete.style.display = 'none';
    }
});

getData();