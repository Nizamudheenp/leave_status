const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const connectDB = require('./config/db');
connectDB();

const leaveRoutes = require('./routes/leaveRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
