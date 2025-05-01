package mailer

import (
	"bizMate/repository"
	"bizMate/utils"
	"fmt"
	"strings"
)

func emailVerificationWithOtpToUserPartial(recipientName, otp string) string {
	return fmt.Sprintf(`<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
	<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%%;">
		<tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:0;text-align:center;">
			<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
			<div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%%;">
				<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%%">
					<tbody><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Hello %s,</div></td></tr>
						<tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:24px;line-height:1;text-align:center;color:#000000;">Your OTP is %s</div></td></tr>
						<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Please enter this OTP to verify your email address.</div></td></tr>
					</tbody>
				</table>
			</div><!--[if mso | IE]></td></tr></table><![endif]-->
		</td></tr></tbody>
	</table>
</div>
<!--[if mso | IE]></td></tr></table><![endif]-->`, recipientName, otp)
}

func rolesUpdateToUserPartial(recipientName, workspaceName string, roles []string) string {
	return fmt.Sprintf(`<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
	<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%%;">
		<tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:0;text-align:center;">
			<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
			<div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%%;">
				<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%%"><tbody>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Hello %s,</div></td></tr>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Your roles have been updated in the workspace "%s" on Bizmate</div></td></tr>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Your new roles are: %s</div></td></tr>
				</tbody></table>
			</div><!--[if mso | IE]></td></tr></table><![endif]-->
		</td></tr></tbody>
	</table>
</div>
<!--[if mso | IE]></td></tr></table><![endif]-->`, recipientName, workspaceName, strings.Join(roles, ", "))
}

func permissionsUpdateToUserPartial(recipientName, workspaceName string, barePermissions []repository.BarePermission) string {
	allPermissionsStr := make([]string, len(barePermissions))
	for i, permission := range barePermissions {
		allPermissionsStr[i] = string(permission.ObjectType) + " - " + fmt.Sprint(int32(permission.Level))
	}
	permissions := strings.Join(allPermissionsStr, ", ")

	return fmt.Sprintf(`<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
	<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%%;">
		<tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:0;text-align:center;">
			<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
			<div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%%;">
				<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%%"><tbody>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Hello %s,</div></td></tr>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Your permissions have been updated in the workspace "%s" on Bizmate</div></td></tr>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Your new permissions are: %s</div></td></tr>
				</tbody></table>
			</div><!--[if mso | IE]></td></tr></table><![endif]-->
		</td></tr></tbody>
	</table>
</div>
<!--[if mso | IE]></td></tr></table><![endif]-->`, recipientName, workspaceName, permissions)
}

func workspaceInvitationRequestToUserPartial(recipientName, ownerName, workspaceName string, invitationLink string) string {
	return fmt.Sprintf(`<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
	<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%%;">
		<tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:0;text-align:center;">
			<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
			<div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%%;">
				<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%%">
					<tbody>
						<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Hello %s</div></td></tr>
						<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Hope you are doing well.</div></td></tr>
						<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">%s has invited you to join their workspace "%s" on Bizmate</div></td></tr>
						<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">To accept this invitation and join the workspace, please click the button below:</div></td></tr>
						<tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
							<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%%;"><tbody><tr>
								<td align="center" bgcolor="#007bff" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#007bff;" valign="middle">
									<a href="%s" style="display:inline-block;background:#007bff;color:white;font-family:Inter, Helvetica, sans-serif;font-size:13px;font-weight:normal;line-height:120%%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank"> Accept Invitation </a>
								</td></tr></tbody></table>
							</td></tr></tbody>
						</table>
					</div><!--[if mso | IE]></td></tr></table><![endif]-->
				</td>
			</tr>
		</tbody>
	</table>
</div>
<!--[if mso | IE]></td></tr></table><![endif]-->`, recipientName, ownerName, workspaceName, invitationLink)
}

func workspaceInvitationStatusUpdateToAdminPartial(ownerName, recipientName, workspaceName string, accepted bool) string {
	statusText := utils.Ternary(
		accepted,
		fmt.Sprintf("Good news! %s has accepted your invitation and joined your workspace.", recipientName),
		fmt.Sprintf("We regret to inform you that %s has declined the invitation to join your workspace.", recipientName),
	)

	furtherText := utils.Ternary(
		accepted,
		fmt.Sprintf("You can now collaborate with %s in your workspace.", recipientName),
		fmt.Sprintf("If you'd like to extend another invitation with %s in the future, you can do so from your workspace settings.", recipientName),
	)

	return fmt.Sprintf(`<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
	<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%%;">
		<tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:0;text-align:center;">
			<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
			<div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%%;">
				<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%%"><tbody>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Hello %s,</div></td></tr>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">We wanted to inform you about the status of your invitation to %s for your workspace "%s".</div></td></tr>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">%s</div></td></tr>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">%s</div></td></tr>
				</tbody></table>
			</div>
			<!--[if mso | IE]></td></tr></table><![endif]-->
		</td></tr></tbody>
	</table>
</div>
<!--[if mso | IE]></td></tr></table><![endif]-->`, ownerName, recipientName, workspaceName, statusText, furtherText)
}

func removedFromWorkspaceStatusUpdateToUserPartial(recipientName, workspaceName string) string {
	return fmt.Sprintf(`<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
	<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%%;">
		<tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:0;text-align:center;">
			<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
			<div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%%;">
				<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%%"><tbody>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">Hello %s,</div></td></tr>
					<tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Inter, Helvetica, sans-serif;font-size:16px;line-height:1;text-align:left;color:#000000;">You have been removed from the workspace "%s" on Bizmate</div></td></tr>
				</tbody></table>
			</div>
			<!--[if mso | IE]></td></tr></table><![endif]-->
		</td></tr></tbody>
	</table>
</div>
<!--[if mso | IE]></td></tr></table><![endif]-->`, recipientName, workspaceName)
}
