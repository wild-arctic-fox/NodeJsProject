// Block helpers make it possible to define custom iterators and other
// functionality that can invoke the passed block with a new contextx

module.exports = {
  ifeq(a, b, options) {
    if (a == b) {
      // function (options.fn) behaves like a normal compiled Handlebars template
      return options.fn(this);
    }
    // Handlebars provides the block for the else fragment as options.inverse
    return options.inverse(this);
  },
};
