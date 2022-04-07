import {
    // Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Typography
} from "@mui/material";

const StudentJobDetailBottom = (props) => {
    const { item } = props;
    return (
        <>
            <Card>
                <CardHeader title="Detail" />
                <CardContent sx={{ mb: 10 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Divider>Job</Divider>
                        </Grid>
                        <Grid
                            item
                            lg={12}
                            md={12}
                            xs={12}
                        >
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Top Reasons To Join Us

                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >

                                {item?.topReasons?.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                ))}
                            </Typography>
                            <br />
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Job Description
                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >

                                {item?.description}
                            </Typography>
                            <br />
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                About Our Team
                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >

                                {item?.aboutOurTeam ? item?.aboutOurTeam : "_"}
                            </Typography>
                            <br />
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Responsibilities

                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >

                                {item?.responsibilities?.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                ))}
                            </Typography>
                            <br />
                            {/* mustHaveSkills */}
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Must Have Skills

                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >

                                {item?.mustHaveSkills?.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                ))}
                            </Typography>
                            <br />
                            {/* niceToHaveSkills */}
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Nice To Have Skills
                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >
                                {item?.niceToHaveSkills?.length ?
                                    (item?.niceToHaveSkills?.map((reason, index) => (
                                        <li key={index}>{reason}</li>
                                    ))) : "_"}
                            </Typography>
                            <br />
                            {/* whyYouWillLove */}
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Why You Will Love
                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >
                                {item?.whyYouWillLove}
                            </Typography>
                            <br />
                            {/* benefits */}
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Benefits
                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >
                                {item?.benefits?.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </Typography>
                            <br />
                            {/* semesters */}
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Semesters
                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >
                                {item?.semesters?.map((semester, index) => (
                                    <li key={index}>{semester?.name}</li>
                                ))}
                            </Typography>
                            <br />
                            {/* majors */}
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Majors
                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >
                                {item?.majors?.map((major, index) => (
                                    <li key={index}>{major?.name}</li>
                                ))}
                            </Typography>
                            <br />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider>About Company</Divider>
                        </Grid>
                        <Grid
                            item
                            lg={12}
                            md={12}
                            xs={12}
                        >
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Company
                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >

                                {item?.company?.name}
                            </Typography>
                            <br />
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Address
                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >

                                {item?.company?.address}
                            </Typography>
                            <br />
                            <Typography color="textPrimary" gutterBottom variant="h4">
                                Description
                            </Typography>
                            <Typography
                                color="textPrimary"
                                gutterBottom
                                variant="h6"
                                sx={{ fontWeight: 'normal' }}
                            >

                                {item?.company?.description}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default StudentJobDetailBottom