const core = require('@actions/core');
const { GitHub, getOctokitOptions } = require('@actions/github/lib/utils')
const { retry } = require('@octokit/plugin-retry')
const { throttling } = require('@octokit/plugin-throttling')

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
        onAbuseLimit(retryAfter, options) {
            core.info(`Secondary rate limit triggered for request ${options.method} ${options.url} (attempt ${options.request.retryCount}/${secondaryRateLimitRetries})`)

            if (options.request.retryCount < secondaryRateLimitRetries) {
                core.info(`Retrying after ${retryAfter} seconds`)
                return true
            }

            core.warning(`Exhausted secondary rate limit retry count (${secondaryRateLimitRetries}) for ${options.method} ${options.url}`)
        },
        onRateLimit(retryAfter, options) {
            core.info(`Rate limit triggered for request ${options.method} ${options.url} (attempt ${options.request.retryCount}/${rateLimitRetries})`)

            if (options.request.retryCount < rateLimitRetries) {
                core.info(`Retrying after ${retryAfter} seconds`)
                return true
            }

            core.warning(`Exhausted rate limit retry count (${rateLimitRetries}) for ${options.method} ${options.url}`)
        }
    };

    return new Octokit(options);
}
