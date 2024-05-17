module.exports = function (name) {
  // Replace all non-alphanumeric characters with underscores
  // do not repeat underscores
  // and do not repeat spaces
  // do not end with _ or space, do not start with space or _
  return name
    .replace(/[^a-z0-9 ]+/gi, '_')
    .replace(/_+/g, '_')
    .replace(/ +/g, ' ')
    .replace(/(^_|_$)/g, '')
    .trim();
};
