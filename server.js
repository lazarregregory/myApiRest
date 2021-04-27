const express = require('express');
const bodyParser =require('body-parser')
const apiRouter = require('./apiRouter').router;



// server
const route = express();
// Body Parser config
route.use(bodyParser.urlencoded({ extended:true}));
route.use(bodyParser.json());


route.get('/', (req, res) => {
    res.setHeader(`Content-Type`, `text/html`);
    res.status(200).send('<h1> Bonjour greg </h1>');
});

route.use('/api/', apiRouter);

route.listen(8080, () => {
    console.log('server en ecoute')
})