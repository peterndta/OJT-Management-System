// import moment from 'moment';
import PropTypes from "prop-types";
// import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  // CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
  // Link,
} from "@mui/material";
import { Icon } from "@iconify/react";
import editFill from "@iconify/icons-eva/edit-fill";
import {
  // Link,
  useNavigate,
} from "react-router-dom";

const AdminStudentDetailHeader = (props) => {
  const navigate = useNavigate();
  const { user } = props;
  // console.log(user.student.address);
  const toComponentB = () => {
    navigate(`/admin/dashboard/student/update/${user.id}`);
  };
  return (
    <Card>
      <CardContent>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "row",
            ml: 2
          }}
          container

          alignItems="center"
          spacing={8}
        >
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            item
            lg={6}
            md={6}
            xs={6}
          >
            <Typography color="textPrimary" gutterBottom variant="h3">
              {/* FPT SOFT */}
              {user.name}
            </Typography>

            <Typography color="secondary" gutterBottom style={{ fontSize: 18 }}>
              {user?.student?.major?.name}
            </Typography>

          </Grid>
          <Grid item sx={{ color: "text.secondary" }} lg={3} md={3} xs={3}>
            <Button
              variant="extended"
              onClick={() => {
                toComponentB();
              }}
              startIcon={<Icon icon={editFill} />}
              sx={{ color: "text.secondary" }}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
    </Card>
  );
};

AdminStudentDetailHeader.propTypes = {
  user: PropTypes.object,
};

export default AdminStudentDetailHeader;
