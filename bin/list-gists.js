const { processAllGists } = require('../lib/gists');

processAllGists({
  listGists: true,
  parentDir: 'downloaded-gists',
}).catch(console.error);
