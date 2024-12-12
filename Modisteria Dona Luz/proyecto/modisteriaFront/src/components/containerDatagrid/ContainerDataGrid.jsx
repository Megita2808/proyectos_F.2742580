import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
export default function ContainerDataGrid({ children }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      m="0px 20px"
      p="0px 10px"
      height="69%"
      width="98%"
      sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.purple[500],
          borderBottom: "none",
          color: "white",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.primary[200],
        },
        "& .MuiCheckbox-root": {
          color: `${colors.purple[200]} !important`,
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${colors.grey[100]} !important`,
        },
      }}
    >
      {children}
    </Box>
  );
}
