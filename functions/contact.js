import { EmailMessage } from "cloudflare:email";          // built-in binding
import { createMimeMessage } from "mimetext";             // lightweight lib

export async function onRequestPost({ request, env }) {
  const { name, email, message } = await request.json();
  if (!name || !email || !message) {
    return new Response('Bad Request', { status: 400 });
  }

  // build a simple MIME email
  const mime = createMimeMessage();
  mime.setSender({ name, addr: email });                  // who filled the form
  mime.setRecipient(env.CONTACT_RECIPIENT);               // your inbox
  mime.setSubject("Website enquiry from " + name);
  mime.addMessage({
    contentType: 'text/plain',
    data: `Name: ${name}\nEmail: ${email}\n\n${message}`
  });

  const mail = new EmailMessage(
    env.CONTACT_SENDER,                                   // verified sender
    env.CONTACT_RECIPIENT,
    mime.asRaw()
  );

  await env.SEND_IT.send(mail);                           // binding name below
  return new Response('OK', { status: 200 });
}
