const { beforeAll, beforeEach, describe, expect, test } = require('@jest/globals');
const nock = require('nock');
const process = require('node:process');
const path = require('path');

const body = 'testbody';
const milestone = '1';
const repo = 'testowner/testrepo';
const state = 'all'
const token = 'testtoken'

beforeAll(() => {
  nock.disableNetConnect();
});

beforeEach(() => {
  process.env['GITHUB_REPOSITORY'] = repo;
  process.env['INPUT_MILESTONE'] = milestone;
  process.env['INPUT_STATE'] = state;
  process.env['INPUT_TOKEN'] = token;
  //process.env['RUNNER_DEBUG'] = true;
});

describe('action test suite', () => {
  test('Posts comments on milestone issues', async () => {
    process.env['GITHUB_EVENT_PATH'] = path.join(__dirname, 'milestone-closed-payload.json');
    process.env['INPUT_BODY'] = body;

    const mockIssues = [
      {
        "number": 1,
      },
      {
        "number": 2,
      }
    ];

    const scope = nock('https://api.github.com')
      .get(`/repos/testowner/testrepo/issues`)
      .query({ milestone: '1', state: 'all' })
      .reply(200, mockIssues)
      .post(`/repos/${repo}/issues/1/comments`, { body: body })
      .reply(200)
      .post(`/repos/${repo}/issues/2/comments`, { body: body })
      .reply(200);

    const action = require('./action');
    await expect(await action()).toEqual({ ids: "1,2" });
    await expect(scope.isDone()).toBeTruthy();
  });

  test('Retries transient errors', async () => {
    process.env['GITHUB_EVENT_PATH'] = path.join(__dirname, 'milestone-closed-payload.json');
    process.env['INPUT_BODY'] = body;

    const mockIssues = [
      {
        "number": 1,
      },
      {
        "number": 2,
      }
    ];

    const scope = nock('https://api.github.com')
      .get(`/repos/testowner/testrepo/issues`)
      .query({ milestone: '1', state: 'all' })
      .reply(500, 'expected transient error')
      .get(`/repos/testowner/testrepo/issues`)
      .query({ milestone: '1', state: 'all' })
      .reply(200, mockIssues)
      .post(`/repos/${repo}/issues/1/comments`, { body: body })
      .reply(200)
      .post(`/repos/${repo}/issues/2/comments`, { body: body })
      .reply(200);

    const action = require('./action');
    await expect(await action()).toEqual({ ids: "1,2" });
    await expect(scope.isDone()).toBeTruthy();
  });

  test('Retries secondary rate limit errors', async () => {
    process.env['GITHUB_EVENT_PATH'] = path.join(__dirname, 'milestone-closed-payload.json');
    process.env['INPUT_BODY'] = body;

    const mockIssues = [
      {
        "number": 1,
      },
      {
        "number": 2,
      }
    ];

    const scope = nock('https://api.github.com')
      .get(`/repos/testowner/testrepo/issues`)
      .query({ milestone: '1', state: 'all' })
      .reply(200, mockIssues)
      .post(`/repos/${repo}/issues/1/comments`, { body: body })
      .reply(200)
      .post(`/repos/${repo}/issues/2/comments`, { body: body })
      .reply(403, {
        message: "You have exceeded a secondary rate limit and have been temporarily blocked from content creation. Please retry your request again later.",
        documentation_url: "https://docs.github.com/rest/overview/resources-in-the-rest-api#secondary-rate-limits"
      })
      .post(`/repos/${repo}/issues/2/comments`, { body: body })
      .reply(200);

    const action = require('./action');
    await expect(await action()).toEqual({ ids: "1,2" });
    await expect(scope.isDone()).toBeTruthy();
  });

  test('Retries rate limit errors', async () => {
    process.env['GITHUB_EVENT_PATH'] = path.join(__dirname, 'milestone-closed-payload.json');
    process.env['INPUT_BODY'] = body;

    const mockIssues = [
      {
        "number": 1,
      },
      {
        "number": 2,
      }
    ];

    const scope = nock('https://api.github.com')
      .get(`/repos/testowner/testrepo/issues`)
      .query({ milestone: '1', state: 'all' })
      .reply(429, 'expected rate limit error')
      .get(`/repos/testowner/testrepo/issues`)
      .query({ milestone: '1', state: 'all' })
      .reply(200, mockIssues)
      .post(`/repos/${repo}/issues/1/comments`, { body: body })
      .reply(200)
      .post(`/repos/${repo}/issues/2/comments`, { body: body })
      .reply(200);

    const action = require('./action');
    await expect(await action()).toEqual({ ids: "1,2" });
    await expect(scope.isDone()).toBeTruthy();
  });
});
