import { EmailMessage } from "cloudflare:email";

export async function onRequestPost({ request, env }) {
  const { name, email, message } = await request.json();
  if (!name || !email || !message) {
    return new Response("Bad Request", { status: 400 });
  }

  const content = `From: ${name} <${email}>
To: ${env.CONTACT_RECIPIENT}
Subject: Website enquiry from ${name}

Name: ${name}
Email: ${email}

${message}
`;

  const mail = new EmailMessage(
    env.CONTACT_SENDER,
    env.CONTACT_RECIPIENT,
    content
  );

  await env.SEND_IT.send(mail);
  return new Response("OK", { status: 200 });
}
