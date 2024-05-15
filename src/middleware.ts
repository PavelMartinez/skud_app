import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// @ts-ignore
const { auth } = NextAuth(authConfig);
import {
	DEFAULT_LOGIN_REDIRECT,
	apiAuthPrefix,
	authRoutes,
	publicRoutes,
	userRoutePrefix,
	adminRoutePrefix
  } from '@/lib/routes'

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isLoggedIn = !!req.auth;
  const isAdmin = Number(req.auth?.user.role) > 1;

  const redirectTo = (path: string) => Response.redirect(new URL(path, nextUrl));

  const isApiRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith(adminRoutePrefix)
  const isUserRoute = pathname.startsWith(userRoutePrefix)

  if (isPublicRoute || isApiRoute) return;
  // below this isPublicRoute and isApiRoute can only be false

	// Redirect non-logged-in users trying to access protected routes

	if (!isLoggedIn) {
		let callbackUrl = nextUrl.pathname;
		if (nextUrl.search) callbackUrl += nextUrl.search;

		const encodedCallbackUrl = encodeURIComponent(callbackUrl);
		return redirectTo(`/api/auth/signin?callbackUrl=${encodedCallbackUrl}`);
	}

	// Redirect logged-in, non-admin users trying to access restricted admin routes
	if (!isAdmin && !isUserRoute) {
		nextUrl.searchParams.set("error", "Access Denied");
		nextUrl.pathname = "/api/auth/error";

		return Response.redirect(nextUrl);
	}

	if (!isAdminRoute && !isUserRoute) {
		if (isAdmin) return redirectTo("/dashboard");
		else return redirectTo("/worker");
	}

	return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};