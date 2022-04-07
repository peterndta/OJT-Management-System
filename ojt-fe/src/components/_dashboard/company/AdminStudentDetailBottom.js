import {
  // Button,
  Card,
  CardContent,
  CardHeader, Divider,
  Grid,
  Typography
} from "@mui/material";
import PropTypes from "prop-types";
// import { useSelector } from 'react-redux';

const AdminStudentDetailBottom = (props) => {
  const { user } = props;

  return (
    // <form autoComplete="off" noValidate {...props}>
    <Card>
      <CardHeader title="Student Detail" />

      <CardContent sx={{ mb: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} >
            <Divider />
          </Grid>
          {/* {
                jobs?.length ? ( */}
          <Grid
            item
            sx={{
              display: "flex",
              flexDirection: "column",
              ml: 10,
            }}
            
          >
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
              container
            >
              <Grid item lg={6} md={6} xs={6}>
                <Typography color="textPrimary" gutterBottom variant="h6">
                  Student Code
                </Typography>
              </Grid>
              <Grid item lg={6} md={6} xs={6}>
                <Typography color="textPrimary" gutterBottom variant="body1">
                  {user?.student?.studentCode}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
              container
            >
              <Grid item lg={6} md={6} xs={6}>
                <Typography color="textPrimary" gutterBottom variant="h6">
                  Semester
                </Typography>
              </Grid>
              <Grid item lg={6} md={6} xs={6}>
                <Typography color="textPrimary" gutterBottom variant="body1">
                  {user?.student?.semester?.name}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
              container
            >
              <Grid item lg={6} md={6} xs={6}>
                <Typography color="textPrimary" gutterBottom variant="h6">
                  Phone
                </Typography>
              </Grid>
              <Grid item lg={6} md={6} xs={6}>
                <Typography color="textPrimary" gutterBottom variant="body1">
                  {user.phone}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
              container
            >
              <Grid item lg={6} md={6} xs={6}>
                <Typography color="textPrimary" gutterBottom variant="h6">
                  Address
                </Typography>
              </Grid>
              <Grid item lg={6} md={6} xs={6}>
                <Typography color="textPrimary" gutterBottom variant="body1">
                  {user?.student?.address}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
              container
              // columnSpacing={{ xs: 1, sm: 2, md: 15 }}
            >
              <Grid item lg={6} md={6} xs={6}>
                <Typography color="textPrimary" gutterBottom variant="h6">
                  E-mail
                </Typography>
              </Grid>
              <Grid item lg={6} md={6} xs={6}>
                <Typography color="textPrimary" gutterBottom variant="body1">
                  {user.email}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    // </form>
  );
};
AdminStudentDetailBottom.propTypes = {
  user: PropTypes.object,
};
export default AdminStudentDetailBottom;
