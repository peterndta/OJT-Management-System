// import PropTypes from 'prop-types';
// import { Link as RouterLink } from 'react-router-dom';
// // material
// import { Box, Card, Link, Typography, Stack } from '@mui/material';
// import { styled } from '@mui/material/styles';

// // ----------------------------------------------------------------------

// const ProductImgStyle = styled('img')({
//   top: 0,
//   width: '100%',
//   height: '100%',
//   objectFit: 'cover',
//   position: 'absolute'
// });

// // ----------------------------------------------------------------------

// CompanyCard.propTypes = {
//   product: PropTypes.object
// };

// export default function CompanyCard({ product }) {
//   const { name, cover, price, colors, status, priceSale } = product;

//   return (
//     <Card>
//       <Box sx={{ pt: '100%', position: 'relative' }}>
//         {/* Company Logo */}
//          <Link to="/admin/dashboard/company/:id/companyprofile" color="inherit" underline="hover" component={RouterLink}>
//           <ProductImgStyle alt={name} src={cover} />
//         </Link>
//       </Box>

//       <Stack spacing={2} sx={{ p: 3 }}>
//         {/* Company Name */}
        
//         <Link to="/admin/dashboard/company/:id/companyprofile" color="inherit" underline="hover" component={RouterLink}>
//           <Typography variant="subtitle1" noWrap>
//             {name}
//           </Typography>
//         </Link>

//         <Stack direction="row" alignItems="center" justifyContent="space-between">
//           {/* Company Description */}
//           <Typography variant="subtitle2">
//             {name}
//           </Typography>
//         </Stack>
//       </Stack>
//     </Card>
//   );
// }
