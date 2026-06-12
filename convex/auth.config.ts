import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://valid-cardinal-98.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} as AuthConfig;
