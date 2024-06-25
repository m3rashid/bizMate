package models

var AllModels = []interface{}{
	&User{},

	&Contact{},

	&Kpi{},
	&Widget{},
	&Dashboard{},

	&EmailTemplate{},
	&BulkEmailRequest{},

	&TableExportLog{},

	&Form{},
	&FormResponse{},

	&Tenant{},

	&Employee{},
	&Attendance{},

	&WebUiNotification{},

	&ProjectTag{},
	&ProjectTask{},
	&Project{},
	&ProjectCycle{},
	&ProjectTaskEvent{},

	&Workflow{},
	&WorkflowStep{},
	&WorkflowExectionLog{},
}
