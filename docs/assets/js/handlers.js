// 6xN array of type:
// [
//     [Name, AI Score, Chances of Selection, Funding, Link1, Link2],
//     [Name, AI Score, Chances of Selection, Funding, Link1, Link2],
//     [Name, AI Score, Chances of Selection, Funding, Link1, Link2]
// ]

const getRecommendations = () => {
    let _cats = document.querySelectorAll('label[for="chips-input-cat-ind"] > span.valid-chip-data');
    let cats = Array.prototype.slice.call(_cats).map(ele => {
        return ele.innerText.slice(0, ele.innerText.length - 1);
    });
    let profile = 'https://www.linkedin.com/company/' + document.getElementById('basic-url').value;
    if (profile === 'https://www.linkedin.com/company/') {
        alert('Please enter company profile link.');
        return;
    } else if (cats.length === 0) {
        alert('Please select at least one category.');
        return;
    } else if (document.querySelectorAll('label[for="chips-input-cat-ind"] > span.invalid-chip-data').length > 0) {
        alert('Please remove invalid categories.')
        return;
    } else if (document.querySelectorAll('label[for="chips-input-loc"] > span.invalid-chip-data').length > 0) {
        alert('Please remove invalid locations.')
        return;
    }

    $.ajax({
        url: 'https://api.inqb8r.tech/getResult/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            profile: profile,
            categories: cats[0],
        }),
        dataType: 'json',

        statusCode: {
            404: () => {
                alert('error');
            },
            200: (res) => {
                const incubators = res.incubators;
                // console.log(res);
                let incubatorList = [];
                // console.log(incubatorList);
                for (const inc in incubators) {
                    let incubator = incubators[inc];
                    let thisIncubator = {};
                    thisIncubator['name'] = incubator.incubator_name;
                    thisIncubator['sf_score'] = incubator.seed_funding_score;
                    thisIncubator['pa_score'] = incubator.physical_amenities;
                    thisIncubator['t_score'] = incubator.talent_score;
                    thisIncubator['ff_score'] = incubator.further_funding;
                    thisIncubator['link1'] = incubator.application;
                    thisIncubator['link2'] = incubator.application;
                    thisIncubator['city'] = incubator.city_name;
                    incubatorList.push(thisIncubator);
                    // { 'name': 'name1', 'sf_score': 10, 'pa_score': 20, 't_score': 30, 'ff_score': 40, 'link1': 'link1', 'link2': 'link2', 'city': 'city1' },
                }
                generateCustomCards(incubatorList.splice(0, 3));
            },
            500: () => {
                alert('error');
            }
        }
    });

};

const generateCustomCards = (params) => {
    let modalBody = document.querySelector('div.modal-dialog[role=document] div.modal-body div.custom-card-wrapper');
    let template = document.querySelector('#custom-card-template');

    let _cities = new Set();

    for (const incubator of params) {
        let clone = template.content.cloneNode(true);
        let dataFields = clone.querySelectorAll('div.custom-card-data');
        let title = clone.querySelector('.custom-card-header');
        let arrow = clone.querySelector('img');

        title.innerHTML = `<a href='${incubator.link1}' target="_blank">${incubator.name}</a>`;
        dataFields[0].innerHTML = incubator.sf_score;
        dataFields[2].innerHTML = incubator.pa_score;
        dataFields[4].innerHTML = incubator.t_score;
        dataFields[6].innerHTML = incubator.ff_score;
        arrow.addEventListener('click', () => {
            window.open(incubator.link2, '_blank');
        });

        modalBody.appendChild(clone);
        modalBody.lastElementChild.setAttribute('city', incubator.city);
        _cities.add(incubator.city);
    }

    let locationFilter = document.getElementById('location-filter');
    let cities = [..._cities].sort();
    cities.forEach(city => {
        let location = document.createElement('option');
        location.value = city;
        location.innerText = city;
        locationFilter.appendChild(location);
    });
};

const handleModalClose = () => {
    $('#perfectIncubatorModal').on('hidden.bs.modal', (e) =>
        $('#perfectIncubatorModal div.custom-card').each((index, element) => element.remove())
    );
};
handleModalClose();

const cityFilterChange = (selectElement) => {
    const city = selectElement.value;
    // console.log(city);
    let cards = document.querySelector('div.modal-dialog[role=document] div.modal-body div.custom-card-wrapper').children;

    if (city === 'Location Filter') {
        for (const card of cards)
            card.style.display = '';
        return;
    }

    for (const card of cards) {
        if (card.getAttribute('city') !== city)
            card.style.display = 'none';
        else
            card.style.display = '';
    }
};

function addChips(e, categoryLocation = 'category') {
    let val = e.value;
    if (val === '') return;
    // if (val.slice(-1) === ' ' && val.trim().length > 0) {
    // console.log(val);
    let ele = e.parentElement;
    let tb = ele.querySelector('input');
    let chip = document.createElement('span');
    let cross = document.createElement('a');
    cross.onclick = (e) => {
        e.target.parentElement.remove();
    };

    chip.innerHTML = val.trim();
    cross.innerHTML = 'x';
    chip.appendChild(cross);
    if (categoryLocation === 'category')
        chip.classList.add(getCategoriesValidatedColor(val.trim()))
    else
        chip.classList.add(getLocationValidatedColor(val.trim()))

    ele.insertBefore(chip, tb);

    e.value = '';
    // }
}
document.getElementById('chips-input-cat-ind').addEventListener('keydown', (e) => {
    if (e.key === 13 || e.keyCode === 13) {
        e.preventDefault();
        addChips(e.target, 'category');
    }
});
document.getElementById('chips-input-loc').addEventListener('keydown', (e) => {
    if (e.key === 13 || e.keyCode === 13) {
        e.preventDefault();
        addChips(e.target, 'location');
    }
});
document.getElementById('chips-input-cat-ind').addEventListener('change', (e) => {
    e.preventDefault();
    addChips(e.target, 'category');
});
document.getElementById('chips-input-loc').addEventListener('change', (e) => {
    e.preventDefault();
    addChips(e.target, 'location');
});
// document.getElementById('chips-input-cat-ind').onchange = (e) => console.log(e);