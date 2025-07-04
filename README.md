# MiniExpress

A minimal custom Express.js-like framework built using Node.js core modules — lightweight and perfect for learning how routing, request handling, and helper-style middleware works under the hood.

---

## Features

- Basic REST methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Automatic query parsing: `/query?key=value` 
- Built-in helpers:
  - `res.send(data)`
  - `res.json(obj)`
  - `res.status(code)`
  - `res.exitWith(code)`
- Custom 404 handler (`notFound404`)
- Logs all registered routes with `getRoutes()`
- Simple, clean, and modular code structure
- Zero dependencies

---

## Setup

> Node.js required

### 1. Clone the Repo

```bash
git clone https://github.com/sohaibalidev/MiniExpress.git
cd mini-express
```

### 2. File Structure

```
mini-express/
│
├── mini-express.js   # Core MiniExpress class
└── app.js            # Sample app usage
```

### 3. Run the Server

```bash
node app.js
```

Or with `nodemon`:

```bash
nodemon app.js
```

---

## Example: `app.js`

```js
const MiniExpress = require('./mini-express.js');
const app = new MiniExpress();

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
    res.status(404).json({ error: 'Route Not Found', method, path });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    app.getRoutes();
});
```

---

## API Testing (Thunder Client / Postman)

### `GET /`

**URL**: `http://localhost:3000/`  
**Response**:  
```
Welcome to MiniExpress!
```

---

### `GET /user`

**URL**: `http://localhost:3000/user`  
**Response**:
```json
{
  "username": "sohaib",
  "country": "Pakistan"
}
```

---

### `GET /status`

**URL**: `http://localhost:3000/status`  
**Response**: HTTP 204 No Content

---

### `GET /query?name=sohaib&age=18`

**URL**: `http://localhost:3000/query?name=sohaib&age=18`  
**Response**:
```json
{
  "receivedQuery": {
    "name": "sohaib",
    "age": 18
  }
}
```

---

### `GET /exit-test`

**URL**: `http://localhost:3000/exit-test`  
**Response**: HTTP 403 Forbidden (empty body)

---

### `POST /submit`

**URL**: `http://localhost:3000/submit`  
**Response**:  
```
Post received
```

---

## Available Response Helpers

| Method                | Description                                         |
|-----------------------|-----------------------------------------------------|
| `res.send(data)`      | Sends plain text or JSON with correct headers       |
| `res.json(obj)`       | Sends JSON with `Content-Type: application/json`    |
| `res.status(code)`    | Sets HTTP status code and enables method chaining   |
| `res.exitWith(code)`  | Sets status code and ends the response immediately  |

---

### Chaining Example

```js
res.status(400).send('Bad Request');
```

---

## Author

Made with simplicity by [Sohaib Ali](https://github.com/sohaibalidev)
