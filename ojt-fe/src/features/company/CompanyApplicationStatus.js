import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { filter } from "lodash";
import { useEffect, useState, useMemo, forwardRef } from "react";
import Label from "../../components/Label";
// components
import Page from "../../components/Page";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import {
  CompanyApplicationMoreMenu,
  UserListHead,
} from "../../components/_dashboard/user";
import StudentListToolbar from "../../components/_dashboard/user/StudentListToolbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
//
// import USERLIST from '../../_mocks_/user';

// ----------------------------------------------------------------------
const AlertSucess = forwardRef((props, ref) => (
  <Alert ref={ref} variant="filled" {...props} />
));

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "code", label: "Student Code", alignRight: false },
  { id: "major", label: "Major", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "job", label: "Job", alignRight: false },
  { id: "company", label: "Company", alignRight: false },
  { id: "experience", label: "Experience", alignRight: false },
  { id: "gpa", label: "GPA", alignRight: false },
  { id: "studentconfirm", label: "Student Confirmed", alignRight: false },
  { id: "companyaccepted", label: "Company Accepted", alignRight: false },
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
        (_user) =>
          _user.studentName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 2) {
      return filter(
        array,
        (_user) =>
          _user.studentCode.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 3) {
      return filter(
        array,
        (_user) =>
          _user.majorName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 4) {
      return filter(
        array,
        (_user) =>
          _user.jobName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 5) {
      return filter(
        array,
        (_user) =>
          _user.companyName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 6) {
      return filter(
        array,
        (_user) => _user.gpa.toString().indexOf(query.toString()) !== -1
      );
    }
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CompanyApplicationStatus() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterBy, setFilterBy] = useState(1);
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [isAcceptedArray, setIsAcceptedArray] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(0);
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };
  const handleClickModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenModal(false);
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
  const handleFilterBy = (event) => {
    setFilterBy(event.target.value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = students.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

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

  const filteredUsers = useMemo(() =>
    applySortFilter(
      students,
      getComparator(order, orderBy),
      filterName,
      filterBy
    ),[students ,order, orderBy, filterName, filterBy]);

  useEffect(() => {
    const tempArray = filteredUsers.map(user => user.companyAccepted)
    setIsAcceptedArray(tempArray)

  },[filteredUsers])

  const isUserNotFound = filteredUsers.length === 0;
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getStudents = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(
          "/companies/get-list-applicaiton",
          {
            signal: controller.signal,
          }
        );
        // console.log("Student Apllication: ", response.data);
        // console.log(typeof(response.data));
        console.log(response.data);
        setLoading(false);
        if (isMounted) {
          const companyAcceptedArray = response.data.map(
            (res) => res.companyAccepted
          );
          setIsAcceptedArray(companyAcceptedArray);
          setStudents(response.data);
        }
      } catch (error) {
        // console.error(error.response);
        setLoading(false);
      }
    };
    getStudents();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const acceptedChange = async (id, accepted, index) => {
    const converted = !accepted;
    try {
      const response = await axiosPrivate.put(
        `/companies/confirm-application/${id}`,
        {
          companyAccepted: converted,
        }
        );
        
      console.log(response);
      const resData = response.data.companyAccepted;
      const cloneAcceptedArray = [...isAcceptedArray];
      filteredUsers[index].companyAccepted = resData;
      cloneAcceptedArray[index] = resData;
      setIsAcceptedArray(cloneAcceptedArray);
      setAlertSuccess(0);        
      setOpenAlert(true);
    } catch (error) {
      console.error(error.response);
      setAlertSuccess(1);        
      setOpenAlert(true);
    }
  };



  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <Page title="Application Status">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Application Status
          </Typography>
        </Stack>
        <Card>
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
                <MenuItem value={4}>Job</MenuItem>
                <MenuItem value={5}>Company</MenuItem>
                <MenuItem value={6}>GPA</MenuItem>
              </Select>
            </FormControl>
            <StudentListToolbar
              numSelected={selected.length}
              filterValue={filterName}
              onFilter={handleFilterByName}
            />
          </Box>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 1024 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={students.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.lenght !== 0 &&
                    filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const {
                          id,
                          studentName,
                          studentCode,
                          majorName,
                          jobName,
                          companyName,
                          cv,
                          studentConfirmed,
                          experience,
                          gpa, email
                        } = row;
                        const isItemSelected =
                          selected.indexOf(studentName) !== -1;
                        const cvName = cv?.name.slice(14);
                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell align="left">{studentName}</TableCell>
                            <TableCell align="left">{studentCode}</TableCell>
                            <TableCell align="left">{majorName}</TableCell>
                            <TableCell align="left">{email}</TableCell>
                            <TableCell align="left">{jobName}</TableCell>
                            <TableCell align="left">{companyName}</TableCell>
                            <TableCell align="left">
                              {" "}
                              {experience == null ? "Empty" : experience}
                            </TableCell>
                            <TableCell align="left">{gpa}</TableCell>

                            <TableCell align="left" style={{ width: "5%" }}>
                              <Label
                                variant="ghost"
                                color={
                                  (studentConfirmed === false && "error") ||
                                  "success"
                                }
                              >
                                {" "}
                                {studentConfirmed ? "Accepted" : "Not Accepted"}
                              </Label>
                            </TableCell>
                            <TableCell align="left" style={{ width: "5%" }}>
                              <Label
                                variant="ghost"
                                color={
                                  isAcceptedArray[index] ? "success" : "error"
                                }
                              >
                                {" "}
                                {isAcceptedArray[index]
                                  ? "Accepted"
                                  : "Not Accepted"}
                              </Label>
                            </TableCell>

                            <TableCell align="right" style={{ width: "5%" }}>
                              <CompanyApplicationMoreMenu
                                accept={isAcceptedArray[index]}
                                onChangeAccepted={acceptedChange}
                                id={id}
                                index={index}
                                cvKey={cv?.key}
                                cvName={cvName}
                                showAlert={handleClickModal}
                              />
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
      <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={handleAlertClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <AlertSucess
            onClose={handleAlertClose}
            severity={alertSuccess === 0 ? "success" : "error"}
            sx={{ width: "100%"  }}
          >
            {" "}
            {alertSuccess === 0 ? "You have successfully accepted this student" 
            : "Accept unsuccessfully"}!

          </AlertSucess>
        </Snackbar>

      <Snackbar
        open={openModal}
        autoHideDuration={6000}
        onClose={handleCloseModal}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleCloseModal} severity="error" variant="filled">
          No CV Found!
        </Alert>
      </Snackbar>
    </Page>
  );
}
