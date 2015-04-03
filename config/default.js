module.exports = {
  "auth": {
    "github": {
      "cookiePassword": "foobarbaz",
      "clientId": process.env.GITHUB_CLIENT_ID,
      "clientSecret": process.env.GITHUB_CLIENT_SECRET
    },
    "cookie": {
      "password": "fluxcapacitor"
    }
  },
  "db": {
    "connection": "postgres://lazy_ca:password@localhost/lazy_ca"
  }
}
