import { Alert, Button, Grid, Snackbar, TextField, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Form, FormikProvider, useFormik } from "formik";
import { forwardRef, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AlertSucess = forwardRef((props, ref) => (
    <Alert ref={ref} variant="filled" {...props} />
));

const isEmpty = (value) => value.trim().length === 0;

export default function CompanyUpdateProfile() {
    const navigate = useNavigate();
    // const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    // const { name, address, description } = location.state;
    const { id } = useParams();
    // const [fileName, setFilename] = useState("Upload Company Logo");
    const [companyName, setCompanyName] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [companyAddress, setCompanyAddress] = useState("");
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
    const [open, setOpen] = useState(false);

    const companyNameChange = (event) => {
        setCompanyName(event.target.value);
    };
    const companyDesChange = (event) => {
        setCompanyDescription(event.target.value);
    };
    const companyAddressChange = (event) => {
        setCompanyAddress(event.target.value);
    };

    // const fileSelectedHandler = (event) => {
    //   // console.log(event.target.files[0]);
    //   setFilename(event.target.files[0].name);
    // };

    const handleClick = () => {
        setOpen(true);
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
          id: "",
        };
        const getCompanies = async () => {
          try {
            setLoading(true);
            const response = await axiosPrivate.get(`/companies/${id}`, {
              signal: controller.signal,
              params,
            });
            // console.log("Company ID: ", response.data);
            setLoading(false);
    
            // isMounted && setCompanies(response.data);
            if (isMounted) {
              setCompanyName(response.data.name);
              setCompanyDescription(response.data.description);
              setCompanyAddress(response.data.address);
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
            name: companyName,
            // password: "",
            // email: "",
            address: companyAddress,
            // salary: "",
            // phone: "",
            description: companyDescription,
        },
        // validationSchema: CompanyValidation,
        onSubmit: async () => {
            let isMounted = true;
            const controller = new AbortController();
            try {
                const response = await axiosPrivate.put(`/companies/${id}`, {
                    name: companyName,
                    description: companyDescription,
                    address: companyAddress,
                });
                // console.log("a: ", response.data.data);
            } catch (error) {
                console.error(error);
            }

            return () => {
                isMounted = false;
                controller.abort();
            };
        },
    });

    const overallValidField =
        !isEmpty(companyName) &&
        !isEmpty(companyDescription) &&
        !isEmpty(companyAddress);

        if (loading) {
            return <LoadingComponent />;
          }
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
                        to="/company/dashboard/profile"
                        style={{ color: "#637381", textDecoration: "none" }}
                    >
                        Profile
                        {/* {company.name} */}
                    </Link>

                    {/* <Link
                        to={`/admin/dashboard/company/${id}`}
                        style={{ color: "#637381", textDecoration: "none" }}
                    >
                        Company Details
                    </Link> */}

                    <Typography
                        sx={{ display: "flex", alignItems: "center" }}
                        color="text.primary"
                    >
                        Edit Profile
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
                        Edit Company
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
                                    error={isEmpty(companyName)}
                                    helperText={isEmpty(companyName) ? "Name is required" : ""}
                                    value={companyName}
                                    onChange={companyNameChange}
                                />

                                {/* <TextField
                  required
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  style={{ width: "45%" }}
                  {...getFieldProps("password")}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                /> */}

                                <TextField
                                    // required
                                    id="description"
                                    label="Description"
                                    multiline
                                    rows={8}
                                    style={{ width: "91.5%" }}
                                    onChange={companyDesChange}
                                    value={companyDescription}
                                />

                                {/* <TextField
                  required
                  id="outlined-company-email-input"
                  label="Email"
                  style={{ width: "91.5%" }}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                /> */}

                                <TextField
                                    required
                                    id="outlined-company-address-input"
                                    label="Address"
                                    style={{ width: "91.5%" }}
                                    error={isEmpty(companyAddress)}
                                    helperText={
                                        isEmpty(companyAddress) ? "Address is required" : ""
                                    }
                                    onChange={companyAddressChange}
                                    value={companyAddress}
                                />

                                {/* <TextField
                  required
                  id="outlined-company-salary-input"
                  label="Salary Range"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ width: "45%" }}
                  {...getFieldProps("salary")}
                  error={Boolean(touched.salary && errors.salary)}
                  helperText={touched.salary && errors.salary}
                /> */}

                                {/* <TextField
                  required
                  id="outlined-company-phone-input"
                  label="Phone number"
                  style={{ width: "45%" }}
                  type="number"
                  {...getFieldProps("phone")}
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
                /> */}

                                {/* <label htmlFor="upload-photo">
                  <input
                    style={{ display: "none" }}
                    id="upload-photo"
                    name="upload-photo"
                    type="file"
                    onChange={fileSelectedHandler}
                    accept="image/*"
                  />
                  <Button size="small" component="span" variant="extended">
                    <Icon icon={briefcaseFill} width={22} height={22} />{" "}
                    {fileName}
                  </Button>
                </label> */}

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
                                        onClick={handleClick}
                                    >
                                        Submit
                                    </Button>
                                    <Snackbar
                                        open={open}
                                        autoHideDuration={6000}
                                        onClose={handleClose}
                                    >
                                        <AlertSucess
                                            onClose={handleClose}
                                            severity={overallValidField ? "success" : "error"}
                                            sx={{ width: "100%" }}
                                        >
                                            Company's Information updated{" "}
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
