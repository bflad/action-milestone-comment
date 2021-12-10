const core = require('@actions/core');
const github = require('@actions/github');
const issues = require('./issues');
const milestones = require('./milestones');
const octokit = require('./octokit');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  try {
    const body = core.getInput('body', { required: true });
    const milestone = parseInt(core.getInput('milestone'));
    const state = core.getInput('state');
    const token = core.getInput('token');

    const client = await octokit(token);
    const repo = github.context.repo;

    const milestoneIssues = await milestones.listIssues(client, repo.owner, repo.repo, milestone, state);

    await Promise.all(milestoneIssues.map(async issue => {
      await issues.createComment(client, repo.owner, repo.repo, issue.number, body);

      core.debug(`Waiting 2 seconds between requests: https://docs.github.com/en/rest/guides/best-practices-for-integrators#dealing-with-secondary-rate-limits`);
      await sleep(2000);
    }));

    const outputs = {
      ids: milestoneIssues.map(issue => issue.number).join(','),
    };

    core.setOutput('ids', outputs.ids);

    return outputs;
  } catch (err) {
    core.setFailed(err.message);
    throw err;
  }
}

module.exports = run;
