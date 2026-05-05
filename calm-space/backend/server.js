require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8081', 'http://172.20.10.3:8081'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/auth', require('./routes/Auth'));
app.use('/users', require('./routes/Users'));
app.use('/emotions', require('./routes/Emotions'));
app.use('/favorites', require('./routes/Favorites'));
app.use('/stress', require('./routes/Stress'));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
