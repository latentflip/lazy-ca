var Hapi = require('hapi')
var Good = require('good')
var Bell = require('bell')
var Cookie = require('hapi-auth-cookie')
var Config = require('getconfig');
var User = require('./models/user');
var openssl = require('./lib/openssl');

console.log(Config);
console.log(process.env);

var server = new Hapi.Server()
server.connection({ port: process.env.PORT || 3000 })

server.register([ Bell, Cookie ], (err) => {
  if (err) {
    throw err
  }

  server.auth.strategy('github', 'bell', {
    provider: 'github',
    password: Config.auth.github.cookiePassword,
    clientId: Config.auth.github.clientId,
    clientSecret: Config.auth.github.clientSecret,
    isSecure: false
  })

  server.auth.strategy('session', 'cookie', 'required', {
    password: Config.auth.cookie.password,
    cookie: 'sid',
    redirectTo: '/login',
    isSecure: false
  })

  server.route({
    method: 'GET',
    path: '/login',
    config: {
      auth: 'github',
      handler: (request, reply) => {
        if (!request.auth.isAuthenticated) {
          return reply('Authentication failed: ' + request.auth.error.message).code(403)
        }

        let creds = request.auth.credentials
        let profile = creds.profile

        request.auth.session.set(request.auth.credentials)

        User.forge({
          github_id: profile.id,
          github_username: profile.username,
          name: profile.displayName,
          email: profile.email
        }).save()
          .then((u) => {
              console.log(u);
              reply.redirect('/');
          })
          .catch((e) => {
            reply(e);
          })
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: 'session',
      handler: (request, reply) => {
        reply(request.auth.credentials)
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/cas/new',
    config: {
      auth: 'session',
      handler: (request, reply) => {
        openssl.generateRootCA({
          country: 'US',
          state: 'WA',
          city: 'Richland',
          org: '&yet',
          dept: 'Ops',
          name: 'Ops Overlords',
          email: 'ops@andyet.com'
        }, function (err, files) {
          reply(err || files);
        });
      }
    }
  })


  server.start(() => {
    console.log('Server running at:', server.info.uri)
  })
})
