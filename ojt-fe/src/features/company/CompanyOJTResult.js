import upload from "@iconify/icons-eva/upload-fill";
import download from "@iconify/icons-eva/download-outline";
import { Icon } from "@iconify/react";
import {
  Alert,
  Avatar,
  Button,
  Container,
  Divider,
  Grid,
  Snackbar,
  Stack,
  Typography,
  LinearProgress,
} from "@mui/material";
import React, { forwardRef, useState } from "react";
import Page from "../../components/Page";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AlertSucess = forwardRef((props, ref) => (
  <Alert ref={ref} variant="filled" {...props} />
));

export default function CompanyOJTResult() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [load, setLoad] = useState(false);
  const [files, setFiles] = useState({ file: null });
  const id = localStorage.getItem("id");
  const [isLoad, setIsLoad] = useState(false);
  const onInputChange = (e) => {
    setFiles(e.target.files[0]);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", files);
    try {
      setIsLoad(true);
      const response = await axiosPrivate.post("/evaluation/import", formData);
      console.log("submit res: ", response);
      setAlertSuccess(true);
      setOpenAlert(true);
      setIsLoad(false);
    } catch (error) {
      console.error(error);
      console.log(error.response);
      setAlertSuccess(false);
      setOpenAlert(true);
      setIsLoad(false);
    }
  };
  const params = {
    companyId: id,
  };
  const exportResult = async () => {
    try {
      setLoad(true);
      const response = await axiosPrivate.get(
        "/evaluation/export-ojt-student",
        {
          responseType: "blob",
          params,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "on-job-student-list.xlsx");
      link.click();
      window.URL.revokeObjectURL(url);
      setLoad(false);
    } catch (error) {
      console.log(error);
      setLoad(false);
    }
  };
  return (
    <Page title="OJT Result">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Submit OJT's Results
          </Typography>
          <Button
            component="span"
            variant="extended"
            onClick={exportResult}
            startIcon={<Icon icon={download} />}
          >
            Get Student List
          </Button>
        </Stack>
        {load && (
          <Stack
            direction="row"
            spacing={3}
            sx={{ marginLeft: "75%", marginTop: "-3%" }}
          >
            <Typography marginTop={-1.2}>File is downloading</Typography>
            <LinearProgress sx={{ width: "35%", margin: "0" }} />
          </Stack>
        )}
        <Divider color="text" />
      </Container>
      <form onSubmit={handleSubmit}>
        <Grid
          sx={{
            position: "absolute",
            top: "50%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            height: "50%",
            bgcolor: "background.paper",
            m: 5,
            boxShadow: 24,
            p: 4,
          }}
          spacing={3}
          item
          lg={12}
          md={12}
          xs={12}
        >
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
            <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
              Upload File Excel
            </Typography>
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xs={12}
            sx={{ mt: 4 }}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <input
              type="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={onInputChange}
            />
          </Grid>

          <Grid
            item
            lg={12}
            md={12}
            xs={12}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 5 }}
          >
            <Avatar
              src="https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.15752-9/274971059_1132440520882109_8123332654021363213_n.png?_nc_cat=103&ccb=1-5&_nc_sid=ae9488&_nc_ohc=ImwmahboHZEAX8ANg72&_nc_ht=scontent.fsgn2-2.fna&oh=03_AVIa8XUNS_YH5DjtzBKn1JBpjYu7IdLxQ-cjipRw_4LMpg&oe=624EF78C"
              sx={{
                height: 100,
                width: 100,
              }}
              variant="square"
            />
          </Grid>
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
              // onClick={handleAlertClick}
            >
              Upload
            </Button>
          </Grid>
          {isLoad && (
            <Stack
              direction="row"
              spacing={3}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography marginTop={-1.2} sx={{ fontSize: "medium" }}>
                Upload is on proccessing.
              </Typography>
              <LinearProgress sx={{ width: "20%", margin: "0" }} />
            </Stack>
          )}
        </Grid>
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
            severity={alertSuccess ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            Submit OJT's results {alertSuccess ? "success" : "error"}!
          </AlertSucess>
        </Snackbar>
      </form>
    </Page>
  );
}
