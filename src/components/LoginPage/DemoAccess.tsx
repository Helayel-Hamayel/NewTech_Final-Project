import { ArrowRight, HardHat, House, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { demoAccounts } from "../../data/demoAccounts";

const accountIcons = {
  resident: House,
  staff: ShieldCheck,
  "field-guard": HardHat,
};

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
        <Link
          className={`demo-account demo-account--${account.role}`}
          to={account.path}
          key={account.name}
        >
          <span className="demo-account-icon" aria-hidden="true">
            {(() => {
              const AccountIcon = accountIcons[account.role];
              return <AccountIcon size={16} strokeWidth={2.2} />;
            })()}
          </span>
          <span className="demo-account-copy">
            <strong>{account.name}</strong> - {account.details}
          </span>
          <span className="demo-account-arrow" aria-hidden="true">
            <ArrowRight size={16} strokeWidth={2.2} />
          </span>
        </Link>
      ))}
    </section>
  );
}
