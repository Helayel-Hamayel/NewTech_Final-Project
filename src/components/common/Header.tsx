import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header>
      <NavLink to="/resident">
        City of Millbrook
      </NavLink>
    </header>
  )
}