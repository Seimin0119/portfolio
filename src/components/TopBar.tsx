import { AppBar, Toolbar, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const TopBar: React.FC = () => {
  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <IconButton color="inherit" edge="end">
          <SearchIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
