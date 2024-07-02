package auth

type redisterBodyReq struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Phone    string `json:"phone,omitempty"`
	Password string `json:"password" validate:"required"`
}

type loginBodyReq struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type createWorkspaceReq struct {
	Name string `json:"name"`
}
