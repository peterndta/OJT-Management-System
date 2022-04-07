import editFill from '@iconify/icons-eva/edit-fill';
import cv from '@iconify/icons-eva/clipboard-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Icon } from '@iconify/react';
// material
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {red, green, blue} from '@mui/material/colors'
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
// ----------------------------------------------------------------------

const CompanyApplicationMoreMenu = (props) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { accept, onChangeAccepted, id, index, cvKey, cvName, showAlert } = props;
  const axiosPrivate = useAxiosPrivate();
  const colorAccepted = accept ? red[600] : green.A700;

  const exportCV = async () => {
    try {
      const response = await axiosPrivate.get(`/storage/${cvKey}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${cvName}`);

      link.click();
      window.URL.revokeObjectURL(url)
    } catch (error) {
      // console.log(error.response);
      showAlert();
    }
  }

  return ( 
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={exportCV}>
          <ListItemIcon>
            <Icon icon={cv} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Student CV" primaryTypographyProps={{ variant: 'body2' }} sx={{color: blue[700]}}/>
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => {onChangeAccepted(id, accept, index)}}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary={`${accept ? "Not Accepted" : "Accepted"}`} primaryTypographyProps={{ variant: 'body2' }} sx={{color: colorAccepted}}/>
        </MenuItem>
      </Menu>
    </>
  );
}

export default CompanyApplicationMoreMenu;