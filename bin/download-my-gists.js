const { processAllGists } = require('../lib/gists');

processAllGists({
  downloadMyGists: true,
  parentDir: 'downloaded-gists',
}).catch(console.error);
