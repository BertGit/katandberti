// Dependencies
var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  morgan = require('morgan'),
  serveStatic = require('serve-static'),
  router = require('./router'),
  bodyParser = require('body-parser')

var app = module.exports = express()

// Configuration
app.set('port', process.env.PORT || 80)
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(morgan('tiny'))
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')))
app.use(serveStatic(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Routing
app.use('/', router)

// Start Server
app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})
