import plusFill from "@iconify/icons-eva/plus-fill";
import { Icon } from "@iconify/react";
// import { useFormik } from "formik";
// import { useState } from "react";
// material
import { Container, Stack, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
// components
import Page from "../../components/Page";
// import Companies from './test'
import {
    // CompanySort,
    CompanyList,
} from "../../components/_dashboard/company";

//
// import PRODUCTS from "../../_mocks_/products";


// ----------------------------------------------------------------------

export default function StudentCompany() {
    // const [openFilter, setOpenFilter] = useState(false);

    // const formik = useFormik({
    //   initialValues: {
    //     gender: "",
    //     category: "",
    //     colors: "",
    //     priceRange: "",
    //     rating: "",
    //   },
    //   onSubmit: () => {
    //     setOpenFilter(false);
    //   },
    // });

    // const { resetForm, handleSubmit } = formik;

    // const handleOpenFilter = () => {
    //   setOpenFilter(true);
    // };

    // const handleCloseFilter = () => {
    //   setOpenFilter(false);
    // };

    // const handleResetFilter = () => {
    //   handleSubmit();
    //   resetForm();
    // };

    return (
        <Page title="Company">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Company
                    </Typography>
                    {/* <Button
                        variant="contained"
                        component={RouterLink}
                        to="/admin/dashboard/registerCompany"
                        startIcon={<Icon icon={plusFill} />}
                    >
                        New Company
                    </Button> */}
                </Stack>
                {/* <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        > */}
                {/* Sort & Filter */}
                {/* <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <CompanySort />
          </Stack>
        </Stack> */}

                {/* Company List */}
                <CompanyList />
            </Container>
            {/* <Companies /> */}
        </Page>

    );
}
