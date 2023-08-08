const core = require('@actions/core');
const github = require('@actions/github');

try {
  // Get the input parameters defined in action metadata file.
  const baseUrl = core.getInput('base-url');
  const endpointUrl = core.getInput('endpoint-url');
  const fullUrl = new URL(endpointUrl, baseUrl).href;
  console.log(`Calling ${fullUrl.href}!`);

  // For now, just set the output to the time.
  const time = (new Date()).toTimeString();
  core.setOutput("response", time);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

} catch (error) {
  core.setFailed(error.message);
}
