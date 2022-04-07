// import briefcaseFill from "@iconify/icons-eva/checkmark-square-outline";
import { Alert, Button, Grid, Snackbar, TextField, InputAdornment, IconButton } from "@mui/material";
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Form, FormikProvider, useFormik } from "formik";
import { forwardRef, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AlertSucess = forwardRef((props, ref) => (
  <Alert ref={ref} variant="filled" {...props} />
));

const isEmpty = (value) => value.trim().length === 0;
const passwordCheck = (value) => value.trim().length < 8;
const defaultField = {
  value: "",
  isTouched: false
}

export default function AddCompany() {
  // const [fileName, setFilename] = useState("Upload Company Logo");

  const axiosPrivate = useAxiosPrivate();
  const [companyAddName, setCompanyName] = useState(defaultField);
  const [Name, setName] = useState(defaultField);
  const [companyDescription, setCompanyDescription] = useState(defaultField);
  const [companyAddAddress, setCompanyAddress] = useState(defaultField);
  const [companyPassword, setCompanyPassword] = useState(defaultField);
  const [companyEmail, setCompanyEmail] = useState(defaultField);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  const companyNameChange = (event) => {
    setCompanyName(prev => ({...prev, value: event.target.value}));
  };
  const nameChange = (event) => {
    setName(prev => ({...prev, value: event.target.value}));
  };
  const companyDesChange = (event) => {
    setCompanyDescription(prev => ({...prev, value: event.target.value}));
  };
  const companyAddressChange = (event) => {
    setCompanyAddress(prev => ({...prev, value: event.target.value}));
  };
  const companyPasswordChange = (event) => {
    setCompanyPassword(prev => ({...prev, value: event.target.value}));
  };
  const companyEmailChange = (event) => {
    setCompanyEmail(prev => ({...prev, value: event.target.value}));
  };

  const companyNameIsTouched = (event) => {
    setCompanyName(prev => ({...prev, isTouched: true}));
  };
  const nameIsTouched = (event) => {
    setName(prev => ({...prev, isTouched: true}));
  };
  const companyDesIsTouched = (event) => {
    setCompanyDescription(prev => ({...prev, isTouched: true}));
  };
  const companyAddressIsTouched = (event) => {
    setCompanyAddress(prev => ({...prev, isTouched: true}));
  };
  const companyPasswordIsTouched = (event) => {
    setCompanyPassword(prev => ({...prev, isTouched: true}));
  };
  const companyEmailIsTouched = (event) => {
    setCompanyEmail(prev => ({...prev, isTouched: true}));
  };

  const companyNameIsInvalid = isEmpty(companyAddName.value) && companyAddName.isTouched;
  const nameIsInvalid = isEmpty(Name.value) && Name.isTouched ;
  const companyDescriptionIsInvalid = isEmpty(companyDescription.value) && companyDescription.isTouched;
  const companyAddressIsInvalid = isEmpty(companyAddAddress.value) && companyAddAddress.isTouched;
  const companyPasswordIsInvalid = passwordCheck(companyPassword.value) && companyPassword.isTouched;
  const companyEmailIsInvalid = isEmpty(companyEmail.value) && companyEmail.isTouched;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  // const fileSelectedHandler = (event) => {
  //   // console.log(event.target.files[0]);
  //   setFilename(event.target.files[0].name);
  // };

  const formik = useFormik({
    initialValues: {
      email: companyEmail,
      password: companyPassword,
      name: Name,
      companyName: companyAddName,
      description: companyDescription,
      companyAddress: companyAddAddress,
    },

    onSubmit: async () => {
      try {
        const response = await axiosPrivate.post("/api/auth/signup", {
          email: companyEmail.value,
          password: companyPassword.value,
          avatar: "string",
          name: Name.value,
          role: "COMPANY_REPRESENTATIVE",
          phone: "stringstrin",
          companyName: companyAddName.value,
          description: companyDescription.value,
          companyAddress: companyAddAddress.value,
          address: "string",
          studentCode: "string",
          majorId: 0,
          semesterId: 0,
        });
        console.log("a: ", response.data.data);
        setAlertSuccess(true);
        setOpen(true);
      } catch (error) {
        console.error(error);
        setAlertSuccess(false);
        setOpen(true);
        if (!error?.response) {
          alert("No Server Response");
        } 
      }
    },
  });
  const overallValidField =
    !isEmpty(companyEmail.value) &&
    !isEmpty(companyAddName.value) &&
    !isEmpty(companyAddAddress.value) &&
    !passwordCheck(companyPassword.value) &&
    !isEmpty(companyDescription.value) &&
    !isEmpty(Name.value) && alertSuccess;

  const { handleSubmit } = formik;
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
            to="/admin/dashboard/company"
            style={{ color: "#637381", textDecoration: "none" }}
          >
            Company
          </Link>

          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            Register Company
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
            Register Company
          </Typography>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid
                item
                sx={{
                  pt: 2,
                }}
              >
                <TextField
                  required
                  id="name"
                  label="Company Name"
                  style={{ width: "45%" }}
                  // {...getFieldProps("name")}
                  error={companyNameIsInvalid}
                  helperText={companyNameIsInvalid ? "Name is required" : ""}
                  value={companyAddName.value}
                  onChange={companyNameChange}
                  onBlur={companyNameIsTouched}
                />

                <TextField
                  required
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  style={{ width: "45%" }}
                  error={companyPasswordIsInvalid}
                  helperText={
                    companyPasswordIsInvalid
                      ? "Password must above 8"
                      : ""
                  }
                  onBlur={companyPasswordIsTouched}
                  value={companyPassword.value}
                  onChange={companyPasswordChange}
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

                <TextField
                  required
                  id="description"
                  label="Description"
                  multiline
                  rows={8}
                  style={{ width: "91.5%" }}
                  error={companyDescriptionIsInvalid}
                  onBlur={companyDesIsTouched}
                  helperText={
                    companyDescriptionIsInvalid ? "Description is required" : ""
                  }
                  onChange={companyDesChange}
                  value={companyDescription.value}
                />

                <TextField
                  required
                  id="outlined-company-name-input"
                  label="Account Name"
                  style={{ width: "45%" }}
                  error={nameIsInvalid}
                  helperText={nameIsInvalid ? "Account Name is required" : ""}
                  value={Name.value}
                  onChange={nameChange}
                  onBlur={nameIsTouched}
                />
                <TextField
                  required
                  id="outlined-company-email-input"
                  label="Email"
                  style={{ width: "45%" }}
                  error={companyEmailIsInvalid}
                  helperText={companyEmailIsInvalid ? "Email is required" : ""}
                  value={companyEmail.value}
                  onChange={companyEmailChange}
                  onBlur={companyEmailIsTouched}
                />

                <TextField
                  required
                  id="outlined-company-address-input"
                  label="Address"
                  style={{ width: "91.5%" }}
                  error={companyAddressIsInvalid}
                  helperText={
                    companyAddressIsInvalid ? "Address is required" : ""
                  }
                  onChange={companyAddressChange}
                  value={companyAddAddress.value}
                  onBlur={companyAddressIsTouched}
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
                    // onClick={handleClick}
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
                      Company's Information added{" "}
                      {overallValidField ? "success" : "error"}!
                    </AlertSucess>
                  </Snackbar>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Box>
      </Grid>
    </Box>
  );
}
