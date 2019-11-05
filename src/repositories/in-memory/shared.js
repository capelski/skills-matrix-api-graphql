const filterItemsByName = name => items => {
    if (name) {
        name = name.toLowerCase();
        items = items.filter(x => x.name.toLowerCase().indexOf(name) > -1);
    }
    return items;
};

const sortByProperty = (propertyName, criteria, callback) => (a, b) => {
    if (a[propertyName] < b[propertyName]) return -criteria;
    if (a[propertyName] > b[propertyName]) return criteria;
    return callback ? callback(a, b) : 0;
};

module.exports = {
    filterItemsByName,
    sortByProperty
};
