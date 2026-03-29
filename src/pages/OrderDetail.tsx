import {
  Container, Text, Title, Stack, Group, Button,
  ThemeIcon, Timeline, Paper, Box, Badge, Loader, Image, Center, Divider, Grid
} from '@mantine/core';
import {
  IconClock, IconCircleX, IconArrowLeft, IconMapPin, IconPhone, IconUser,
  IconChefHat, IconBike, IconStar
} from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppQuery } from '../hooks/useAppQuery';
import dayjs from 'dayjs';
import { useBrandTheme } from '../providers/BrandThemeProvider';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  pending: { label: 'Chờ xác nhận', color: '#f97316', icon: IconClock, bg: '#fff7ed' },
  confirmed: { label: 'Đã xác nhận', color: '#06b6d4', icon: IconClock, bg: '#ecfeff' },
  preparing: { label: 'Đang chuẩn bị', color: '#8b5cf6', icon: IconChefHat, bg: '#f5f3ff' },
  delivering: { label: 'Đang giao', color: '#3b82f6', icon: IconBike, bg: '#eff6ff' },
  completed: { label: 'Hoàn thành', color: '#22c55e', icon: IconStar, bg: '#f0fdf4' },
  cancelled: { label: 'Đã hủy', color: '#ef4444', icon: IconCircleX, bg: '#fef2f2' },
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

  const { data: order, isLoading } = useAppQuery(`order-${id}`, `/orders/${id}`);

  if (isLoading) return (
    <Box mih="100vh" bg="#fafafa">
      <Center h="100vh">
        <Stack align="center" gap="lg">
          <Loader size="lg" color="orange" />
          <Text fw={600} size="sm" c="dimmed">Đang tải thông tin đơn hàng...</Text>
        </Stack>
      </Center>
    </Box>
  );

  if (!order) return (
    <Center mih="100vh" bg="#fafafa" p="xl">
      <Paper radius="24px" p={32} withBorder bg="white" style={{ maxWidth: 400, textAlign: 'center' }}>
        <Stack align="center" gap="lg">
          <ThemeIcon size={80} radius="xl" color="red" variant="light">
            <IconCircleX size={40} />
          </ThemeIcon>
          <Stack gap={4}>
            <Title order={3} fw={700} size="lg">Đơn hàng không tồn tại</Title>
            <Text c="dimmed" size="sm">Không tìm thấy đơn hàng #{id}</Text>
          </Stack>
          <Button fullWidth size="md" radius="xl" color="orange" onClick={() => navigate('/')} fw={600}>
            Về trang chủ
          </Button>
        </Stack>
      </Paper>
    </Center>
  );

  const activeIndex = STATUS_FLOW.indexOf(order.order_status);
  const currentStatus = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.pending;
  const orderCode = order.order_code || `ORDER-${String(order.id).padStart(4, '0')}`;

  return (
    <Box bg="#fafafa" mih="100vh" pb={100}>
      {/* Header */}
      <Box bg="white" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #f0f0f0' }}>
        <Container size="sm" py={16}>
          <Group justify="space-between" align="center">
            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate('/orders')}
              fw={500}
              radius="xl"
            >
              Quay lại
            </Button>
            <Badge
              color="orange"
              variant="filled"
              size="lg"
              radius="xl"
              fw={600}
              px="lg"
              styles={{ root: { background: currentStatus.color } }}
            >
              {currentStatus.label}
            </Badge>
          </Group>
        </Container>
      </Box>

      <Container size="sm" py={24} px="md">
        <Stack gap="lg">
          {/* Order Info Card */}
          <Paper radius="20px" p={24} withBorder bg="white" style={{ border: '1px solid #f0f0f0' }}>
            <Stack gap="lg">
              {/* Order Code & Time */}
              <Box style={{ textAlign: 'center' }}>
                <Text size="xs" fw={500} c="dimmed" tt="uppercase" mb={4}>
                  Mã đơn hàng
                </Text>
                <Title order={2} fw={700} size="h3" c="dark">
                  {orderCode}
                </Title>
                <Text size="sm" c="dimmed" mt={4}>
                  {dayjs(order.created_at).format('HH:mm • DD/MM/YYYY')}
                </Text>
              </Box>

              <Divider />

              {/* Customer Info */}
              <Grid gutter="md">
                <Grid.Col span={6}>
                  <Stack gap={6}>
                    <Group gap={8}>
                      <ThemeIcon color="orange" variant="light" size="sm" radius="md">
                        <IconUser size={14} />
                      </ThemeIcon>
                      <Text size="xs" c="dimmed">Khách hàng</Text>
                    </Group>
                    <Text fw={600} size="sm" pl={28}>
                      {order.customer_name || 'Khách hàng'}
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack gap={6}>
                    <Group gap={8}>
                      <ThemeIcon color="orange" variant="light" size="sm" radius="md">
                        <IconPhone size={14} />
                      </ThemeIcon>
                      <Text size="xs" c="dimmed">Số điện thoại</Text>
                    </Group>
                    <Text fw={600} size="sm" pl={28}>
                      {order.customer_phone || 'N/A'}
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Stack gap={6}>
                    <Group gap={8}>
                      <ThemeIcon color="orange" variant="light" size="sm" radius="md">
                        <IconMapPin size={14} />
                      </ThemeIcon>
                      <Text size="xs" c="dimmed">Địa chỉ giao hàng</Text>
                    </Group>
                    <Text fw={500} size="sm" pl={28} c="dark.7">
                      {order.shipping_address || 'Nhận tại quầy'}
                    </Text>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>

          {/* Order Timeline */}
          {!['cancelled'].includes(order.order_status) && (
            <Paper radius="20px" p={24} withBorder bg="white" style={{ border: '1px solid #f0f0f0' }}>
              <Text fw={600} size="sm" mb="lg">Trạng thái đơn hàng</Text>
              <Timeline
                active={activeIndex}
                bulletSize={36}
                lineWidth={3}
                color="orange"
                styles={{
                  itemBody: { paddingLeft: 16 },
                  itemBullet: { border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
                }}
              >
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
                          size={36}
                          radius="xl"
                          color={isDone ? stepCfg.color : 'gray.3'}
                          variant={isDone ? 'filled' : 'light'}
                          style={{
                            border: isCurrent ? `3px solid ${stepCfg.color}` : 'none',
                            transform: isCurrent ? 'scale(1.1)' : 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Icon size={18} stroke={2} />
                        </ThemeIcon>
                      }
                      title={
                        <Text
                          fw={isCurrent ? 700 : isDone ? 600 : 500}
                          size="sm"
                          c={isDone ? 'dark' : 'dimmed'}
                        >
                          {stepCfg.label}
                        </Text>
                      }
                    >
                      {isCurrent && (
                        <Text size="xs" c="orange" fw={500} mt={2}>
                          Đang xử lý
                        </Text>
                      )}
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            </Paper>
          )}

          {/* Cancelled Status */}
          {order.order_status === 'cancelled' && (
            <Paper radius="20px" p={24} withBorder bg="#fef2f2" style={{ border: '1px solid #fecaca' }}>
              <Group justify="center" gap="sm">
                <ThemeIcon color="red" variant="light" size="lg" radius="xl">
                  <IconCircleX size={24} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text fw={600} c="red">Đơn hàng đã bị hủy</Text>
                  {order.cancel_reason && (
                    <Text size="sm" c="red.6">Lý do: {order.cancel_reason}</Text>
                  )}
                </Stack>
              </Group>
            </Paper>
          )}

          {/* Order Items */}
          <Paper radius="20px" p={24} withBorder bg="white" style={{ border: '1px solid #f0f0f0' }}>
            <Text fw={600} size="sm" mb="lg">Chi tiết món</Text>
            <Stack gap="md">
              {order.items?.map((item: OrderItem, idx: number) => (
                <Group key={idx} justify="space-between" align="flex-start" wrap="nowrap">
                  <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
                    <Box
                      style={{
                        borderRadius: 12,
                        overflow: 'hidden',
                        border: '1px solid #f0f0f0',
                        flexShrink: 0
                      }}
                    >
                      <Image
                        src={item.image_url || '/placeholder-food.png'}
                        w={64}
                        h={64}
                        fit="cover"
                      />
                    </Box>
                    <Stack gap={4} style={{ flex: 1, minWidth: 0, maxWidth: 'calc(100% - 80px)' }}>
                      <Text fw={600} size="sm" lineClamp={2} style={{ wordBreak: 'break-word' }}>
                        {item.product_name || `Sản phẩm #${item.product_id}`}
                      </Text>
                      <Group gap="sm">
                        <Badge
                          variant="light"
                          color="orange"
                          size="sm"
                          radius="md"
                          px={8}
                        >
                          x{item.quantity}
                        </Badge>
                        <Text size="sm" c="dimmed">
                          {Number(item.unit_price).toLocaleString()}đ
                        </Text>
                      </Group>
                    </Stack>
                  </Group>
                  <Text fw={700} size="sm" c="orange" style={{ whiteSpace: 'nowrap' }}>
                    {(item.unit_price * item.quantity).toLocaleString()}đ
                  </Text>
                </Group>
              ))}
            </Stack>

            <Divider my="lg" />

            {/* Order Summary */}
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Tạm tính</Text>
                <Text size="sm" fw={500}>
                  {Number(order.total_amount).toLocaleString()}đ
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Phí giao hàng</Text>
                <Text size="sm" fw={500} c="green">
                  Miễn phí
                </Text>
              </Group>
              <Divider />
              <Group justify="space-between" align="center">
                <Stack gap={2}>
                  <Text size="sm" c="dimmed">Tổng thanh toán</Text>
                  <Text size="xs" c="dimmed">
                    {order.payment_method === 'transfer' ? 'Chuyển khoản' : 'Thanh toán khi nhận'}
                  </Text>
                </Stack>
                <Text fw={700} size="xl" c="orange">
                  {Number(order.total_amount).toLocaleString()}đ
                </Text>
              </Group>
            </Stack>
          </Paper>

          {/* Back Button */}
          <Button
            fullWidth
            size="md"
            radius="xl"
            variant="light"
            color="orange"
            fw={600}
            onClick={() => navigate('/')}
            leftSection={<IconArrowLeft size={18} />}
            h={48}
          >
            Về trang chủ
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
