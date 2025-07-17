// Interfaces
export interface Timecard {
  id: string;
  date: string;
  employee: string;
  project: string;
  equipment: string;
  costCode: string;
  workType: string;
  hours: number;
  notes: string;
  status: string;
  approved: boolean;
  approvedBy?: string;
  approvedDate?: string;
  createdBy: string;
  createdDate: string;
}

export interface Project {
  id: string;
  name: string;
  costCodes: string[];
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
}

export interface PayPeriod {
  label: string;
  start: string;
  end: string;
}

// Constants
export const PAY_PERIODS: PayPeriod[] = [
  { label: "July 13 - July 26, 2025", start: "2025-07-13", end: "2025-07-26" },
  { label: "June 29 - July 12, 2025", start: "2025-06-29", end: "2025-07-12" },
  { label: "June 15 - June 28, 2025", start: "2025-06-15", end: "2025-06-28" },
  { label: "June 1 - June 14, 2025", start: "2025-06-01", end: "2025-06-14" },
  { label: "May 18 - May 31, 2025", start: "2025-05-18", end: "2025-05-31" }
];

export const SAMPLE_CREW: CrewMember[] = [
  { id: "1", name: "John Smith", role: "Foreman", phone: "555-0123" },
  { id: "2", name: "Anna Lee", role: "Operator", phone: "555-0456" },
  { id: "3", name: "Mike Brown", role: "Laborer", phone: "555-0789" }
];

export const SAMPLE_COST_CODES = [
  "01-Site Preparation",
  "02-Excavation", 
  "03-Foundation",
  "04-Concrete Work",
  "05-Framing",
  "06-Electrical",
  "07-Plumbing",
  "08-HVAC",
  "09-Finishing",
  "10-Cleanup"
];

export const WORK_TYPES = [
  "Regular Time",
  "Overtime", 
  "Double Time",
  "Travel Time",
  "Standby",
  "Training",
  "Equipment Operation",
  "Maintenance",
  "Site Preparation",
  "Cleanup"
];

export const SAMPLE_EQUIPMENT: Equipment[] = [
  { id: '1', name: "CAT 320", type: "Excavator" },
  { id: '2', name: "Bobcat S650", type: "Skid Steer" },
  { id: '3', name: "Hydraulic Hammer", type: "Attachment" },
  { id: '4', name: "Plate Compactor", type: "Compactor" }
];

// Utility Functions
export const getCurrentPayPeriod = (): PayPeriod => {
  const today = new Date();
  for (const period of PAY_PERIODS) {
    const startDate = new Date(period.start);
    const endDate = new Date(period.end);
    if (today >= startDate && today <= endDate) {
      return period;
    }
  }
  return PAY_PERIODS[0];
};

export const getPayPeriodDates = (start: string, end: string): string[] => {
  const dates: string[] = [];
  let current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const formatDateString = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
  return dateObj.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const isWeekend = (dateString: string): boolean => {
  const parts = dateString.split('-');
  const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

export const isHoliday = (dateString: string): boolean => {
  const holidays = [
    '2025-01-01', '2025-02-17', '2025-03-29', '2025-05-19', '2025-07-01',
    '2025-08-04', '2025-09-01', '2025-09-30', '2025-10-13', '2025-11-11',
    '2025-12-25', '2025-12-26'
  ];
  return holidays.includes(dateString);
};

export const getDateRangeString = (
  viewMode: 'payPeriod' | 'month' | 'customRange',
  selectedPayPeriod: PayPeriod,
  selectedMonth: string,
  customRange: { start: string; end: string }
): string => {
  if (viewMode === "payPeriod") {
    return selectedPayPeriod.label;
  } else if (viewMode === "month") {
    const [year, month] = selectedMonth.split("-");
    const monthName = new Date(Number(year), Number(month) - 1).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long' 
    });
    return monthName;
  } else if (viewMode === "customRange") {
    return `${customRange.start} to ${customRange.end}`;
  }
  return "All Dates";
};

export const calculateDateRange = (
  mode: 'payPeriod' | 'month' | 'customRange',
  selectedPayPeriod: PayPeriod,
  selectedMonth: string,
  customRange: { start: string; end: string }
): string[] => {
  let visibleDates: string[] = [];
  
  if (mode === 'payPeriod') {
    visibleDates = getPayPeriodDates(selectedPayPeriod.start, selectedPayPeriod.end);
  } else if (mode === 'month') {
    const [year, month] = selectedMonth.split("-");
    const first = new Date(Number(year), Number(month) - 1, 1);
    const last = new Date(Number(year), Number(month), 0);
    visibleDates = getPayPeriodDates(
      first.toISOString().slice(0, 10),
      last.toISOString().slice(0, 10)
    );
  } else if (mode === 'customRange') {
    visibleDates = getPayPeriodDates(customRange.start, customRange.end);
  }
  
  return visibleDates;
};

export const filterTimecards = (
  timecards: Timecard[],
  visibleDates: string[],
  filters: {
    date: string;
    employee: string;
    project: string;
    equipment: string;
    costCode: string;
    workType: string;
    status: string;
  }
): Timecard[] => {
  return timecards.filter((timecard) => {
    const dateInRange = visibleDates.length === 0 || visibleDates.includes(timecard.date);
    const employeeMatch = !filters.employee || timecard.employee.includes(filters.employee);
    const projectMatch = !filters.project || timecard.project.includes(filters.project);
    const costCodeMatch = !filters.costCode || timecard.costCode.includes(filters.costCode);
    const equipmentMatch = !filters.equipment || timecard.equipment.includes(filters.equipment);
    const workTypeMatch = !filters.workType || timecard.workType.includes(filters.workType);
    const statusMatch = !filters.status || (timecard.approved ? "Approved" : timecard.status) === filters.status;
    
    return dateInRange && employeeMatch && projectMatch && costCodeMatch && 
           equipmentMatch && workTypeMatch && statusMatch;
  });
};

export const getUniqueValues = (timecards: Timecard[], field: keyof Timecard): string[] => {
  return Array.from(new Set(timecards.map(tc => tc[field] as string).filter(Boolean))).sort();
};
