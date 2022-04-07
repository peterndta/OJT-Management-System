import {
    // TextField,
    Avatar, Box,
    // Button,
    Card,
    CardContent, Grid,
    Typography,
    Link,

} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const StudentJob = (props) => {
    const { id, name, title, salary, topReasons, description,
        aboutOurTeam, responsibilities, mustHaveSkills,
        niceToHaveSkills, whyYouWillLove, benefits,
        semesters, majors, company
    } = props;
    // console.log(topReasons);
    return (
        <Link
            to={`${window.location.pathname}/${id}`}
            color="inherit"
            underline="none"
            component={RouterLink}
        >
            <Card
                sx={{
                    marginBottom: 2
                }}
            >
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid
                            item
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                            lg={12}
                            md={12}
                            xs={12}
                        >
                            <Box

                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    m: 1,
                                }}
                            >
                                <Avatar
                                    src="data:image/png;base64,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"
                                    sx={{
                                        height: 100,
                                        width: 100,
                                    }}
                                    variant="square"
                                />
                                <Box sx={{ ml: 5 }}>
                                    <Typography color="textPrimary" gutterBottom variant="h4">
                                        {name}
                                    </Typography>
                                    <Grid>
                                        <Typography color="primary" gutterBottom variant="subtitle">
                                            Title: {title}
                                        </Typography>
                                        <Typography color="primary" gutterBottom variant="subtitle" margin={2}>
                                            |
                                        </Typography>
                                        <Typography color="primary" gutterBottom variant="subtitle">
                                            $ {salary}
                                        </Typography>
                                    </Grid>
                                    <br />
                                    <Typography color="textSecondary" variant="subtitle2">
                                        {description}
                                    </Typography>
                                </Box>
                            </Box>

                        </Grid>



                    </Grid>
                </CardContent>
            </Card>
        </Link>
    )
}
