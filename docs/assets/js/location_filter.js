var validator_locations = [...(new Set([
    "Delhi",
    "Mumbai",
    "Chennai",
]))];

const getLocationValidatedColor = (val = "") => {
    val = String(val).toLowerCase();
    for (const i of validator_locations) {
        if (val.localeCompare(i.toLowerCase()) === 0)
            return 'valid-chip-data';
    }
    return 'invalid-chip-data';
};

function locationSetter() {
    let dl = document.createElement('datalist');
    dl.setAttribute('id', 'location-list');
    validator_locations.forEach(val => {
        let ele = document.createElement('option');
        ele.setAttribute('value', val);
        dl.append(ele);
    });
    document.body.append(dl);
}
locationSetter();