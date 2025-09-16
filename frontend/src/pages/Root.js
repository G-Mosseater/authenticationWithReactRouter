import {
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";

import MainNavigation from "../components/MainNavigation";
import { useEffect } from "react";
import { getTokenDuration } from "../util/auth";

function RootLayout() {
  // const navigation = useNavigation();
  // Get the token loaded by the root route
  const token = useLoaderData(); 

  // useSubmit allows us to call actions programmatically (like logout)
  const submit = useSubmit();  useEffect(() => {
    if (!token) {
      return  // no token → do nothing
    }
    if (token === "EXPIRED") {
            // If token has expired, logout immediately

      submit(null, { action: "/logout", method: "post" });
      return
    }
        // Calculate how long until the token expires

    const tokenDuration = getTokenDuration();
    
    console.log(tokenDuration);
        // Schedule automatic logout when the token expires

    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);
  }, [token, submit]);
  return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
