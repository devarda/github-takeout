const axios = require('axios');

module.exports = async function getSourceRepoOfFork(fullName) {
  const response = await axios.get(`https://api.github.com/repos/${fullName}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  return response.data.fork_of ? response.data.fork_of.full_name : null;
};
