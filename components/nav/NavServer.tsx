import { getUser } from "@/actions/user/get-user";
import { Suspense } from "react";
import NavBar from "./Navbar";

async function NavbarServer() {
  const user = await getUser();
  return <NavBar user={user} />;
}
const NavServer = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavbarServer />
    </Suspense>
  );
};
export default NavServer;
