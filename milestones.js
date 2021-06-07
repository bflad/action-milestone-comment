async function listIssues(client, owner, repo, milestone, state) {
  client.log.info(`Listing issues for milestone: ${milestone}`);

  try {
    const issues = await client.paginate(
      client.rest.issues.listForRepo,
      {
        owner: owner,
        repo: repo,
        milestone: milestone,
        state: state
      }
    );

    client.log.info(`Found milestone issues: ${issues.map(issue => issue.number).join(', ')}`);

    return issues;
  } catch (err) {
    client.log.error(`Unable to list issues for milestone (${milestone}): ${err}`);
    throw err;
  }
}

exports.listIssues = listIssues;
