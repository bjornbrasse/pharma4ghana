"use node";

import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index";

export async function getTransporter() {
	const testAccount = await nodemailer.createTestAccount();

	const transportOptions: SMTPTransport.Options =
		process.env.DEV === "production"
			? {
					host: process.env.SMTP_HOST,
					port: 465,
					secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
					requireTLS: true, // force STARTTLS
					auth: {
						user: process.env.SMTP_USER,
						pass: process.env.SMTP_PASSWORD,
					},
				}
			: {
					host: testAccount.smtp.host,
					port: testAccount.smtp.port,
					secure: testAccount.smtp.secure,
					auth: {
						user: testAccount.user,
						pass: testAccount.pass,
					},
				};

	return nodemailer.createTransport(transportOptions);
}
