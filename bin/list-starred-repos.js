const processAllStarredRepositories = require('../lib/starredRepositories');

processAllStarredRepositories({
  parentDir: 'downloaded-gists',
}).catch(console.error);
