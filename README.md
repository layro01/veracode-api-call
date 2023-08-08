# Veracode API Call Action

This action shows how to make an HMAC encrypted REST API call to the Veracode Platform.

## Inputs

### `base-url`
**Optional** The base URL for the Veracode Platform region. Defaults to US Commercial (`https://api.veracode.com/`). For more information, see [Region Domains](https://docs.veracode.com/r/Region_Domains_for_Veracode_APIs#rest-apis) in the Veracode Help Center.

### `endpoint-url`
**Required** The endpoint URL for the Veracode Platform API you wish to call. For more information, see [Veracode REST APIs](https://docs.veracode.com/r/c_rest_intro) in the Veracode Help Center.

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