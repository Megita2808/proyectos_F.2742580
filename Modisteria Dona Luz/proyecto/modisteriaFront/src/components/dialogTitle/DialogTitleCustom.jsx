import { DialogTitle } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
export default function DialogTitleCustom({ children }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <DialogTitle
      color={colors.grey[100]}
      fontSize={"28px"}
      textAlign={"center"}
      marginTop={"13px"}
    >
      {children}
    </DialogTitle>
  );
}
