import type { PortalTab } from './types'

const tabs: PortalTab[] = ['Dashboard', 'Billing', 'My Tickets', 'Properties']

type ResidentPortalNavProps = {
  activeTab: PortalTab
  onTabChange: (tab: PortalTab) => void
}

export default function ResidentPortalNav({ activeTab, onTabChange }: ResidentPortalNavProps) {
  return (
    <nav className="resident-nav" aria-label="Resident portal navigation">
      <ul className="resident-nav-list">
        {tabs.map((tab) => (
          <li key={tab}>
            <button
              className={`resident-nav-button${activeTab === tab ? ' is-active' : ''}`}
              type="button"
              aria-current={activeTab === tab ? 'page' : undefined}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}