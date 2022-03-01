addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  const Authorization = request.headers.get('Authorization')
  const [scheme, encoded] = Authorization.split(' ')

  if (!(btoa(USERNAME+":"+PASSWORD) === encoded)) {
      return new Response("Nope, sorry!")
  }

  let { token, expiry } = JSON.parse(await KEYS.get('access_token'))

  if (expiry < new Date().valueOf()) {
    const response = await fetch(REFRESH_ENDPOINT, {
        method: "POST",
        headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'refresh_token',
            'refresh_token': REFRESH_TOKEN
        })
    })

    data = await response.json()

    token = data.access_token
    expiry = new Date().valueOf() + (data.expires_in*1000)
    await KEYS.put('access_token', JSON.stringify({token, expiry}))
  }

  const headers = new Headers(request.headers);
  headers.set("Authorization", "Bearer "+token)

  return await fetch("https://"+HOSTNAME+url.pathname, {
    headers,
      body: request.body,
      method: request.method,
      redirect: request.redirect,
    
  })
}
