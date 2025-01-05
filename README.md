# social-network-chat-back

# PostgreSQL with Docker: Quick Start Guide

This guide explains how to set up and run a PostgreSQL server using Docker, including starting and restarting the container.

## Prerequisites

1. **Install Docker**: Ensure Docker is installed on your machine. Download it from [Docker's official website](https://www.docker.com/products/docker-desktop) if needed.

---

## Initial Setup

### Step 1: Run PostgreSQL Container

Open your terminal and execute the following command:

```bash
docker run --name my-postgres \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -d postgres
```

### Explanation of Flags:

- `--name my-postgres`: Assigns a name to your container (e.g., `my-postgres`).
- `-e POSTGRES_USER=myuser`: Specifies the PostgreSQL username.
- `-e POSTGRES_PASSWORD=mypassword`: Specifies the PostgreSQL password.
- `-e POSTGRES_DB=mydb`: Creates a default database named `mydb`.
- `-p 5432:5432`: Maps port 5432 of the container to port 5432 on your local machine.
- `-d postgres`: Downloads and runs the default PostgreSQL image.

### Verify the Container is Running

Use the following command to check the status of the container:

```bash
docker ps
```

If the container is running, you will see it listed in the output.

---

## Accessing the PostgreSQL Server

### From Docker Terminal

To access the PostgreSQL server directly from the Docker container, run:

```bash
docker exec -it my-postgres psql -U myuser -d mydb
```

### From External Tools

You can connect to PostgreSQL using tools like `psql` or GUI clients like [pgAdmin](https://www.pgadmin.org/). Use the following connection details:

- **Host**: `localhost`
- **Port**: `5432`
- **Username**: `myuser`
- **Password**: `mypassword`
- **Database**: `mydb`

---

## Persistent Data

By default, data will be lost when the container stops. To ensure data persistence, use a Docker volume:

```bash
docker run --name my-postgres \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -v my_postgres_data:/var/lib/postgresql/data \
  -d postgres
```

Here, `my_postgres_data` is the volume that will store your database files.

---

## Restarting the PostgreSQL Container

### To Start the Container Again

If the container is stopped, you can restart it using:

```bash
docker start my-postgres
```

### To Stop the Container

To stop the container, run:

```bash
docker stop my-postgres
```

### To Remove the Container

If you need to delete the container, use:

```bash
docker rm my-postgres
```

If you plan to reuse the data, make sure the volume (`my_postgres_data`) is not removed.

---

## Summary

1. Use `docker run` to set up and start the PostgreSQL server.
2. Use `docker exec` to access the server.
3. Use volumes to persist data.
4. Use `docker start` and `docker stop` to manage the container lifecycle.

With these steps, you can efficiently set up and manage PostgreSQL with Docker!
