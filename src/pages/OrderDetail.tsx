import {
  Container, Text, Title, Stack, Group, Button,
  ThemeIcon, Timeline, Paper, Box, Badge, Loader, Image, Center, Divider
} from '@mantine/core';
import {
  IconClock, IconCircleX, IconArrowLeft, IconToolsKitchen2,
  IconCheck, IconTruck, IconMapPin, IconPhone, IconUser, IconReceipt
} from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppQuery } from '../hooks/useAppQuery';
import dayjs from 'dayjs';
import { useBrandTheme } from '../providers/BrandThemeProvider';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Chờ xác nhận', color: 'orange', icon: IconClock },
  confirmed: { label: 'Đã xác nhận', color: 'cyan', icon: IconCheck },
  preparing: { label: 'Đang chuẩn bị', color: 'brand', icon: IconToolsKitchen2 },
  delivering: { label: 'Đang giao hàng', color: 'blue', icon: IconTruck },
  completed: { label: 'Đã hoàn thành', color: 'green', icon: IconCheck },
  cancelled: { label: 'Đã hủy', color: 'red', icon: IconCircleX },
};

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'delivering', 'completed'];

interface OrderItem {
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  image_url?: string;
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeTheme } = useBrandTheme();

  const { data: order, isLoading } = useAppQuery(`order-${id}`, `/orders/${id}`);

  if (isLoading) return (
    <Box mih="100vh" bg="#F8FAFC">
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="md" color="brand" variant="bars" />
          <Text fw={900} size="xs" c="dimmed">Dữ liệu đơn hàng...</Text>
        </Stack>
      </Center>
    </Box>
  );

  if (!order) return (
    <Center mih="100vh" bg="#F8FAFC" p="xl">
      <Paper radius="32px" p={40} withBorder bg="white" className="text-center shadow-xl border-slate-100 max-w-sm">
        <Stack align="center" gap="lg">
          <ThemeIcon size={64} radius="xl" color="red" variant="light">
            <IconCircleX size={32} />
          </ThemeIcon>
          <Stack gap={2}>
            <Title order={3} fw={900} size={18}>Đơn hàng không tồn tại</Title>
            <Text c="dimmed" fw={600} size="xs">Mã đơn #{id} không đúng.</Text>
          </Stack>
          <Button fullWidth size="md" radius="xl" color="brand" onClick={() => navigate('/')} fw={800}>Về trang chủ</Button>
        </Stack>
      </Paper>
    </Center>
  );

  const activeIndex = STATUS_FLOW.indexOf(order.order_status);
  const currentStatus = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.pending;

  return (
    <Box bg="#F8FAFC" mih="100vh" pb={120}>
      <Container size="xs" py={32} px="md">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Button variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/orders')} fw={800} size="xs">Quay lại</Button>
            <Badge color={currentStatus.color} variant="filled" size="sm" radius="xl" fw={1000} px="md">{currentStatus.label.toUpperCase()}</Badge>
          </Group>

          <Paper radius="32px" p="xl" withBorder bg="white" className="shadow-2xl border-slate-100/50">
            <Stack gap="lg">
              <Box className="text-center">
                <Text size="9px" fw={900} c="dimmed" tt="uppercase" lts="1.5px" mb={2}>XÁC NHẬN CHI TIẾT</Text>
                <Title order={1} fw={900} size={24} c="dark.8">#{activeTheme?.brand_name?.toUpperCase() || 'ORANGE'}-{order.id}</Title>
                <Text size="11px" c="dimmed" fw={700} mt={4}>{dayjs(order.created_at).format('HH:mm DD/MM/YYYY')}</Text>
              </Box>

              <Divider variant="dashed" />

              <Stack gap="xs">
                <Text fw={900} size="9px" c="dimmed" tt="uppercase">THÔNG TIN NHẬN HÀNG</Text>
                <Paper p="md" radius="20px" bg="slate.0" withBorder className="border-slate-100">
                  <Stack gap={6}>
                    <Group wrap="nowrap" gap="sm">
                      <ThemeIcon color="brand" variant="light" size="xs" radius="sm"><IconUser size={12} /></ThemeIcon>
                      <Text size="xs" fw={800}>{order.customer_name || 'Enterprise Client'}</Text>
                    </Group>
                    <Group wrap="nowrap" gap="sm">
                      <ThemeIcon color="brand" variant="light" size="xs" radius="sm"><IconPhone size={12} /></ThemeIcon>
                      <Text size="xs" fw={800}>{order.customer_phone || 'N/A'}</Text>
                    </Group>
                    <Group wrap="nowrap" align="flex-start" gap="sm">
                      <ThemeIcon color="brand" variant="light" size="xs" radius="sm" mt={2}><IconMapPin size={12} /></ThemeIcon>
                      <Text size="10px" fw={700} c="dark.5">{order.shipping_address || 'Nhận tại quầy'}</Text>
                    </Group>
                  </Stack>
                </Paper>
              </Stack>

              <Box>
                <Text fw={900} size="10px" c="brand" tt="uppercase" mb="md" ta="center">TIẾN ĐỘ VẬN CHUYỂN</Text>
                <Timeline active={activeIndex} bulletSize={32} lineWidth={2} color="brand">
                  {STATUS_FLOW.map((s, idx) => {
                    const stepCfg = STATUS_CONFIG[s];
                    const Icon = stepCfg.icon;
                    const isDone = activeIndex >= idx;
                    const isCurrent = activeIndex === idx;
                    return (
                      <Timeline.Item key={s} bullet={<ThemeIcon size={isCurrent ? 32 : 24} radius="xl" color={isDone ? stepCfg.color : 'slate.2'} variant={isDone ? 'filled' : 'light'} className={isCurrent ? 'shadow-md border border-white' : ''}><Icon size={isCurrent ? 16 : 12} stroke={3} /></ThemeIcon>}>
                        <Stack gap={0} mt={-4}>
                          <Text fw={isDone ? 900 : 700} size={isCurrent ? 'xs' : '10px'} c={isDone ? 'dark.8' : 'dimmed'}>{stepCfg.label}</Text>
                          {isCurrent && <Text size="8px" fw={900} c="brand" tt="uppercase">Đang xử lý</Text>}
                        </Stack>
                      </Timeline.Item>
                    )
                  })}
                </Timeline>
              </Box>

                <Stack gap={8}>
                  <Text fw={900} size="9px" c="dimmed" tt="uppercase" lts="1px">GIỎ HÀNG CHI TIẾT</Text>
                  <Stack gap={4}>
                    {order.items?.map((item: OrderItem, idx: number) => (
                      <Paper key={idx} p="xs" radius="xl" withBorder bg="white" className="border-slate-50 shadow-sm">
                        <Group justify="space-between" wrap="nowrap">
                          <Group gap="sm" wrap="nowrap">
                            <Box 
                              style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #f1f5f9' }}
                            >
                              <Image 
                                src={item.image_url || '/placeholder-food.png'} 
                                w={42} h={42} fit="cover"
                              />
                            </Box>
                            <Stack gap={0}>
                              <Text fw={800} size="xs" lineClamp={1} className="tracking-tight">{item.product_name}</Text>
                              <Group gap={4}>
                                <Badge variant="light" color="brand" size="sm" radius="sm" px={4} h={18}>{item.quantity}x</Badge>
                                <Text size="10px" fw={900} c="brand">{(Number(item.unit_price)).toLocaleString()}đ</Text>
                              </Group>
                            </Stack>
                          </Group>
                          <Text fw={1000} size="sm" className="tracking-tighter">{(item.unit_price * item.quantity).toLocaleString()}đ</Text>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </Stack>

              <Paper radius="24px" p="md" style={{ background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)' }}>
                <Group justify="space-between">
                  <Stack gap={0}>
                    <Text fw={100} size="9px" c="white" opacity={0.7} tt="uppercase">Tổng thanh toán ( {order.payment_method === 'transfer' ? 'CK' : 'Tiền mặt'} )</Text>
                    <Text fw={1000} size="lg" c="white" className="leading-tight">{Number(order.total_amount).toLocaleString()}đ</Text>
                  </Stack>
                  <ThemeIcon size={44} radius="12px" variant="white" color="brand" className="shadow-lg"><IconReceipt size={24} stroke={2.5} /></ThemeIcon>
                </Group>
              </Paper>
            </Stack>
          </Paper>

          <Button fullWidth size="md" radius="xl" variant="subtle" color="gray" fw={900} onClick={() => navigate('/')} leftSection={<IconArrowLeft size={18} />}>VỀ TRANG CHỦ</Button>
        </Stack>
      </Container>
    </Box>
  );
}
