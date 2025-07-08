const MiniExpress = require('./mini-express.js');
const app = new MiniExpress();

// Middlewares
app.use((req, res, next) => {
    console.log('\n\nThis Is Global Middleware')
    next();
})

// ================== Middlewares ==================

const checkLoginStatus = (req, res, next) => {
    const loggedIn = req.headers.isloggedin === "true";
    
    if (loggedIn) {
        console.log('Already logged in');
        return res.status(400).send('Already Logged In');
    }

    console.log('User not logged in');
    next();
};

const validateLoginFields = (req, res, next) => {
    // Mocking user input
    req.body = { username: 'sohaib', password: '123456' };

    const { username, password } = req.body;

    if (!username || !password) {
        console.log('Missing login fields');
        return res.status(400).json({ error: 'Username and password are required' });
    }

    console.log('Login fields look good');
    next();
};

// ================== Login Route ==================

app.post('/login', checkLoginStatus, validateLoginFields, (req, res) => {
    console.log('/login hit!');
    res.status(200).send('Logged In');
});

app.get('/', (req, res) => {
    res.send('Welcome to MiniExpress!');
});

app.get('/user', (req, res) => {
    res.json({ username: 'sohaib', country: 'Pakistan' });
});

app.get('/status', (req, res) => {
    res.status(204).send();
});

app.get('/query', (req, res) => {
    res.json({ receivedQuery: req.query });
});

app.get('/exit-test', (req, res) => {
    res.exitWith(403);
});

app.post('/submit', (req, res) => {
    res.status(201).send('Post received');
});

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
