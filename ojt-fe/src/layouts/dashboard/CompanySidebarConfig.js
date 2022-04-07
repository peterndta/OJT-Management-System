import { Icon } from '@iconify/react';
import folderFill from '@iconify/icons-eva/folder-fill';
import briefcaseFill from '@iconify/icons-eva/briefcase-fill';
import bookOpenFill from '@iconify/icons-eva/book-open-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import shieldfill from '@iconify/icons-eva/shield-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const companySidebarConfig = [
    {
        title: 'Job',
        path: '/company/dashboard/app',
        icon: getIcon(folderFill)
    },
    {
        title: 'Student Offer',
        path: '/company/dashboard/student-offer',
        icon: getIcon(briefcaseFill)
    },
    {
        title: 'Application Status',
        path: '/company/dashboard/verify',
        icon: getIcon(fileTextFill)
    },
    {
        title: 'Submit Results',
        path: '/company/dashboard/ojtresults',
        icon: getIcon(bookOpenFill)
    },
    {
        title: 'Security',
        path: '/company/dashboard/security',
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

export default companySidebarConfig;
