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
  Alert, CircularProgress
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useParams, useNavigate } from "react-router-dom";
import { forwardRef, useState, useEffect } from "react";
import { Form, FormikProvider, useFormik } from "formik";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AlertSucess = forwardRef((props, ref) => (
  <Alert ref={ref} variant="filled" {...props} />
));

const isEmpty = (value) => value.trim().length === 0;
const phoneCheck = (value) => value.trim().length < 11;
const gpaCheck = (value) => value > 10 || value < 0 || value.length === 0;

export default function AdminUpdateStudentInfo() {
  const navigate = useNavigate(); 
  const { id } = useParams();

  const axiosPrivate = useAxiosPrivate();
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentCodes, setStudentCode] = useState("");
  const [studentMajor, setStudentMajor] = useState(1);
  const [studentSemester, setStudentSemester] = useState(1);
  const [studentStatus, setStudentStatus] = useState(1);
  const [studentGPA, setStudentGPA] = useState("");

  const [semester, setSemester] = useState();
  const [open, setOpen] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const studentNameChange = (event) => {
    setStudentName(event.target.value);
  };
  const studentEmailChange = (event) => {
    setStudentEmail(event.target.value);
  };
  const studentAddressChange = (event) => {
    setStudentAddress(event.target.value);
  };
  const studentPhoneChange = (event) => {
    setStudentPhone(event.target.value);
  };
  const studentCodeChange = (event) => {
    setStudentCode(event.target.value);
  };
  const studentMajorChange = (event) => {
    setStudentMajor(event.target.value);
  };
  const studentSemesterChange = (event) => {
    setStudentSemester(event.target.value);
  };
  const studentStatusChange = (event) => {
    setStudentStatus(event.target.value);
  };
  const studentGPAChange = (event) => {
    setStudentGPA(event.target.value);
  };
  
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  
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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const params = {
      id: "",
    };
    const getCompanies = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`/users/${id}`, {
          signal: controller.signal,
          params,
        });
        console.log("Company ID: ", response.data);
        setLoading(false);

        if (isMounted) {
          setStudentName(response.data?.name);
          setStudentEmail(response.data?.email);
          setStudentAddress(response.data?.student?.address);
          setStudentPhone(response.data?.phone);
          setStudentCode(response.data?.student?.studentCode);
          setStudentMajor(response.data?.student?.major?.id);
          setStudentSemester(response.data?.student?.semester?.id);
          setStudentGPA(response.data?.student?.gpa);
          setStudentStatus(response.data?.student?.ojtStatus);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        navigate('/404');
      }
    };
    getCompanies();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, id]);

  const formik = useFormik({
    initialValues: {
      name: studentName,
      email: studentEmail,
      semesterId: studentSemester,
      address: studentAddress,
      majorId: studentMajor,
      phone: studentPhone,
      studentCode: studentCodes,
    },

    onSubmit: async () => {
      try {
        const response = await axiosPrivate.put(`/users/${id}`, {
          email: studentEmail,
          password: "stringst",
          avatar: "string",
          name: studentName,
          role: "STUDENT",
          phone: studentPhone,
          companyName: "string",
          description: "string",
          companyAddress: "string",
          address: studentAddress,
          studentCode: studentCodes,
          gpa: studentGPA,
          ojtStatus: studentStatus,
          majorId: studentMajor,
          semesterId: studentSemester,
        })
        setAlertSuccess(true);
        setOpen(true);
        // console.log("a: ", response);
      } catch (error) {
        // console.error(error);
        setAlertSuccess(false);
        setOpen(true);
        if (!error?.response) {
          alert('No Server Response');
        } 
      }
    },
  });

  const overallValidField =
    !isEmpty(studentEmail) &&
    !isEmpty(studentName) &&
    !isEmpty(studentPhone) &&
    !isEmpty(studentAddress) &&
    !isEmpty(studentCodes) && alertSuccess &&
    !gpaCheck(studentGPA);

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
          <Link
            to={`/admin/dashboard/student/${id}`}
            style={{ color: "#637381", textDecoration: "none" }}
          >
            Student Details
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            Edit Student
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
            Edit Student
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
                  error={isEmpty(studentName)}
                  helperText={isEmpty(studentName) ? "Name is required" : ""}
                  onChange={studentNameChange}
                  value={studentName}
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
                  error={isEmpty(studentCodes)}
                  helperText={
                    isEmpty(studentCodes) ? "Student Code is required" : ""
                  }
                  onChange={studentCodeChange}
                  value={studentCodes}
                />

                <TextField
                  required
                  id="outlined-student-email-input"
                  label="Email"
                  style={{ width: "91.5%" }}
                  error={isEmpty(studentEmail)}
                  helperText={isEmpty(studentEmail) ? "Email is required" : ""}
                  onChange={studentEmailChange}
                  value={studentEmail}
                />

                <TextField
                  required
                  id="outlined-student-address-input"
                  label="Address"
                  style={{ width: "91.5%" }}
                  error={isEmpty(studentAddress)}
                  helperText={
                    isEmpty(studentAddress) ? "Address is required" : ""
                  }
                  onChange={studentAddressChange}
                  value={studentAddress}
                />

                <FormControl sx={{ width: "45%", ml: 1, mt: 1 }}>
                  <InputLabel id="major-select">Major</InputLabel>
                  <Select
                    labelId="major-select"
                    id="major-select"
                    value={studentMajor}
                    label="Major"
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
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  id="outlined-student-phone-input"
                  label="Phone number"
                  style={{ width: "45%" }}
                  type="number"
                  onChange={studentPhoneChange}
                  value={studentPhone}
                  error={phoneCheck(studentPhone)}
                  helperText={phoneCheck(studentPhone) ? "Phone must above 11" : ""}
                />

                <TextField
                  required
                  id="outlined-student-gpa-input"
                  label="GPA"
                  style={{ width: "45%" }}
                  type="number"
                  onChange={studentGPAChange}
                  value={studentGPA}
                  error={gpaCheck(studentGPA)}
                  helperText={gpaCheck(studentGPA) ? "GPA must from 0-10" : ""}
                />

                <FormControl sx={{ width: "45%", ml: 1, mt: 1 }}>
                  <InputLabel id="status-select">Status</InputLabel>
                  <Select
                    labelId="status-select"
                    id="status-select"
                    value={studentStatus}
                    label="Status"
                    onChange={studentStatusChange}
                  >
                    <MenuItem value={-1}>Not Yet</MenuItem>
                    <MenuItem value={0}>Is OJT</MenuItem>
                    <MenuItem value={1}>Passed</MenuItem>
                    <MenuItem value={2}>Not Passed</MenuItem>                  
                  </Select>
                </FormControl>

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
                      Student's Information updated{" "}
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
