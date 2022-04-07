import plusFill from "@iconify/icons-eva/plus-fill";
import { Icon } from "@iconify/react";
import { Container, Stack, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
// components
import Page from "../../components/Page";
// import Companies from './test'
import {

  CompanyList,
} from "../../components/_dashboard/company";




// ----------------------------------------------------------------------

export default function AdminCompany() {
  return (
    <Page title="Company">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Company
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/admin/dashboard/registerCompany"
            startIcon={<Icon icon={plusFill} />}
          >
            New Company
          </Button>
        </Stack>
        {/* Company List */}
        <CompanyList />
      </Container>
    </Page>

  );
}
