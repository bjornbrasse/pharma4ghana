export function organizationInvitationEmail({
	invitedByUsername,
	invitationLink,
	organizationName,
}: {
	invitedByUsername: string;
	invitationLink: string;
	organizationName: string;
}): { subject: string; text: string } {
	const subject = `You're invited to join ${organizationName} on Toxicomp`;
	const text = `Hello,
	You have been invited by ${invitedByUsername} to join the team "${organizationName}" on Toxicomp.
	
	Please click the link below to accept the invitation and join the team:
	${invitationLink}
	`;

	return { subject, text };
}

// export function signinOtpEmail({ otp }: { otp: string }): {
// 	subject: string;
// 	text: string;
// } {
// 	const subject = `Signing in on Toxicomp`;
// 	const text = `Hello,
// 		You are signing in on Toxicomp.

// 		Please use this one-time passcode to complete the sign-in process:
// 		${otp}
// 		`;

// 	return { subject, text };
// }

export function createSigninEmail({ link }: { link: string }): {
	subject: string;
	html: string;
} {
	const subject = `Signing in on Kwestjan`;
	const html = `Hello,
		You are signing in on Kwestjan.
		
		Please use this one-time passcode to complete the sign-in process:
		
		<a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Click here to sign in</a>
		`;

	return { subject, html };
}

export function createOtpEmail({
	otp,
	type,
}: {
	otp: string;
	type: "sign-in" | "email-verification" | "forget-password" | "change-email";
}) {
	const subject = "OTP from ToxiComp";
	const description =
		type === "email-verification"
			? "Use this code to verify your email address:"
			: type === "sign-in"
				? "Use this code to sign in:"
				: "Use this code to reset your password:";

	const text = `
		<h1>${escapeHtml(description)}</h1>

		<p
			style="
				font-family: monospace;
				font-size: 32px;
				font-weight: 700;
				letter-spacing: 8px;
			"
		>
			${escapeHtml(otp)}
		</p>

		<p>This code expires in five minutes.</p>

		<p>If you did not request this code, you can ignore this email.</p>
	`;
	return { subject, text };
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}
