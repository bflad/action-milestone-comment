const milestones = require('./milestones')
const nock = require('nock')
const { Octokit } = require("@octokit/rest");

const client = new Octokit({
  auth: 'testtoken',
  log: console,
});

beforeAll(() => {
  nock.disableNetConnect();
});

describe('list issues', () => {
  test('returns empty list successfully', async () => {
    const mockIssues = [];

    nock('https://api.github.com')
      .get(`/repos/testowner/testrepo/issues`)
      .query({milestone: '1', state: 'all'})
      .reply(200, mockIssues);

    const issues = await milestones.listIssues(client, 'testowner', 'testrepo', 1, 'all');

    await expect(issues).toEqual(mockIssues);
  });

  test('returns list successfully', async () => {
    const mockIssues = [
      {
        "number": 1,
      },
      {
        "number": 2,
      }
    ];

    nock('https://api.github.com')
      .get(`/repos/testowner/testrepo/issues`)
      .query({milestone: '1', state: 'all'})
      .reply(200, mockIssues);

    const issues = await milestones.listIssues(client, 'testowner', 'testrepo', 1, 'all');

    await expect(issues).toEqual(mockIssues);
  });

  test('throws error', async () => {
    nock('https://api.github.com')
      .get(`/repos/testowner/testrepo/issues`)
      .query({milestone: '1', state: 'all'})
      .reply(500, 'expected error');

    const milestones = require('./milestones')

    await expect(milestones.listIssues(client, 'testowner', 'testrepo', 1, 'all')).rejects.toThrow('expected error');
  });
});

// test('wait 500 ms', async () => {
//   const start = new Date();
//   await wait(500);
//   const end = new Date();
//   var delta = Math.abs(end - start);
//   expect(delta).toBeGreaterThanOrEqual(500);
// });
