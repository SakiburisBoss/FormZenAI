import { getUser } from "@/actions/user/getUser";
import { Suspense } from "react";
import NavBar from "./Navbar";

async function NavbarServer() {
  const user = await getUser();
  const isAuthenticated = Boolean(user && user.isAnonymous === false);
  return <NavBar isAuthenticated={isAuthenticated} />;
}
const NavServer = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavbarServer />
    </Suspense>
  );
};
export default NavServer;
