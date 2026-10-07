import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <NavLink to="/resident">
        Tel Aviv-Yafo Municipality
      </NavLink>
    </header>
  )
}