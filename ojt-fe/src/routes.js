import { Navigate, useRoutes } from 'react-router-dom';
import ChangePass from './components/utils/ChangePass';
import AddCompany from './features/admin/AddCompany';
import AddStudent from './features/admin/AddStudent';
import AdminApplicationStatus from './features/admin/AdminApplicationStatus';
import AdminCompany from './features/admin/AdminCompany';
import AdminCompanyProfile from './features/admin/AdminCompanyProfile';
import AdminOJTResult from './features/admin/AdminOJTResult';
import AdminStudentList from './features/admin/AdminStudentList';
import AdminStudentProfile from './features/admin/AdminStudentProfile';
import AdminUpdateCompanyInfo from './features/admin/AdminUpdateCompanyInfo';
import AdminUpdateStudentInfo from './features/admin/AdminUpdateStudentInfo';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import CompanyOJTResult from './features/company/CompanyOJTResult';
import CompanyCreateJob from './features/company/CompanyCreateJob';
import CompanyProfile from './features/company/CompanyProfile';
import CompanyStudentList from './features/company/CompanyStudentList';
import CompanyUpdateProfile from './features/company/CompanyUpdateProfile';
import StudentCompany from './features/student/StudentCompany';
import StudentCompanyProfile from './features/student/StudentCompanyProfile';
import StudentJobDetail from './features/student/StudentJobDetail';
import CompanyJobDetail from './features/company/CompanyJobDetail';
import StudentJobList from './features/student/StudentJobList';
import CompanyApplicationStatus from './features/company/CompanyApplicationStatus';
// layouts
import AdminDashboardLayout from './layouts/dashboard/adminIndex';
import CompanyDashboardLayout from './layouts/dashboard/companyIndex';
import StudentDashboardLayout from './layouts/dashboard/studentIndex';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
// import Products from './pages/Products';
import StudentApplicationStatus from './features/student/StudentApplicationStatus';
import StudentOJTResult from './features/student/StudentOJTResult';
//
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import User from './pages/User';
import StudentProfile from './features/student/StudentProfile';
import CompanyStudentDetail from './features/company/CompanyStudentDetail';
import StudentProfileEdit from './features/student/StudentProfileEdit';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      element: <PersistLogin />,
      children: [
        {
          path: '/admin',
          element: <RequireAuth allowedRoles={["SYS_ADMIN"]} />,
          children: [
            {
              path: 'dashboard',
              element: <AdminDashboardLayout />,
              children: [
                { element: <Navigate to="/admin/dashboard/app" replace /> },

                { path: 'student', element: <AdminStudentList /> },


                { path: 'company', element: <AdminCompany /> }
                ,
                { path: 'company/:id', element: <AdminCompanyProfile /> }
                ,
                { path: 'student/:id', element: <AdminStudentProfile /> }
                ,

                { path: 'registerStudent', element: <AddStudent /> }
                ,
                { path: 'registerCompany', element: <AddCompany /> },

                { path: 'ojtresult', element: <AdminOJTResult /> },

                { path: 'applicationstatus', element: <AdminApplicationStatus /> },

                { path: 'company/update/:id', element: <AdminUpdateCompanyInfo /> },

                { path: 'student/update/:id', element: <AdminUpdateStudentInfo /> },

                { path: 'security', element: <ChangePass /> },

              ]
            },
          ]
        },
        {
          path: '/student',
          element: <RequireAuth allowedRoles={["STUDENT"]} />,
          children: [
            {
              path: 'dashboard',
              element: <StudentDashboardLayout />,
              children: [
                { element: <Navigate to="/student/dashboard/jobs" replace /> },

                { path: 'jobs', element: <StudentJobList /> },

                { path: 'jobs/:id', element: <StudentJobDetail /> },

                { path: 'security', element: <ChangePass /> },


                { path: 'company', element: <StudentCompany /> }
                ,
                { path: 'company/:id', element: <StudentCompanyProfile /> }
                ,
                { path: 'profile', element: <StudentProfile /> },

                { path: 'profile/edit', element: <StudentProfileEdit /> },

                { path: 'applicationstatus', element: <StudentApplicationStatus /> },
                { path: 'ojtResult', element: <StudentOJTResult /> },



              ]
            },
          ]
        },
        {
          path: '/company',
          element: <RequireAuth allowedRoles={["COMPANY_REPRESENTATIVE"]} />,
          children: [
            {
              path: 'dashboard',
              element: <CompanyDashboardLayout />,
              children: [
                { element: <Navigate to="/company/dashboard/app" replace /> },

                { path: 'app', element: <CompanyCreateJob /> }
                ,
                { path: 'user', element: <User /> },

                { path: 'student-offer', element: <CompanyStudentList /> }
                ,
                { path: 'student-offer/:id', element: <CompanyStudentDetail /> },

                { path: 'profile/update/:id', element: <CompanyUpdateProfile /> },

                { path: 'profile', element: <CompanyProfile /> },
                { path: 'jobs/:id', element: <CompanyJobDetail /> },

                { path: 'ojtresults', element: <CompanyOJTResult /> },

                { path: 'security', element: <ChangePass /> },

                { path: 'verify', element: <CompanyApplicationStatus /> },



              ]
            },
          ]
        },
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
