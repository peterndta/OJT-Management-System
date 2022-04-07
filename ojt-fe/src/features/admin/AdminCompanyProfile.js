import {
  Box, CircularProgress, Container,
  Grid
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import CompanyDetailBottom from "../../components/_dashboard/company/CompanyDetailBottom";
// import { useSelector } from 'react-redux';
import AdminCompanyDetailHeader from "../../components/_dashboard/company/AdminCompanyDetailHeader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AdminCompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // console.log(id);
  const [companies, setCompanies] = useState({});
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
        const response = await axiosPrivate.get(`/companies/${id}`, {
          signal: controller.signal,
          params,
        });
        // console.log("Company ID: ", response.data);
        setLoading(false);

        // isMounted && setCompanies(response.data);
        if (isMounted) {
          setCompanies(response.data);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);

        // navigate('/login', { state: { from: location }, replace: true });
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
    <Page title="Company Detail">
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} xs={12}>
              <AdminCompanyDetailHeader user={companies} />
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <CompanyDetailBottom user={companies} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
};

export default AdminCompanyProfile;
