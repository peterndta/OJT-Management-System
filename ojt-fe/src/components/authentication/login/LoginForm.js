import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
// material
import {
  IconButton,
  InputAdornment, Stack, TextField
} from '@mui/material';
// import axios from 'axios';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// import AuthContext from "../../../context/AuthProvider";
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';
// ----------------------------------------------------------------------

export default function LoginForm() {
  // const { setAuth } = useContext(AuthContext);
  // console.log(setAuth);
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    // onSubmit: () => {
    //   navigate('/dashboard', { replace: true });
    // }

    onSubmit: async () => {

      // const formData = new FormData();
      // formData.append('empEmail', values.email);
      // formData.append('password', values.password);
      // console.log(formData.get("empEmail"));

      // const response = await axios(
      //   {
      //     method: 'post',
      //     url: 'http://localhost:8081/backend/api/auth/signin',
      //     data: {
      //       "email": values.email,
      //       "password": values.password
      //     },

      //   }
      // )
      try {
        const response = await axios.post('/api/auth/signin',
          {
            "email": values.email,
            "password": values.password
          }
        )

        console.log(JSON.stringify(response?.data));
        const token = response?.data?.token;
        const roles = response?.data?.roles;
        const refreshToken = response?.data?.refreshToken;
        const account = response?.data?.account;
        console.log(token);
        // console.log(account.name);
        setAuth({ token, roles, account, refreshToken });
        localStorage.setItem("account", JSON.stringify(account));
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("roles", roles);
        localStorage.setItem("id", account?.company?.id);
        localStorage.setItem("name", account?.name);
        localStorage.setItem("email", account?.email);
        localStorage.setItem("companyName", account?.company?.name);
        if (localStorage.getItem('roles') === 'SYS_ADMIN')
          navigate('/admin/dashboard/student', { replace: true });
        if (localStorage.getItem('roles') === 'STUDENT')
          navigate('/student/dashboard/jobs', { replace: true });
        if (localStorage.getItem('roles') === 'COMPANY_REPRESENTATIVE')
          navigate('/company/dashboard/app', { replace: true });
        // const accessToken = response?.data?.token;
        // const roles = [response?.data?.roleID];
        // console.log(roles);
        // localStorage.setItem("roles", roles);
        // setAuth({ user, pwd, roles, accessToken });

        // setUser('');
        // setPwd('');
        // navigate(from, { replace: true });
      } catch (err) {
        if (!err?.response) {
          alert('No Server Response');
        } else if (err.response?.status === 400) {
          alert('Login Failed. Email or password wrong!');
        } else {
          alert('Login Failed. Email or password wrong!')
        }
      }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          {/* <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          /> */}
          {/* 
          <Link component={RouterLink} variant="subtitle2" to="#">
            Forgot password?
          </Link> */}
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
