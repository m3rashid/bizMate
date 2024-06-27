package dashboard

type CreateDashboardBody struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Active      bool   `json:"active"`
}
