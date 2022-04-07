// material
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import {
    Container, IconButton,
    InputAdornment, Link, Stack, TextField, Typography
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from "react-router-dom";
import * as Yup from 'yup';
// components
import Page from '../../components/Page';
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const StudentProfileEdit = () => {
    const [student, setStudent] = useState();


    const { auth } = useAuth();
    // const [showPassword, setShowPassword] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const changePassSchema = Yup.object().shape({

        name: Yup.string().required('name is required'),
        phone: Yup.string().required('phone is required'),

        address: Yup.string().required('address is required')

    });
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getStudent = async () => {
            try {
                const response = await axiosPrivate.get('/users/get-student-info', {
                    signal: controller.signal,
                });
                console.log("data ", response.data);
                localStorage.setItem("editProfile", JSON.stringify(response.data))
                if (isMounted) {
                    setStudent(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getStudent();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    // console.log("Stud: ", student?.name);
    const formik = useFormik({
        initialValues: {
            name: JSON.parse(localStorage.getItem('editProfile')).name,
            phone: JSON.parse(localStorage.getItem('editProfile')).phone,
            address: JSON.parse(localStorage.getItem('editProfile')).student?.address,

        },

        validationSchema: changePassSchema,
        // onSubmit: () => {
        //   navigate('/dashboard', { replace: true });
        // }

        onSubmit: async () => {

            if (window.confirm("Are you sure you want to update profile?")) {

                try {

                    const response = await axiosPrivate.put(`/users/${JSON.parse(localStorage.getItem('editProfile')).id}`,
                        {
                            "email": "string@gmail.com",
                            "password": "stringst",
                            "avatar": "string",
                            "name": values.name,
                            "role": "string",
                            "phone": values.phone,
                            "companyName": "string",
                            "description": "string",
                            "companyAddress": "string",
                            "address": values.address,
                            "studentCode": "string",
                            "gpa": 10,
                            "ojtStatus": 1,
                            "majorId": 0,
                            "semesterId": 0

                        }
                    )
                    if (response.status === 200) {
                        alert('Update Profile successfully')
                    }




                } catch (err) {
                    if (!err?.response) {

                        alert('No Server Response');

                    } else {
                        console.log(err);
                        alert('Something wrong. Update unsuccess!');
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
    console.log("val", values.name);

    // const handleShowPassword = () => {
    //     setShowPassword((show) => !show);
    // };



    return (
        <Page title="Edit Profile">
            <Container>
                <Stack direction="row" spacing={2}
                    // alignItems="center" 
                    // justifyContent="space-between" 
                    mb={5}
                >
                    <Link
                        // to={`/admin/dashboard/company/${company.id}`}
                        to='/student/dashboard/profile'
                        color="inherit"
                        underline="hover"
                        component={RouterLink}
                    >
                        <Typography variant="h4" gutterBottom>

                            Profile
                        </Typography>
                    </Link>
                    <Typography variant="h4" gutterBottom>

                        |
                    </Typography>
                    <Typography variant="h4" gutterBottom>

                        Edit Profile
                    </Typography>
                </Stack>
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Stack spacing={3}>

                            <Stack direction="row" spacing={5}>
                                <Typography
                                    variant='h5'
                                >
                                    Name
                                </Typography>

                                <TextField
                                    fullWidth
                                    // autoComplete="current-password"
                                    // type={showPassword ? 'text' : 'password'}
                                    // label={student?.name}
                                    // defaultValue="Hello World"
                                    // value={student?.name}
                                    {...getFieldProps('name')}
                                    // InputProps={{
                                    //     endAdornment: (
                                    //         <InputAdornment position="end">
                                    //             <IconButton onClick={handleShowPassword} edge="end">
                                    //                 <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                                    //             </IconButton>
                                    //         </InputAdornment>
                                    //     )
                                    // }}
                                    error={Boolean(touched.name && errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                            </Stack>
                            <Stack direction="row" spacing={5}>
                                <Typography
                                    variant='h5'
                                >
                                    Phone
                                </Typography>
                                <TextField
                                    fullWidth
                                    // autoComplete="current-password"
                                    // type={showPassword ? 'text' : 'password'}
                                    // label="New Password"
                                    {...getFieldProps('phone')}
                                    // InputProps={{
                                    //     endAdornment: (
                                    //         <InputAdornment position="end">
                                    //             <IconButton onClick={handleShowPassword} edge="end">
                                    //                 <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                                    //             </IconButton>
                                    //         </InputAdornment>
                                    //     )
                                    // }}
                                    error={Boolean(touched.phone && errors.phone)}
                                    helperText={touched.phone && errors.phone}
                                />
                            </Stack>
                            <Stack direction="row" spacing={3}>
                                <Typography
                                    variant='h5'
                                >
                                    Address
                                </Typography>
                                <TextField
                                    fullWidth
                                    // autoComplete="current-password"
                                    // type={showPassword ? 'text' : 'password'}
                                    // label="Confirm Password"
                                    {...getFieldProps('address')}
                                    // InputProps={{
                                    //     endAdornment: (
                                    //         <InputAdornment position="end">
                                    //             <IconButton onClick={handleShowPassword} edge="end">
                                    //                 <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                                    //             </IconButton>
                                    //         </InputAdornment>
                                    //     )
                                    // }}
                                    error={Boolean(touched.address && errors.address)}
                                    helperText={touched.address && errors.address}
                                />
                            </Stack>
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
                            Save Change
                        </LoadingButton>
                    </Form>
                </FormikProvider>

            </Container>
        </Page>
    );
}

export default StudentProfileEdit