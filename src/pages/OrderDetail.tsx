import {
  Container,
  Text,
  Title,
  Stack,
  Group,
  Button,
  ThemeIcon,
  Timeline,
  Paper,
  Box,
  Badge,
  Loader,
  Image,
} from '@mantine/core';
import {
  IconHistory,
  IconClock,
  IconCircleCheck,
  IconChefHat,
  IconPackage,
  IconCash,
  IconCircleX,
  IconArrowLeft
} from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppQuery } from '../hooks/useAppQuery';
import dayjs from 'dayjs';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Chờ xác nhận', color: 'orange', icon: IconClock },
  confirmed: { label: 'Đã nhận đơn', color: 'blue', icon: IconCircleCheck },
  preparing: { label: 'Đang chế biến', color: 'violet', icon: IconChefHat },
  done: { label: 'Hoàn tất món', color: 'green', icon: IconPackage },
  paid: { label: 'Đã thanh toán', color: 'teal', icon: IconCash },
  cancelled: { label: 'Đã huỷ', color: 'red', icon: IconCircleX },
};

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'done', 'paid'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useAppQuery(`order-${id}`, `/orders/${id}`);

  if (isLoading) return (
    <Box className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <Stack align="center" gap="md">
        <Loader size="xl" color="blue" variant="dots" />
        <Text fw={700} c="dimmed">Đang lấy thông tin đơn hàng...</Text>
      </Stack>
    </Box>
  );

  if (!order) return (
    <Box className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <Paper radius="32px" p={40} withBorder className="text-center shadow-premium-lg bg-white border-white max-w-sm">
        <Stack align="center" gap="xl">
          <ThemeIcon size={80} radius="full" color="red" variant="light">
            <IconCircleX size={40} />
          </ThemeIcon>
          <Stack gap={4}>
            <Title order={3} fw={900}>Không tìm thấy đơn hàng</Title>
            <Text c="dimmed" fw={600} size="sm">Đơn hàng #{id} không tồn tại hoặc đã bị xóa khỏi hệ thống.</Text>
          </Stack>
          <Button fullWidth size="lg" radius="xl" color="blue" onClick={() => navigate('/')}>Quay lại trang chủ</Button>
        </Stack>
      </Paper>
    </Box>
  );

  const activeIndex = STATUS_FLOW.indexOf(order.order_status);
  const currentStatus = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.pending;

  return (
    <Box className="bg-[#f8fafc] min-h-screen">
      {/* MAIN CONTENT */}
      <Container size="xs" className="px-4 pt-6 relative z-20" style={{ maxWidth: 480 }}>
        <Stack gap="xl">
          {/* INFO SECTION */}
          <Box className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 shadow-sm border border-white/50">
            <Group justify="space-between" mb="lg" align="flex-start" wrap="nowrap">
              <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Text size="xs" fw={800} c="dimmed" tt="uppercase" lts="1px">Mã đơn hàng</Text>
                <Title order={2} fw={1000} size="h3" c="blue" className="leading-tight truncate">
                  #{order.id}
                </Title>
              </Stack>
              <Stack gap={4} align="flex-end" style={{ flexShrink: 0 }}>
                <Badge
                  color={currentStatus.color}
                  variant="filled"
                  size="lg"
                  radius="md"
                  fw={900}
                  leftSection={<currentStatus.icon size={14} stroke={3} />}
                >
                  {currentStatus.label}
                </Badge>
                <Text fw={800} size="xs" className="text-slate-500">
                  {dayjs(order.created_at).format('HH:mm DD/MM')}
                </Text>
              </Stack>
            </Group>

            {/* PROGRESS SECTION */}
            <Box py={24} px="md" className="bg-slate-50/50 rounded-[24px] border border-slate-100 mb-lg">
              <Text fw={900} size="xs" mb={24} c="slate.5" tt="uppercase" lts="1.5px">TIẾN ĐỘ</Text>

              <Timeline active={activeIndex} bulletSize={40} lineWidth={3} color="blue">
                {STATUS_FLOW.map((s, idx) => {
                  const stepCfg = STATUS_CONFIG[s];
                  const Icon = stepCfg.icon;
                  const isDone = activeIndex >= idx;
                  const isCurrent = activeIndex === idx;
                  return (
                    <Timeline.Item
                      key={s}
                      bullet={
                        <ThemeIcon
                          size={isCurrent ? 40 : 34}
                          radius="full"
                          color={isDone ? stepCfg.color : 'slate'}
                          variant={isDone ? 'filled' : 'light'}
                          className={`transition-all duration-300 ${isCurrent ? 'shadow-lg ring-4 ring-blue-50' : 'opacity-60'}`}
                        >
                          <Icon size={isCurrent ? 20 : 16} stroke={3} />
                        </ThemeIcon>
                      }
                    >
                      <Stack gap={2} mt={-4}>
                        <Text fw={isDone ? 900 : 700} size={isCurrent ? 'md' : 'sm'} c={isDone ? 'slate.9' : 'slate.4'}>
                          {stepCfg.label}
                        </Text>
                        {isCurrent && (
                          <Badge size="sm" variant="gradient" gradient={{ from: 'blue', to: 'indigo' }} radius="sm" fw={900}>
                            ĐANG XỬ LÝ
                          </Badge>
                        )}
                        {s === 'paid' && isDone && order.payment_method && order.payment_method !== 'unpaid' && (
                          <Text size="xs" fw={700} c="dimmed">
                            {order.payment_method === 'cash' ? 'Bằng tiền mặt' : 'Bằng chuyển khoản'}
                          </Text>
                        )}
                      </Stack>
                    </Timeline.Item>
                  )
                })}
              </Timeline>
            </Box>

            {/* ORDER ITEMS LIST */}
            <Stack gap="md" mt="xl">
              <Text fw={900} size="xs" c="slate.5" tt="uppercase" lts="2px" mb={4}>CHI TIẾT MÓN ĂN</Text>
              <Stack gap="xs">
                {order.items?.map((item: any, idx: number) => (
                  <Group key={idx} justify="space-between" wrap="nowrap" className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                      {item.image_url ? (
                        <Image src={item.image_url} w={48} h={48} radius="lg" style={{ objectFit: 'cover', flexShrink: 0 }} alt="" />
                      ) : (
                        <ThemeIcon color="blue" variant="light" radius="md" size="xl" style={{ flexShrink: 0 }}>
                          <IconPackage size={20} />
                        </ThemeIcon>
                      )}
                      <Stack gap={0} style={{ minWidth: 0 }}>
                        <Text fw={900} size="sm" c="slate.8" truncate>{item.product_name || `Món #${item.product_id}`}</Text>
                        <Group gap={6}>
                          <Text size="xs" c="dimmed" fw={700}>x{item.quantity}</Text>
                          <Text size="xs" c="blue.6" fw={800}>{(Number(item.unit_price)).toLocaleString()}đ</Text>
                        </Group>
                      </Stack>
                    </Group>
                    <Text fw={1000} size="md" c="slate.9" style={{ flexShrink: 0 }}>{(item.unit_price * item.quantity).toLocaleString()}đ</Text>
                  </Group>
                ))}
              </Stack>
            </Stack>

            {/* PAYMENT SUMMARY */}
            <Paper radius="24px" p="md" mt="xl" className="bg-slate-900 shadow-2xl relative overflow-hidden">
              <Box className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16" />
              <Group justify="space-between" wrap="nowrap">
                <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={800} size="xs" opacity={0.6} c="white" tt="uppercase" lts="1px">TỔNG CỘNG</Text>
                  <Text fw={1000} size="28px" c="white" className="leading-tight sm:text-4xl truncate">
                    {Number(order.total_amount).toLocaleString()}đ
                  </Text>
                </Stack>
                <ThemeIcon size={56} radius="16px" variant="filled" color="blue" className="shadow-lg" style={{ flexShrink: 0 }}>
                  <IconCash size={32} stroke={2.5} />
                </ThemeIcon>
              </Group>
            </Paper>

            <Button
              fullWidth
              size="lg"
              radius="xl"
              variant="subtle"
              mt="xl"
              h={54}
              onClick={() => navigate('/orders')}
              leftSection={<IconHistory size={20} />}
              className="font-black text-slate-500 hover:text-blue-600"
            >
              Lịch sử đơn hàng
            </Button>
          </Box>

          <Button
            variant="transparent"
            color="slate"
            size="lg"
            radius="xl"
            leftSection={<IconArrowLeft size={22} />}
            onClick={() => navigate('/')}
            className="font-black text-slate-400 hover:text-blue-600 transition-colors"
          >
            VỀ TRANG CHỦ
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
