const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');

const app = express();
const port = process.env.port || 3999;

app.use(morgan('dev'));
app.use(sassMiddleware({
  src: path.join(__dirname),
  dest: path.join(__dirname),
  debug: true,
  // outputStyle: 'compressed',
  indentedSyntax: false,
  sourceMap: true
}));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static('views'));

app.get('/', (req, res) => {
  res.sendFile('/views/', 'index.html');
});

app.listen(port, () => {
  debug(`Listening on ${port}`);
});
