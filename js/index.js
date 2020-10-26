import Login from "./pages/Login/Login";
import Router from "./utils/Router/Router";
import Signup from "./pages/Signup/Signup";
import Chats from "./pages/Chats/Chats";
import Settings from "./pages/Settings/Settings";
import ServerError from "./pages/ServerError/ServerError";
import NotFoundError from "./pages/NotFoundError/NotFoundError";

const router = new Router(".root");

export default router;

router
  .redirect("/", "/chats")
  .use("/login", Login)
  .use("/signup", Signup)
  .use("/chats", Chats)
  .use("/settings", Settings)
  .use("/500", ServerError)
  .useDefault("/404", NotFoundError)
  .start();
