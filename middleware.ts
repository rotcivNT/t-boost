import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { isMemberInConversation } from "./app/services/channel.action";

export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth: async (auth, req, res) => {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    if (auth.userId && !auth.orgId && auth.isPublicRoute) {
      const redirectURL = new URL("/dashboard", req.url);
      return NextResponse.redirect(redirectURL, 308);
    }
    if (auth.userId && auth.orgId && auth.isPublicRoute) {
      const redirectURL = new URL(`/workspace/${auth.orgId}/home`, req.url);
      return NextResponse.redirect(redirectURL, 308);
    }
    if (auth.userId && auth.orgId && !auth.isPublicRoute) {
      const c_id = req.nextUrl.pathname.split("/home/")[1];
      if (c_id) {
        const isInCovnersation = await isMemberInConversation(
          c_id,
          auth.userId
        );
        if (!isInCovnersation && !req.url.includes("[cid]")) {
          const redirectURL = new URL(`/workspace/${auth.orgId}/home`, req.url);
          return NextResponse.redirect(redirectURL, 308);
        }
        return NextResponse.next();
      }
    }
  },
  ignoredRoutes: ["/api/webhooks(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
