-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS bare_permissions (
	id SERIAL PRIMARY KEY,
	object_type VARCHAR(50) NOT NULL,
	object_id uuid NOT NULL,
	user_id uuid NOT NULL,
	workspace_id uuid NOT NULL,
	permission int NOT NULL DEFAULT 0 -- 0=none, 1=read, 2=write, 3=delete
);

CREATE TABLE IF NOT EXISTS roles (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	description VARCHAR(500),
	permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
	workspace_id uuid NOT NULL,
	created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	created_by_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS roles_users_relation (
	role_id int NOT NULL,
	user_id uuid NOT NULL,
	workspace_id uuid NOT NULL,
	PRIMARY KEY (role_id, user_id, workspace_id)
);

ALTER TABLE ONLY bare_permissions ADD CONSTRAINT fk_bare_permissions_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE ONLY bare_permissions ADD CONSTRAINT fk_bare_permissions_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE ONLY roles ADD CONSTRAINT fk_roles_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY roles_users_relation ADD CONSTRAINT fk_roles_users_relation_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE ONLY roles_users_relation ADD CONSTRAINT fk_roles_users_relation_role FOREIGN KEY (role_id) REFERENCES roles(id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS bare_permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS roles_users_relation CASCADE;
-- +goose StatementEnd
