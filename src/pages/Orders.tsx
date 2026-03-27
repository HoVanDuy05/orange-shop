import {
  Container,
  Text,
  Title,
  Stack,
  Group,
  Button,
  Badge,
  Paper,
  Box,
  Image,
  Loader,
  Center,
  ThemeIcon,
} from '@mantine/core';
import {
  IconHistory,
  IconChevronRight
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useAppQuery } from '../hooks/useAppQuery';
import dayjs from 'dayjs';

const STATUS_COLOR: Record<string, string> = {
  pending: 'orange',
  confirmed: 'blue',
  paid: 'teal',
  done: 'green',
  cancelled: 'red',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ thanh toán',
  confirmed: 'Đã tiếp nhận',
  paid: 'Đã thanh toán',
  done: 'Hoàn thành',
  cancelled: 'Đã huỷ',
};

export default function Orders() {
  const navigate = useNavigate();
  const { phoneNumber } = useUserStore();

  const { data: orders = [], isLoading } = useAppQuery(
    `orders-${phoneNumber}`,
    `/orders/phone/${phoneNumber}`
  );

  return (
    <Box className="bg-[#f8fafc] min-h-screen pb-100">
      {/* HEADER SECTION */}
      <Box className="bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-800 text-white pt-10 pb-20 px-4 relative overflow-hidden">
        <Box className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-[100px]" />

        <Container size="md" className="relative z-10">
          <Stack gap={0}>
            <Badge variant="white" color="blue" size="sm" radius="md" fw={900} mb={12} className="w-fit">
              LỊCH SỬ GIAO DỊCH
            </Badge>
            <Title order={1} fw={900} className="text-3xl sm:text-4xl tracking-tighter">
              Đơn hàng của bạn
            </Title>
            <Text size="md" opacity={0.8} fw={600} mt={4}>
              Quản lý và theo dõi các món ăn đã đặt.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* CONTENT SECTION */}
      <Container size="md" mt={30} pb={100} className="px-4 relative z-20" style={{ maxWidth: 960 }}>
        <Stack gap="xl">
          {isLoading ? (
            <Paper radius="32px" p={100} withBorder className="bg-white/90 backdrop-blur-xl border-white shadow-premium-lg">
              <Center>
                <Stack align="center" gap="md">
                  <Loader variant="dots" size="xl" color="blue" />
                  <Text fw={700} c="dimmed">Đang tìm đơn hàng của bạn...</Text>
                </Stack>
              </Center>
            </Paper>
          ) : orders.length === 0 ? (
            <Paper radius="32px" p={60} bg="white" withBorder className="border-white shadow-premium-lg">
              <Stack align="center" gap={30}>
                <Box className="relative">
                  <ThemeIcon size={140} radius="full" variant="light" color="blue" className="bg-blue-50">
                    <Image src="https://cdn-icons-png.flaticon.com/512/5086/5086315.png" w={90} opacity={0.5} />
                  </ThemeIcon>
                  <Box className="absolute inset-0 animate-pulse bg-blue-400/10 rounded-full" />
                </Box>
                <Stack align="center" gap={6}>
                  <Title order={2} fw={900} size="28px" ta="center">Bạn chưa đặt món nào!</Title>
                  <Text c="dimmed" fw={600} size="md" ta="center" maw={320}>Cái bụng đang đói cần được nạp năng lượng ngay thôi nè.</Text>
                </Stack>
                <Button
                  size="xl"
                  radius="xl"
                  color="blue.7"
                  px={50}
                  h={65}
                  onClick={() => navigate('/menu')}
                  className="shadow-2xl shadow-blue-500/30 text-lg font-black transition-transform hover:-translate-y-1 active:scale-95"
                >
                  Khám phá menu ngay 🍕
                </Button>
              </Stack>
            </Paper>
          ) : (
            <Stack gap="md">
              {[...orders].sort((a: any, b: any) => b.id - a.id).map((order: any) => (
                <Paper
                  key={order.id}
                  radius="24px"
                  withBorder
                  p="md"
                  className="shadow-premium-sm hover:shadow-premium-md transition-all bg-white border-white cursor-pointer group"
                  onClick={() => navigate(`/order-detail/${order.id}`)}
                >
                  <Group justify="space-between" wrap="nowrap" align="center">
                    <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                      <ThemeIcon size={44} radius="xl" variant="light" color={STATUS_COLOR[order.order_status]} className="bg-slate-50">
                        <IconHistory size={20} />
                      </ThemeIcon>
                      <Stack gap={2} style={{ minWidth: 0 }}>
                        <Group gap={8} wrap="nowrap">
                          <Text fw={900} size="lg" className="group-hover:text-blue-600 transition-colors leading-none">
                            IUH-{dayjs(order.created_at).format('DDMMYYYY')}-{order.id}
                          </Text>
                          <Badge
                            color={STATUS_COLOR[order.order_status] || 'gray'}
                            variant="light"
                            size="xs"
                            radius="sm"
                            fw={800}
                            style={{ flexShrink: 0 }}
                          >
                            {STATUS_LABEL[order.order_status] || order.order_status}
                          </Badge>
                        </Group>
                        <Text size="xs" c="dimmed" fw={600} className="truncate">
                          {dayjs(order.created_at).format('HH:mm')} • {dayjs(order.created_at).format('DD/MM/YYYY')}
                        </Text>
                      </Stack>
                    </Group>

                    <Stack gap={0} align="flex-end" style={{ flexShrink: 0 }}>
                      <Text fw={1000} size="xl" className="text-blue-700 leading-none">
                        {(Number(order.total_amount)).toLocaleString()}đ
                      </Text>
                      <Group gap={4} mt={6} className="hidden sm:flex">
                        <Text size="xs" fw={700} c="dimmed">Chi tiết</Text>
                        <IconChevronRight size={12} className="text-slate-300" />
                      </Group>
                    </Stack>
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
