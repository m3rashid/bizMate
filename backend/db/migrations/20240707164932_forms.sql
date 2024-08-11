-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS forms (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(500) NOT NULL,
	form_body jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean DEFAULT false,
	submit_text VARCHAR(50) DEFAULT 'Submit',
	cancel_text VARCHAR(50) DEFAULT 'Cancel',
  send_response_email boolean DEFAULT false,
  allow_anonymous_responses boolean DEFAULT true,
  allow_multiple_responses boolean DEFAULT false
);

ALTER TABLE ONLY forms ADD CONSTRAINT fk_forms_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY forms ADD CONSTRAINT fk_forms_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS forms CASCADE;
DROP TABLE IF EXISTS form_responses CASCADE;
-- +goose StatementEnd
