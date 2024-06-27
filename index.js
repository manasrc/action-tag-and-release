const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('token');
const version = core.getInput('version');
const repository = core.getInput('repository');
const sha = core.getInput('sha');

const [owner, repo] = repository.split('/');
const octokit = github.getOctokit(token);

(async () => {
  const tag = await octokit.rest.git.createTag({
    owner, repo, tag: `v${version}`, message: '', object: sha, type: 'commit'
  });

  console.log(tag);

  const release = await octokit.rest.repos.createRelease({
    owner, repo, tag_name: tag.data.tag,
  });

  console.log(release);

  const asset = await octokit.rest.repos.uploadReleaseAsset({
    owner, repo, release_id: release.data.id, name, data
  });

  console.log(asset);
})();
