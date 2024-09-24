### BizMate

<a href="https://www.producthunt.com/posts/bizmate-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-bizmate&#0045;2" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=491314&theme=light" alt="Bizmate - Streamline&#0032;your&#0032;organization&#0032;workflow | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

BizMate is an open-source business management system that aims to streamline the process of managing businesses with the following key features

- **Independent Workspaces**: Manage multiple business environments with separate workspaces.
- **User Management**: Invite users, assign roles, and set permissions within each workspace.
- **Role-Based Access Control**: Fully customizable roles and permission settings for enhanced security.
- **Forms Management**: Includes a drag-and-drop builder for creating forms, along with analytics and insights for better data management.
- **Upcoming Features**: Currently working on adding a calendar feature to help with scheduling.

<img src="./screenshots/1.png" />
<img src="./screenshots/2.png" />
<img src="./screenshots/3.png" />

#### Tech Stack

- **Frontend**: TypeScript, NextJs, React, HeadlessUI, Tailwindcss
- **Backend**: Golang, GoFiber, AWS
- **Database**: PostgreSQL, SQLC (query-parser and codegen), Goose (database migrations), MongoDB (logs and responses)
- **Others**: Docker, Docker compose, Makefile, Shell, Caddy server, Air (hot-reload)

#### Installation

To get started with BizMate, follow these steps:

**Prerequisites**

- Docker & Docker Compose installed on your machine
- Go, Node.js, and Yarn installed

**Steps**

1. Clone the repository:

```bash
git clone https://github.com/m3rashid/bizMate.git
```

2. Navigate to the project directory:

```bash
cd bizMate/backend
```

3. Configuration

```bash
# You can configure the environment variables in the .env file.
# Make sure to set up your database configurations properly depending on your development or production environment.
cp .env.sample .env.local
```

4. Setup tools

```bash
go install github.com/pressly/goose/v3/cmd/goose@latest # install goose for migrations
# or if you have a mac, you can do `brew install goose`

go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest # install sqlc for query-building
```

5. Build and run the app using Docker Compose:

```bash
docker compose up
```

#### Contributions

Feel free to open issues or pull requests to contribute to the project.
