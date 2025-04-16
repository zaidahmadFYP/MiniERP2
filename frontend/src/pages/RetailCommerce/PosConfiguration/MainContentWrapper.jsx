import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"

const MainContentWrapper = styled(Box)(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  marginLeft: open ? "60px" : "60px", // Adjust for mini/full drawer state
  marginTop: "64px", // Adjust for AppBar height
  transition: theme.transitions.create(["margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f5f5f7",
  color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
  height: "calc(100vh - 64px)", // Fixed height instead of minHeight
  maxHeight: "calc(100vh - 64px)", // Ensure it doesn't grow beyond viewport
  overflow: "hidden", // Prevent scrolling at the container level
  display: "flex",
  flexDirection: "column",
}))

export default MainContentWrapper
