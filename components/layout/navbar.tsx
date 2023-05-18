import { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";

const navItems = [
  { label: "Home", ref: "/" },
  { label: "Ierse terriërs", ref: "/ierse-terriers" },
  { label: "Solognote schapen", ref: "/solognote-schapen" },
  { label: "Contact", ref: "/contact" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prevValue) => !prevValue);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle}>
      <Typography variant="h5" sx={{ my: 2 }}>
        Boerderij bloem
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <Link key={item.ref} href={item.ref} legacyBehavior>
            <ListItem key={item.label} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar className="navbar" component="nav" position="sticky" elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
            }}
          >
            Boerderij bloem
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Link key={item.ref} href={item.ref} legacyBehavior>
                <Button key={item.label} sx={{ color: "#25362a" }}>
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "95%",
              maxWidth: "250px",
              textAlign: "center",
              backgroundColor: "#fff4eb",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}
