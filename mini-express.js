class MiniExpress {
  #http = require("http");
  #notfoundfunc;
  #routes;
  #middlewares;

  constructor() {
    this.#routes = {};
    this.#middlewares = [];
    this.#notfoundfunc = null;
  }

  getRoutes() {
    console.log("Registered Routes:");
    for (const [method, routes] of Object.entries(this.#routes)) {
      console.log(`\n${method}:`);
      for (const [path] of Object.entries(routes)) {
        console.log(`-> [ ${path} ]`);
      }
    }
  }

  use(middleware) {
    if (!middleware || typeof middleware !== "function")
      throw new Error("middleware must be a function");

    this.#middlewares.push(middleware);
  }

  #attachHelpers(res) {
    res.send = (data) => {
      if (typeof data !== "string" && typeof data !== "object")
        throw new Error("Response must be a string or object");

      if (typeof data === "string") res.setHeader("Content-Type", "text/plain");
      else {
        res.setHeader("Content-Type", "application/json");
        data = JSON.stringify(data);
      }
      res.end(data);
    };

    res.status = (code) => {
      res.statusCode = code;
      return res;
    };

    res.exitWith = (code) => {
      res.statusCode = code;
      res.end();
    };

    res.json = (obj) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(obj));
    };
  }

  #methodHandler(method, path, handlers) {
    if (!path) throw new Error("Path is not defined");
    if (!handlers) throw new Error("Handler is not defined");

    if (!this.#routes[method]) this.#routes[method] = {};
    this.#routes[method][path] = handlers;
  }

  #requestParser(req) {
    if (!req) return;
    let [path, rawQuery] = req.url.split("?");
    let parsedQuery = {};

    if (rawQuery) {
      parsedQuery = Object.fromEntries(
        rawQuery.split("&").map((q) => {
          const [key, value = ""] = q.split("=");
          try {
            return [key, JSON.parse(decodeURIComponent(value))];
          } catch {
            return [key, decodeURIComponent(value)];
          }
        })
      );
    }

    req.path = path;
    req.query = parsedQuery;
  }

  #runMiddleware(req, res, routeHandlers) {
    let globalIndex = 0;
    const runGlobalMiddleware = () => {
      if (globalIndex < this.#middlewares.length)
        this.#middlewares[globalIndex++](req, res, runGlobalMiddleware);

      else runRouteHandlers();
    }

    let routeIndex = 0;
    const runRouteHandlers = () => {
      if (routeIndex < routeHandlers.length)
        routeHandlers[routeIndex++](req, res, runRouteHandlers);
    }

    runGlobalMiddleware();
  }

  #requestHandler(req, res) {
    const { method, path } = req;
    const routeHandler = this.#routes[method]?.[path];

    if (routeHandler)
      return this.#runMiddleware(req, res, routeHandler)

    if (typeof this.#notfoundfunc === "function")
      return this.#notfoundfunc(req, res);

    return res.status(404).send("404 Not Found");
  }

  get = (path, ...handler) => this.#methodHandler("GET", path, handler);
  post = (path, ...handler) => this.#methodHandler("POST", path, handler);
  put = (path, ...handler) => this.#methodHandler("PUT", path, handler);
  patch = (path, ...handler) => this.#methodHandler("PATCH", path, handler);
  delete = (path, ...handler) => this.#methodHandler("DELETE", path, handler);

  notFound404 = (callback) => (this.#notfoundfunc = callback);

  listen(port, callback) {
    const server = this.#http.createServer((req, res) => {
      this.#attachHelpers(res);
      this.#requestParser(req);
      this.#requestHandler(req, res);
    });

    server.listen(port, () => {
      if (callback) callback();
    });
  }
}

module.exports = MiniExpress;
