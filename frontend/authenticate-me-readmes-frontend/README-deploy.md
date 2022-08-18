# Authenticate Me - Deploying your Express + React app to Heroku

Before you begin deploying, **make sure to remove any `console.log`'s or
`debugger`'s in any production code**. You can search your entire project folder
if you are using them anywhere.

You will set up Heroku to run on a production, not development, version of your
application. When a Node.js application like yours is pushed up to Heroku, it is
identified as a Node.js application because of the `package.json` file. It runs
`npm install` automatically. **Then**, if there is a `heroku-postbuild` script
in the `package.json` file, it will run that script. Afterwards, it will
automatically run `npm start`.

In the following phases, you will configure your application to work in
production, not just in development, and configure the `package.json` scripts
for `install`, `heroku-postbuild` and `start` scripts to install, build your
React application, and start the Express production server.

## Phase 1: Setting up your Express + React application

Right now, your React application is on a different localhost port than your
Express application. However, since your React application only consists of
static files that don't need to bundled continuously with changes in production,
your Express application can serve the React assets in production too. These
static files live in the `frontend/build` folder after running `npm run build`
in the `frontend` folder.

Add the following changes into your `backend/routes.index.js` file.

At the root route, serve the React application's static `index.html` file along
with `XSRF-TOKEN` cookie. Then serve up all the React application's static
files using the `express.static` middleware. Serve the `index.html` and set the
`XSRF-TOKEN` cookie again on all routes that don't start in `/api`. You should
already have this set up in `backend/routes/index.js` which should now look
like this:

```js
// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

router.use('/api', apiRouter);

// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });
}

// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.status(201).json({});
  });
}

module.exports = router;
```

When Heroku runs `npm install`, it will use the `package.json` file at the very
root of your project directory (outside of both the `backend` and `frontend`
folders). Currently, the `install` script should be set to install the packages
only from the `backend` folder. Overwrite the `install` script in the root
`package.json` to also install the packages in the `frontend` folder:

```bash
npm --prefix backend install backend && npm --prefix frontend install frontend
```

This will run `npm install` in the `backend` folder then run `npm install` in
the `frontend` folder.

Next, define a `heroku-postbuild` script that will run the `npm run build`
command in the `frontend` folder. Remember, Heroku will automatically run this
script after running `npm install`. This will build the React static files in
the `frontend` folder. The `heroku-postbuild` script should run the `build`
script in the `frontend` folder:

```bash
npm run build --prefix frontend
```

The root `package.json`'s scripts should look like this:

```json
  "scripts": {
    "heroku-postbuild": "npm run build --prefix frontend",
    "install": "npm --prefix backend install backend && npm --prefix frontend install frontend",
    "dev:backend": "npm install --prefix backend start",
    "dev:frontend": "npm install --prefix frontend start",
    "sequelize": "npm run --prefix backend sequelize",
    "sequelize-cli": "npm run --prefix backend sequelize-cli",
    "start": "npm start --prefix backend"
  },
```

The `dev:backend` and `dev:frontend` scripts are optional and will not be used
for Heroku.

<!-- Not using CSP in helmet anymore -->
<!-- There's just one more thing to edit. For the `build` script in the
`frontend/package.json` file, add an `INLINE_RUNTIME_CHUNK=false` environment
variable before `react-scripts build`. This is necessary because the `helmet`
backend package is a middleware you added as an extra layer of security to the
Express application in production. The `helmet` middleware adds a [Content
Security Policy] which doesn't allow unsafe-inline JavaScript scripts. React,
by default, adds their JavaScript scripts as unsafe-inline. To remove this,
you need to have an environment variable of `INLINE_RUNTIME_CHUNK` set to
`false` before running `react-scripts build`.

`frontend/package.json`'s scripts should now look like this:

```json
  "scripts": {
    "start": "react-scripts start",
    "build": "INLINE_RUNTIME_CHUNK=false react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
``` -->

Finally, commit your changes.

## Phase 2: Deploy to Heroku

Once you're finished setting this up, make sure the changes are on the `main`
branch and push up the `main` branch, just run:

```bash
git push heroku main
```

You may want to make two applications on Heroku, the `main` branch site that
should have working code only. And your `staging` site that you can use to test
your work new features on the `dev` branch.

Make sure the production database is seeded and migrated (see backend
deployment instructions as a reminder on how to do that).

Open your deployed site and check to see if you successfully deployed your
Express + React application to Heroku!

If you see an `Application Error` or are experiencing different behavior than
what you see in your local environment, check the logs by running:

```bash
heroku logs
```

If you want to open a connection to the logs to continuously output to your
terminal, then run:

```bash
heroku logs --tail
```

The logs may clue you into why you are experiencing errors or different
behavior.

### Wrapping up

You can also open your site in the browser with `heroku open`. If it works,
congratulations, you've created a production-ready, dynamic, full-stack website
that can be securely accessed anywhere in the world! Give yourself a pat on the
back. You're a web developer!

[Heroku Dashboard]: https://dashboard.heroku.com/
[Create Heroku Account]: https://signup.heroku.com/
[Heroku CLI]: https://devcenter.heroku.com/articles/heroku-command-line
[Setting Heroku Config Variables]: https://devcenter.heroku.com/articles/config-vars
[Content Security Policy]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP