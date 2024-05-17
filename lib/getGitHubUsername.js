require('dotenv').config();
const axios = require('axios');

module.exports = async function getGitHubUsername() {
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });
    return response.data.login;
  } catch (error) {
    console.error('Error getting GitHub username: ', error);
  }
};
