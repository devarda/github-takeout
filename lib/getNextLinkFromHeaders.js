module.exports = function (headers) {
  const link = headers.link;
  const nextLink = link.split(',').find((link) => link.includes('rel="next"'));

  //return nextUrl
  const nextUrl = nextLink ? nextLink.split(';')[0].trim().slice(1, -1) : null;
  return nextUrl;
};
