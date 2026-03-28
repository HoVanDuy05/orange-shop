import {
  Container, Text, Group, Stack, Box, Image, ActionIcon,
  Button as MantineButton, Switch, Radio, Title, ScrollArea, Skeleton
} from '@mantine/core';
import {
  IconChevronLeft, IconPlus, IconMinus, IconTrash, IconInfoCircle, IconQrcode
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useCartProducts } from '../hooks/useCartProducts';
import { useBrandTheme } from '../providers/BrandThemeProvider';
import { useAppQuery } from '../hooks/useAppQuery';
import { useAppMutation } from '../hooks/useAppMutation';
import { notifications } from '@mantine/notifications';

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function Checkout() {
  const navigate = useNavigate();
  const { activeTheme } = useBrandTheme();
  const { cart, updateQuantity, removeFromCart, clearCart } = useUserStore();
  const { cartWithDetails, isLoading } = useCartProducts();
  const mutation = useAppMutation('/orders');

  const { data: products = [], isLoading: loadingProds } = useAppQuery('products', '/products');
  const recommended = Array.isArray(products) ? products.slice(0, 5) : [];

  const [ecoFriendly, setEcoFriendly] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const [showPaymentQR, setShowPaymentQR] = useState(false);

  const subtotal = cartWithDetails.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  const deliveryFee = 29000;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'cash') {
      try {
        const res = await mutation.mutateAsync({
          customer_name: 'Khách hàng Mobile',
          customer_phone: '0123456789',
          shipping_address: 'Địa chỉ của tôi',
          order_type: 'delivery',
          payment_method: 'cash',
          note: ecoFriendly ? 'Thân thiện môi trường (Không muỗng nĩa nhựa)' : '',
          items: cart.map(i => ({
            product_id: i.id,
            quantity: i.quantity
          }))
        });
        notifications.show({ title: 'Xác nhận thành công!', message: 'Đơn hàng của bạn đã được tiếp nhận.', color: 'green' });
        clearCart();
        const orderId = res.id || res.data?.id;
        navigate(`/order-detail/${orderId}`);
      } catch (err: any) {
        notifications.show({ title: 'Lỗi', message: err.response?.data?.message || 'Có lỗi khi đặt hàng', color: 'red' });
      }
    } else {
      setShowPaymentQR(true);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const res = await mutation.mutateAsync({
        customer_name: 'Khách hàng Mobile',
        customer_phone: '0123456789',
        shipping_address: 'Địa chỉ của tôi',
        order_type: 'delivery',
        payment_method: 'transfer',
        note: ecoFriendly ? 'Thân thiện môi trường (Không muỗng nĩa nhựa)' : '',
        items: cart.map(i => ({
          product_id: i.id,
          quantity: i.quantity
        }))
      });
      notifications.show({ title: 'Thanh toán thành công!', message: 'Đơn hàng của bạn đã được xác nhận.', color: 'green' });
      clearCart();
      const orderId = res.id || res.data?.id;
      navigate(`/order-detail/${orderId}`);
    } catch (err: any) {
      notifications.show({ title: 'Lỗi', message: err.response?.data?.message || 'Có lỗi khi đặt hàng', color: 'red' });
    }
  };

  if (cart.length === 0) {
    return (
      <Box p={32} bg="white" mih="100vh">
        <Stack align="center" justify="center" h="70vh" gap="xl">
          <Text fw={700} c="dimmed">Giỏ hàng của bạn đang trống</Text>
          <MantineButton variant="light" color="brand" radius="xl" onClick={() => navigate('/menu')}>Khám phá thực đơn</MantineButton>
        </Stack>
      </Box>
    );
  }

  if (showPaymentQR) {
    return (
      <Box bg="#f8fafc" mih="100vh">
        {/* Header */}
        <Box bg="white" py={12} px={16} style={{ borderBottom: '1px solid #f1f5f9' }}>
          <Group align="center">
            <ActionIcon variant="subtle" color="gray" onClick={() => setShowPaymentQR(false)} size="lg" radius="xl">
              <IconChevronLeft size={24} />
            </ActionIcon>
            <Text fw={800} size="md" style={{ color: '#0f172a' }}>Thanh toán chuyển khoản</Text>
          </Group>
        </Box>

        <Container size="sm" py={24}>
          <Stack gap={24} align="center">
            <Box bg="white" p={24} style={{ borderRadius: 16, border: '1px solid #f1f5f9' }}>
              <Stack gap={16} align="center">
                <Box w={200} h={200} bg="#f8fafc" style={{ borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconQrcode size={120} color="#94a3b8" />
                </Box>
                <Title order={3} fw={800} style={{ color: '#0f172a' }}>{formatVND(total)}</Title>
                <Text size="sm" c="dimmed" fw={600}>Quét mã QR để thanh toán</Text>
              </Stack>
            </Box>

            <Box bg="white" p={16} style={{ borderRadius: 12, border: '1px solid #f1f5f9' }}>
              <Stack gap={12}>
                <Group justify="space-between">
                  <Text size="sm" fw={600} c="gray.7">Ngân hàng</Text>
                  <Text size="sm" fw={700}>VCB</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" fw={600} c="gray.7">Số tài khoản</Text>
                  <Text size="sm" fw={700}>1234567890</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" fw={600} c="gray.7">Chủ tài khoản</Text>
                  <Text size="sm" fw={700}>VAN DUY HO</Text>
                </Group>
              </Stack>
            </Box>

            <MantineButton
              fullWidth
              size="lg"
              radius="xl"
              color="green"
              h={56}
              fw={800}
              onClick={handlePaymentSuccess}
            >
              Đã thanh toán
            </MantineButton>
          </Stack >
        </Container >
      </Box >
    );
  }

  return (
    <Box bg="#f8fafc" mih="100vh" pb={160}>
      {/* ── HEADER ── */}
      <Box bg="white" py={12} px={16} style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #f1f5f9' }}>
        <Group align="center">
          <ActionIcon variant="subtle" color="gray" onClick={() => navigate(-1)} size="lg" radius="xl">
            <IconChevronLeft size={24} />
          </ActionIcon>
          <Stack gap={0}>
            <Text fw={800} size="md" style={{ color: '#0f172a' }}>{activeTheme?.brand_name || 'Nhà hàng của tôi'}</Text>
            <Text size="11px" c="dimmed" fw={600}>Khoảng cách tới chỗ bạn: 3.6 km</Text>
          </Stack>
        </Group>
      </Box>

      {/* ── TÓM TẮT ĐƠN HÀNG ── */}
      <Box bg="white" mt={12} p={16}>
        <Group justify="space-between" mb={16}>
          <Text fw={800} size="lg" style={{ color: '#0f172a' }}>Tóm tắt đơn hàng</Text>
          <Text size="sm" c="brand" fw={700} onClick={() => navigate('/menu')} style={{ cursor: 'pointer' }}>Thêm món</Text>
        </Group>

        <Stack gap={16}>
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Group key={i} wrap="nowrap" align="flex-start" gap="sm">
                <Skeleton width={56} height={56} radius={10} />
                <Box style={{ flex: 1 }}>
                  <Skeleton height={14} width="80%" radius="sm" />
                </Box>
                <Stack gap={6} align="flex-end">
                  <Skeleton height={16} width={60} radius="sm" />
                  <Skeleton height={22} width={80} radius={40} />
                </Stack>
              </Group>
            ))
          ) : (
            cartWithDetails.map((item) => (
              <Group key={item.id} wrap="nowrap" align="flex-start" gap="sm">
                <Box w={56} h={56} style={{ borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <Image src={item.image_url || '/placeholder-food.png'} w={56} h={56} style={{ objectFit: 'cover' }} />
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={700} size="sm" lineClamp={2} style={{ color: '#1e293b', lineHeight: 1.3 }}>{item.product_name}</Text>
                </Box>
                <Stack gap={6} align="flex-end" style={{ flexShrink: 0 }}>
                  <Text fw={700} size="sm" style={{ color: '#0f172a' }}>{formatVND(item.price || 0)}</Text>

                  <Group gap={0} style={{ border: '1px solid #e2e8f0', borderRadius: 40, overflow: 'hidden', backgroundColor: '#fff' }}>
                    <ActionIcon variant="subtle" color="gray" size={22} radius={0} onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, -1)}>
                      {item.quantity === 1 ? <IconTrash size={10} /> : <IconMinus size={8} />}
                    </ActionIcon>
                    <Text size="10px" fw={700} w={18} ta="center">{item.quantity}</Text>
                    <ActionIcon variant="subtle" color="brand" size={22} radius={0} onClick={() => updateQuantity(item.id, 1)}>
                      <IconPlus size={8} />
                    </ActionIcon>
                  </Group>
                </Stack>
              </Group>
            ))
          )}
        </Stack>
      </Box>

      {/* ── GỢI Ý THÊM ── */}
      <Box bg="white" mt={12} py={20}>
        <Container size="lg" px="md">
          <Text fw={800} size="md" mb={12} style={{ color: '#0f172a' }}>Đặt thêm để nhận ưu đãi</Text>
          <ScrollArea scrollbars="x" offsetScrollbars>
            <Group wrap="nowrap" gap="md" pb={8}>
              {loadingProds ? Array(3).fill(0).map((_, i) => <Skeleton key={i} w={100} h={140} radius="md" />) : recommended.map((p: any) => (
                <Stack key={p.id} gap={4} w={110} style={{ flexShrink: 0 }}>
                  <Box style={{ position: 'relative', width: '100%', paddingBottom: '100%', borderRadius: 16, overflow: 'hidden' }}>
                    <Image src={p.image_url || '/placeholder-food.png'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <ActionIcon color="brand" variant="filled" size="xs" radius="xl" style={{ position: 'absolute', bottom: 8, right: 8, zIndex: 1 }}>
                      <IconPlus size={14} />
                    </ActionIcon>
                  </Box>
                  <Text fw={700} size="xs" lineClamp={1} mt={4} style={{ color: '#1e293b' }}>{p.product_name}</Text>
                  <Text fw={800} size="xs" color="#000">{formatVND(p.price)}</Text>
                </Stack>
              ))}
            </Group>
          </ScrollArea>
        </Container>
      </Box>

      {/* ── PHƯƠNG THỨC THANH TOÁN ── */}
      <Box bg="white" mt={12} p={16}>
        <Text fw={800} size="lg" mb={16} style={{ color: '#0f172a' }}>Phương thức thanh toán</Text>
        <Radio.Group value={paymentMethod} onChange={(value: string) => setPaymentMethod(value as 'cash' | 'transfer')}>
          <Stack gap={12}>
            <Radio value="cash" label="Thanh toán khi nhận hàng" color="brand" size="md" />
            <Radio value="transfer" label="Chuyển khoản" color="brand" size="md" />
          </Stack>
        </Radio.Group>
      </Box>

      {/* ── CHI PHÍ ── */}
      <Box bg="white" mt={12} p={16}>
        <Stack gap={10}>
          <Group justify="space-between" align="center">
            <Text size="sm" fw={600} c="gray.7">Tổng tạm tính</Text>
            <Text size="sm" fw={700} style={{ color: '#0f172a' }}>{formatVND(subtotal)}</Text>
          </Group>
          <Group justify="space-between" align="center">
            <Group gap={4}>
              <Text size="sm" fw={600} c="gray.7">Phí giao hàng và phí áp dụng</Text>
              <IconInfoCircle size={14} color="#94a3b8" />
            </Group>
            <Text size="sm" fw={700} style={{ color: '#0f172a' }}>{formatVND(deliveryFee)}</Text>
          </Group>
        </Stack>
      </Box>

      {/* ── ENVIRONMENT FRIENDLY ── */}
      <Box bg="white" mt={12} p={16}>
        <Group justify="space-between" align="center">
          <Stack gap={2} style={{ flex: 1 }}>
            <Text fw={800} size="md" style={{ color: '#0f172a' }}>Thân thiện với môi trường</Text>
            <Text size="xs" c="dimmed" fw={600}>Góp phần bảo vệ môi trường, không muỗng nĩa nhựa.</Text>
          </Stack>
          <Switch checked={ecoFriendly} onChange={(event) => setEcoFriendly(event.currentTarget.checked)} color="brand" size="md" />
        </Group>
      </Box>

      {/* ── BOTTOM BUTTON ── */}
      <Box
        bg="white"
        p={16}
        pb={32}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
          zIndex: 100,
          borderRadius: '24px 24px 0 0',
          borderTop: '1px solid #f1f5f9'
        }}
      >
        <Group justify="space-between" mb={16} align="baseline">
          <Text fw={700} size="lg" style={{ color: '#0f172a' }}>Tổng cộng</Text>
          <Text fw={800} size="xl" style={{ color: '#0f172a' }}>{formatVND(total)}</Text>
        </Group>
        <MantineButton
          fullWidth
          size="lg"
          radius="xl"
          color="brand"
          h={56}
          fw={800}
          onClick={handlePlaceOrder}
          disabled={cart.length === 0}
        >
          {paymentMethod === 'cash' ? 'Đặt đơn' : 'Tiếp tục thanh toán'}
        </MantineButton>
      </Box>
    </Box >
  );
}
