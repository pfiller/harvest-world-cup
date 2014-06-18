var __slice = [].slice;

(function() {
  var _ferry_data_from_island, _ferry_data_from_island_warning, _underscoreize;
  window.ferry_data_from_island = function() {
    var name, names, results, _i, _len;
    names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    results = {};
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      results[name] = _ferry_data_from_island(name);
    }
    if (names.length === 1) {
      return results[names[0]];
    } else {
      return _underscoreize(results);
    }
  };
  _ferry_data_from_island = function(name) {
    var island, json;
    island = document.getElementById("" + name + "-data-island");
    if (!island) {
      return _ferry_data_from_island_warning(name);
    }
    json = JSON.parse(island.innerHTML);
    island.parentNode.removeChild(island);
    return json;
  };
  _ferry_data_from_island_warning = function(name) {
    var message;
    message = ("We encountered a problem loading your data (bootstrap " + name + ").\nThis can occur when accessing Harvest through a proxy or when using\ncertain browser extensions that removes certain tags from the page. Please\ncontact your IT staff or Harvest for more details.").replace(/\n/g, " ");
    alert(message);
    throw new Error(message);
  };
  return _underscoreize = function(obj) {
    var k, results, v;
    results = {};
    for (k in obj) {
      v = obj[k];
      results[k.replace(/-/g, "_")] = v;
    }
    return results;
  };
})();
