import { Icon } from '@iconify/react';
import peopleFill from '@iconify/icons-eva/people-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import bookOpenFill from '@iconify/icons-eva/book-open-fill';
import briefcaseFill from '@iconify/icons-eva/briefcase-fill';
import shieldfill from '@iconify/icons-eva/shield-fill';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const adminSidebarConfig = [
  {
    title: 'student',
    path: '/admin/dashboard/student',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Company',
    path: '/admin/dashboard/company',
    icon: getIcon(briefcaseFill)
  },
  {
    title: 'Application Status',
    path: '/admin/dashboard/applicationstatus',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'OJT Result',
    path: '/admin/dashboard/ojtresult',
    icon: getIcon(bookOpenFill)
  },
  {
    title: 'Security',
    path: '/admin/dashboard/security',
    icon: getIcon(shieldfill)
  },

  // {
  //   title: 'login',
  //   path: '/admin/dashboard/updateCompany',
  //   icon: getIcon(bookOpenFill)
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

export default adminSidebarConfig;
