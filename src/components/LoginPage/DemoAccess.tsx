import { ArrowRight, HardHat, House, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/useUser";
import { demoAccounts } from "../../data/demoAccounts";

const accountIcons = {
  resident: House,
  staff: ShieldCheck,
  "field-guard": HardHat,
};

export default function DemoAccess() {
  const { saveUser } = useUser();

  return (
    <section className="demo-access" aria-labelledby="demo-access-heading">
      <div className="demo-access-heading">
        <span className="demo-access-kicker" id="demo-access-heading">
          Demo access
        </span>
        <span className="demo-access-note">Choose a sample workspace</span>
      </div>
      <p className="demo-access-disclaimer">
        Demo changes are temporary and are not saved or sent to staff.
      </p>

      {demoAccounts.map((account) => (
        <Link
          className={`demo-account demo-account--${account.role}`}
          to={account.path}
          key={account.name}
          onClick={() => saveUser(account.user)}
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
