const { processAllGists } = require('../lib/gists');

processAllGists({
  listGists: true,
  listWithFiles: true,
  parentDir: 'downloaded-gists',
}).catch(console.error);
