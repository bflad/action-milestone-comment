async function createComment(client, owner, repo, issueNumber, body) {
  client.log.info(`Commenting on issue: ${issueNumber}`);

  try {
    await client.rest.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      body: body,
    });
  } catch(err) {
    client.log.error(`Unable to comment on issue (${issueNumber}): ${err}`);
    throw err;
  }
}

exports.createComment = createComment;
