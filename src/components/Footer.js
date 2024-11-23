// src/components/Footer.js
import React from "react";
import { Box, Typography, Grid, TextField, Button, Divider, Link } from "@mui/material";
import { Facebook, Twitter, YouTube } from "@mui/icons-material";

function Footer() {
  return (
    <Box sx={{ bgcolor: "#000000", color: "#e5e7eb", px: { xs: 4, md: 12 }, py: 6 }}>
      <Grid container spacing={4}>
        {/* Logo y Redes Sociales */}
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <img
              src="https://tailwind-generator.b-cdn.net/favicon.png"
              alt="Logo"
              width="111"
            />
            <Typography variant="h6" fontWeight="bold" textTransform="uppercase">
              Autos
              Analítica
            </Typography>
          </Box>
          <Box display="flex" gap={2} mt={2}>
            <Link href="#" color="inherit">
              <Facebook />
            </Link>
            <Link href="#" color="inherit">
              <Twitter />
            </Link>
            <Link href="#" color="inherit">
              <YouTube />
            </Link>
          </Box>
        </Grid>

        {/* Legal Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" textTransform="uppercase" mb={2} color="#ffffff">
            Legal
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Link href="#imprint" underline="hover" color="inherit">
              Imprint
            </Link>
            <Link href="#privacy-policy" underline="hover" color="inherit">
              Privacy Policy
            </Link>
            <Link href="#terms-of-use" underline="hover" color="inherit">
              Terms of Use
            </Link>
          </Box>
        </Grid>

        {/* Newsletter Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" textTransform="uppercase" mb={2} color="#ffffff">
            Notificaciones
          </Typography>
          <Typography variant="body2" mb={2}>
            Te enviaremos notificaciones.
          </Typography>
          <Box display="flex">
            <TextField
              placeholder="Enter your email"
              variant="outlined"
              size="small"
              sx={{
                flexGrow: 1,
                bgcolor: "white",
                borderRadius: "4px 0 0 4px",
                input: { py: 1.5, px: 2 },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#FFCC00', // Color naranja para resaltar
                color: 'black',
                fontWeight: "bold",
                borderRadius: "0 4px 4px 0",
                "&:hover": {
                  color: 'black', 

                },
              }}
            >
                Suscribirse 
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ borderColor: "gray.500", my: 4 }} />

      {/* Footer Bottom */}
      <Typography variant="body2" textAlign="center">
        © {new Date().getFullYear()} Your Company - All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
