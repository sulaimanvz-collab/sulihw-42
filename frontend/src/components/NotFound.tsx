import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Page Not Found
      </Typography>
      <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
        Back to Home
      </Button>
    </Box>
  );
};

export default NotFound;
