import {
  AppShell, UnstyledButton, Text, Container, Indicator, ActionIcon,
  Box, Drawer, Stack, Image, ScrollArea, Button,
  Group, Center,
  Skeleton
} from '@mantine/core';
import {
  IconShoppingCart, IconSmartHome, IconToolsKitchen2, IconHistory,
  IconTrash, IconPlus, IconMinus, IconX, IconChevronRight
} from '@tabler/icons-react';
import { useUserStore } from '../../store/userStore';
import { useCartProducts } from '../../hooks/useCartProducts';
import { notifications } from '@mantine/notifications';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useBrandTheme } from '../../providers/BrandThemeProvider';
import { AppTitle } from '../common/AppTitle';
import { GlobalLoader } from './GlobalLoader';
import { useDisclosure } from '@mantine/hooks';

export const UserShell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTheme } = useBrandTheme();
  console.log('Theme:', activeTheme);

  const {
    cart, removeFromCart, updateQuantity, phoneNumber
  } = useUserStore();

  const { cartWithDetails, isLoading } = useCartProducts();

  const [opened, { open, close }] = useDisclosure(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartWithDetails.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'VNĐ';

  const handleCheckoutClick = () => {
    // Check if user is logged in
    const storedPassword = localStorage.getItem('userPassword');
    if (!phoneNumber.trim() || !storedPassword) {
      notifications.show({
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để đặt hàng',
        color: 'orange'
      });
      close();
      navigate('/auth');
      return;
    }
    close();
    navigate('/checkout');
  };

  const handleCartClick = () => {
    open();
  };

  const NavLink = ({ href, icon: Icon, label }: any) => {
    const active = location.pathname === href;

    const handleClick = () => {
      // Check if user is logged in for order-related pages
      if (href === '/orders' || href.includes('/order-detail')) {
        const storedPassword = localStorage.getItem('userPassword');
        if (!phoneNumber.trim() || !storedPassword) {
          notifications.show({
            title: 'Yêu cầu đăng nhập',
            message: 'Vui lòng đăng nhập để xem lịch sử đơn hàng',
            color: 'orange'
          });
          navigate('/auth');
          return;
        }
      }
      navigate(href);
    };

    return (
      <UnstyledButton
        onClick={handleClick}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}
      >
        <Box
          px={active ? 24 : 0}
          py={active ? 8 : 4}
          style={{
            backgroundColor: active ? 'var(--brand-primary)' : 'transparent',
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            color: active ? '#fff' : '#94a3b8'
          }}
        >
          <Icon
            size={24}
            stroke={active ? 2.5 : 2}
          />
        </Box>
        <Text
          size="11px"
          fw={1000}
          mt={4}
          style={{
            color: active ? 'var(--brand-primary)' : '#94a3b8',
          }}
        >
          {label}
        </Text>
      </UnstyledButton>
    );
  };

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 80 }}
      padding="0"
    >
      <GlobalLoader />

      {/* HEADER */}
      <AppShell.Header
        className="bg-white border-b border-slate-100 z-[1001]"
        style={{ height: 60 }}
      >
        <Container size="lg" h="100%">
          <Group justify="space-between" h="100%" wrap="nowrap" px={8} align="center">
            <AppTitle />

            <Indicator label={totalItems} size={18} color="brand" offset={5} disabled={totalItems === 0} withBorder>
              <ActionIcon
                variant="light"
                color="brand"
                size={40}
                radius="xl"
                onClick={handleCartClick}
                className="shadow-sm"
              >
                <IconShoppingCart size={20} stroke={2.5} />
              </ActionIcon>
            </Indicator>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main bg="#f8fafc">
        <Box pb={80}>
          <Outlet />
        </Box>
      </AppShell.Main>

      <AppShell.Footer
        className="bg-white border-t border-slate-100 z-[1000] shadow-[0_-10px_30px_rgba(0,0,0,0.03)]"
        style={{ height: 80 }}
      >
        <Container size="lg" h="100%">
          <Group justify="space-around" h="100%" wrap="nowrap" px="xs" align="center">
            <NavLink href="/" icon={IconSmartHome} label="Trang chủ" />
            <NavLink href="/menu" icon={IconToolsKitchen2} label="Thực đơn" />
            <NavLink href="/orders" icon={IconHistory} label="Lịch sử" />
          </Group>
        </Container>
      </AppShell.Footer>

      {/* CART MODAL (BOTTOM DRAWER) */}
      <Drawer
        opened={opened}
        onClose={close}
        position="bottom"
        size="100dvh"
        padding={0}
        radius={0}
        styles={{
          header: { display: 'none' },
          content: { height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }
        }}
        overlayProps={{ backgroundOpacity: 0.1, blur: 0 }}
      >
        <Box h="100%" display="flex" style={{ flexDirection: 'column', overflow: 'hidden' }} bg="#f8fafc">
          {/* Header - Sticky top */}
          <Box bg="white" p="md" style={{ borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
            <Group justify="space-between" align="center">
              <Stack gap={0}>
                <Text fw={800} size="lg" style={{ color: '#0f172a' }}>Giỏ hàng của tôi</Text>
                <Text size="11px" c="dimmed" fw={600}>Kiểm tra lại các món trước khi đặt đơn</Text>
              </Stack>
              <ActionIcon variant="light" color="gray" radius="xl" size="lg" onClick={close}>
                <IconX size={20} />
              </ActionIcon>
            </Group>
          </Box>

          {/* Content - Scrollable */}
          <ScrollArea style={{ flex: 1, minHeight: 0 }} bg="white" px={12} py={16}>
            {isLoading ? (
              <Stack gap={20} pb={32}>
                {Array(3).fill(0).map((_, i) => (
                  <Group key={i} wrap="nowrap" align="flex-start" gap={12}>
                    <Skeleton width={56} height={56} radius={10} />
                    <Stack gap={8} style={{ flex: 1 }}>
                      <Skeleton height={14} width="80%" radius="sm" />
                      <Skeleton height={12} width="40%" radius="sm" />
                    </Stack>
                    <Stack gap={6} align="flex-end">
                      <Skeleton height={16} width={60} radius="sm" />
                      <Skeleton height={22} width={80} radius={40} />
                    </Stack>
                  </Group>
                ))}
              </Stack>
            ) : cartWithDetails.length > 0 ? (
              <Stack gap={20} pb={32}>
                {cartWithDetails.map((item) => (
                  <Group key={item.id} wrap="nowrap" align="flex-start" gap={12}>
                    <Box w={56} h={56} style={{ borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <Image src={item.image_url || '/placeholder-food.png'} w={56} h={56} style={{ objectFit: 'cover' }} />
                    </Box>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text fw={700} size="sm" lineClamp={2} style={{ color: '#1e293b', lineHeight: 1.3 }}>{item.product_name}</Text>
                      <Text size="10px" c="brand" fw={700} style={{ cursor: 'pointer' }} mt={2}>{item.category_name}</Text>
                    </Box>
                    <Stack gap={6} align="flex-end" style={{ flexShrink: 0, minWidth: 0 }}>
                      <Text fw={700} size="sm" style={{ color: '#0f172a' }}>{formatVND(item.price || 0)}</Text>

                      {/* Pill-shaped Quantity selector */}
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
                ))}
              </Stack>
            ) : (
              <Center py={100}>
                <Stack align="center" gap="xl">
                  <IconShoppingCart size={64} stroke={1} color="#cbd5e1" />
                  <Text fw={800} c="dimmed">Giỏ hàng đang trống</Text>
                  <Button variant="light" color="brand" radius="xl" onClick={close}>Quay lại thực đơn</Button>
                </Stack>
              </Center>
            )}
          </ScrollArea>

          {/* Footer - Sticky bottom */}
          {cart.length > 0 && (
            <Box bg="white" p={12} pb={24} style={{ borderTop: '1px solid #f1f5f9', boxShadow: '0 -4px 16px rgba(0,0,0,0.06)', flexShrink: 0 }}>
              <Group justify="space-between" mb={10} align="baseline">
                <Text fw={700} size="sm" style={{ color: '#64748b' }}>Tạm tính</Text>
                <Text fw={800} size="md" style={{ color: '#0f172a' }}>{formatVND(totalPrice)}</Text>
              </Group>
              <Button
                fullWidth size="sm" radius="xl" color="brand" h={44} fw={700}
                onClick={handleCheckoutClick}
                rightSection={<IconChevronRight size={16} />}
                className="shadow-lg"
              >
                Xác nhận đơn hàng
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppShell>
  );
};
