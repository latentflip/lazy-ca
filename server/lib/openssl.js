var exec = require('child_process').exec
var tmp = require('tmp');
var fs = require('fs');

var escapeShell = function(cmd) {
  return '"'+cmd.replace(/(["\s'$`\\])/g,'\\$1')+'"'
}

function writeToTmp(contents, cb) {
  tmp.file(function (err, path, fd, cleanup) {
    if (err) {
      cleanup()
      return cb(err)
    }

    fs.writeFile(path, contents, function (err) {
      if (err) {
        cleanup()
        return cb(err)
      }

      return cb(null, path, cleanup)
    })
  })
}


function formatForm (form) {
  var str = ''
  str += '/C='  + form.country
  str += '/ST=' + form.state
  str += '/L='  + form.city
  str += '/O='  + form.org
  str += '/OU=' + form.dept
  str += '/CN=' + form.domain || form.name
  if (form.email) {
    str += '/emailAddress=' + form.email
  }
  return '"' + str + '"'
}

exports.generateCertificate = function (outdir, form, done) {
  var cmd = [
    'openssl req',
    '-nodes',
    '-newkey rsa:2048',
    '-keyout', outdir + '/private.key',
    '-out', outdir + '/CSR.csr',
    '-subj', formatForm(form)
  ].join(' ')

  exec(cmd, console.log)
}

exports.generateRootKey = function (done) {
  exec('openssl genrsa 2048', done);
}

exports.generateRootCA = function (form, done) {
  exports.generateRootKey(function (err, key) {
    if (err) {
      return done(err)
    }

    writeToTmp(key, function (err, path, cleanup) {
      var createCA = [
        'openssl req',
        '-x509', '-new', '-nodes',
        '-key', path,
        '-days', '1024',
        '-subj', formatForm(form),
      ].join(' ');

      exec(createCA, function (err, stdout) {
        console.log(arguments)
        if (err) {
          return done(err)
        }

        cleanup();

        done(null, {
          key: key.toString(),
          pem: stdout.toString()
        })
      })
    })
  })
}

exports.generateRootCA({
  country: 'US',
  state: 'WA',
  city: 'Richland',
  org: '&yet',
  dept: 'Ops',
  name: 'Ops Overlords',
  email: 'ops@andyet.com'
}, console.log);
