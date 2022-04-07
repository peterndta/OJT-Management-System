// material
import {
  Box, Alert,
  // Avatar,
  Button,
  Card, CircularProgress,
  Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography, Snackbar
} from "@mui/material";
import { filter } from "lodash";
import { useEffect, useState } from "react";
// components
import Page from "../../components/Page";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import {
  UserListHead
} from "../../components/_dashboard/user";
import CompanyStudentOfferMoreMenu from "./CompanyStudentOfferMoreMenu";
import StudentListToolbar from "../../components/_dashboard/user/StudentListToolbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "code", label: "Student Code", alignRight: false },
  { id: "major", label: "Major", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "phone", label: "Phone", alignRight: false },
  { id: "gpa", label: "GPA", alignRight: false },
  { id: "ojtStatus", label: "OJT Status", alignRight: false },
  { id: "offer", label: "Offer Student", alignRight: false },
  { id: "" },
];



// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query, filterBy) {
  // console.log(array);
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    if (filterBy === 1) {
      return filter(
        array,
        (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 2) {
      return filter(
        array,
        (_user) => _user.student.studentCode.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 3) {
      return filter(
        array,
        (_user) => _user.student.major.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CompanyStudentList() {
  const [messageOffer, setMessageOffer] = useState("");
  const [statusOffer, setStatusOffer] = useState(0);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenModal(false);
  };
  const handleClickModal = () => {
    setOpenModal(true);
  };
  const jobListTest = [
    {
      "id": 1,
      "name": "Java Developer (All Levels) - Up to $2k"
    },
    {
      "id": 2,
      "name": "Job 2"
    }
  ]
  const handleOffer = () => {
    if (jobOffer) {
      console.log("job Offer", jobOffer);
      console.log("id student", studentOfferID);
      const offer = async () => {
        try {
          const response = await axiosPrivate.post(`/companies/offer-student/${studentOfferID}`,
            {
              "experience": "string",
              "jobId": jobOffer,
              "attachments": [
                {
                  "key": "string",
                  "name": "string"
                }
              ]
            }

          )
          if (response.status === 200) {
            // success apply message 
            setMessageOffer("Offer Successfully!")
            setStatusOffer(0)
            handleClickModal()

          }
        } catch (error) {
          setStatusOffer(1)
          console.log(error);
          if (error?.response?.data?.message) {
            setMessageOffer(error?.response?.data?.message);
          } else {
            setMessageOffer("Cannot offer")
          }
          handleClickModal();
        }
      }
      offer();
      setJobList([]);
      setJobOffer('');
      setMessage("")
      setOpen(false);
    }
    else {
      setMessage("Choose job before offer!")
    }
  }

  // select
  const [jobOffer, setJobOffer] = useState('');
  const [jobList, setJobList] = useState([]);
  const [studentOfferID, setStudentOfferID] = useState('');

  const handleChange = (event) => {
    setJobOffer(event.target.value);
    setMessage("")
  };
  // console.log(jobOffer);

  // dialog
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return;
    setJobList([]);
    setJobOffer('');
    setMessage("")
    setOpen(false);
  };

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [filterBy, setFilterBy] = useState(1);
  const handleFilterBy = (event) => {
    setFilterBy(event.target.value);
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
      <CircularProgress color="success" size={50} />
    </Box>
  );
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = students.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //   setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - students.length) : 0;

  const filteredUsers = applySortFilter(
    students,
    getComparator(order, orderBy),
    filterName,
    filterBy
  );

  const isUserNotFound = filteredUsers.length === 0;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getStudents = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get("/companies/get-student-list-to-offer", {
          signal: controller.signal,
        });
        // console.log("Student list: ", response.data);
        // console.log(typeof(response.data));
        setLoading(false);
        if (isMounted) {
          setStudents(response.data);
        }
      } catch (error) {
        // console.error(error);
        setLoading(false);
      }
    };
    getStudents();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  // console.log(students);
  if (loading) {
    return <LoadingComponent />;
  }


  return (
    <>
      <Page title="Student Offer">
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              Student
            </Typography>
            <Box>
              <label htmlFor="upload-photo">
                <input
                  style={{ display: "none" }}
                  id="upload-photo"
                  name="upload-photo"
                  type="file"
                />
                {/* <Button
                                component="span"
                                variant="extended"
                                startIcon={<Icon icon={plusCircle} />}
                            >
                                Import
                            </Button> */}
              </label>
              {/* <Button variant="extended" startIcon={<Icon icon={download} />}>
                            Export
                        </Button> */}
              {/* <Button
                            variant="contained"
                            component={RouterLink}
                            to="/admin/dashboard/registerStudent"
                            startIcon={<Icon icon={plusFill} />}
                            sx={{
                                ml: 1,
                            }}
                        >
                            New Student
                        </Button> */}
            </Box>
          </Stack>

          <Card>
            {/* Search và Filter */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FormControl sx={{ width: "10% ", ml: 2 }}>
                <InputLabel id="demo-simple-select-label">Search</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Search"
                  value={filterBy}
                  onChange={handleFilterBy}
                >
                  <MenuItem value={1}>Name</MenuItem>
                  <MenuItem value={2}>Code</MenuItem>
                  <MenuItem value={3}>Major</MenuItem>
                </Select>
              </FormControl>
              <StudentListToolbar
                numSelected={selected.length}
                filterValue={filterName}
                onFilter={handleFilterByName}
              />
            </Box>

            {/* Table */}
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  {/* Đầu bảng */}
                  <UserListHead
                    // order={order}
                    // orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={students.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const { id, name, student, phone, email } = row;
                        const isItemSelected = selected.indexOf(name) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            {/* Checkbox */}
                            {/* <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell> */}

                            {/* Data cột Name */}
                            {/* <TableCell component="th" scope="row" padding="none"> */}
                            {/* <Stack
                              direction="row"
                              alignItems="left"
                              spacing={2}
                            > */}
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            {/* <Typography variant="subtitle2" noWrap> */}
                            {/* {name} */}
                            {/* </Typography> */}
                            {/* </Stack> */}
                            {/* </TableCell> */}
                            <TableCell align="left">
                              {name}
                            </TableCell>
                            {/* Data cột Student Code */}
                            <TableCell align="left">
                              {student.studentCode}
                            </TableCell>

                            {/* Data cột Major */}
                            <TableCell align="left">
                              {student.major.name}
                            </TableCell>

                            {/* Data cột Email */}
                            <TableCell align="left">{email}</TableCell>

                            {/* Data cột phone */}
                            <TableCell align="left">{phone}</TableCell>
                            {/* Data cột gpa */}
                            <TableCell align="left">{student.gpa}</TableCell>
                            {/* Data cột ojtStatus */}
                            <TableCell align="left">


                              {
                                // eslint-disable-next-line no-nested-ternary
                                student.ojtStatus === -1 ? "Not Yet"

                                  : student.ojtStatus === 0 ? "Is OJT"

                                    : "Finished OJT"
                              }

                            </TableCell>
                            {/* Data cột offer */}
                            <TableCell align="left">
                              <Button onClick={
                                () => {
                                  const getJobs = async () => {
                                    try {

                                      const response = await axiosPrivate.get(`/companies/get-jobs-suiable-for-student/${student?.id}`, {

                                      });
                                      // console.log("Student list: ", response.data);
                                      // console.log(typeof(response.data));


                                      setJobList(response.data);

                                    } catch (error) {
                                      // console.error(error);

                                    }
                                  };
                                  getJobs();
                                  // setJobList(jobListTest)
                                  setStudentOfferID(student?.id)
                                  handleClickOpen();
                                }

                              }>Offer</Button>
                            </TableCell>

                            {/* Thanh edit delete */}
                            <TableCell align="right">
                              <CompanyStudentOfferMoreMenu stID={id} />
                            </TableCell>
                          </TableRow>
                        );
                      })}

                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {/* Thông báo user not found */}
                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={students.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      </Page>
      <Dialog
        open={open}
        onClose={handleClose}
        // aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Are you sure to offer this student?
        </DialogTitle>
        <DialogContent>
          <DialogContentText color="textPrimary">
            If yes, choose job to offer.
            Otherwise, click cancel
          </DialogContentText>
          <br />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Job Offer</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={jobOffer}
              label="Job Offer"
              onChange={handleChange}
            >
              {
                jobList?.map((option, index) =>
                (
                  <MenuItem key={index} value={option.jobId}>
                    {option.jobName}
                  </MenuItem>
                )
                )
              }
            </Select>
          </FormControl>
          <br />
          <br />
          {message && <Typography color="error">{message}</Typography>}
        </DialogContent>
        <DialogActions sx={{ marginRight: "40%" }}>
          <Button onClick={handleClose} sx={{ fontSize: "large" }}>Cancel</Button>
          <Button onClick={handleOffer} autoFocus sx={{ fontSize: "large" }}>
            Offer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openModal} autoHideDuration={6000}
        onClose={handleCloseModal}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert onClose={handleCloseModal}
          severity={
            statusOffer === 0 ? "success" : "error"
          }
          sx={
            {
              width: '200%',
              backgroundColor: statusOffer === 0 ? "green" : "red",
              color: "white"
            }
          }>
          {messageOffer}
        </Alert>
      </Snackbar>
    </>

  );
}
