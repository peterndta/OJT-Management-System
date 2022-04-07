import {
  Button,
  // Paper,
  TextField,
  Grid,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import { forwardRef, useEffect, useState } from "react";
import { Form, FormikProvider, useFormik } from "formik";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AlertSucess = forwardRef((props, ref) => (
  <Alert ref={ref} variant="filled" {...props} />
));
const defaultField = {
  value: "",
  isTouched: false
}
const isEmpty = (value) => value.trim().length === 0;
const passwordCheck = (value) => value.trim().length < 8;
const phoneCheck = (value) => value.trim().length < 11;
const gpaCheck = (value) => value > 10 || value < 0 || value.trim().length === 0;

export default function AddStudent() {
  const axiosPrivate = useAxiosPrivate();
  const [studentName, setStudentName] = useState(defaultField);
  const [studentEmail, setStudentEmail] = useState(defaultField);
  const [studentAddress, setStudentAddress] = useState(defaultField);
  const [studentPhone, setStudentPhone] = useState(defaultField);
  const [studentCodes, setStudentCode] = useState(defaultField);
  const [studentMajor, setStudentMajor] = useState(1);
  const [studentSemester, setStudentSemester] = useState(5);
  const [studentPassword, setStudentPassword] = useState(defaultField);
  const [studentGPA, setStudentGPA] = useState(defaultField);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [semester, setSemester] = useState();
  const [loading, setLoading] = useState(false);
  const studentNameChange = (event) => {
    setStudentName(prev => ({...prev, value: event.target.value}));
  };
  const studentEmailChange = (event) => {
    setStudentEmail(prev => ({...prev, value: event.target.value}));
  };
  const studentAddressChange = (event) => {
    setStudentAddress(prev => ({...prev, value: event.target.value}));
  };
  const studentPhoneChange = (event) => {
    setStudentPhone(prev => ({...prev, value: event.target.value}));
  };
  const studentCodeChange = (event) => {
    setStudentCode(prev => ({...prev, value: event.target.value}));
  };
  const studentMajorChange = (event) => {
    setStudentMajor(event.target.value);
  };
  const studentSemesterChange = (event) => {
    setStudentSemester(event.target.value);
  };
  const studentPasswordChange = (event) => {
    setStudentPassword(prev => ({...prev, value: event.target.value}));
  };
  const studentGPAChange = (event) => {
    setStudentGPA(prev => ({...prev, value: event.target.value}));
  };

  const studentNameIsTouched = (event) => {
    setStudentName(prev => ({...prev, isTouched: true}));
  };
  const studentEmailIsTouched = (event) => {
    setStudentEmail(prev => ({...prev, isTouched: true}));
  };
  const studentAddressIsTouched = (event) => {
    setStudentAddress(prev => ({...prev, isTouched: true}));
  };
  const studentPhoneIsTouched = (event) => {
    setStudentPhone(prev => ({...prev, isTouched: true}));
  };
  const studentCodeIsTouched = (event) => {
    setStudentCode(prev => ({...prev, isTouched: true}));
  };
  const studentPasswordIsTouched = (event) => {
    setStudentPassword(prev => ({...prev, isTouched: true}));
  };
  const studentGPAIsTouched = (event) => {
    setStudentGPA(prev => ({...prev, isTouched: true}));
  };

  const studentNameIsValid = isEmpty(studentName.value) && studentName.isTouched;
  const studentEmailIsValid = isEmpty(studentEmail.value) && studentEmail.isTouched; 
  const studentAddressIsValid = isEmpty(studentAddress.value) && studentAddress.isTouched; 
  const studentPhoneIsValid = phoneCheck(studentPhone.value) && studentPhone.isTouched; 
  const studentCodeIsValid = isEmpty(studentCodes.value) && studentCodes.isTouched; 
  const studentPasswordIsValid = passwordCheck(studentPassword.value) && studentPassword.isTouched; 
  const studentGPAIsValid = gpaCheck(studentGPA.value) && studentGPA.isTouched; 

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const LoadingComponent = () => (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="success" size={60} />

    </Box>
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const params = {
      search: "",
      pageNo: 0,
      pageSize: 20,
      sortBy: "id ASC",
    };
    const getSemester = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get("/semester/get-all-semester", {
          signal: controller.signal,
          params,
        });
        console.log("a: ", response.data.content);
        setLoading(false);
        if (isMounted) {
          setSemester(response.data.content);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    getSemester();

    return () => {
      isMounted = false;
      controller.abort();
    };

  }, []);

  const formik = useFormik({
    initialValues: {
      name: studentName,
      password: studentPassword,
      email: studentEmail,
      semesterId: studentSemester,
      address: studentAddress,
      majorId: studentMajor,
      phone: studentPhone,
      studentCode: studentCodes,
      gpa: studentGPA
    },
    // validationSchema: CompanyValidation,
    onSubmit: async () => {
      // let isMounted = true;
      // const controller = new AbortController();
      try {
        const response = await axiosPrivate.post("/api/auth/signup", {
          email: studentEmail.value,
          password: studentPassword.value,
          avatar: "string",
          name: studentName.value,
          role: "STUDENT",
          phone: studentPhone.value,
          companyName: "string",
          description: "string",
          companyAddress: "string",
          address: studentAddress.value,
          studentCode: studentCodes.value,
          gpa: studentGPA.value,
          ojtStatus: -1,
          majorId: studentMajor,
          semesterId: studentSemester,
        });
        console.log("a: ", response.data.data);
        setAlertSuccess(true);
        setOpen(true);
      } catch (error) {
        console.error(error);
        setAlertSuccess(false);
        setOpen(true);
        if (!error?.response) {
          alert('No Server Response');       
        } 
      }
    },
  });
  const overallValidField =
    !isEmpty(studentEmail.value) &&
    !isEmpty(studentName.value) &&
    !phoneCheck(studentPhone.value) &&
    !isEmpty(studentAddress.value) &&
    !passwordCheck(studentPassword.value) &&
    !isEmpty(studentCodes.value) && alertSuccess &&
    !gpaCheck(studentGPA.value);

  const { handleSubmit } = formik;

  if (loading) {
    return <LoadingComponent />;
  } 

  return (
    <Box>
      <Grid
        container
        direction="row"
        role="presentation"
        item
        justifyContent="flex-end"
        lg={12}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            to="/admin/dashboard/student"
            style={{ color: "#637381", textDecoration: "none" }}
          >
            Student
          </Link>

          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            Register Student
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Grid
        item
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          mt: 5,
          p: 3,
          pb: 8,
          ml: 20,
        }}
        style={{ width: "80%" }}
        autoComplete="off"
        lg={12}
        md={12}
        xs={12}
      >
        <Box
          sx={{
            pl: 5,
          }}
        >
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
            variant="h4"
          >
            Register Student
          </Typography>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Box
                sx={{
                  pt: 2,
                }}
              >
                <TextField
                  required
                  id="outlined-student-name-input"
                  label="Student Name"
                  style={{ width: "91.5%" }}
                  error={studentNameIsValid}
                  helperText={studentNameIsValid ? "Name is required" : ""}
                  onChange={studentNameChange}
                  value={studentName.value}
                  onBlur={studentNameIsTouched}
                />

                <TextField
                  required
                  id="outlined-student-password-input"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  style={{ width: "91.5%" }}
                  error={studentPasswordIsValid}
                  value={studentPassword.value}
                  helperText={
                    studentPasswordIsValid ? "Password must above 7" : ""
                  }
                  onBlur={studentPasswordIsTouched}
                  onChange={studentPasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword} edge="end">
                          <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <FormControl sx={{ width: "45%", ml: 1, mt: 1 }}>
                  <InputLabel id="smester-select">Semester</InputLabel>
                  <Select
                    labelId="smester-select"
                    id="smester-select"
                    value={studentSemester}
                    label="Semester"
                    onChange={studentSemesterChange}
                  >
                    {
                      semester?.map((option, index) =>
                      (
                        <MenuItem key={index} value={option.id}>
                          {option.name}
                        </MenuItem>
                      )
                      )
                    }
                  </Select>
                </FormControl>

                <TextField
                  required
                  id="outlined-student-code-input"
                  label="Student Code"
                  style={{ width: "45%" }}
                  error={studentCodeIsValid}
                  helperText={
                    studentCodeIsValid ? "Student Code is required" : ""
                  }
                  value={studentCodes.value}
                  onChange={studentCodeChange}
                  onBlur={studentCodeIsTouched}
                />

                <TextField
                  required
                  id="outlined-student-email-input"
                  label="Email"
                  style={{ width: "91.5%" }}
                  helperText={studentEmailIsValid ? "Email is required" : ""}
                  error={studentEmailIsValid}
                  value={studentEmail.value}
                  onChange={studentEmailChange}
                  onBlur={studentEmailIsTouched}
                />

                <TextField
                  required
                  id="outlined-student-address-input"
                  label="Address"
                  style={{ width: "91.5%" }}
                  error={studentAddressIsValid}
                  helperText={
                    studentAddressIsValid ? "Address is required" : ""
                  }
                  value={studentAddress.value}
                  onChange={studentAddressChange}
                  onBlur={studentAddressIsTouched}
                />

                <FormControl sx={{ width: "45%", ml: 1, mt: 1 }}>
                  <InputLabel id="major-select">Major</InputLabel>
                  <Select
                    labelId="major-select"
                    id="major-select"
                    label="Major"
                    value={studentMajor}
                    onChange={studentMajorChange}
                  >
                    <MenuItem value={1}>Software Engineering</MenuItem>
                    <MenuItem value={2}>Digital Art Design</MenuItem>
                    <MenuItem value={3}>Information Security</MenuItem>
                    <MenuItem value={4}>Information System</MenuItem>
                    <MenuItem value={5}>Artificial Intelligence</MenuItem>
                    <MenuItem value={6}>IoT</MenuItem>
                    <MenuItem value={7}>Business Administration</MenuItem>
                    <MenuItem value={8}>International Business</MenuItem>
                    <MenuItem value={9}>Digital Marketing</MenuItem>
                    <MenuItem value={10}>
                      Tourism and Holiday Service Administration
                    </MenuItem>
                    <MenuItem value={11}>
                      Multifunctional Communication Administration
                    </MenuItem>
                    <MenuItem value={12}>Hotel Management</MenuItem>
                    <MenuItem value={13}>Japanese</MenuItem>
                    <MenuItem value={14}>Korean</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  required
                  id="outlined-student-phone-input"
                  label="Phone number"
                  style={{ width: "45%" }}
                  type="number"
                  error={studentPhoneIsValid}
                  helperText={
                    studentPhoneIsValid ? "Phone must above 11" : ""
                  }
                  onChange={studentPhoneChange}
                  onBlur={studentPhoneIsTouched}
                />

                <TextField
                  required
                  id="outlined-student-gpa-input"
                  label="GPA"
                  style={{ width: "45%" }}
                  type="number"
                  value={studentGPA.value}
                  error={studentGPAIsValid}
                  helperText={
                    studentGPAIsValid ? "GPA must from 0-10" : ""
                  }
                  onChange={studentGPAChange}
                  onBlur={studentGPAIsTouched}
                />
                
                <Grid
                  item
                  justifyContent="flex-end"
                  alignItems="flex-end"
                  container
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: 4,
                      mr: 10,
                    }}
                    type="submit"
                  >
                    Submit
                  </Button>
                  <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <AlertSucess
                      onClose={handleClose}
                      severity={overallValidField ? "success" : "error"}
                      sx={{ width: "100%" }}
                    >
                      Student's Information added{" "}
                      {overallValidField ? "success" : "error"}!
                    </AlertSucess>
                  </Snackbar>
                </Grid>
              </Box>
            </Form>
          </FormikProvider>
        </Box>
      </Grid>
    </Box>
  );
}
