const core = require('@actions/core');
const github = require('@actions/github');

const { default: axios } = require('axios');

const auth = require('./auth');

try {
  // Get the input parameters defined in action metadata file.
  const baseUrl = core.getInput('base-url');
  const endpointUrl = core.getInput('endpoint-url');
  const apiMethod = core.getInput('api-method');
  const apiBody = core.getInput('api-body');

  console.log(`Got input parameters:`);
  console.log(`  base-url: ${baseUrl}`);
  console.log(`  endpoint-url: ${endpointUrl}`);
  console.log(`  api-method: ${apiMethod}`);
  console.log(`  api-body: ${apiBody}`);

  const fullUrl = new URL(endpointUrl, baseUrl);
  console.log(`Calling ${apiMethod} ${fullUrl.href}...`);

  // Get the Veracode API Key and Secret from action secrets stored in the repo executing a workflow using this action.
  const apiKeyId = process.env.VERACODE_API_KEY_ID;
  const apiKeySecret = process.env.VERACODE_API_KEY_SECRET;
  if (apiKeyId !== undefined && apiKeyId.length > 0) {
    console.log('Got API Key ID');
  }
  if (apiKeySecret !== undefined && apiKeySecret.length > 0) {
    console.log('Got API Key Secret');
  }  

  // Generate an HMAC header for the call.
  const authorization = auth.generateAuthHeader(apiKeyId, apiKeySecret, fullUrl.href, apiMethod);
  if (authorization !== undefined && authorization.length > 0) {
    console.log('Generated HMAC header for request');
  } 

  // Make the REST API call.
  const headers = {
    'Authorization': authorization,
    'Content-Type': 'application/json'
  }

  switch (apiMethod) {
    case 'GET':
      console.log('Making GET call');
      axios.get(fullUrl, {headers: headers}).then(response => {
        console.log(`Response: ${JSON.stringify(response.data)}`);
        core.setOutput("response", JSON.stringify(response.data));
      })
      break;
    case 'HEAD':
      axios.head(fullUrl, {headers: headers}).then(response => {
        core.setOutput("response", response);
      })
      break;
    case 'PATCH':
      axios.patch(fullUrl, apiBody, {headers: headers}).then(response => {
        core.setOutput("response", response);
      })
      break;
    case 'POST':
      axios.post(fullUrl, apiBody, {headers: headers}).then(response => {
        core.setOutput("response", response);
      })
      break;
    default:
      throw new Error(`Unsupported HTTP method '${apiMethod}'`);
  }

  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);

} catch (error) {
  core.setFailed(error.message);
}
