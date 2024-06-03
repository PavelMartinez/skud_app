/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [];

export const userRoutePrefix = "/worker";
export const adminRoutePrefix = "/dashboard";

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes: string[] = ["/dashboard", "/worker"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";
export const apiPrefix = "/api";

export const DEFAULT_LOGIN_REDIRECT = "/";