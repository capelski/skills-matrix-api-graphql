const filterItemsByName = (name) => (items) => {
    if (name) {
        name = name.toLowerCase();
        items = items.filter(x => x.name.toLowerCase().indexOf(name) > -1);
    }
    return items;
};

const sortByName = (criteria) => (a, b) => {
	if (a.name < b.name) return -criteria;
	if (a.name > b.name) return criteria;
	return 0;
};

module.exports = {
    filterItemsByName,
    sortByName
};