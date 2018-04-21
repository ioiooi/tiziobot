require('dotenv').config();
const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const logger = require('morgan');

// slack sdk
const { WebClient } = require('@slack/client');
const token = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(token);
app.set('web', web);

// routes
const eventsRouter = require('./routes/events');
const commandsRouter = require('./routes/commands');
const icr = require('./routes/ic');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup routes
app.use('/events', eventsRouter);
app.use('/commands', commandsRouter);
app.use('/ic', icr);

const devRouter = require('./routes/dev');
app.use('/dev', devRouter);

const port = normalizePort(process.env.PORT || '3000');
server.listen(port, () => console.log(`listening on port: ${port}`));

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};
