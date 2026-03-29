import {
  Container, Text, Group, Stack, Box, Paper,
  ActionIcon, Avatar, Button, Divider
} from '@mantine/core';
import {
  IconChevronLeft, IconUser, IconPhone, IconMapPin,
  IconShoppingBag, IconLogout, IconEdit
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useBrandTheme } from '../providers/BrandThemeProvider';
import { useAppQuery } from '../hooks/useAppQuery';
import { notifications } from '@mantine/notifications';
import { useUserStore } from '../store/userStore';

export default function Profile() {
  const navigate = useNavigate();
  const { activeTheme } = useBrandTheme();
  const {
    phoneNumber,
    customerName,
    shippingAddress,
    clearCart,
    setCustomerName,
    setPhoneNumber,
    setShippingAddress
  } = useUserStore();

  // Fetch profile từ API
  const { data: profileData } = useAppQuery('profile', '/auth/client/profile');

  // Merge data từ API và local store
  const userProfile = profileData?.user || profileData || {};
  const displayName = userProfile.full_name || customerName || 'Khách hàng';
  const displayPhone = userProfile.phone || phoneNumber || '';
  const displayAddress = userProfile.address || shippingAddress || '';

  const handleLogout = () => {
    // Clear all user data
    clearCart();
    setCustomerName('');
    setPhoneNumber('');
    setShippingAddress('');
    localStorage.removeItem('userPassword');

    notifications.show({
      title: 'Đã đăng xuất',
      message: 'Hẹn gặp lại bạn!',
      color: 'green'
    });

    navigate('/');
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    // Format: 0123456789 -> 0123 456 789
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  return (
    <Box bg="#f8fafc" mih="100vh" pb={100}>
      {/* Header */}
      <Box
        bg="white"
        py={12}
        px={16}
        style={{ borderBottom: '1px solid #f1f5f9' }}
      >
        <Group align="center">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => navigate(-1)}
            size="lg"
            radius="xl"
          >
            <IconChevronLeft size={24} />
          </ActionIcon>
          <Text fw={800} size="md" style={{ color: '#0f172a' }}>
            Tài khoản của tôi
          </Text>
        </Group>
      </Box>

      <Container size="lg" py={24} px="md">
        {/* User Info Card */}
        <Paper
          p={24}
          radius="xl"
          mb={20}
          style={{
            background: `linear-gradient(135deg, ${activeTheme?.primary_color || '#ff6b00'} 0%, ${activeTheme?.secondary_color || '#ffffff'}55 100%)`,
            color: 'white'
          }}
        >
          <Group gap={16}>
            <Avatar
              size={64}
              radius="xl"
              style={{
                background: 'white',
                color: activeTheme?.primary_color || '#ff6b00'
              }}
            >
              <IconUser size={32} />
            </Avatar>
            <Stack gap={4} style={{ flex: 1 }}>
              <Text fw={800} size="lg">
                {displayName}
              </Text>
              <Text size="sm" opacity={0.9}>
                {formatPhone(displayPhone)}
              </Text>
            </Stack>
          </Group>
        </Paper>

        {/* Info Items */}
        <Paper p={16} radius="xl" mb={12} style={{ border: '1px solid #f1f5f9' }}>
          <Stack gap={16}>
            {/* Phone */}
            <Group gap={12}>
              <Box
                w={40}
                h={40}
                style={{
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${activeTheme?.primary_color || '#ff6b00'}20 0%, ${activeTheme?.secondary_color || '#ffffff'}40 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconPhone size={20} color={activeTheme?.primary_color || '#ff6b00'} />
              </Box>
              <Stack gap={2} style={{ flex: 1 }}>
                <Text size="xs" c="dimmed" fw={600}>Số điện thoại</Text>
                <Text fw={700} size="sm">{formatPhone(displayPhone) || 'Chưa cập nhật'}</Text>
              </Stack>
            </Group>

            <Divider />

            {/* Address */}
            <Group gap={12}>
              <Box
                w={40}
                h={40}
                style={{
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${activeTheme?.primary_color || '#ff6b00'}20 0%, ${activeTheme?.secondary_color || '#ffffff'}40 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconMapPin size={20} color={activeTheme?.primary_color || '#ff6b00'} />
              </Box>
              <Stack gap={2} style={{ flex: 1 }}>
                <Text size="xs" c="dimmed" fw={600}>Địa chỉ giao hàng</Text>
                <Text fw={700} size="sm" lineClamp={2}>
                  {displayAddress || 'Chưa cập nhật địa chỉ'}
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Paper>

        {/* Quick Actions */}
        <Paper p={16} radius="xl" mb={12} style={{ border: '1px solid #f1f5f9' }}>
          <Stack gap={12}>
            <Button
              variant="subtle"
              color="dark"
              fullWidth
              justify="flex-start"
              leftSection={<IconShoppingBag size={20} color={activeTheme?.primary_color || '#ff6b00'} />}
              onClick={() => navigate('/orders')}
              size="md"
              radius="lg"
              h={48}
            >
              <Text fw={700} size="sm">Lịch sử đơn hàng</Text>
            </Button>

            <Divider />

            <Button
              variant="subtle"
              color="dark"
              fullWidth
              justify="flex-start"
              leftSection={<IconEdit size={20} color={activeTheme?.primary_color || '#ff6b00'} />}
              onClick={() => navigate('/checkout')}
              size="md"
              radius="lg"
              h={48}
            >
              <Text fw={700} size="sm">Cập nhật thông tin</Text>
            </Button>
          </Stack>
        </Paper>

        {/* Logout */}
        <Button
          color="brand"
          variant="light"
          fullWidth
          size="md"
          radius="xl"
          h={48}
          leftSection={<IconLogout size={20} />}
          onClick={handleLogout}
          fw={700}
        >
          Đăng xuất
        </Button>
      </Container>
    </Box>
  );
}
