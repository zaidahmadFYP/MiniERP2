import { TextField, InputAdornment, useTheme } from "@mui/material"
import { Search } from "@mui/icons-material"

export default function SearchBar({ searchQuery, setSearchQuery }) {
  const theme = useTheme()

  return (
    <TextField
      placeholder="Filter"
      variant="outlined"
      size="small"
      fullWidth
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        sx: {
          color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
          "& .MuiSvgIcon-root": {
            color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.54)",
          },
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 1,
          backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "inherit",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
        },
      }}
    />
  )
}
