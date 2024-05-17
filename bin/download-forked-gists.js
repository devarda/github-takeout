const { processAllGists } = require('../lib/gists');

processAllGists({
  downloadForkedGists: true,
  parentDir: 'downloaded-gists',
}).catch(console.error);
