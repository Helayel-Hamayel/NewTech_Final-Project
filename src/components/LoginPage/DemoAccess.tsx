import { Link } from 'react-router-dom'
import { demoAccounts } from '../../data/demoAccounts'

export default function DemoAccess() {
  return (
    <section className="demo-access" aria-labelledby="demo-access-heading">
      <div className="demo-access-heading">
        <span className="demo-access-kicker" id="demo-access-heading">
          Demo access
        </span>
        <span className="demo-access-note">Choose a workspace</span>
      </div>

      {demoAccounts.map((account) => (
        <Link className="demo-account" to={account.path} key={account.name}>
          <span className="demo-account-icon" aria-hidden="true">
            {account.icon}
          </span>
          <span className="demo-account-copy">
            <strong>{account.name}</strong> - {account.details}
          </span>
          <span className="demo-account-arrow" aria-hidden="true">
            -&gt;
          </span>
        </Link>
      ))}
    </section>
  );
}
