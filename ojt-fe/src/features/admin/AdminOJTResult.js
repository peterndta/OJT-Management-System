import download from "@iconify/icons-eva/download-outline";
import { Icon } from "@iconify/react";
// material
import {
  Box,
  Button,
  Card, CircularProgress,
  Container,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import Label from "../../components/Label";
// components
import Page from "../../components/Page";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import { UserListHead } from "../../components/_dashboard/user";
import StudentListToolbar from "../../components/_dashboard/user/StudentListToolbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "code", label: "Student Code", alignRight: false },
  { id: "major", label: "Major", alignRight: false },
  { id: "job", label: "Job", alignRight: false },
  { id: "company", label: "Company", alignRight: false },
  { id: "grade", label: "Grade", alignRight: false },
  { id: "comment", label: "Comment", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  // { id: "" },
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
        (_user) => _user.studentName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 2) {
      return filter(
        array,
        (_user) => _user.studentCode.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 3) {
      return filter(
        array,
        (_user) => _user.majorName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 4) {
      return filter(
        array,
        (_user) => _user.jobName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 5) {
      return filter(
        array,
        (_user) => _user.companyName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (filterBy === 6) {
      return filter(
        array,
        (_user) => _user.grade.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function AdminOJTResult() {
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
  const [load, setLoad] = useState(false);
  // const [download, setDownload] = useState(false);
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
        const response = await axiosPrivate.get("/admin/get-all-evaluation", {
          signal: controller.signal,
        });
        // console.log("Student OJT: ", response.data);
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



  const exportResult = async () => {
    try {
      setLoad(true);
      const response = await axiosPrivate.get("/admin/student-export", {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'result.xlsx'); // or any other extension

      link.click();
      window.URL.revokeObjectURL(url)
      setLoad(false);

    } catch (error) {
      console.log(error);
      setLoad(false);
    }
  }



  if (loading) {
    return <LoadingComponent />;
  }


  return (
    <Page title="OJT Result">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            OJT Result
          </Typography>
          {/* <Button variant="extended" startIcon={<Icon icon={download} />}
            onClick={exportResult}
          >
            Export
          </Button> */}

        </Stack>
        {load && <Stack direction="row" spacing={3} sx={{ marginLeft: "75%", marginTop: "-3%" }}>
          <Typography marginTop={-1.2}>
            File is downloading
          </Typography>
          <LinearProgress sx={{ width: "35%", margin: "0" }} />
        </Stack>
        }
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
                <MenuItem value={6}>Grade</MenuItem>
              </Select>
            </FormControl>
            <StudentListToolbar
              numSelected={selected.length}
              filterValue={filterName}
              onFilter={handleFilterByName}
            />
          </Box>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
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
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        id,
                        studentName,
                        studentCode,
                        majorName,
                        jobName,
                        grade,
                        pass,
                        companyName,
                        comment
                      } = row;
                      const isItemSelected = selected.indexOf(studentName) !== -1;

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
                          <TableCell align="left">{jobName}</TableCell>
                          <TableCell align="left">{companyName}</TableCell>
                          <TableCell align="left">{grade}</TableCell>
                          <TableCell align="left">{comment}</TableCell>
                          <TableCell align="left" style={{ width: "5%" }}>
                            <Label
                              variant="ghost"
                              color={
                                (pass === false && "error") || "success"
                              }
                            >
                              {" "}
                              {pass ? "Pased" : "Not Passed"}
                            </Label>
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
    </Page>
  );
}
