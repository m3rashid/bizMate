package mailer

import (
	"bizMate/repository"
	"bizMate/utils"
	"fmt"
)

func EmailVerificationWithOtpToUser(recipientEmail, recipientName, otp string) Mail {
	title := "Please use this OTP to verify your email"
	emailSubject := "Your OTP for email verification on Bizmate"
	emailBody := emailVerificationWithOtpToUserPartial(recipientName, otp)
	emailHtml := generateTransactionalMailBody(title, recipientEmail, emailBody)
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
	title := fmt.Sprintf("Your roles on %s have been updated. Please login to use your new roles", workspaceName)
	emailSubject := fmt.Sprintf("Your roles on %s have been updated", workspaceName)
	emailBody := rolesUpdateToUserPartial(recipientName, workspaceName, newRoles)
	emailHtml := generateTransactionalMailBody(title, recipientEmail, emailBody)
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
	title := fmt.Sprintf("Your permissions on %s have been updated. Please login to use your new permissions", workspaceName)
	emailSubject := fmt.Sprintf("Your permissions on %s have been updated", workspaceName)
	emailBody := permissionsUpdateToUserPartial(recipientName, workspaceName, barePermissions)
	emailHtml := generateTransactionalMailBody(title, recipientEmail, emailBody)
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
	title := fmt.Sprintf("You have been invited to join %s on Bizmate by %s", workspaceName, ownerName)
	emailSubject := "You have been invited to a new workspace on Bizmate"
	emailBody := workspaceInvitationRequestToUserPartial(recipientEmail, ownerName, workspaceName, invitationLink)
	emailHtml := generateTransactionalMailBody(title, recipientEmail, emailBody)
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
	title := fmt.Sprintf(
		"Your invitation to %s has been %s by %s(%s)",
		workspaceName,
		utils.Ternary(accepted, "accepted", "rejected"),
		recipientName,
		recipientEmail,
	)
	emailSubject := fmt.Sprintf("Update on your invitation for invitation to %s in %s workspace", recipientName, workspaceName)
	emailBody := workspaceInvitationStatusUpdateToAdminPartial(ownerName, recipientName, workspaceName, accepted)
	emailHtml := generateTransactionalMailBody(title, recipientEmail, emailBody)
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
	emailHtml := generateTransactionalMailBody(emailSubject, recipientEmail, emailBody)
	return Mail{
		To:       []string{recipientEmail},
		Subject:  emailSubject,
		BodyText: emailSubject,
		BodyHtml: emailHtml,
	}
}
