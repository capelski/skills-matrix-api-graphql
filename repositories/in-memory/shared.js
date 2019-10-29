const sortByName = (criteria) => (a, b) => {
	if (a.name < b.name) return -criteria;
	if (a.name > b.name) return criteria;
	return 0;
};

module.exports = {
    sortByName
};