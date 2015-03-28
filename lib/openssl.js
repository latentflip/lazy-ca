var exec = require('child_process').exec

//openssl req -nodes -newkey rsa:2048 -keyout private.key -out CSR.csr -subj "/C=NL/ST=Zuid Holland/L=Rotterdam/O=Sparkling Network/OU=IT Department/CN=ssl.raymii.org"

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

exports.generateRootCA = function (outdir, form, done) {
  var createCAKey = [
    'openssl genrsa',
    '-out', outdir + '/rootCA.key',
    '2048'
  ].join(' ')

  var signCA = [
    'openssl req',
    '-x509', '-new', '-nodes',
    '-key', outdir + '/rootCA.key',
    '-days', '1024',
    '-subj', formatForm(form),
    '-out', outdir + '/rootCA.pem'
  ].join(' ')

  exec(createCAKey, function (err) {
    if (err) {
      return done(err)
    }

    exec(signCA, done);
  })
}

//exports.generateRootCA(__dirname + '/../CA', {
//  country: 'US',
//  state: 'WA',
//  city: 'Richland',
//  org: '&yet',
//  dept: 'Ops',
//  name: 'Ops Overlords',
//  email: 'ops@andyet.com'
//}, console.log);
