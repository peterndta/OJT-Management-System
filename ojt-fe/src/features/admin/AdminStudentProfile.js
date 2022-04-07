import {
  Box, CircularProgress, Container,
  Grid
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import AdminStudentDetailBottom from "../../components/_dashboard/company/AdminStudentDetailBottom";
// import { useSelector } from 'react-redux';
import AdminStudentDetailHeader from "../../components/_dashboard/company/AdminStudentDetailHeader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AdminStudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState({});
  const axiosPrivate = useAxiosPrivate();
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
        // console.log("Company ID: ", response.data);
        setLoading(false);

        if (isMounted) {
          setStudents(response.data);
        }
      } catch (error) {
        // console.error(error);
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

  if (loading) {
    return <LoadingComponent />;
  } 
  return (
    <Page title="Student Detail">
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} xs={12}>
              <AdminStudentDetailHeader user={students} />
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <AdminStudentDetailBottom user={students} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
};

export default AdminStudentProfile;
