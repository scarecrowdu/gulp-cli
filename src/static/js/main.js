const class2type = {};

"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach((item) => {
  class2type[ "object " + item ] = item.toLowerCase();
});

console.log(class2type);
