require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 641:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(974);
const github = __nccwpck_require__(520);
const issues = __nccwpck_require__(526);
const milestones = __nccwpck_require__(990);
const octokit = __nccwpck_require__(199);
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


/***/ }),

/***/ 526:
/***/ ((__unused_webpack_module, exports) => {

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


/***/ }),

/***/ 990:
/***/ ((__unused_webpack_module, exports) => {

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


/***/ }),

/***/ 199:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(974);
const { GitHub, getOctokitOptions } = __nccwpck_require__(339)
const { retry } = __nccwpck_require__(206)
const { throttling } = __nccwpck_require__(310)

const rateLimitRetries = 5
const secondaryRateLimitRetries = 5

module.exports = function client(token) {
    const Octokit = GitHub.plugin(throttling, retry);
    const options = getOctokitOptions(token);

    options.log = {
        debug: core.debug,
        info: core.info,
        warning: core.warning,
        error: core.error,
    };

    options.throttle = {
        onSecondaryRateLimit(retryAfter, options, oktokit, retryCount) {
            core.info(`Secondary rate limit triggered for request ${options.method} ${options.url} (attempt ${retryCount}/${secondaryRateLimitRetries})`)

            if (retryCount < secondaryRateLimitRetries) {
                core.info(`Retrying after ${retryAfter} seconds`)
                return true
            }

            core.warning(`Exhausted secondary rate limit retry count (${secondaryRateLimitRetries}) for ${options.method} ${options.url}`)
        },
        onRateLimit(retryAfter, options, oktokit, retryCount) {
            core.info(`Rate limit triggered for request ${options.method} ${options.url} (attempt ${retryCount}/${rateLimitRetries})`)

            if (retryCount < rateLimitRetries) {
                core.info(`Retrying after ${retryAfter} seconds`)
                return true
            }

            core.warning(`Exhausted rate limit retry count (${rateLimitRetries}) for ${options.method} ${options.url}`)
        }
    };

    return new Octokit(options);
}


/***/ }),

/***/ 974:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 520:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 339:
/***/ ((module) => {

module.exports = eval("require")("@actions/github/lib/utils");


/***/ }),

/***/ 206:
/***/ ((module) => {

module.exports = eval("require")("@octokit/plugin-retry");


/***/ }),

/***/ 310:
/***/ ((module) => {

module.exports = eval("require")("@octokit/plugin-throttling");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const action = __nccwpck_require__(641);

async function run() {
  try {
    await action();
  } catch(err) {
    return;
  }
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map