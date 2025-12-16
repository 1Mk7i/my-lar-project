"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography
} from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: "error" | "warning" | "info";
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Підтвердити",
  cancelText = "Скасувати",
  onConfirm,
  onCancel,
  severity = "warning"
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: '400px'
        }
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon 
          color={severity === "error" ? "error" : severity === "warning" ? "warning" : "info"} 
          sx={{ fontSize: 28 }}
        />
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description" sx={{ fontSize: '1rem', mt: 1 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit">
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={severity === "error" ? "error" : "primary"}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

