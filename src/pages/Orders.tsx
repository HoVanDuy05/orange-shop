import {
  Container, Text, Title, Stack, Group, Button, Badge,
  Paper, Box, Loader, Center, ThemeIcon, ActionIcon
} from '@mantine/core';
import {
  IconHistory, IconChevronRight, IconClock,
  IconCheck, IconX, IconToolsKitchen2, IconTruck, IconReceipt
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useAppQuery } from '../hooks/useAppQuery';
import dayjs from 'dayjs';
import { useBrandTheme } from '../providers/BrandThemeProvider';

const STATUS_MAP: Record<string, { color: string; label: string; icon: any }> = {
  pending: { color: 'orange', label: 'Chờ xác nhận', icon: IconClock },
  confirmed: { color: 'cyan', label: 'Đã xác nhận', icon: IconCheck },
  preparing: { color: 'brand', label: 'Đang chuẩn bị', icon: IconToolsKitchen2 },
  delivering: { color: 'blue', label: 'Đang giao hàng', icon: IconTruck },
  completed: { color: 'green', label: 'Hoàn thành', icon: IconCheck },
  cancelled: { color: 'red', label: 'Đã huỷ', icon: IconX },
};

export default function Orders() {
  const navigate = useNavigate();
  const { activeTheme } = useBrandTheme();
  const { phoneNumber } = useUserStore();

  const { data: orders = [], isLoading } = useAppQuery(
    `orders-${phoneNumber}`,
    `/orders/phone/${phoneNumber}`
  );

  const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

  if (isLoading) return (
    <Center h="70vh">
      <Loader size="md" color="brand" variant="bars" />
    </Center>
  );

  return (
    <Box bg="#f8fafc" mih="100vh" pb={120} pt={32}>
      <Container size="sm">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Stack gap={2}>
              <Badge variant="light" color="brand" size="xs" radius="xl" py={4} px="md">MY ACTIVITY</Badge>
              <Title order={1} fw={900} size={28} className="tracking-tighter">LỊCH SỬ ĐƠN</Title>
            </Stack>
            <ThemeIcon size={44} radius="xl" color="brand" variant="light" className="shadow-sm">
              <IconHistory size={24} />
            </ThemeIcon>
          </Group>

          {!phoneNumber ? (
            <Paper p={40} radius="32px" withBorder className="text-center bg-white">
              <Stack align="center" gap="lg">
                <IconClock size={60} color="#cbd5e1" stroke={1} />
                <Title order={3} fw={900} size={18}>Bạn chưa đặt món</Title>
                <Text c="dimmed" fw={600} size="xs">Theo dõi suất ăn hàng ngày của bạn tại đây.</Text>
                <Button size="md" radius="xl" color="brand" onClick={() => navigate('/menu')} px={32} fw={800}>
                  Xem món ngay
                </Button>
              </Stack>
            </Paper>
          ) : orders.length > 0 ? (
            <Stack gap="xs">
              {orders.map((order: any) => {
                const status = STATUS_MAP[order.order_status] || STATUS_MAP.pending;
                return (
                  <Paper
                    key={order.id} p="md" radius="24px" withBorder
                    className="hover:shadow-lg transition-all border-slate-100 bg-white"
                    onClick={() => navigate(`/order-detail/${order.id}`)}
                  >
                    <Group justify="space-between">
                      <Stack gap={4}>
                        <Group gap={6}>
                          <Text fw={900} size="md" c="dark.8">#{activeTheme?.brand_name?.toUpperCase() || 'ORANGE'}-{order.id}</Text>
                          <Badge color={status.color} variant="light" radius="sm" size="xs" fw={900}>{status.label}</Badge>
                        </Group>
                        <Text size="10px" c="dimmed" fw={700}>{dayjs(order.created_at).format('HH:mm - DD/MM/YYYY')}</Text>

                        <Group gap={6} mt={2}>
                          <Text size="sm" fw={900} c="brand">{formatVND(Number(order.total_amount))}</Text>
                          <Text size="10px" c="dimmed">•</Text>
                          <Text size="10px" c="dimmed" fw={800}>{order.items?.length || 0} món</Text>
                        </Group>
                      </Stack>

                      <ActionIcon variant="light" color="gray" radius="xl" size="md">
                        <IconChevronRight size={16} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          ) : (
            <Paper p={40} radius="32px" withBorder className="text-center shadow-sm bg-white">
              <Stack align="center" gap="lg">
                <IconReceipt size={60} color="#cbd5e1" stroke={1} />
                <Title order={3} size={18} fw={900}>Chưa có đơn hàng nào</Title>
                <Button variant="light" color="brand" radius="xl" size="md" onClick={() => navigate('/menu')} fw={900}>Chọn món bạn thích nhé!</Button>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
