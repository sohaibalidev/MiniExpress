const MiniExpress = require('./mini-express.js');
const app = new MiniExpress();

// Root route with plain string response
app.get('/', (req, res) => {
    res.send('Welcome to MiniExpress!');
});

// JSON response route
app.get('/user', (req, res) => {
    res.json({ username: 'sohaib', country: 'Pakistan' });
});

// Status chaining response
app.get('/status', (req, res) => {
    res.status(204).send();
});

// Route testing query params
// Example: GET /query?name=sohaib&age=18
app.get('/query', (req, res) => {
    res.json({ receivedQuery: req.query });
});

// Custom exit with status code
app.get('/exit-test', (req, res) => {
    res.exitWith(403);
});

// POST example with simple response
app.post('/submit', (req, res) => {
    res.status(201).send('Post received');
});

// Route not found will trigger 404
app.notFound404((req, res) => {
    const { method, path } = req;
    const jsonMsg = { error: "Route Not Found", method, path }

    console.log(jsonMsg)
    res.status(404).json(jsonMsg);
});


// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    app.getRoutes();
});
