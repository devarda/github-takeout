# GitHub TakeOut

> Hackable scripts to archive your GitHub data using GitHub's API: Download all your Gists, all starred Gists, all forked Gists, list of starred Repositories, CSV exports of Gists and more.

If you are considering deleting a GitHub previous work-account, sunsetting an underutilized account, or simply desiring a comprehensive backup of your GitHub contributions – be it Gists, starred Gists, forked Gists, starred Repositories – you will find here scripts to archive your GitHub data using GitHub's API, enabling you to create a CSV list of your contributions or download the files themselves.

## Features

- Download all your Gists
- Download all your starred Gists
- Download all your forked Gists
- Download a list of all your Gists as a CSV
- Download a list of all your starred Gists as a CSV
- Download a list of all your starred Repositories as a CSV

Look at the code for the options you can use to customize the scripts to your needs. Start from the bin folder and work your way up to the function files where you can hack the fields you want to include in the CSV files, or adjust the options. There are hidden options such as excluding the Gists you have created while downloading all your starred Gists. This is so that it wouldn't duplicate with the Gists you have downloaded if you were downloading it all, but it may be useful to disable that for some other use case.

## Usage

First create a GitHub token by following the instructions [here to create a fine-grained token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token).

Then, checkout the repo and install the dependencies:

```bash
# Setup
git clone ..........
cd github-takeout
yarn install
```

Then, create a `.env` file (or copy sample.env) in the root of the project and add the following:

```env
GITHUB_TOKEN=your_github_token
```

Then, run the script you want in the [bin](./bin) folder where you can adjust the options in the script. Or you may use the package scripts descried below.

### Download Everything

This script will create the folder defined in [dirFileNameConstants.js](./dirFileNameConstants.js) and download everything in respective folders and files.

```bash
# download everything
yarn download-all

```

### Download Forked Gists

This script will download the gists that you have forked. Each gist will be in a separate folder where the name of the folder is determined by the description or the id of the gist if the description is not available. The files will be stored in the gist folder as separate files.

```bash

# download forked gists
yarn download-forked-gists
```

### Download All Gists Created By You

This script will download gists created by you (minus the ones that you've forked). The distinction is made because if you are the type of person that forks and modifies your gists then you can easily copy the contents of forked-gists and combine them with your gists. If you are the type of person that forks to keep a copy of the original then you can have a separate folder for each.

```bash
# download my gists
yarn download-my-gists

```

### Download All Gists You've Starred

This script will download the gists that you have starred.

```bash
# download starred gists
yarn download-starred-gists
```

### List All Gists As CSV

These scripts will list all your gists in a CSV file. You have the option of listing the gists with files or without files. The ones with files is meant to act as an index for the gists that you've downloaded and have redundant information of the parent gist for sorting purposes. The list will include forked and original gists that are in your account.

```bash
# list gists with files
yarn list-gists-with-files

# list gists
yarn list-gists

```

### List All Gists You've Starred As CSV

These scripts will list all the gists you've starred in a CSV file. You have the option of listing the gists with files or without files like the previous script.

```bash

# list starred gists with files
yarn list-starred-gists-with-files

# list starred gists
yarn list-starred-gists

```

### List Starred Repositories

Use cases:

- You want to see **a list of repositories** you have starred.
- You want to see **when** you starred a repository.
- You want to figure out **the popular repositories** you have starred.
- You want to see the **languages, licenses, homepages, your permissions** of the repositories you have starred.
- You want to see **the topics** of the repositories you have starred.
- You want to see **which repositories are private, archived, or is a fork (with source repo of fork)**.

```bash

# list starred repos
yarn list-starred-repos
```

Example:

| owner   | name  | starred_at                                                | url                              | description                                                                   | is_fork | fork_of | default_branch | license     | size  | homepage            | is_private | my_permissions | is_archived | created_at                                                | updated_at                                                | last_push_at                                              | language   | tags                                                                                                      | forks_count | open_issues_count | stargazers_count | watchers_count | has_wiki | has_projects | has_downloads | has_issues | has_pages | has_discussions |
| ------- | ----- | --------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------- | ------- | ------- | -------------- | ----------- | ----- | ------------------- | ---------- | -------------- | ----------- | --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------- | ----------- | ----------------- | ---------------- | -------------- | -------- | ------------ | ------------- | ---------- | --------- | --------------- |
| mochajs | mocha | Sun Jan 28 2018 19:49:10 GMT-0500 (Eastern Standard Time) | https://github.com/mochajs/mocha | ☕️ simple, flexible, fun javascript test framework for node.js & the browser | false   |         | master         | MIT License | 23904 | https://mochajs.org | false      | pull           | false       | Mon Mar 07 2011 13:44:25 GMT-0500 (Eastern Standard Time) | Thu May 16 2024 17:17:38 GMT-0400 (Eastern Daylight Time) | Thu May 16 2024 04:02:51 GMT-0400 (Eastern Daylight Time) | JavaScript | bdd, browser, javascript, mocha, mochajs, node, nodejs, tdd, test, test-framework, testing, testing-tools | 2987        | 238               | 22450            | 22450          | true     | false        | true          | true       | false     | false           |

## Support This Project

If you find this project helpful, please consider supporting me. My work is not sponsored and I am an independent developer. Every bit helps. ❤️

Buy me a coffee: [☕️](https://buymeacoffee.com/devarda)
