-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS calendar_event (
	id uuid PRIMARY KEY,
	deleted boolean DEFAULT false,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	name VARCHAR(100) NOT NULL,
	is_private boolean DEFAULT false,
	start_time TIMESTAMP WITH TIME ZONE NOT NULL,
	end_time TIMESTAMP WITH TIME ZONE NOT NULL,
	recurrence_rule VARCHAR(500), -- iCal RFC 5545
	description text,
	created_by_id uuid NOT NULL,
	workspace_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS calendar_event_exceptions (
	id uuid PRIMARY KEY,
	event_id uuid NOT NULL,
	occurrence_time TIMESTAMP WITH TIME ZONE NOT NULL,
	action int NOT NULL DEFAULT 0, -- 0=skip, 1=modify, 2=cancel
	created_by_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS calendar_event_participants (
	user_id uuid NOT NULL,
	event_id uuid NOT NULL,
	PRIMARY KEY (user_id, event_id)
);

CREATE TABLE IF NOT EXISTS calendar_event_invites (
	id uuid PRIMARY KEY,
	event_id uuid NOT NULL,
	user_id uuid NOT NULL,
	status int NOT NULL DEFAULT 0, -- 0=pending, 1=accepted, -1=rejected
	created_by_id uuid NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ONLY calendar_event ADD CONSTRAINT fk_calendar_event_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY calendar_event ADD CONSTRAINT fk_calendar_event_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY calendar_event_exceptions ADD CONSTRAINT fk_calendar_event_exception_event FOREIGN KEY (event_id) REFERENCES calendar_event(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY calendar_event_exceptions ADD CONSTRAINT fk_calendar_event_exception_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY calendar_event_participants ADD CONSTRAINT fk_calendar_event_participants_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY calendar_event_participants ADD CONSTRAINT fk_calendar_event_participants_event FOREIGN KEY (event_id) REFERENCES calendar_event(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY calendar_event_invites ADD CONSTRAINT fk_calendar_event_invite_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY calendar_event_invites ADD CONSTRAINT fk_calendar_event_invite_event FOREIGN KEY (event_id) REFERENCES calendar_event(id) ON UPDATE CASCADE ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS calendar_event CASCADE;
DROP TABLE IF EXISTS calendar_event_exceptions CASCADE;
DROP TABLE IF EXISTS calendar_event_participants CASCADE;
DROP TABLE IF EXISTS calendar_event_invites CASCADE;
-- +goose StatementEnd
