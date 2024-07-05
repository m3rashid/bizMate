-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;
-- SET default_tablespace = '';
-- SET default_table_access_method = heap;


CREATE TABLE attendance (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone
);

CREATE TABLE bulk_email_requests (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  email_template_id uuid NOT NULL,
  body_variable_mapping text,
  subject_variable_mapping text
);

CREATE TABLE contacts (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  birthday timestamp with time zone,
  other_phones text,
  other_emails text,
  other_details text
);

CREATE TABLE dashboard_charts (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  dashboard_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  refresh_interval bigint NOT NULL,
  position bigint NOT NULL,
  model text NOT NULL,
  x_label text,
  y_label text,
  x_data_key text,
  y_data_key text,
  chart_type text,
  chart_options text
);

CREATE TABLE dashboard_kpis (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  dashboard_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  model text NOT NULL,
  model_field text NOT NULL,
  aggregation_type text NOT NULL,
  time_period bigint NOT NULL
);

CREATE TABLE dashboards (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  title text NOT NULL,
  description text NOT NULL,
  active boolean DEFAULT false
);

CREATE TABLE email_templates (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  title text NOT NULL,
  description text,
  variables text,
  subject_template text NOT NULL,
  body_template_html text NOT NULL,
  body_template_design_json text NOT NULL
);

CREATE TABLE employees (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  user_id uuid NOT NULL,
  employement_type bigint NOT NULL,
  monthly_salary numeric NOT NULL,
  weekly_hours numeric NOT NULL
);

CREATE TABLE form_responses (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  updated_by_id uuid,
  created_by_id uuid,
  form_id uuid NOT NULL,
  response text NOT NULL,
  device_ip text
);

CREATE TABLE forms (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  title text NOT NULL,
  description text NOT NULL,
  body text NOT NULL,
  submit_text text NOT NULL,
  cancel_text text NOT NULL,
  success_page text,
  failure_page text,
  active boolean DEFAULT false,
  send_response_email boolean DEFAULT false,
  allow_anonymous_response boolean DEFAULT true,
  allow_response_update boolean DEFAULT false,
  allow_multiple_response boolean DEFAULT false,
  previous_version_ids text DEFAULT '[]'::text
);

CREATE TABLE project_cycles (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  cycle_goals text,
  project_id uuid NOT NULL,
  cycle_days_count bigint NOT NULL,
  start_day timestamp with time zone NOT NULL
);

CREATE TABLE project_tags (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  name text NOT NULL
);

CREATE TABLE project_task_comments (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  task_id uuid NOT NULL,
  type text NOT NULL,
  data text NOT NULL
);

CREATE TABLE project_tasks (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL,
  deadline timestamp with time zone,
  project_id uuid NOT NULL,
  parent_task_id uuid
);

CREATE TABLE projects (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  name text NOT NULL,
  description text NOT NULL,
  abandoned boolean DEFAULT false,
  completed boolean DEFAULT false,
  readme text,
  guidelines text,
  docs text
);

CREATE TABLE table_export_logs (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL
);

CREATE TABLE tags_task_relation (
  project_task_id uuid NOT NULL,
  project_tag_id uuid NOT NULL
);

CREATE TABLE user_invites (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  status bigint,
  plain_text_password text
);

CREATE TABLE user_webui_notifications (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  link text,
  read boolean
);

CREATE TABLE users (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  avatar text,
  deactivated boolean,
  provider text NOT NULL,
  password text NOT NULL,
  refresh_token text
);

CREATE TABLE users_project_relation (
  project_id uuid NOT NULL,
  user_id uuid NOT NULL
);

CREATE TABLE users_task_relation (
  project_task_id uuid NOT NULL,
  user_id uuid NOT NULL
);

CREATE TABLE users_workspace_relation (
  workspace_id uuid NOT NULL,
  user_id uuid NOT NULL
);

CREATE TABLE workflow_execution_logs (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  workflow_step_id uuid NOT NULL,
  output text NOT NULL
);

CREATE TABLE workflow_steps (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  function_name text NOT NULL,
  input text NOT NULL,
  workflow_id uuid NOT NULL
);

CREATE TABLE workflows (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  updated_by_id uuid,
  name text NOT NULL,
  description text NOT NULL,
  active boolean NOT NULL,
  edges text NOT NULL
);

CREATE TABLE workspace_webui_notifications (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  link text,
  read text
);

CREATE TABLE workspaces (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_by_id uuid NOT NULL,
  name text
);

CREATE TABLE workspaces_user_relation (
  user_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
	PRIMARY KEY (user_id, workspace_id)
);

ALTER TABLE ONLY attendance ADD CONSTRAINT fk_attendance_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY attendance ADD CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY bulk_email_requests ADD CONSTRAINT fk_bulk_email_requests_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY bulk_email_requests ADD CONSTRAINT fk_bulk_email_requests_email_template FOREIGN KEY (email_template_id) REFERENCES email_templates(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY contacts ADD CONSTRAINT fk_contacts_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY contacts ADD CONSTRAINT fk_contacts_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY dashboard_charts ADD CONSTRAINT fk_dashboard_charts_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY dashboard_charts ADD CONSTRAINT fk_dashboard_charts_dashboard FOREIGN KEY (dashboard_id) REFERENCES dashboards(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY dashboard_charts ADD CONSTRAINT fk_dashboard_charts_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY dashboard_kpis ADD CONSTRAINT fk_dashboard_kpis_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY dashboard_kpis ADD CONSTRAINT fk_dashboard_kpis_dashboard FOREIGN KEY (dashboard_id) REFERENCES dashboards(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY dashboard_kpis ADD CONSTRAINT fk_dashboard_kpis_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY dashboards ADD CONSTRAINT fk_dashboards_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY dashboards ADD CONSTRAINT fk_dashboards_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY email_templates ADD CONSTRAINT fk_email_templates_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY email_templates ADD CONSTRAINT fk_email_templates_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY employees ADD CONSTRAINT fk_employees_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY employees ADD CONSTRAINT fk_employees_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY employees ADD CONSTRAINT fk_employees_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY form_responses ADD CONSTRAINT fk_form_responses_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY form_responses ADD CONSTRAINT fk_form_responses_form FOREIGN KEY (form_id) REFERENCES forms(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY form_responses ADD CONSTRAINT fk_form_responses_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY forms ADD CONSTRAINT fk_forms_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY forms ADD CONSTRAINT fk_forms_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY project_cycles ADD CONSTRAINT fk_project_cycles_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY project_cycles ADD CONSTRAINT fk_project_cycles_project FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY project_cycles ADD CONSTRAINT fk_project_cycles_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY project_task_comments ADD CONSTRAINT fk_project_task_comments_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY project_task_comments ADD CONSTRAINT fk_project_task_comments_task FOREIGN KEY (task_id) REFERENCES project_tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY project_task_comments ADD CONSTRAINT fk_project_task_comments_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY project_tasks ADD CONSTRAINT fk_project_tasks_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY project_tasks ADD CONSTRAINT fk_project_tasks_parent_task FOREIGN KEY (parent_task_id) REFERENCES project_tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY project_tasks ADD CONSTRAINT fk_project_tasks_project FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY project_tasks ADD CONSTRAINT fk_project_tasks_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY projects ADD CONSTRAINT fk_projects_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY projects ADD CONSTRAINT fk_projects_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY table_export_logs ADD CONSTRAINT fk_table_export_logs_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY tags_task_relation ADD CONSTRAINT fk_tags_task_relation_project_tag FOREIGN KEY (project_tag_id) REFERENCES project_tags(id);

ALTER TABLE ONLY tags_task_relation ADD CONSTRAINT fk_tags_task_relation_project_task FOREIGN KEY (project_task_id) REFERENCES project_tasks(id);

ALTER TABLE ONLY users_project_relation ADD CONSTRAINT fk_users_project_relation_project FOREIGN KEY (project_id) REFERENCES projects(id);

ALTER TABLE ONLY users_project_relation ADD CONSTRAINT fk_users_project_relation_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE ONLY users_task_relation ADD CONSTRAINT fk_users_task_relation_project_task FOREIGN KEY (project_task_id) REFERENCES project_tasks(id);

ALTER TABLE ONLY users_task_relation ADD CONSTRAINT fk_users_task_relation_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE ONLY users_workspace_relation ADD CONSTRAINT fk_users_workspace_relation_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE ONLY users_workspace_relation ADD CONSTRAINT fk_users_workspace_relation_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE ONLY workflow_execution_logs ADD CONSTRAINT fk_workflow_execution_logs_workflow_step FOREIGN KEY (workflow_step_id) REFERENCES workflow_steps(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY workflow_steps ADD CONSTRAINT fk_workflow_steps_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY workflow_steps ADD CONSTRAINT fk_workflow_steps_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY workflow_steps ADD CONSTRAINT fk_workflow_steps_workflow FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY workflows ADD CONSTRAINT fk_workflows_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY workflows ADD CONSTRAINT fk_workflows_updated_by_user FOREIGN KEY (updated_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY workspaces ADD CONSTRAINT fk_workspaces_created_by_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY workspaces_user_relation ADD CONSTRAINT fk_workspaces_user_relation_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE ONLY workspaces_user_relation ADD CONSTRAINT fk_workspaces_user_relation_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id);
