const { items } = require('../utils/items');

function getMenu() {
  return items;
}

function findItemById(id) {
  return items.find((item) => item.id === id);
}

module.exports = { getMenu, findItemById };