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

export type MaintenanceTicketStage = 'Reported' | 'Dispatched' | 'In Progress' | 'Resolved'

export type MaintenanceTicket = {
  id: string
  type: string
  location: string
  reportedDate: string
  stage: MaintenanceTicketStage
}

export type InvoiceStatus = 'Paid' | 'Due'

export type Invoice = {
  id: string
  period: string
  rent: number
  water: number
  electricity: number
  fines: number
  total: number
  status: InvoiceStatus
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

export const seededInvoices: Invoice[] = [
  {
    id: 'INV-2026-05',
    period: 'May 2026',
    rent: 1250,
    water: 32,
    electricity: 84,
    fines: 0,
    total: 1366,
    status: 'Paid',
  },
  {
    id: 'INV-2026-06',
    period: 'Jun 2026',
    rent: 1250,
    water: 38,
    electricity: 92,
    fines: 0,
    total: 1380,
    status: 'Paid',
  },
  {
    id: 'INV-2026-07',
    period: 'Jul 2026',
    rent: 1250,
    water: 41,
    electricity: 96,
    fines: 50,
    total: 1437,
    status: 'Paid',
  },
  {
    id: 'INV-2026-08',
    period: 'Aug 2026',
    rent: 1250,
    water: 45,
    electricity: 101,
    fines: 75,
    total: 1471,
    status: 'Due',
  },
]

export const seededMaintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'TKT-2201',
    type: 'Pothole',
    location: 'Oak Blvd near #88',
    reportedDate: 'Sep 1, 2026',
    stage: 'In Progress',
  },
  {
    id: 'TKT-2189',
    type: 'Broken Streetlight',
    location: 'Riverside Dr & Park Ave',
    reportedDate: 'Aug 26, 2026',
    stage: 'Resolved',
  },
  {
    id: 'TKT-2174',
    type: 'Blocked Storm Drain',
    location: '14 Maple St front',
    reportedDate: 'Aug 19, 2026',
    stage: 'Dispatched',
  },
]
