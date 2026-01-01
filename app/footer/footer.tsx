'use client';
import React, { useEffect } from 'react';
import feather from 'feather-icons';
import { Grid, Container, Box, Typography, Link } from '@mui/material';
import './footer.css'
import { Twitter, Facebook, Instagram, Phone } from 'lucide-react';

const Footer = () => {

  return (
    <footer id="footer">
      <Box className="footer-top">
        <Container>
          <Grid container spacing={4}>
            {/* Contact Info */}
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <div className="footer-contact">
                <h3>MoodMate</h3>
                <p>
                  A108 Adam Street<br />
                  New York, NY 535022<br />
                  United States<br /><br />
                  <strong>Phone:</strong> +1 5589 55488 55<br />
                  <strong>Email:</strong> info@example.com<br />
                </p>
              </div>
            </Grid>

            {/* Useful Links */}
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <div className="footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/articles">Articles</Link></li>
                  <li><Link href="/mood-tracker">Mood Tracker</Link></li>
                </ul>
              </div>
            </Grid>

            {/* Social Media */}
            <Grid size={{ xs: 12, md: 12, lg: 4 }}>
              <div className="footer-links">
                <h4>Our Social Media</h4>
                <p style={{ paddingBottom: '10px' }}>Follow us to get the latest updates</p>
                <div className="social-links mt-3">
                  <a href="#" className="twitter"><Twitter /></a>
                  <a href="#" className="facebook"><Facebook /></a>
                  <a href="https://www.instagram.com/bottlebank_lucky7" className="instagram"><Instagram /></a>
                  <a href="#" className="whatsapp"><Phone /></a>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bottom */}
      <Box className="footer-bottom">
        <Container sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography className="copyright">
            &copy; {new Date().getFullYear()} <strong>MoodMate</strong>. All Rights Reserved
          </Typography>
          <Typography className="credits">
            Designed by <a href="https://www.linkedin.com/in/shane-baskara-71b97017a/">Shane Baskara</a>
          </Typography>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
