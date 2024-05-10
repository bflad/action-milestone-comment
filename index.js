const action = require('./action');
const core = require('@actions/core');

async function run() {
  try {
    await action();
  } catch(err) {
    core.debug(err);
  }
}

run();
