import { useState } from "react";
import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
} from "react-router-dom";

import classes from "./AuthForm.module.css";

function AuthForm() {
  // const [isLogin, setIsLogin] = useState(true);

  // function switchAuthHandler() {
  //   setIsLogin((isCurrentlyLogin) => !isCurrentlyLogin);
  // }
  //useSearchParams is a hook that lets you read and modify the URL query parameters
  //  (the ?key=value part of the URL)
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  // Get data returned from the action function
  const data = useActionData(); // ← This will contain whatever your action function returned
  const navigation = useNavigation(); // ← Gives info about the current form submission/navigation state
  const isSubmitting = navigation.state === "submitting";

//   How this works:

//  When your AuthForm submits, React Router calls the `action` function for that route.
//  Inside the action, you can process the form data, send requests, and return a response.
//  If the action returns something (like `return response` for errors), 
//    `useActionData()` gives you access to that data in your component.
//  `useNavigation()` tracks navigation and submission states, 
//    which allows you to show loading indicators or disable buttons while the form is submitting.
// */
  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? "Log in" : "Create a new user"}</h1>
        {data && data.errors && (
          <ul>
            {Object.values(data.errors).map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        {data && data.message && <p> {data.message}</p>}
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          {/* switch between modes with useSearchParams */}
          <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
            {isLogin ? "Create new user" : "Login"}
          </Link>
          <button disabled={isSubmitting}>
            {isSubmitting ? "Submitting" : "Save"}
          </button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
