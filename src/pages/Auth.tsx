import {
  Container, Text, Group, Stack, Box, Image, ActionIcon,
  Button as MantineButton, TextInput, Title, Divider, PasswordInput
} from '@mantine/core';
import {
  IconChevronLeft, IconUser, IconPhone
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrandTheme } from '../providers/BrandThemeProvider';
import { useUserStore } from '../store/userStore';
import { notifications } from '@mantine/notifications';

import { useAppMutation } from '../hooks/useAppMutation';

export default function Auth() {
  const navigate = useNavigate();
  const { activeTheme } = useBrandTheme();
  const { setPhoneNumber, setCustomerName: setStoreCustomerName } = useUserStore();
  const loginMutation = useAppMutation('/auth/client/login');
  const registerMutation = useAppMutation('/auth/client/register');

  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phoneNumberInput.trim()) {
      notifications.show({ title: 'Lỗi', message: 'Vui lòng nhập số điện thoại', color: 'red' });
      return;
    }

    if (!password.trim()) {
      notifications.show({ title: 'Lỗi', message: 'Vui lòng nhập mật khẩu', color: 'red' });
      return;
    }

    if (!isLogin && !customerName.trim()) {
      notifications.show({ title: 'Lỗi', message: 'Vui lòng nhập tên của bạn', color: 'red' });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginMutation.mutateAsync({
          phone: phoneNumberInput.trim(),
          password: password.trim()
        });

        if (res.success) {
          // Store password in localStorage for ProtectedRoute and UserShell checks
          localStorage.setItem('userPassword', password.trim());
          setPhoneNumber(phoneNumberInput.trim());
          if (res.user?.full_name) {
            setStoreCustomerName(res.user.full_name);
          }

          notifications.show({
            title: 'Thành công!',
            message: 'Đăng nhập thành công',
            color: 'green'
          });
          navigate('/menu');
        } else {
          notifications.show({ title: 'Lỗi', message: res.message || 'Đăng nhập thất bại', color: 'red' });
        }
      } else {
        const res = await registerMutation.mutateAsync({
          phone: phoneNumberInput.trim(),
          password: password.trim(),
          full_name: customerName.trim()
        });

        if (res.success) {
          notifications.show({
            title: 'Thành công!',
            message: 'Đăng ký thành công. Vui lòng đăng nhập.',
            color: 'green'
          });
          setIsLogin(true);
        } else {
          notifications.show({ title: 'Lỗi', message: res.message || 'Đăng ký thất bại', color: 'red' });
        }
      }
    } catch (error: any) {
      notifications.show({
        title: 'Lỗi',
        message: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="#f8fafc" mih="100vh">
      {/* Header */}
      <Box bg="white" py={12} px={16} style={{ borderBottom: '1px solid #f1f5f9' }}>
        <Group align="center">
          <ActionIcon variant="subtle" color="gray" onClick={() => navigate(-1)} size="lg" radius="xl">
            <IconChevronLeft size={24} />
          </ActionIcon>
          <Text fw={800} size="md" style={{ color: '#0f172a' }}>
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </Text>
        </Group>
      </Box>

      <Container size="sm" py={32}>
        <Stack gap={32} align="center">
          {/* Logo */}
          <Box py={20}>
            <Image
              src={activeTheme?.logo_url || '/logo-iuh.png'}
              h={80} w="auto" fit="contain"
              mx="auto"
            />
            <Title order={2} fw={900} ta="center" mt={16} style={{ color: '#0f172a' }}>
              {activeTheme?.brand_name || 'VanDui Coffee'}
            </Title>
            <Text size="sm" c="dimmed" ta="center" fw={600} mt={4}>
              {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
            </Text>
          </Box>

          {/* Form */}
          <Box w="100%" maw={400}>
            <Stack gap={20}>
              {!isLogin && (
                <TextInput
                  leftSection={<IconUser size={16} />}
                  label="Tên của bạn"
                  placeholder="Nhập tên của bạn"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  size="md"
                  required
                />
              )}

              <TextInput
                leftSection={<IconPhone size={16} />}
                label="Số điện thoại"
                placeholder="Nhập số điện thoại của bạn"
                value={phoneNumberInput}
                onChange={(e) => setPhoneNumberInput(e.target.value)}
                size="md"
                required
              />

              <PasswordInput
                label="Mật khẩu"
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="md"
                required
              />

              <MantineButton
                fullWidth
                size="lg"
                radius="xl"
                color="brand"
                h={48}
                fw={700}
                onClick={handleSubmit}
                loading={loading}
              >
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
              </MantineButton>
            </Stack>
          </Box>

          {/* Switch between login/register */}
          <Box w="100%" maw={400}>
            <Divider label="Hoặc" labelPosition="center" my={20} />
            <Group justify="center" gap={8}>
              <Text size="sm" c="dimmed">
                {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              </Text>
              <MantineButton
                variant="subtle"
                color="brand"
                size="sm"
                p={0}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </MantineButton>
            </Group>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
