module.exports = app => {
  app.post('/login', (req, res) => {
    res.send('Hello root');
  });

  app.post('/signup', (req, res) => {

  });
}