const filterItemsByName = (name) => (items) => {
    if (name) {
        name = name.toLowerCase();
        items = items.filter(x => x.name.toLowerCase().indexOf(name) > -1);
    }
    return items;
};

const sortByProperty = (criteria, property, callback) => (a, b) => {
    if (a[property] < b[property]) return -criteria;
    if (a[property] > b[property]) return criteria;
    return callback ? callback(a, b) : 0;
};

module.exports = {
    filterItemsByName,
    sortByProperty
};