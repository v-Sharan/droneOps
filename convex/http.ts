import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET env variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response(
        "Error Occured -- no svix headers while checking headers",
        { status: 400 },
      );
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      }) as any;
    } catch (error) {
      return new Response("Error Occured -- no svix headers while Verifing", {
        status: 400,
      });
    }

    const eventType = evt.type;

    if (eventType == "user.created") {
      const { id, email_addresses, username, image_url } = evt.data;

      const email = email_addresses[0].email_address;

      try {
        await ctx.runMutation(api.user.createUsers, {
          email: email,
          image: image_url,
          clerkId: id,
          username: username,
        });
      } catch (error) {
        return new Response("Error Creating User", { status: 400 });
      }
    }
    return new Response("Webhook processed succesfully", { status: 200 });
  }),
});

export default http;
