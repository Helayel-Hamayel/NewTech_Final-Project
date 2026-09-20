import type { PortalTab } from './types'

const tabs: PortalTab[] = ['Dashboard', 'Billing', 'My Tickets', 'Properties']

type ResidentPortalNavProps = {
  activeTab: PortalTab
  onTabChange: (tab: PortalTab) => void
}

export default function ResidentPortalNav({ activeTab, onTabChange }: ResidentPortalNavProps) {
  return (
    <nav aria-label="Resident portal navigation">
      <ul>
        {tabs.map((tab) => (
          <li key={tab}>
            <button type="button" aria-current={activeTab === tab ? 'page' : undefined} onClick={() => onTabChange(tab)}>
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}