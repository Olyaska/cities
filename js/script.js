'use strict';
const url = './js/db_cities.json';
const outputData = (data) => {
    console.log(data);
};
// 1. XMLHttpRequest
const getData1 = (url, outputData) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();
    request.addEventListener('readystatechange', e => {
        if (request.readyState !== 4) {
            return;
        }
        if (request.status === 200) {
    
            const response = JSON.parse(request.responseText);
            outputData(response);    // <--- получили данные   
        } else {
            console.log(request.status);                   
        }
    });
};
getData1(url, outputData);
// 2. + Promise
const getData2 = (url) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send();
        request.addEventListener('readystatechange', e => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {        
                const response = JSON.parse(request.responseText);
                resolve(response);    // функция при успехе   
            } else {
                reject(request.status);  // при ошибке              
            }
        });
    });
};
getData2(url) // запустить ф, возвр промис
    .then(outputData) //resolve - обработать промис функцией outputData
    .catch(error => console.error(error)); //reject
// 3 Fetch
fetch(url).
    then((response) => {
        if (response.status !== 200) {
            throw new Error('Status network not 200');
        }
        console.log(response); //body  ответ от сервера
        // console.log(response.text()); //получили промис в виде строки
        return response.json(); //получили промис в виде json
    })
    .then((response) => {
        outputData(response);
    })
    .catch((error) => console.error(error));
const getData3 = () => {
    return fetch(url); // возвращает промис
}

// const postData = (body) => {
    // fetch('./db_cities.json').
    //     then((response) => {
    //         console.log(response);
    //     })

// };
// const getData = () => { 
//     return new Promise((resolve, reject) => {
//         const request = new XMLHttpRequest();
//         request.open('GET', './js/db_cities.json');
//         request.setRequestHeader('Content-Type', 'application/json');
//         request.send();
//         request.addEventListener('readystatechange', e => {
//             if (request.readyState !== 4) {
//                 return;
//             }
//             if (request.status === 200) {
//                 document.querySelector('.loading-spinner').style.display = 'none';
//                 document.querySelector('.input-cities').style.display = 'block';
//                 const data = JSON.parse(request.responseText);
//                 return data;       
//             } else {
//                 console.log(request.status);                   
//             }
//         });
//     })
// };
/*
        document.querySelector('.loading-spinner').style.display = 'none';
        document.querySelector('.input-cities').style.display = 'block';
const data = getData();
console.log(data);
const dataRU = data.RU;
const input = document.getElementById('select-cities');
const label = document.querySelector('.label');
const listDefault = document.querySelector('.dropdown-lists__list--default');
const listSelect = document.querySelector('.dropdown-lists__list--select');
const listAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete');
const dropdown = document.querySelector('.dropdown');
const btnX = document.querySelector('.close-button');
const btnGo = document.querySelector('.button');

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
const clearInput = () => {
    input.value = '';
    label.textContent = 'Страна или город';
    btnX.style.display = 'none';
    btnGo.href = '#';
    btnGo.disabled = 'true';
}
input.addEventListener('focus', () => {
    listDefault.style.display = 'block';
    listSelect.style.display = 'none';
    listAutocomplete.style.display = 'none';
});
input.addEventListener('input', (e) => {
    autocomplite(e.target.value.trim().toLowerCase());
});

dropdown.addEventListener('click', (e) => {
    if (e.target.closest('.dropdown-lists__list--default')) {
        const clickCountry = e.target.closest('.dropdown-lists__total-line');
        if (clickCountry) {
            listDefault.style.display = 'none';
            listSelect.style.display = 'block';
        
            renderSelect(clickCountry.dataset.countryNum);
        }
    }

    if (e.target.closest('.dropdown-lists__list--select')) {
        if (e.target.closest('.dropdown-lists__total-line')) {
            listDefault.style.display = 'block';
            listSelect.style.display = 'none';
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
    listDefault.style.display = 'block';
    listSelect.style.display = 'none';
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
renderDefault();
*/