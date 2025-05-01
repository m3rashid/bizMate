SET client_encoding = 'UTF8';


CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone
);

CREATE TABLE IF NOT EXISTS bulk_email_requests (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL,
  email_template_id uuid NOT NULL,
  body_variable_mapping text,
  subject_variable_mapping text
);

CREATE TABLE IF NOT EXISTS contacts (
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

CREATE TABLE IF NOT EXISTS dashboard_charts (
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

CREATE TABLE IF NOT EXISTS dashboard_kpis (
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

CREATE TABLE IF NOT EXISTS dashboards (
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

CREATE TABLE IF NOT EXISTS email_templates (
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

CREATE TABLE IF NOT EXISTS employees (
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

CREATE TABLE IF NOT EXISTS project_cycles (
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

CREATE TABLE IF NOT EXISTS project_tags (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  name text NOT NULL
);

CREATE TABLE IF NOT EXISTS project_task_comments (
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

CREATE TABLE IF NOT EXISTS project_tasks (
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

CREATE TABLE IF NOT EXISTS projects (
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

CREATE TABLE IF NOT EXISTS table_export_logs (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  created_by_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS tags_task_relation (
  project_task_id uuid NOT NULL,
  project_tag_id uuid NOT NULL
);


CREATE TABLE IF NOT EXISTS user_webui_notifications (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  link text,
  read boolean
);

CREATE TABLE IF NOT EXISTS users_project_relation (
  project_id uuid NOT NULL,
  user_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS users_task_relation (
  project_task_id uuid NOT NULL,
  user_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS workspace_webui_notifications (
  id uuid PRIMARY KEY,
  deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  workspace_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  link text,
  read text
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
