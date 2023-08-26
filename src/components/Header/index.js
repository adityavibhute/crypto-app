import { useContext } from 'react';
import MaterialUISwitch from '../Toggle';
import { AppBar, Toolbar, Typography, FormGroup, FormControlLabel, ThemeProvider, CssBaseline, Link } from '@mui/material';
import { darkTheme, lightTheme } from '../../themes';
import ThemeContext from '../../ThemeContext';

const Header = () => {
    const {
        theme,
        setTheme,
    } =  useContext(ThemeContext);

    const toggleTheme = () => {
        setTheme((prevTheme) => !prevTheme);
    };
    const navStyle = {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    };

    return (
        <ThemeProvider theme={theme ? darkTheme : lightTheme}>
            <CssBaseline />
            <AppBar position="static" style={navStyle}>
                <Toolbar>                    
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        <Link style={{textDecoration: 'none', color: 'gold'}} href="/">Crypto-Currency</Link>
                    </Typography>
                </Toolbar>
                <FormGroup style={{ flexDirection: 'row' }}>
                    <FormControlLabel
                        control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked onChange={toggleTheme} />}
                    />
                </FormGroup>
            </AppBar>
        </ThemeProvider>
    )
};

export default Header;