# social-network-chat-back

A Node.js/TypeScript backend for a social network chat application using Express, Socket.IO, and PostgreSQL.

## Prerequisites

- **Node.js** (v18 or higher)
- **Docker** (for PostgreSQL database)
- **npm** or **yarn**

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydb
```

### 3. Database Setup with Docker

#### First Time Setup

Run PostgreSQL container with persistent data:

```bash
docker run --name my-postgres \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -v my_postgres_data:/var/lib/postgresql/data \
  -d postgres
```

#### Starting Existing Container

If you already have the container created:

```bash
docker start my-postgres
```

#### Verify Container Status

```bash
docker ps
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` with Socket.IO on `http://localhost:3000/socket`.

## Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run types:check` - Check TypeScript types without emitting files
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Database Management

### Connection Details

- **Host**: `localhost`
- **Port**: `5432`
- **Username**: `myuser`
- **Password**: `mypassword`
- **Database**: `mydb`

### Accessing PostgreSQL

#### Via Docker Terminal

```bash
docker exec -it my-postgres psql -U myuser -d mydb
```

#### Via External Tools

Use tools like [pgAdmin](https://www.pgadmin.org/) or [DBeaver](https://dbeaver.io/) with the connection details above.

### Docker Container Management

| Command                            | Description                                       |
| ---------------------------------- | ------------------------------------------------- |
| `docker start my-postgres`         | Start the PostgreSQL container                    |
| `docker stop my-postgres`          | Stop the PostgreSQL container                     |
| `docker restart my-postgres`       | Restart the PostgreSQL container                  |
| `docker logs my-postgres`          | View container logs                               |
| `docker exec -it my-postgres bash` | Access container shell                            |
| `docker rm my-postgres`            | Remove container (⚠️ Will lose data if no volume) |

### Data Persistence

The setup uses a Docker volume `my_postgres_data` to persist database data. This ensures your data survives container restarts and removals.

To view Docker volumes:

```bash
docker volume ls
```

To inspect the volume:

```bash
docker volume inspect my_postgres_data
```

## Troubleshooting

### Database Connection Issues

If you see connection errors, the application will automatically display Docker setup instructions. Common solutions:

1. **Container not running**: `docker start my-postgres`
2. **Wrong credentials**: Check your `.env` file matches Docker environment variables
3. **Port conflicts**: Ensure port 5432 is not used by other services

### TypeScript/ESM Issues

If you encounter module resolution errors:

1. Ensure you're using the correct Node.js version (18+)
2. Try using `tsx` instead of `ts-node-esm`: `npm install --save-dev tsx`
3. Update the dev script to: `"dev": "nodemon --exec tsx src/index.ts"`

### Socket.IO Connection Issues

- Verify CORS settings in `./middlewares/cors`
- Check that the client connects to the correct path: `/socket`
- Ensure the server is running on the expected port

## Project Structure

```
src/
├── api/           # API routes
├── config/        # Configuration files
├── db/           # Database connection and queries
├── middlewares/  # Express middlewares
├── socket/       # Socket.IO handlers
└── index.ts      # Application entry point
```

## Development Features

- **Hot Reload**: Automatic server restart on code changes
- **TypeScript**: Full TypeScript support with strict mode
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Morgan**: HTTP request logging
- **CORS**: Cross-origin resource sharing configuration

## Production Deployment

1. Build the application: `npm run build`
2. Set `NODE_ENV=production` in your environment
3. Use a production PostgreSQL instance
4. Start with: `npm start`

## Contributing

Run tests and linting: `npm test && npm run lint`

## License

ISC
