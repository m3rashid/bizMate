package mailer

import (
	"bizMate/repository"
	"bizMate/utils"
	"fmt"
)

func SendTestEmails() error {
	// to := "m3rashid.hussain@gmail.com"
	// name := "Rashid"
	// mails := []Mail{
	// 	EmailVerificationWithOtpToUser(to, name, "123456"),
	// 	EmailRolesUpdateToUser(to, name, "Workspace", []string{"Admin", "User"}),
	// 	EmailPermissionsUpdateToUser(to, name, "Workspace", []repository.BarePermission{
	// 		{ObjectType: "User", Level: 12},
	// 		{ObjectType: "Admin", Level: 22},
	// 	}),
	// 	EmailWorkspaceInvitationRequestToUser(to, "Owner", "Workspace", "https://bizmate.com/invitation"),
	// 	EmailWorkspaceInvitationStatusUpdateToAdmin(to, name, "Owner", "Workspace", true),
	// 	EmailRemovedFromWorkspaceStatusUpdateToUser(to, name, "Workspace"),
	// }

	// for _, mail := range mails {
	// 	go func(mail Mail) {
	// 		if err := mail.Send(); err != nil {
	// 			fmt.Println("\n\n\nERROR in sending email", err)
	// 		} else {
	// 			fmt.Println("\n\n\nEmail sent successfully")
	// 		}
	// 	}(mail)
	// }

	return nil
}

func EmailVerificationWithOtpToUser(recipientEmail, recipientName, otp string) Mail {
	emailSubject := "Your OTP for email verification on Bizmate"
	emailBody := emailVerificationWithOtpToUserPartial(recipientName, otp)
	emailHtml := generateTransactionalMailBody(recipientEmail, emailBody)
	return Mail{
		To:       []string{recipientEmail},
		Subject:  emailSubject,
		BodyText: emailSubject,
		BodyHtml: emailHtml,
	}
}

func EmailRolesUpdateToUser(
	recipientEmail string,
	recipientName string,
	workspaceName string,
	newRoles []string,
) Mail {
	emailSubject := fmt.Sprintf("Your roles on %s have been updated", workspaceName)
	emailBody := rolesUpdateToUserPartial(recipientName, workspaceName, newRoles)
	emailHtml := generateTransactionalMailBody(recipientEmail, emailBody)
	return Mail{
		To:       []string{recipientEmail},
		Subject:  emailSubject,
		BodyText: emailSubject,
		BodyHtml: emailHtml,
	}
}

func EmailPermissionsUpdateToUser(
	recipientEmail string,
	recipientName string,
	workspaceName string,
	barePermissions []repository.BarePermission,
) Mail {
	emailSubject := fmt.Sprintf("Your permissions on %s have been updated", workspaceName)
	emailBody := permissionsUpdateToUserPartial(recipientName, workspaceName, barePermissions)
	emailHtml := generateTransactionalMailBody(recipientEmail, emailBody)
	return Mail{
		To:       []string{recipientEmail},
		Subject:  emailSubject,
		BodyText: emailSubject,
		BodyHtml: emailHtml,
	}
}

func EmailWorkspaceInvitationRequestToUser(
	recipientEmail string,
	ownerName string,
	workspaceName string,
	invitationLink string,
) Mail {
	emailSubject := "You have been invited to a new workspace on Bizmate"
	emailBody := workspaceInvitationRequestToUserPartial(recipientEmail, ownerName, workspaceName, invitationLink)
	emailHtml := generateTransactionalMailBody(recipientEmail, emailBody)
	return Mail{
		To:       []string{recipientEmail},
		Subject:  emailSubject,
		BodyText: emailSubject,
		BodyHtml: emailHtml,
	}
}

func EmailWorkspaceInvitationStatusUpdateToAdmin(
	recipientEmail string,
	recipientName string,
	ownerName string,
	workspaceName string,
	accepted bool,
) Mail {
	emailSubject := fmt.Sprintf(
		"%s %s your invitation to %s workspace",
		recipientName,
		utils.Ternary(accepted, "accepted", "rejected"),
		workspaceName,
	)
	emailBody := workspaceInvitationStatusUpdateToAdminPartial(ownerName, recipientName, workspaceName, accepted)
	emailHtml := generateTransactionalMailBody(recipientEmail, emailBody)
	return Mail{
		To:       []string{recipientEmail},
		Subject:  emailSubject,
		BodyText: emailSubject,
		BodyHtml: emailHtml,
	}
}

func EmailRemovedFromWorkspaceStatusUpdateToUser(recipientEmail, recipientName, workspaceName string) Mail {
	emailSubject := fmt.Sprintf("You have been removed from %s", workspaceName)
	emailBody := removedFromWorkspaceStatusUpdateToUserPartial(recipientName, workspaceName)
	emailHtml := generateTransactionalMailBody(recipientEmail, emailBody)
	return Mail{
		To:       []string{recipientEmail},
		Subject:  emailSubject,
		BodyText: emailSubject,
		BodyHtml: emailHtml,
	}
}
