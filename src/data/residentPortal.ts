export type UtilityType = 'Water' | 'Electricity'

export type Fine = {
  id: string
  status: 'Unpaid' | 'Appealed'
  violation: string
  location: string
  date: string
  amount: number
  photo: string
}

export const resident = {
  name: 'Maria Reyes',
  id: 'RES-00441',
}

export const utilityUsage: Record<UtilityType, Array<{ month: string; usage: number }>> = {
  Water: [
    { month: 'Mar 2026', usage: 18 },
    { month: 'Apr 2026', usage: 21 },
    { month: 'May 2026', usage: 17 },
    { month: 'Jun 2026', usage: 24 },
    { month: 'Jul 2026', usage: 22 },
    { month: 'Aug 2026', usage: 19 },
  ],
  Electricity: [
    { month: 'Mar 2026', usage: 310 },
    { month: 'Apr 2026', usage: 288 },
    { month: 'May 2026', usage: 325 },
    { month: 'Jun 2026', usage: 341 },
    { month: 'Jul 2026', usage: 367 },
    { month: 'Aug 2026', usage: 352 },
  ],
}

export const seededFines: Fine[] = [
  {
    id: 'CIT-1042',
    status: 'Unpaid',
    violation: 'Illegal dumping',
    location: 'Oak Blvd near #88',
    date: 'Sep 4, 2026',
    amount: 150,
    photo: 'Citation photo',
  },
  {
    id: 'CIT-1018',
    status: 'Unpaid',
    violation: 'Parking violation',
    location: '14 Maple Street',
    date: 'Aug 28, 2026',
    amount: 75,
    photo: 'Citation photo',
  },
  {
    id: 'CIT-0997',
    status: 'Appealed',
    violation: 'Missed waste collection',
    location: 'Riverside Drive',
    date: 'Aug 12, 2026',
    amount: 50,
    photo: 'Citation photo',
  },
]
