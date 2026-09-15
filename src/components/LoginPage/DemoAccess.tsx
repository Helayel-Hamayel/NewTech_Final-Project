import { Link } from 'react-router-dom'
import { demoAccounts } from '../../data/demoAccounts'

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
