import {
  Box, CircularProgress, Container,
  Grid
} from "@mui/material";
import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import Page from "../../components/Page";
import CompanyProfileDetailBottom from "./CompanyProfileDetailBottom";
// import { useSelector } from 'react-redux';
import CompanyDetailHeader from "../../components/_dashboard/company/CompanyDetailHeader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CompanyProfile = () => {
  const id = localStorage.getItem('id');
  // console.log(id);
  const [companies, setCompanies] = useState({});
  const axiosPrivate = useAxiosPrivate();
  // const navigate = useNavigate();
  // const location = useLocation();
  // const refresh = useRefreshToken();
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
      }
    };
    getCompanies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  // console.log(companies);
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
              <CompanyDetailHeader user={companies} />
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <CompanyProfileDetailBottom user={companies} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
};

export default CompanyProfile;
