import { redirect } from "react-router-dom";

// Calculate how much time is left until the token expires
export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration"); // get expiration from localStorage
  const expirationDate = new Date(storedExpirationDate); // convert to Date object
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime(); // milliseconds remaining
  return duration; 
}

// Get (extract) the token from localStorage and check expiration
export function getAuthToken() {
  const token = localStorage.getItem("token"); // get token from browser storage
  if (!token) {
    return null; // no token → user not logged in
  }

  const tokenDuration = getTokenDuration();
  if (tokenDuration < 0) {
    return "EXPIRED"; // token expired → trigger auto logout
  }

  return token; // return token if valid
}
// Loader function for React Router to get token before rendering a route
export function tokenLoader() {
  return getAuthToken(); // returns token string, "EXPIRED", or null
}

// Loader function to protect routes that require authentication
export function checkAuthLoader() {
  const token = getAuthToken(); // get token from localStorage

  if (!token) {
    return redirect("/auth"); // if not logged in, redirect to login page
  }

  return null; // token exists → allow route access
}
