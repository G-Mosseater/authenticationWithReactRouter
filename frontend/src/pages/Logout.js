import { redirect } from "react-router-dom";

// This function handles logging the user out
export function action() {
  // Remove the stored token from localStorage
  // This effectively logs out the user on the frontend
  localStorage.removeItem("token");
  localStorage.removeItem("expiration"); // also remove expiration time

  // Redirect the user back to the home page ("/")
  return redirect("/");
}