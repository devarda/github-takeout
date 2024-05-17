const { processAllStarredGists } = require('../lib/starredGists');

processAllStarredGists({
  downloadStarredGists: true,
  ignoreSelfStars: true,
  parentDir: 'downloaded-gists',
}).catch(console.error);
