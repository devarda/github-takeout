const { processAllStarredGists } = require('../lib/starredGists');

processAllStarredGists({
  listStarredGists: true,
  ignoreSelfStars: true,
  listWithFiles: true,
  parentDir: 'downloaded-gists',
}).catch(console.error);
