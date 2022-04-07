// material
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import {
  Container, IconButton,
  InputAdornment, Stack, TextField, Typography
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
// components
import Page from '../Page';
import useAuth from "../../hooks/useAuth";









export default function ChangePass() {
  const { auth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const changePassSchema = Yup.object().shape({

    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string().required('New Password is required'),

    confirmPassword: Yup.string().required('Confirm Password is required')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  });
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',

    },
    validationSchema: changePassSchema,
    // onSubmit: () => {
    //   navigate('/dashboard', { replace: true });
    // }

    onSubmit: async () => {

      if (window.confirm("Are you sure you want to change your password?")) {

        try {
          const response = await axiosPrivate.put(`/users/password/${auth.account.id}`,
            {
              "oldPassword": values.oldPassword,
              "newPassword": values.newPassword,

            }
          )
          if (response.status === 200) {
            alert('Change password successfully')
          }




        } catch (err) {
          if (!err?.response) {

            alert('No Server Response');

          } else {
            console.log(err);
            alert('Something wrong. Change password unsuccess!');
          }
        }
      } else {
        console.log('cancel');
        console.log(auth.account.id);
        //
      }
    }
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;


  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };



  return (
    <Page title="Security">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>

            Security | Change Password
          </Typography>

        </Stack>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>


              <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                label="Old Password"
                {...getFieldProps('oldPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.oldPassword && errors.oldPassword)}
                helperText={touched.oldPassword && errors.oldPassword}
              />

              <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                {...getFieldProps('newPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.newPassword && errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
              />
              <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                label="Confirm Password"
                {...getFieldProps('confirmPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
            </Stack>

            {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          
            </Stack> */}
            <br /><br />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}

            >
              Change Password
            </LoadingButton>
          </Form>
        </FormikProvider>

      </Container>
    </Page>
  );
}
