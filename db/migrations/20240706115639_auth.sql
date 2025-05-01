-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  avatar text NOT NULL,
  deactivated boolean DEFAULT false,
  provider text NOT NULL CHECK(provider in ('google', 'credentials')),
  password text NOT NULL,
  refresh_token text NOT NULL
);

CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
	description VARCHAR(500),
  deleted boolean DEFAULT false,
	color VARCHAR(9) NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_by_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS users_workspaces_relation (
  user_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  deleted boolean DEFAULT false,
	PRIMARY KEY (user_id, workspace_id)
);

CREATE TABLE IF NOT EXISTS workspace_invites (
  id uuid PRIMARY KEY,
  workspace_id uuid NOT NULL,
  email VARCHAR(50) NOT NULL,
  status int NOT NULL DEFAULT 0, -- 0=pending, 1=accepted, -1=rejected
	created_by_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ONLY users_workspaces_relation ADD CONSTRAINT fk_users_workspace_relation_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE ONLY users_workspaces_relation ADD CONSTRAINT fk_users_workspace_relation_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE ONLY workspaces ADD CONSTRAINT fk_workspaces_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS workspace_invites CASCADE;
DROP TABLE IF EXISTS users_workspaces_relation CASCADE;
-- +goose StatementEnd
