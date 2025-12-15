import { Typography, Button } from "@mui/material";

export default function Profile() {
  return (
    <div>
      <Typography variant="h4">Профіль користувача</Typography>
      <Button variant="outlined" color="primary">Змінити аватарку</Button>
      <Button variant="outlined" color="secondary">Вийти</Button>
      <Button variant="contained" color="error">Видалити акаунт</Button>
    </div>
  );
}
