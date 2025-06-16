'use client';
import { AppBar, Container, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Button, Tooltip, Avatar } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import Link from "next/link";
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { login, logout } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NavBarProps {

}

const NavBar: FunctionComponent<NavBarProps> = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const pagesBeforeLogin = ['Home', 'Articles'];
    const pagesAfterLogin = ['Home', 'Articles', 'Mood Checker'];
    const settings = ['Profile', 'Account Settings', 'Logout'];

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const currentUser = useAppSelector((state) => state.user.currentUser)

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

    const handleClickUserMenu = (key: string) => {
        switch (key) {
            case 'Profile':
                router.push('/profile');
                break;
            case 'Logout':
                dispatch(logout());
                localStorage.removeItem("user");
                handleCloseUserMenu();
                router.push('/sign-in');
                break;
            default:
                console.log(`Handler function for ${key} not found`);
                break;
        }
    }

    useEffect(() => {
        console.log(JSON.parse(localStorage.getItem("user")!))
        const localUser = JSON.parse(localStorage.getItem("user")!)
        dispatch(login(localUser))
    }, [])

    return (
        <AppBar position="static" className="navbar" style={{ backgroundColor: "#6D696A" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        <Image
                            src="/logo.png"
                            alt="MoodMate Logo"
                            width={40}
                            height={40}
                            style={{ marginRight: '5px', borderRadius: '10%' }}
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                fontWeight: 700,
                                letterSpacing: '.2rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            MoodMate
                        </Typography>
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
                            {currentUser ? (
                                pagesAfterLogin.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Link href={`/${page.toLocaleLowerCase().replace(/\s+/g, "-")}`} key={page}><Typography textAlign="center">{page}</Typography></Link>
                                    </MenuItem>
                                ))
                            ) : (
                                pagesBeforeLogin.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Link href={`/${page.toLocaleLowerCase().replace(/\s+/g, "-")}`} key={page}><Typography textAlign="center">{page}</Typography></Link>
                                    </MenuItem>
                                ))
                            )}
                        </Menu>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', flexGrow: 1 }}>
                        <Image
                            src="/logo.png"
                            alt="MoodMate Logo"
                            width={32}
                            height={32}
                            style={{ marginRight: '5px', borderRadius: '10%' }}
                        />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '.2rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            MoodMate
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {currentUser ? (
                            pagesAfterLogin.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {/* <Link href="/register" key={page}>{page}</Link> */}
                                    <Link href={`/${page.toLowerCase().replace(/\s+/g, "-")}`} key={page}>{page}</Link>
                                </Button>
                            ))
                        ) : (
                            pagesBeforeLogin.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {/* <Link href="/register" key={page}>{page}</Link> */}
                                    <Link href={`/${page.toLowerCase().replace(/\s+/g, "-")}`} key={page}>{page}</Link>
                                </Button>
                            ))
                        )}

                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {currentUser ? (
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    {/* <Avatar alt={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}`} src="/static/images/avatar/2.jpg" /> */}
                                    <Avatar
                                        alt={currentUser?.username}
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=random`}
                                    />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Link href="/sign-in">
                                <Button variant="text" sx={{ my: 2, color: 'white', display: 'block' }}>Sign in</Button>
                            </Link>
                        )}
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
                                <MenuItem key={setting} onClick={() => handleClickUserMenu(setting)}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;