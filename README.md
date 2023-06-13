# Space Web App

## Prerequisite

you need to provide the following environment variables to run the server:

- `MONGO_URI`: your MongoDB connection string
- `JWT_SECRET`: your JWT secret key

see [.env.example](./server/.env.example) in the server directory for example.

## Install the App

Open your terminal from the root directory, and run the following commands:

```bash
npm run install-server
```

```bash
npm run install-client
```

## Run the App

Open your terminal from the root directory, and run the following commands:

```bash
npm run dev-server
```

```bash
npm run start-client
```

**NOTES**

- nodemon package is required for development.
- The server runs on port 4000 by default
- The client runs on port 3000 by default

## Build the App

Open your terminal from the root directory, and run the following commands:

```bash
npm run build-server
```

```bash
npm run build-client
```

to start the built server:

```bash
npm run start-server
```
