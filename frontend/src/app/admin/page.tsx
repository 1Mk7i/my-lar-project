"use client";

import { useState } from "react";
import { Box, Container, Tabs, Tab, Typography, Paper } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AdminRules from "@/components/admin/AdminRules";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminBooks from "@/components/admin/AdminBooks";
import AdminStats from "@/components/admin/AdminStats";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);

  if (!user || user.role?.id !== 3) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5" color="error">
          Доступ заборонено. Тільки для адміністраторів.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Адмін-панель
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Статистика" />
          <Tab label="Правила" />
          <Tab label="Користувачі" />
          <Tab label="Книги" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AdminStats />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AdminRules />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AdminUsers />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <AdminBooks />
        </TabPanel>
      </Paper>
    </Container>
  );
}

