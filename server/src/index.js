const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const playlistRouter = require('./routers/playlist');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(userRouter);
app.use(playlistRouter);

app.listen(port, () => {
    console.log("Server is up on port ", port);
});

