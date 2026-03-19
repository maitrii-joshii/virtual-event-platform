require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    if(err) {
        return console.error("Failed to start server: ", err);
    }
    console.log(`Application has started on http://localhost:${PORT}`);
});