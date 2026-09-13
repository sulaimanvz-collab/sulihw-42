import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import type { OnlineUser } from "../../types";

interface Props {
  users: OnlineUser[];
}

export const OnlineList = ({ users }: Props) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: "100%", minHeight: "400px" }}>
      <Typography variant="h6" gutterBottom>
        Online users
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <List dense>
        {users.map((user) => (
          <ListItem key={user._id} disableGutters>
            <ListItemText primary={user.username} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default OnlineList;
