import { Icon } from '@iconify/react';
import folderFill from '@iconify/icons-eva/folder-fill';
import briefcaseFill from '@iconify/icons-eva/briefcase-fill';
import shieldfill from '@iconify/icons-eva/shield-fill';
import mapoutline from '@iconify/icons-eva/map-outline';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
// import lockFill from '@iconify/icons-eva/lock-fill';
// import personAddFill from '@iconify/icons-eva/person-add-fill';
// import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const studentSidebarConfig = [
  {
    title: 'Job',
    path: '/student/dashboard/jobs',
    icon: getIcon(folderFill)
  },
  {
    title: 'Company',
    path: '/student/dashboard/company',
    icon: getIcon(briefcaseFill)
  },
  {
    title: 'Application Status',
    path: '/student/dashboard/applicationstatus',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'OJT Result',
    path: '/student/dashboard/ojtResult',
    icon: getIcon(mapoutline)
  },
  {
    title: 'Security',
    path: '/student/dashboard/security',
    icon: getIcon(shieldfill)
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon(lockFill)
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon(personAddFill)
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon(alertTriangleFill)
  // }
];

export default studentSidebarConfig;
