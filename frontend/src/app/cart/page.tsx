import { Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function Cart() {
  return (
    <div>
      <Typography variant="h4">Кошик</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Назва книги</TableCell>
            <TableCell>Ціна</TableCell>
            <TableCell>Кількість</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Тут буде мапінг по книгам у кошику */}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary">Замовити</Button>
    </div>
  );
}
