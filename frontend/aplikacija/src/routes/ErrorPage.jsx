import { useRouteError } from "react-router-dom";
import Navigacija from "./Navigacija/Navigacija";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <Navigacija></Navigacija>
      <h1>Oops!</h1>
      <p>Ispričavam se, ali stvorila se greška</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}