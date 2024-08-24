-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS bare_permissions (
	id uuid PRIMARY KEY,
	object_type VARCHAR(50) NOT NULL,
	object_id uuid,
	user_id uuid NOT NULL,
	workspace_id uuid NOT NULL,
	level int NOT NULL DEFAULT 1 -- 1=none, 2=read, 4=write, 8=delete, 16=admin
);

CREATE TABLE IF NOT EXISTS roles (
	id uuid PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	description VARCHAR(500),
	permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
	workspace_id uuid NOT NULL,
	created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	created_by_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS roles_users_relation (
	role_id uuid NOT NULL,
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
