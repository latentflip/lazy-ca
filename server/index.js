var Hapi = require('hapi')
var Good = require('good')
var Bell = require('bell')
var Cookie = require('hapi-auth-cookie')
var Config = require('config');

var server = new Hapi.Server()
server.connection({ port: 3000 })

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
          return reply('Authentication failed: ' + request.auth.error.message).code(403);
        }

        request.auth.session.set(request.auth.credentials);

        reply.redirect('/');
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

  server.start(() => {
    console.log('Server running at:', server.info.uri)
  })
})
