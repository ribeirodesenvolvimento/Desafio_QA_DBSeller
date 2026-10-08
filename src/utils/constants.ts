
export const CONFIG = {
  BASE_URL: (
    process.env.ORANGEHRM_BASE_URL ??
    'https://opensource-demo.orangehrmlive.com/web/index.php'
  ).replace(/\/$/, ''),

  ROUTES: {
    LOGIN: '/auth/login',
    DASHBOARD: '/dashboard/index',
    PUBLIC_JOBS: '/recruitmentApply/jobs.html',
    CANDIDATES: '/recruitment/viewCandidates',
    EMPLOYEES: '/pim/viewEmployeeList',
    DIRECTORY: '/directory/viewDirectory',
    TIMESHEETS: '/time/viewEmployeeTimesheet',
    LEAVE: '/leave/viewLeaveList',
  },

  CREDENTIALS: {
    USERNAME: process.env.ORANGEHRM_USERNAME || 'Admin',
    PASSWORD: process.env.ORANGEHRM_PASSWORD || 'admin123',
  },
} as const;
