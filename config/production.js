module.exports = {
  "auth": {
    "github": {
      "clientId": process.env.GITHUB_CLIENT_ID,
      "clientSecret": process.env.GITHUB_CLIENT_SECRET
    }
  },
  "db": {
    "connecion": process.env.DATABASE_URL
  }
}
