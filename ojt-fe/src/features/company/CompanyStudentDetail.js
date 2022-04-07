import {
    Card, CardContent, Container,
    Grid, Stack, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../../components/Page";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CompanyStudentDetail = () => {
    const { id } = useParams();
    console.log(id);
    const [student, setStudent] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getStudent = async () => {
            try {
                const response = await axiosPrivate.get(`/companies/get-student-by-id/${id}`, {
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
        <Page title="Student Offer Profile">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>

                        Student Offer Profile
                    </Typography>

                </Stack>
                <Card>
                    <CardContent sx={{ mb: 5 }}>
                        {/* <Grid container spacing={1}>
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
                                    {student?.name}
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
                                    {student?.student?.studentCode}
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
                                    {student?.student?.major?.name}
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Semester
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                    {student?.student?.semester?.name}
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    GPA
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                    {student?.student?.gpa}
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Email
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                    {student?.email}
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Phone
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                    {student?.phone}
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Address
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'normal' }}>
                                    {student?.student?.address}
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />

                    </CardContent>
                </Card>
            </Container>
        </Page>
    )
}

export default CompanyStudentDetail