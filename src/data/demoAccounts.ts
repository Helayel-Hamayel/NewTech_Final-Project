export type DemoAccount = {
  icon: string
  name: string
  details: string
  path: string
}

export const demoAccounts: DemoAccount[] = [
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
