// BottomNav.tsx
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate, useLocation } from 'react-router-dom';

function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const getTabValue = (path: string) => {
        if (path === '/recommendation') return 1;
        return 0;
    };

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: '#000'
        }}>
            <BottomNavigation sx={{ backgroundColor: '#000' }}
                showLabels
                value={getTabValue(location.pathname)}
                onChange={(event, newValue) => {
                    if (newValue === 0) navigate('/');
                    else if (newValue === 1) navigate('/recommendation');
                }}
            >
                <BottomNavigationAction className=' focus:outline-none!' label="Home" icon={<HomeIcon />}
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: '#333',
                            color: '#ffcc00',
                        },
                        color: '#888',
                        borderRadius: 2,
                        padding: '6px 12px',
                    }}
                />
                <BottomNavigationAction className=' focus:outline-none!' label="Hobby" icon={<FavoriteIcon />}
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: '#333',
                            color: '#ffcc00',
                        },
                        color: '#888',
                        borderRadius: 2,
                        padding: '6px 12px',
                    }} />
            </BottomNavigation>
        </Box>
    );
}

export default BottomNav;
