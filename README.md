# OAuth Hopper

### Hop over OAuth2 services

OAuth Hopper exposes OAuth2 services behind normal [Basic Access Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) so that you can access them through clients that don't support OAuth2. It is meant to run as a Cloudflare Worker.

##### Requirements

- An OAuth2 token

##### Setup

1. Create a new Cloudflare Worker
2. Under "Settings", "Variables", Create the following Environment Variables:
   - `CLIENT_ID` - Your OAuth2 Client ID
   - `CLIENT_SECRET` Your OAuth2 Client Secret
   - `HOSTNAME` - The hostname of the resource you're trying to hop over. For example, Google's one is `apidata.googleusercontent.com`
   - `REFRESH_ENDPOINT` - The refresh endpoint of your OAuth2 provider. For example, Google's one is `https://www.googleapis.com/oauth2/v4/token`
   - `REFRESH_TOKEN` - Your latest refresh token
   - `USERNAME` - The username you want to connect with
   - `PASSWORD` - The password you want to use when connecting
3. Create a new Workers KV namespace, and under "KV Namespace Bindings" map it to a variable called `KEYS`
4. In the the KV namespace, create a key called `access_token` with the following JSON value: `{"token":"XYZ","expiry":0}` (replace `XYZ` with your latest access token)
5. Copy the content of [index.js](index.js) to your worker
6. Connect to the resource using the URL of your Worker - OAuth Hopper will proxy the resource for you while hopping over OAuth!
