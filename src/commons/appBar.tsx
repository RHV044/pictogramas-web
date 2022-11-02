import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useLocation, useNavigate } from 'react-router-dom';
import FormDialogValidarAcceso from '../configuracion/components/validarCambioConfiguracion';
import { getUsuarioLogueado } from '../services/usuarios-services';
import { IUsuario } from '../login/model/usuario';
import imagenUsuario from '../commons/imagen-usuario.jpg';
import Logo from '../commons/Logo-PictogAR.png';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CircularProgress } from '@mui/material';
import { Check } from '@mui/icons-material';

const pages = ['Pizarras', 'Actividades', 'Estadisticas'];
const settings = ['Configuracion', 'Cambiar Cuenta'];

const ResponsiveAppBar = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [configuracionOpen, setConfiguracionOpen] = React.useState(false);
  const [userLogueado, setUserLogueado] = React.useState(
    null as IUsuario | null
  );
  const porcentaje = useSelector((state: RootState) => state.porcentaje.value);

  React.useEffect(() => {
    getUsuarioLogueado().then((usuario) => {
      if (usuario != undefined) {
        setUserLogueado(usuario);
      } else {
        navigate('/cuenta/seleccionar' + location.search);
      }
    });
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const cerrarValidarConfiguracion = () => {
    setConfiguracionOpen(false);
  };

  const handleChange = (page: string) => {
    if (page === 'Configuracion') {
      setConfiguracionOpen(true);
    } else {
      navigate(
        `/${page.toLocaleLowerCase().replace(/ /g, '')}` + location.search
      );
    }
  };

  return (
    <AppBar position="static" style={{ marginBottom: 10 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {configuracionOpen && (
            <FormDialogValidarAcceso
              cerrarValidarConfiguracion={cerrarValidarConfiguracion}
            />
          )}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <a href="/pictogramas">
              <img alt="Qries" src={Logo} height="65" />
            </a>
            {porcentaje < 100 && (
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  marginTop: 0,
                  paddingTop: 1.5,
                }}
              >
                <CircularProgress color="warning" />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="button"
                    component="div"
                    color="text.secondary"
                    display="block"
                  >{`${porcentaje.toString()}%`}</Typography>
                </Box>
              </Box>
            )}
            {porcentaje === 100 && <Check></Check>}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleChange(page);
                  }}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <a href="/pictogramas">
              <img alt="Qries" src={Logo} height="65" />
            </a>
            {porcentaje < 100 && (
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  marginTop: 0,
                  paddingTop: 1.5,
                }}
              >
                <CircularProgress color="secondary" />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="button"
                    component="div"
                    color="text.secondary"
                    display="block"
                  >{`${porcentaje.toString()}%`}</Typography>
                </Box>
              </Box>
            )}
            {porcentaje === 100 && <Check></Check>}
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleChange(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {/* TODO: Podriamos agregar aca un mensaje y porcentaje de sincronizacion */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Configuracion">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Remy Sharp"
                  src={
                    userLogueado &&
                    userLogueado.imagen &&
                    userLogueado.imagen !== ''
                      ? userLogueado.imagen
                      : imagenUsuario
                  }
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleChange(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
