import editFill from '@iconify/icons-eva/edit-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Icon } from '@iconify/react';
// material
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useRef, useState } from 'react';
import {green} from '@mui/material/colors'
// ----------------------------------------------------------------------

const StudentApplicationMoreMenu = (props) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { openDialog, acceptVal, accept, idVal, id, indexVal, index } = props;

  
  const handleClickOpen = () => {
    openDialog(true);
    acceptVal(accept);
    idVal(id);
    indexVal(index);
  };
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
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleClickOpen}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Accepted" primaryTypographyProps={{ variant: 'body2' }} sx={{color: green.A700}}/>
        </MenuItem>
      </Menu>
    </>
  );
}

export default StudentApplicationMoreMenu;