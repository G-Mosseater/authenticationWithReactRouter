import AuthForm from "../components/AuthForm";
import { json, redirect } from "react-router-dom";
function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

// This action function is triggered when the AuthForm is submitted via React Router
//get access to the formdata with request
export async function action({ request }) {
  // get the mode of query
  const searchParams = new URL(request.url).searchParams;
  // Validate the mode

  const mode = searchParams.get("mode") || "login";
  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsuported mode" }, { status: 422 });
  }
  // Get the form data from the submitted form

  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };
  // Send the login/signup request to the backend

  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });
  // Handle expected backend errors (validation or unauthorized)

  if (response.status === 422 || response.status === 401) {
    return response; // ← this will be available in `useActionData()` in the component
  }
  // Handle unexpected backend errors

  if (!response.ok) {
    throw json({ message: "Could not authenticate user" }, { status: 500 });
  }
  //accessing the token
  // Wait for the server response to be converted into JSON format
  const resData = await response.json();
  // From the JSON object, extract the "token" property
  const token = resData.token;

  localStorage.setItem("token", token);
  // Redirect to homepage if authentication was successful

//  / Example: when logging in, set token expiration 1 hour from now
const expiration = new Date();
expiration.setHours(expiration.getHours() + 1); // 1 hour ahead
localStorage.setItem('expiration', expiration.toISOString()); // store in localStorage


  return redirect("/");
}
