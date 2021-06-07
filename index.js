const action = require('./action');

async function run() {
  try {
    await action();
  } catch(err) {
    return;
  }
}

run();
