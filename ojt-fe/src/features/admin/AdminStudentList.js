/* eslint-disable no-nested-ternary */
import plusCircle from "@iconify/icons-eva/plus-circle-outline";
import plusFill from "@iconify/icons-eva/plus-fill";
import upload from "@iconify/icons-eva/upload-fill";
import { Icon } from "@iconify/react";
// material
import {
  Alert,
  Box,
  // Avatar,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
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
import { forwardRef, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Label from "../../components/Label";
// components
import Page from "../../components/Page";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import {
  AdminStudentMoreMenu,
  UserListHead,
} from "../../components/_dashboard/user";
import StudentListToolbar from "../../components/_dashboard/user/StudentListToolbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "code", label: "Student Code", alignRight: false },
  { id: "major", label: "Major", alignRight: false },
  { id: "semester", label: "Semester", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "phone", label: "Phone", alignRight: false },
  { id: "gpa", label: "GPA", alignRight: false },
  { id: "isojt", label: "OJT Status", alignRight: false },
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
        (_user) =>
          _user.student?.studentCode
            .toLowerCase()
            .indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 3) {
      return filter(
        array,
        (_user) =>
          _user.student.major?.name
            .toLowerCase()
            .indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 4) {
      return filter(
        array,
        (_user) =>
          _user.student.semester?.name
            .toLowerCase()
            .indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 5) {
      return filter(
        array,
        (_user) =>
          _user.student?.gpa.toString().indexOf(query.toString()) !== -1
      );
    }
  }
  return stabilizedThis.map((el) => el[0]);
}
const AlertSucess = forwardRef((props, ref) => (
  <Alert ref={ref} variant="filled" {...props} />
));

export default function AdminStudentList() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [filterBy, setFilterBy] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  const handleFilterBy = (event) => {
    setFilterBy(event.target.value);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        const response = await axiosPrivate.get("/admin/get-all-student-list", {
          signal: controller.signal,
        });
        console.log("Student list: ", response.data);
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

  const [files, setFiles] = useState({ file: null });
  const onInputChange = (e) => {
    setFiles(e.target.files[0]);
  };
  // const token = auth?.token;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", files);
    try {
      setLoad(true)
      const response = await axiosPrivate.post(
        "/admin/import-student-list",
        formData
      );
      console.log("a: ", response);
      setAlertSuccess(true);
      setOpenAlert(true);
      handleClose();
      setLoad(false)
    } catch (error) {
      console.error(error);
      console.log(error.response);
      setAlertSuccess(false);
      setOpenAlert(true);
      setLoad(false)
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <Page title="Student">
      <Container maxWidth="xl">
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
            <Button
              component="span"
              variant="extended"
              onClick={handleOpen}
              startIcon={<Icon icon={plusCircle} />}
            >
              Import
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "30%",
                    height: "30%",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                  }}
                  spacing={3}
                >
                  <Grid item lg={12} md={12} xs={12}>
                    <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
                      Upload File Excel
                    </Typography>
                  </Grid>
                  <Divider color="text" />
                  <Grid item lg={12} md={12} xs={12} sx={{ mt: 4 }}>
                    <input
                      type="file"
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      onChange={onInputChange}
                    />
                  </Grid>
                  {load && (
                    <Stack
                      direction="row"
                      spacing={3}
                      sx={{mt: 3}}
                    >
                      <Typography marginTop={-1.2} sx={{ fontSize: "default" }}>
                        Upload is on proccessing.
                      </Typography>
                      <LinearProgress sx={{ width: "20%", margin: "0" }} />
                    </Stack>
                  )}
                  <Grid
                    item
                    lg={12}
                    md={12}
                    xs={12}
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{
                        m: 5,
                        width: "50%",
                      }}
                      startIcon={<Icon icon={upload} />}
                    >
                      Upload
                    </Button>
                  </Grid>
                </Box>
              </form>
            </Modal>
            <Snackbar
              open={openAlert}
              autoHideDuration={5000}
              onClose={handleAlertClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <AlertSucess
                onClose={handleAlertClose}
                severity={alertSuccess ? "success" : "error"}
                sx={{ width: "100%" }}
              >
                Import student list {alertSuccess ? "success" : "error"}!
              </AlertSucess>
            </Snackbar>

            {/* </label> */}

            {/* <Button variant="extended" startIcon={<Icon icon={download} />}>
              Export
            </Button> */}
            <Button
              variant="contained"
              component={RouterLink}
              to="/admin/dashboard/registerStudent"
              startIcon={<Icon icon={plusFill} />}
              sx={{
                ml: 1,
              }}
            >
              New Student
            </Button>
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
                <MenuItem value={4}>Semester</MenuItem>
                <MenuItem value={5}>GPA</MenuItem>
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
                          // role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          {/* Data cột Name */}
                          <TableCell align="left">{name}</TableCell>

                          {/* Data cột Student Code */}
                          <TableCell align="left">
                            {student.studentCode}
                          </TableCell>

                          {/* Data cột Major */}
                          <TableCell align="left">
                            {student.major?.name}
                          </TableCell>

                          <TableCell align="left">
                            {student.semester?.name}
                          </TableCell>

                          {/* Data cột Email */}
                          <TableCell align="left">{email}</TableCell>

                          {/* Data cột phone */}
                          <TableCell align="left">{phone}</TableCell>

                          <TableCell align="left">{student.gpa}</TableCell>

                          <TableCell align="left" style={{ width: "7%" }}>
                            <Label
                              variant="ghost"
                              color={
                                (student.ojtStatus === -1 && "secondary") ||
                                (student.ojtStatus === 0 && "warning") ||
                                (student.ojtStatus === 1 && "success") ||
                                "error"
                              }
                            >
                              {" "}
                              {student.ojtStatus === -1
                                ? "Not Yet"
                                : student.ojtStatus === 0
                                ? "Is OJT"
                                : student.ojtStatus === 1
                                ? "Passed"
                                : "Not Passed"}
                            </Label>
                          </TableCell>

                          {/* Thanh edit delete */}
                          <TableCell align="right" style={{ width: "5%" }}>
                            <AdminStudentMoreMenu stID={id} />
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
  );
}
