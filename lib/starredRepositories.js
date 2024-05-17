require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { LIST_CSV_STARRED_REPOS_FILENAME } = require('./dirFileNameConstants');
const getNextLinkFromHeaders = require('./getNextLinkFromHeaders');
const getSourceRepoOfFork = require('./getSourceRepoOfFork');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
/**
 * Runs once per page of starred repositories listed in the response from the GitHub API
 * @param {string} next
 * @param {import('csv-writer/src/lib/csv-writer').CsvWriter} csvWriter
 * @param {Object} options - parentDir
 * @returns {Promise<{nextUrl: string, csvWriter: CsvWriter}>}
 */
async function processStarredRepositories(
  next,
  csvWriter,
  { parentDir = 'downloaded-gists' }
) {
  const response = await axios.get(
    next ? next : 'https://api.github.com/user/starred',
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.star+json',
      },
    }
  );
  //create parentDir if it doesn't exist
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir);
  }
  // setup csvWriter if not already setup
  if (!csvWriter) {
    csvWriter = createCsvWriter({
      path: path.resolve(parentDir, LIST_CSV_STARRED_REPOS_FILENAME),
      header: [
        { id: 'owner', title: 'owner' },
        { id: 'name', title: 'name' },
        { id: 'starred_at', title: 'starred_at' },
        { id: 'url', title: 'url' },
        { id: 'description', title: 'description' },

        { id: 'is_fork', title: 'is_fork' },
        { id: 'fork_of', title: 'fork_of' },

        { id: 'default_branch', title: 'default_branch' },
        { id: 'license', title: 'license' },
        { id: 'size', title: 'size' },
        { id: 'homepage', title: 'homepage' },

        { id: 'is_private', title: 'is_private' },
        { id: 'my_permissions', title: 'my_permissions' },
        { id: 'is_archived', title: 'is_archived' },
        { id: 'created_at', title: 'created_at' },
        { id: 'updated_at', title: 'updated_at' },
        { id: 'last_push_at', title: 'last_push_at' },
        { id: 'language', title: 'language' },
        { id: 'tags', title: 'tags' },

        { id: 'forks_count', title: 'forks_count' },
        { id: 'open_issues_count', title: 'open_issues_count' },
        { id: 'stargazers_count', title: 'stargazers_count' },
        { id: 'watchers_count', title: 'watchers_count' },
        { id: 'has_wiki', title: 'has_wiki' },
        { id: 'has_projects', title: 'has_projects' },
        { id: 'has_downloads', title: 'has_downloads' },
        { id: 'has_issues', title: 'has_issues' },
        { id: 'has_pages', title: 'has_pages' },
        { id: 'has_discussions', title: 'has_discussions' },
      ],
    });
  }
  const records = await Promise.all(
    response.data.map(async ({ starred_at, repo }) => {
      return {
        starred_at: new Date(starred_at),
        url: repo.html_url,
        size: repo.size,
        is_private: repo.private,
        //get the permissions that are true
        my_permissions: Object.keys(repo.permissions).filter(
          (permission) => repo.permissions[permission]
        ),
        default_branch: repo.default_branch,
        license: repo.license ? repo.license.name : null,
        is_fork: repo.fork,
        fork_of: repo.fork ? await getSourceRepoOfFork(repo.full_name) : null,
        is_archived: repo.archived,
        created_at: new Date(repo.created_at),
        description: repo.description
          ? repo.description.replace(/(\r\n|\n|\r)/gm, ' ')
          : null,
        owner: repo.owner.login,
        name: repo.name,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        homepage: repo.homepage,
        language: repo.language,
        last_push_at: new Date(repo.pushed_at),
        stargazers_count: repo.stargazers_count,
        updated_at: new Date(repo.updated_at),
        watchers_count: repo.watchers_count,
        tags: repo.topics.join(', '),
        has_wiki: repo.has_wiki,
        has_projects: repo.has_projects,
        has_downloads: repo.has_downloads,
        has_issues: repo.has_issues,
        has_pages: repo.has_pages,
        has_discussions: repo.has_discussions,
      };
    })
  );

  await csvWriter.writeRecords(records);

  const nextUrl = getNextLinkFromHeaders(response.headers);

  return { nextUrl, csvWriter };
}

async function processAllStarredRepositories(
  options = {
    parentDir: 'downloaded-gists',
  }
) {
  let nextUrl = null;
  let csvWriter = null;
  do {
    try {
      const { nextUrl: next, csvWriter: nextWriter } =
        await processStarredRepositories(nextUrl, csvWriter, options);
      nextUrl = next;
      csvWriter = nextWriter;
    } catch (error) {
      console.error(error);
    }
  } while (nextUrl);
  return;
}

module.exports = processAllStarredRepositories;
