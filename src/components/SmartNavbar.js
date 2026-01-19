import { isAuthenticated } from "../utils/auth";
import NavBarUser from "./NavBarUser";
import NavBarSimple from "./EcoHomeNavBar";

export default function SmartNavbar({ onSearch }) {
  return isAuthenticated() ? (
    <NavBarUser AboutAccount="Your Details" />
  ) : (
    <NavBarSimple onSearch={onSearch} />
  );
}
