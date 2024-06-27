const fs = require('fs');
const path = require('path');

const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('token');
const version = core.getInput('version');
const repository = core.getInput('repository');
const sha = core.getInput('sha');
const asset = core.getInput('asset');

const [owner, repo] = repository.split('/');
const octokit = github.getOctokit(token);

(async () => {
  const tag = await octokit.rest.git.createTag({
    owner, repo, tag: `v${version}`, message: '', object: sha, type: 'commit'
  });

  const release = await octokit.rest.repos.createRelease({
    owner, repo, tag_name: tag.data.tag,
  });

  if (asset) {
    const name = path.basename(asset);
    const data = fs.readFileSync(asset);
    await octokit.rest.repos.uploadReleaseAsset({
      owner, repo, release_id: release.data.id, name, data
    });
  }
})();
