module.exports = {
  "auth": {
    "github": {
      "clientId": process.env.GITHUB_CLIENT_ID,
      "clientSecret": process.env.GITHUB_CLIENT_SECRET
    }
  },
  "db": {
    "connection": process.env.DATABASE_URL
  }
}
