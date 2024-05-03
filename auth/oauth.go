package auth

import (
	"bizmate/models"
	"bizmate/utils"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/shareed2k/goth_fiber"
)

func beginAuth(ctx *fiber.Ctx) error {
	return goth_fiber.BeginAuthHandler(ctx)
}

func getRedirectUrl(success bool, err string) string {
	return os.Getenv("AUTH_CLIENT_CALLBACK") + utils.Conditional("?success=true", "?success=false&error="+err, success)
}

func authCallback(ctx *fiber.Ctx) error {
	tenantUrl := ctx.Query("tenant")
	if tenantUrl == "" {
		return ctx.Redirect(getRedirectUrl(false, "request_forged"))
	}

	user, err := goth_fiber.CompleteUserAuth(ctx)
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "auth_failed"))
	}

	db, err := utils.GetTenantDBFromTenantUrl(tenantUrl)
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "tenant_not_found"))
	}

	existingUser := models.User{}
	if err = db.Where("email = ?", user.Email).Find(&existingUser).Error; err != nil {
		fmt.Println(err)
		return ctx.Redirect(getRedirectUrl(false, "internal_server_error"))
	}

	return ctx.Redirect(os.Getenv("AUTH_CLIENT_CALLBACK") + "?success=true")
}

func logout(ctx *fiber.Ctx) error {
	if err := goth_fiber.Logout(ctx); err != nil {
		log.Fatal(err)
	}

	return ctx.SendString("logout")
}

/*
{
  "user": {
    "RawData": {
      "email": "coold1741@gmail.com",
      "id": "104723773042656199816",
      "picture": "https://lh3.googleusercontent.com/a-/ALV-UjWt-j19TuiK9407KgXCk0LVeNx2tMidMMicoQ61klh7tUrX2RuL=s96-c",
      "verified_email": true
    },
    "Provider": "google",
    "Email": "coold1741@gmail.com",
    "Name": "",
    "FirstName": "",
    "LastName": "",
    "NickName": "",
    "Description": "",
    "UserID": "104723773042656199816",
    "AvatarURL": "https://lh3.googleusercontent.com/a-/ALV-UjWt-j19TuiK9407KgXCk0LVeNx2tMidMMicoQ61klh7tUrX2RuL=s96-c",
    "Location": "",
    "AccessToken": "ya29.a0AXooCgs3ALwVum6R2BCtB7kwnBCEs_ckjup0pdeV1iSptgGJg3Tqk68wnjTWZ0_J3kDzKnk33ivBWUw2JCmfna_ZHzi5K11AIgbUO7hysRK25kmBoPzhH6_dOSR_9M0ob48pktp34Hz15XvB47VtY22Jx-MwpBSmP8sJaCgYKAUYSARESFQHGX2Miw_3gkhOeV0l6pmBTJEOAYw0171",
    "AccessTokenSecret": "",
    "RefreshToken": "1//0gMIm2O5CSZaXCgYIARAAGBASNwF-L9Irj-Mu0Bz9IgGmYW4rBRxhL4UdjjRApJO3dva7krz7ompiaCALn466R7nydNDSi1RNdn8",
    "ExpiresAt": "2024-05-03T15:01:52.92307475Z",
    "IDToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjM2UzZTU1ODExMWM3YzdhNzVjNWI2NTEzNGQyMmY2M2VlMDA2ZDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMjk0MzU3MDM1MC0zdmMzbzgwcjVsdWcycDdub3RkYzgzaGc0ZWFlYW5pdS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjIyOTQzNTcwMzUwLTN2YzNvODByNWx1ZzJwN25vdGRjODNoZzRlYWVhbml1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA0NzIzNzczMDQyNjU2MTk5ODE2IiwiZW1haWwiOiJjb29sZDE3NDFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJpNzlvRTdhcDFGV3FBOWVadGVXRk9nIiwiaWF0IjoxNzE0NzQ0OTEzLCJleHAiOjE3MTQ3NDg1MTN9.ndgR3K1ZUBGbx4XcoCVfZu0g1knwlZG3MxzW9gSByZhBwGyAjW3-5YjeJgnWTj_ObI4JW2q76rvDqS9zsqLBYSS7BWpbztmSuutQLv4ErDZX0-XQ6rAbjqr-eH-o5qxvovnbOOJBHi6YfGsaiwMDmihdQ5cX4IDDs5KGajgiE4iJlhX9c43bylsAXW0_3STSCSct-DuiTkn4rtgy-HOffUTj9RTRH5_oH0mL5Q8yLRy86u1g-PLKNSIHclGgttsJhAL2FE5FlkAxiNkdhuPxvwZJQ72Xm5-CEIDfZ_6nxZB_Yexm9lo0wqoNrxdsBRbf-PegKDMxnorZz7qi3FdJSw"
  }
}
*/
