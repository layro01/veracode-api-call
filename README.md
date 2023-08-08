# Veracode API Call Action

This action shows how to make an HMAC encrypted REST API call to the Veracode Platform.

## Inputs

### `base-url`
**Optional** The base URL for the Veracode Platform region. Defaults to US Commercial (`https://api.veracode.com/`). For more information, see [Region Domains](https://docs.veracode.com/r/Region_Domains_for_Veracode_APIs#rest-apis) in the Veracode Help Center.

### `endpoint-url`
**Required** The endpoint URL for the Veracode Platform API you wish to call. For more information, see [Veracode REST APIs](https://docs.veracode.com/r/c_rest_intro) in the Veracode Help Center.

### `api-method`
**Required** The HTTP method (a.k.a. API verb) you wish to make. For more information on the methods supported by a particular endpoint or resource, see [Veracode REST APIs](https://docs.veracode.com/r/c_rest_intro) in the Veracode Help Center.

### `api-body`
**Optional** The body to send with the API request. Must be of content type `application/json`.

## Outputs

### `response`

the response for the API call, in JSON format.

## Example usage

```yaml
uses: actions/veracode-api-call@main
with:
  base-url: 'https://api.veracode.eu/'
  endpoint-url: '/healthcheck/status'
```

## Publishing Action Updates

### Basic Steps

To publish updates to this repo, you first need to build it and publish the changes to the Webpacked `/dist/index.js` version of the action. To do this run `npm run build` before commiting the files.

**Note:** You will need to have installed [vercel/ncc](https://github.com/vercel/ncc) prior to running the build using `npm i -g @vercel/ncc`.

### Tagging a Version

To tag a version, run the following commands:

```bash
npm run build
git commit -m "New action v1.3"
git tag -a -m "New action v1.3" v1.3
git push --follow-tags
```
