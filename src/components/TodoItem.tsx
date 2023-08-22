import { Card, Typography } from "@mui/material";
import React, { FC } from "react";

type Props = { children: string };

const TodoItem: FC<Props> = ({ children }) => {
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="body1">{children}</Typography>
    </Card>
  );
};

export default TodoItem;
