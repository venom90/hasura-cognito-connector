
module.exports = app => {
  /**
   * @description Health API for k8s probe or monitoring tools
   */
  app.get('/health', (req, res) => {
    res.status(200).send('ok');
  })

  app.get('/', (req, res) => res.status(200).send('void'));
  app.get('/favicon.ico', (req, res) => res.status(200).send('void'));
}