import {
    Box,
    CircularProgress, Container, Grid
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../../components/Page";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import StudentJobDetailHeader from "./StudentJobDetailHeader";
import StudentJobDetailBottom from "./StudentJobDetailBottom";

const StudentJobDetail = () => {
    const { id } = useParams(); // get id job
    const axiosPrivate = useAxiosPrivate();

    const [job, setJob] = useState({});

    console.log("id", id);

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
        const getJob = async () => {
            try {

                const response = await axiosPrivate.get(`/jobs/${id}`);

                setLoading(false);
                if (isMounted)
                    setJob(response.data);

            } catch (error) {
                console.error(error);
                setLoading(true);

                // navigate('/login', { state: { from: location }, replace: true });
            }
        };
        getJob()
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (loading) {
        return <LoadingComponent />;
    }
    console.log("Job: ", job);
    return (
        <Page title="Job Detail">
            <Container
                sx={
                    { m: 1 }
                }
            >
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} xs={12}>
                        <StudentJobDetailHeader item={job} />



                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <StudentJobDetailBottom item={job} />
                    </Grid>

                </Grid>


            </Container>
        </Page>
    )
}

export default StudentJobDetail