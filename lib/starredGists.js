require('dotenv').config();
const {
  STARRED_GISTS_DIRNAME,
  LIST_CSV_STARRED_FILENAME,
  LIST_CSV_STARRED_WITH_FILES_FILENAME,
} = require('./dirFileNameConstants');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const safeDirName = require('./safeDirName');
const getGitHubUsername = require('./getGitHubUsername');
const getNextLinkFromHeaders = require('./getNextLinkFromHeaders');

/**
 * Runs once per page of starred gists listed in the response from the GitHub API
 * @param {string} next
 * @param {import('csv-writer/src/lib/csv-writer').CsvWriter} csvWriter
 * @param {Object} options
 * @returns {Promise<{nextUrl: string, csvWriter: CsvWriter}>}
 */
async function processStarredGists(
  next = null,
  csvWriter = null,
  {
    ignoreSelfStars = false,
    downloadStarredGists = false,
    listStarredGists = false,
    listWithFiles = false,
    parentDir = 'downloaded-gists',
  }
) {
  //create parentDir if it doesn't exist
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir);
  }
  //create starred-gists directory if it doesn't exist
  if (
    downloadStarredGists &&
    !fs.existsSync(path.resolve(parentDir, STARRED_GISTS_DIRNAME))
  ) {
    fs.mkdirSync(path.resolve(parentDir, STARRED_GISTS_DIRNAME));
  }

  const ignoringOwner = ignoreSelfStars ? await getGitHubUsername() : '';

  //create csvWriter if listStarredGists or listWithFiles
  if (!csvWriter && listStarredGists && listWithFiles) {
    csvWriter = createCsvWriter({
      path: path.resolve(parentDir, LIST_CSV_STARRED_WITH_FILES_FILENAME),
      header: [
        { id: 'id', title: 'id' },
        { id: 'gist_url', title: 'gist_url' },
        { id: 'owner_login', title: 'owner_login' },
        { id: 'created_at', title: 'created_at' },
        { id: 'updated_at', title: 'updated_at' },
        { id: 'name', title: 'name' },
        { id: 'folderName', title: 'folderName' },
        { id: 'is_forked', title: 'is_forked' },
        { id: 'is_public', title: 'is_public' },
        { id: 'revision_count', title: 'revision_count' },
        { id: 'source_gist', title: 'source_gist' },
        { id: 'source_owner', title: 'source_owner' },
        { id: 'source_created_at', title: 'source_created_at' },
        { id: 'source_updated_at', title: 'source_updated_at' },
        { id: 'filename', title: 'filename' },
        { id: 'raw_url', title: 'raw_url' },
        { id: 'language', title: 'language' },
      ],
    });
  } else if (!csvWriter && listStarredGists) {
    csvWriter = createCsvWriter({
      path: path.resolve(parentDir, LIST_CSV_STARRED_FILENAME),
      header: [
        { id: 'id', title: 'id' },
        { id: 'gist_url', title: 'gist_url' },
        { id: 'owner_login', title: 'owner_login' },
        { id: 'created_at', title: 'created_at' },
        { id: 'updated_at', title: 'updated_at' },
        { id: 'name', title: 'name' },
        { id: 'folderName', title: 'folderName' },
        { id: 'is_forked', title: 'is_forked' },
        { id: 'is_public', title: 'is_public' },
        { id: 'revision_count', title: 'revision_count' },
        { id: 'source_gist', title: 'source_gist' },
        { id: 'source_owner', title: 'source_owner' },
        { id: 'source_created_at', title: 'source_created_at' },
        { id: 'source_updated_at', title: 'source_updated_at' },
      ],
    });
  }

  //get gists
  try {
    const response = await axios({
      method: 'get',
      url: next ? next : 'https://api.github.com/gists/starred',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    //get details of each gist
    await Promise.all(
      response.data.map(async (gistFromList) => {
        const gistDetails = await axios({
          method: 'get',
          url: gistFromList.url,
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });
        const gist = gistDetails.data;
        const owner_login = gist.owner.login;

        if (ignoringOwner === owner_login) {
          return;
        }

        const id = gist.id;
        const created_at = new Date(gist.created_at);
        const updated_at = new Date(gist.updated_at);
        const is_forked = gist.fork_of ? true : false;
        const is_public = gist.public;
        const revision_count = gist.history.length;
        const gist_url = gist.html_url;
        // name is the description if it exists, otherwise the last part of the url
        const name = gist.description
          ? gist.description
          : gist.url.split('/').pop();

        // fork_meta is an object with source_gist, source_owner, source_created_at, and source_updated_at if the gist is a fork
        const fork_meta = is_forked
          ? {
              source_gist: gist.fork_of.html_url,
              source_owner: gist.fork_of.owner.url,
              source_created_at: new Date(gist.fork_of.created_at),
              source_updated_at: new Date(gist.fork_of.updated_at),
            }
          : {
              source_gist: null,
              source_owner: null,
              source_created_at: null,
              source_updated_at: null,
            };

        // files is an array of objects with filename, raw_url, language, and content
        const files = Object.values(gist.files).map((file) => {
          return {
            filename: file.filename,
            raw_url: file.raw_url,
            language: file.language,
            content: file.content,
          };
        });

        const nameWithoutLineBreaks = name.replace(/(\r\n|\n|\r)/gm, ' ');
        const folderName = safeDirName(name);

        // write to csv if listStarredGists or listWithFiles
        if (listStarredGists && listWithFiles) {
          const records = files.map((file) => {
            const obj = {
              id,
              gist_url,
              owner_login,
              created_at,
              updated_at,
              name: nameWithoutLineBreaks,
              folderName,
              is_forked,
              is_public,
              revision_count,
              ...fork_meta,
              ...file,
            };
            delete obj.content;
            return obj;
          });
          await csvWriter.writeRecords(records);
        } else if (listStarredGists) {
          const records = {
            id,
            gist_url,
            owner_login,
            created_at,
            updated_at,
            name: nameWithoutLineBreaks,
            folderName,
            is_forked,
            is_public,
            revision_count,
            ...fork_meta,
          };
          await csvWriter.writeRecords([records]);
        }
        // download files if downloadStarredGists
        if (downloadStarredGists) {
          const gistDir = path.resolve(
            parentDir,
            STARRED_GISTS_DIRNAME,
            folderName
          );
          if (!fs.existsSync(gistDir)) {
            fs.mkdirSync(gistDir);
          }
          files.forEach((file) => {
            const filePath = path.resolve(gistDir, file.filename);
            fs.writeFileSync(filePath, file.content);
          });
        }
      })
    );

    const nextUrl = getNextLinkFromHeaders(response.headers);

    return { nextUrl, csvWriter };
  } catch (error) {
    throw error;
  }
}

async function processAllStarredGists(
  options = {
    downloadStarredGists: false,
    listStarredGists: false,
    listWithFiles: false,
    ignoreSelfStars: false,
    parentDir: 'downloaded-gists',
  }
) {
  let nextUrl = null;
  let csvWriter = null;
  do {
    try {
      const { nextUrl: next, csvWriter: nextWriter } =
        await processStarredGists(nextUrl, csvWriter, options);
      nextUrl = next;
      csvWriter = nextWriter;
    } catch (error) {
      console.error(error);
    }
  } while (nextUrl);
  return;
}

module.exports = { processAllStarredGists };
