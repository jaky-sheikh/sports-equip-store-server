const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middlware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Sports equipment server is running')
})

app.listen(port, () => {
    console.log(`Sports server is running on port: ${port}`)
})
