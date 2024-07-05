**Reference**

- Heavy Action [ Write(W) or Update(U) ]

---

| Model Name                    | Heavy | Database | Remarks                                 |
| ----------------------------- | ----- | -------- | --------------------------------------- |
| users                         | U     | Postgres |                                         |
| workspaces                    | U     | Postgres |                                         |
| user_invites                  | W     | Mongo    |                                         |
| -                             |       |          |                                         |
| employees                     | U     | Postgres | Halt                                    |
| attendance                    | W     | Mongo    | Halt                                    |
| -                             |       |          |                                         |
| dashboards                    | W     |          | Halt                                    |
| dashboard_kpis                | W     |          | Halt                                    |
| dashboard_charts              | W     |          | Halt                                    |
| -                             |       |          |                                         |
| contacts                      | W     |          | Halt                                    |
| email_templates               | W     |          | Halt                                    |
| bulk_email_requests           | W     |          | Halt                                    |
| -                             |       |          |                                         |
| forms                         | UW    |          | form and form body into separate models |
| form_responses                | W     |          | Mongo                                   |
| -                             |       |          |                                         |
| project_cycles                | W     | Mongo    |                                         |
| project_tags                  | W     | Mongo    |                                         |
| project_task_comments         | W     | Mongo    |                                         |
| project_tasks                 | U     |          |                                         |
| projects                      | U     |          |                                         |
| -                             |       |          |                                         |
| table_export_logs             | W     |          |                                         |
| -                             |       |          |                                         |
| workflows                     |       |          | Halt                                    |
| workflow_steps                |       |          | Halt                                    |
| workflow_execution_logs       | W     |          | Halt                                    |
| -                             |       |          |                                         |
| user_webui_notifications      | W     | Mongo    |                                         |
| workspace_webui_notifications | W     | Mongo    |                                         |

---
