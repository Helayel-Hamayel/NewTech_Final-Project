import { Link } from 'react-router-dom'

type DemoAccount = {
  icon: string
  name: string
  details: string
  path: string
}

const demoAccounts: DemoAccount[] = [
  {
    icon: 'R',
    name: 'Resident Portal',
    details: 'Maria Reyes · RES-00441',
    path: '/resident',
  },
  {
    icon: 'M',
    name: 'Municipality Staff',
    details: 'R. Kowalczyk · Dispatch #D-003',
    path: '/staff',
  },
  {
    icon: 'G',
    name: 'Field Guard',
    details: 'J. Mbeki · Officer #G-114',
    path: '/field-guard',
  },
]

export default function DemoAccess() {
  return (
    <section aria-labelledby="demo-access-heading">
      <div>
        <span id="demo-access-heading">Demo Access</span>
      </div>

      {demoAccounts.map((account) => (
        <Link to={account.path} key={account.name}>
          <span>{account.icon} </span>
          <span>
            <strong>{account.name}</strong> - {account.details}
          </span>
        </Link>
      ))}
    </section>
  )
}
