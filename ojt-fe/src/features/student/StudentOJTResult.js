import editFill from "@iconify/icons-eva/edit-fill";
import { Icon } from "@iconify/react";
import {
    Button, Card, CardContent, Container,
    Grid, Stack, Typography, Link,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Page from "../../components/Page";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const StudentOJTResult = () => {
    const [student, setStudent] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getStudent = async () => {
            try {
                const response = await axiosPrivate.get('/student/get-all-ojt-result', {
                    signal: controller.signal,
                });
                console.log(response.data);
                if (isMounted) {
                    setStudent(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getStudent();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);






    return (
        <Page title="OJT Result">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>

                        OJT Result
                    </Typography>

                </Stack>
                <Card>
                    {student?.length ? (
                        student && student.map((item, index) => (
                            <CardContent sx={{ mb: 5 }} key={index}>
                                {/* <Grid container spacing={1}>
                                <Link
                                    // to={`/admin/dashboard/company/${company.id}`}
                                    to={`${window.location.pathname}/edit`}
                                    color="inherit"
                                    underline="hover"
                                    sx={{ marginLeft: "80%" }}
                                    component={RouterLink}
                                >
                                    <Button
                                        variant="text"
                                        startIcon={<Icon icon={editFill} />}
                                        sx={{
                                            color: "text.secondary",
                                            marginLeft: "80%"
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </Link>
                            </Grid>
                            <br /> */}

                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Name
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                            {item?.studentName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Student Code
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                            {item?.studentCode}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Major
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                            {item?.majorName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Company name
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                            {item?.companyName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Job Name
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                            {item?.jobName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Grade
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                            {item?.grade}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            OJT Result
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                            {item?.pass === true ? "Passed" : "Not passed"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />


                            </CardContent>
                        ))

                    ) : (
                        <CardContent>
                            You have not result to display
                        </CardContent>
                    )
                    }
                </Card>
            </Container>
        </Page>
    )
}

export default StudentOJTResult