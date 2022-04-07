import {
    Box, Container, Skeleton, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import Page from "../../components/Page";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { StudentJob } from "./StudentJob";

const StudentJobList = () => {
    const axiosPrivate = useAxiosPrivate();

    const [jobs, setJobs] = useState([]);

    const getJobs = async () => {
        try {
            const response
                = await axiosPrivate.get("/student/get-jobs-by-account-id");
            setJobs(response.data)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {

        getJobs()

    }, [])
    // console.log(jobs);
    return (
        <Page title="Jobs">
            <Container
                sx={
                    { m: 1 }
                }
            >
                <Typography variant="h4" gutterBottom m={1}>
                    Jobs
                </Typography>
                {
                    jobs?.length ? (

                        jobs.map((job, index) =>
                            <StudentJob
                                key={index}
                                {...job} />)

                    ) : (
                        <Box>
                            <Skeleton />
                            <Skeleton animation="wave" />
                            <Skeleton animation={false} />
                        </Box>
                    )
                }
            </Container>
        </Page >
    )
}

export default StudentJobList