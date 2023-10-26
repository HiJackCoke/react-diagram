require('dotenv/config');
const conventionalGithubReleaser = require('conventional-github-releaser');

conventionalGithubReleaser(
   {
      type: 'oauth',
      url: 'https://api.github.com/',
      token: process.env.GITHUB_TOKEN,
   },
   {
      preset: 'angular',
   },
   (e) => {
      if (e) {
         console.error(e);
         process.exit(1);
      }

      process.exit(0);
   },
);
