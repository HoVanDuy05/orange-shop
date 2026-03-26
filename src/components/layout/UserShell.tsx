import React from 'react';
import {
  AppShell,
  UnstyledButton,
  Text,
  Container,
  Indicator,
  ActionIcon,
  Box,
  Drawer,
  Stack,
  Image,
  Title,
  ScrollArea,
  Button,
  TextInput,
  Modal,
  Paper,
  Group,
} from '@mantine/core';
import {
  IconShoppingCart,
  IconSmartHome,
  IconToolsKitchen2,
  IconHistory,
  IconTrash,
  IconPlus,
  IconMinus,
  IconX,
  IconUser,
  IconPhone
} from '@tabler/icons-react';
import { useUserStore } from '../../store/userStore';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useAppMutation } from '../../hooks/useAppMutation';
import { useUserRealtime } from '../../hooks/useUserRealtime';
import { GlobalLoader } from './GlobalLoader';

export const UserShell = ({ children }: { children: React.ReactNode }) => {
  useUserRealtime();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, tableId, removeFromCart, updateQuantity, clearCart, customerName, setCustomerName, phoneNumber, setPhoneNumber } = useUserStore();

  const [opened, { open, close }] = useDisclosure(false);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
  const [loginOpened, { close: closeLogin }] = useDisclosure(!customerName || !phoneNumber);
  const [tempName, setTempName] = React.useState(customerName);
  const [tempPhone, setTempPhone] = React.useState(phoneNumber);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const mutation = useAppMutation('/orders');

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      notifications.show({ title: 'Cần cung cấp tên', message: 'Vui lòng nhập tên bạn để nhà bếp tiện phục vụ nè.', color: 'orange' });
      return;
    }
    try {
      const res = await mutation.mutateAsync({
        dining_table_id: tableId ? Number(tableId) : null,
        customer_name: customerName,
        customer_phone: phoneNumber,
        payment_method: 'unpaid',
        items: cart.map(i => ({
          product_id: i.id,
          quantity: i.quantity,
          unit_price: i.price
        }))
      });

      if (res.data?.token || res.token) {
        localStorage.setItem('token', res.data?.token || res.token);
      }
      notifications.show({ title: 'Đặt món thành công!', message: 'Đơn hàng đã được gửi tới bếp.', color: 'green' });
      clearCart();
      close();
      navigate('/orders');
    } catch (error: any) {
      notifications.show({ title: 'Lỗi', message: error.response?.data?.message || 'Có lỗi khi đặt hàng', color: 'red' });
    }
  };

  const NavLink = ({ href, icon: Icon, label }: any) => {
    const active = location.pathname === href;
    return (
      <UnstyledButton
        onClick={() => navigate(href)}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 6, paddingBottom: 4 }}
      >
        <Box
          style={{
            width: 52,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
            marginBottom: 2,
            backgroundColor: active ? '#2563eb' : 'transparent',
            color: active ? 'white' : '#64748b',
            transition: 'all 0.2s',
          }}
        >
          <Icon size={20} stroke={active ? 2.5 : 2} />
        </Box>
        <Text size="10px" fw={active ? 800 : 600} style={{ color: active ? '#2563eb' : '#64748b' }}>
          {label}
        </Text>
      </UnstyledButton>
    );
  };

  return (
    <AppShell
      header={{ height: 60 }}
      padding="0"
    >
      <GlobalLoader />
      <AppShell.Header className="bg-white border-b border-slate-100 z-[1001]">
        <Container size="lg" h="100%">
          <Group justify="space-between" h="100%" wrap="nowrap" px="xs">
            <UnstyledButton onClick={() => navigate('/')} className="flex items-center gap-2">
              <Image src="/logo-iuh.png" h={30} w="auto" />
              <Box>
                <Text fw={900} size="xs" c="blue.8" tt="uppercase" className="leading-tight">Food Court</Text>
                <Text size="8px" fw={700} c="dimmed" tt="uppercase">IUH University</Text>
              </Box>
            </UnstyledButton>

            <Indicator label={totalItems} size={18} color="red" offset={2} disabled={totalItems === 0} withBorder>
              <ActionIcon variant="filled" color="blue.7" size="lg" radius="md" onClick={open}>
                <IconShoppingCart size={20} />
              </ActionIcon>
            </Indicator>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main pb={100} bg="white">
        {children}
      </AppShell.Main>

      {/* MATCHED UI FOOTER */}
      <Box
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'white',
          borderTop: '1px solid #eee',
          paddingBottom: 'env(safe-area-inset-bottom, 10px)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        <NavLink href="/" icon={IconSmartHome} label="Trang chủ" />
        <NavLink href="/menu" icon={IconToolsKitchen2} label="Thực đơn" />
        <NavLink href="/orders" icon={IconHistory} label="Lịch sử" />
      </Box>

      {/* PREMIUM CART DRAWER */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="sm"
        padding={0}
        zIndex={1100}
        styles={{
          header: { display: 'none' },
          body: { height: '100%', padding: 0 }
        }}
      >
        <Stack h="100vh" gap={0}>
          {/* Drawer Header */}
          <Group justify="space-between" px="md" py="sm" style={{ borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
            <Group gap="xs">
              <IconShoppingCart size={20} color="#2563eb" />
              <Text fw={900} size="lg">Giỏ hàng</Text>
            </Group>
            <ActionIcon variant="subtle" color="gray" size="lg" radius="xl" onClick={close}>
              <IconX size={18} />
            </ActionIcon>
          </Group>

          {/* Cart Items */}
          <ScrollArea style={{ flex: 1 }} px="md" py="sm">
            {cart.length === 0 ? (
              <Stack align="center" py={80} gap="sm" style={{ opacity: 0.35 }}>
                <IconShoppingCart size={56} stroke={1} color="#94a3b8" />
                <Text fw={700} c="dimmed">Giỏ hàng trống</Text>
                <Text size="xs" c="dimmed">Hãy thêm món ngon vào nhé!</Text>
              </Stack>
            ) : (
              <Stack gap="xs">
                {cart.map(item => (
                  <Paper key={item.id} p="sm" radius="xl" style={{ border: '1px solid #f1f5f9', backgroundColor: '#fff' }}>
                    <Group wrap="nowrap" gap="sm" align="flex-start">
                      {/* Product image */}
                      <Box style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', flexShrink: 0, backgroundColor: '#f8fafc' }}>
                        <img
                          src={item.image_url || 'https://via.placeholder.com/64'}
                          alt={item.product_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e: any) => { e.target.src = 'https://via.placeholder.com/64'; }}
                        />
                      </Box>

                      {/* Info + Controls */}
                      <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                        <Text fw={700} size="sm" lineClamp={2} style={{ lineHeight: 1.3 }}>{item.product_name}</Text>
                        <Text fw={900} size="sm" c="blue.7">{(item.price * item.quantity).toLocaleString()}đ</Text>

                        <Group justify="space-between" align="center" mt={4}>
                          {/* Quantity */}
                          <Group gap={6}>
                            <ActionIcon
                              variant="default"
                              size="sm"
                              radius="xl"
                              onClick={() => updateQuantity(item.id, -1)}
                              style={{ border: '1px solid #e2e8f0' }}
                            >
                              <IconMinus size={12} stroke={3} />
                            </ActionIcon>
                            <Text size="sm" fw={800} w={18} ta="center">{item.quantity}</Text>
                            <ActionIcon
                              variant="filled"
                              color="blue.7"
                              size="sm"
                              radius="xl"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <IconPlus size={12} stroke={3} />
                            </ActionIcon>
                          </Group>

                          {/* Delete */}
                          <ActionIcon
                            variant="light"
                            color="red"
                            size="md"
                            radius="xl"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Stack>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </ScrollArea>

          {/* Order Summary + Checkout */}
          {cart.length > 0 && (
            <Stack gap={0} style={{ borderTop: '1px solid #f1f5f9', flexShrink: 0, padding: '16px' }}>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed" fw={600}>{cart.reduce((s, i) => s + i.quantity, 0)} món</Text>
                <Text fw={900} size="lg" c="blue.8">{totalPrice.toLocaleString()}đ</Text>
              </Group>
              <Button
                fullWidth
                size="lg"
                radius="xl"
                color="blue.7"
                fw={900}
                onClick={openConfirm}
                style={{ height: 50 }}
              >
                Đặt hàng ngay
              </Button>
            </Stack>
          )}
        </Stack>
      </Drawer>

      {/* CONFIRM ORDER MODAL */}
      <Modal
        opened={confirmOpened}
        onClose={closeConfirm}
        centered
        radius="lg"
        padding={0}
        size="sm"
        zIndex={1300}
        withCloseButton={false}
        overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
      >
        <Stack gap={0}>
          <Box style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px 12px 0 0', borderBottom: '1px solid #f1f5f9' }}>
            <Text fw={900} size="lg">Xác nhận đơn hàng</Text>
            <Text size="xs" c="dimmed" mt={2}>Kiểm tra lại trước khi đặt nhé!</Text>
          </Box>

          <Stack gap="xs" p={20} style={{ maxHeight: 260, overflowY: 'auto' }}>
            {cart.map(item => (
              <Group key={item.id} justify="space-between" wrap="nowrap">
                <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                  <Box style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0, backgroundColor: '#f1f5f9' }}>
                    <img src={item.image_url} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e: any) => { e.target.src = 'https://via.placeholder.com/36'; }} />
                  </Box>
                  <Stack gap={0} style={{ minWidth: 0 }}>
                    <Text size="sm" fw={700} lineClamp={1}>{item.product_name}</Text>
                    <Text size="xs" c="dimmed">x{item.quantity}</Text>
                  </Stack>
                </Group>
                <Text size="sm" fw={800} c="blue.7" style={{ flexShrink: 0 }}>{(item.price * item.quantity).toLocaleString()}đ</Text>
              </Group>
            ))}
          </Stack>

          <Stack gap={6} px={20} pb={4} style={{ borderTop: '1px solid #f1f5f9' }}>
            <Group justify="space-between" pt={12}>
              <Text fw={600} c="dimmed" size="sm">Khách hàng</Text>
              <Text fw={700} size="sm">{customerName}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={900} size="md">Tổng cộng</Text>
              <Text fw={900} size="lg" c="blue.7">{totalPrice.toLocaleString()}đ</Text>
            </Group>
          </Stack>

          <Group gap="sm" p={20} style={{ borderTop: '1px solid #f1f5f9' }}>
            <Button flex={1} variant="default" radius="md" size="md" onClick={closeConfirm}>Hủy</Button>
            <Button
              flex={2} radius="md" color="blue.7" size="md" fw={900}
              loading={mutation.isPending}
              onClick={() => { closeConfirm(); handleCheckout(); }}
            >
              Xác nhận đặt món
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={loginOpened}
        onClose={closeLogin}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        centered
        radius="lg"
        padding={0}
        size="sm"
        zIndex={1200}
        overlayProps={{ backgroundOpacity: 0.5, blur: 3 }}
      >
        <Stack gap={0}>
          {/* Blue header */}
          <Box style={{ background: '#2563eb', padding: '24px 24px 20px', borderRadius: '12px 12px 0 0', textAlign: 'center' }}>
            <Image src="/logo-iuh.png" h={36} w="auto" mx="auto" mb={12} style={{ filter: 'brightness(0) invert(1)' }} />
            <Title order={3} fw={900} style={{ color: 'white' }}>Xin chào! 👋</Title>
            <Text size="xs" style={{ color: 'rgba(255,255,255,0.75)' }} mt={4}>Chào mừng đến với Food Court IUH</Text>
          </Box>

          {/* Form */}
          <Stack gap="md" p={24}>
            <TextInput
              label={<Text fw={700} size="sm">Họ và tên *</Text>}
              placeholder="Nguyễn Văn A"
              radius="md"
              size="md"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              leftSection={<IconUser size={16} color="#2563eb" />}
            />
            <TextInput
              label={<Text fw={700} size="sm">Số điện thoại *</Text>}
              placeholder="0901 234 567"
              radius="md"
              size="md"
              type="tel"
              value={tempPhone}
              onChange={e => setTempPhone(e.target.value)}
              leftSection={<IconPhone size={16} color="#2563eb" />}
            />
            <Button
              fullWidth
              size="lg"
              radius="md"
              color="blue.7"
              fw={900}
              mt={4}
              onClick={() => {
                if (tempName.trim() && tempPhone.trim()) {
                  setCustomerName(tempName);
                  setPhoneNumber(tempPhone);
                  closeLogin();
                  notifications.show({ title: 'Xác nhận thành công!', message: `Chào ${tempName}!`, color: 'blue' });
                } else {
                  notifications.show({ title: 'Thiếu thông tin', message: 'Vui lòng nhập đầy đủ tên và SĐT.', color: 'red' });
                }
              }}
            >
              Bắt đầu đặt món
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </AppShell>
  );
};

