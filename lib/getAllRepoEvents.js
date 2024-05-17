const getGitHubUsername = require('./getGitHubUsername');
const axios = require('axios');
require('dotenv').config();

async function getEvents(nextUrl, results, owner, repo, username) {
  const response = await axios.get(
    nextUrl || `https://api.github.com/repos/${owner}/${repo}/events`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );
  console.log(response.data);
  const myEvents = response.data.filter(
    (event) => event.actor.login === username
  );
  results.push(...myEvents);
  const next = response.headers.link
    ? response.headers.link
        .split(', ')
        .find((link) => link.includes('rel="next"'))
    : null;
  const nextUrl2 = next ? next.match(/<(.+)>/)[1] : null;
  return { nextUrl: nextUrl2, results };
}

async function getAllRepoEventsByMe(owner, repo) {
  const username = await getGitHubUsername();
  let nextUrl = null;
  let results = [];
  do {
    try {
      const { nextUrl: next } = await getEvents(
        nextUrl,
        results,
        owner,
        repo,
        username
      );
      nextUrl = next;
    } catch (error) {
      console.error(error);
    }
  } while (nextUrl);
  return results;
}

module.exports = getAllRepoEventsByMe;
