import {
  Container,
  SimpleGrid,
  Text,
  Badge,
  Button,
  Group,
  Title,
  Stack,
  Box,
  Paper,
  ThemeIcon,
  ActionIcon,
  Card,
} from '@mantine/core';
import {
  IconChevronRight,
  IconStar,
  IconTruck,
  IconShieldCheck,
  IconTrendingUp,
  IconClock,
  IconPlus,
  IconThumbUp
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAppQuery } from '../hooks/useAppQuery';
import { useUserStore } from '../store/userStore';
import { notifications } from '@mantine/notifications';

const VND = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useUserStore();

  const { data: products = [], isLoading: loadingProds } = useAppQuery('products', '/products');

  // Filter top 5 products by sales_count
  const bestSellers = [...products]
    .sort((a: any, b: any) => (b.sales_count || 0) - (a.sales_count || 0))
    .slice(0, 5);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      product_name: product.product_name,
      price: Number(product.price),
      quantity: 1,
      image_url: product.image_url
    });
    notifications.show({
      title: 'Đã thêm món! 😋',
      message: `Đã đưa "${product.product_name}" vào giỏ hàng.`,
      color: 'blue.7',
      variant: 'light',
    });
  };

  return (
    <Box bg="white">
      {/* BEST SELLERS SECTION - REFINED TITLE & ICON */}
      <Container size="lg" py={20} px="sm">
        <Group justify="space-between" mb="lg">
          <Stack gap={2}>
            <Group gap="xs">
              <ThemeIcon variant="light" color="blue" radius="md" size="md">
                <IconThumbUp size={18} stroke={2.5} />
              </ThemeIcon>
              <Title order={2} size="18px" fw={900} className="tracking-tight text-slate-800 uppercase">
                Các món bạn có thể thích
              </Title>
            </Group>
            <Text c="dimmed" size="xs" fw={500}>Nổi bật tuần qua tại Food Court</Text>
          </Stack>
          <Button
            variant="subtle"
            color="blue"
            size="sm"
            radius="xl"
            rightSection={<IconChevronRight size={14} />}
            onClick={() => navigate('/menu')}
            fw={700}
          >
            Tất cả
          </Button>
        </Group>

        {loadingProds ? (
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="sm">
            {[1, 2, 3, 4, 5].map(i => <Paper key={i} h={180} className="bg-slate-50 animate-pulse rounded-2xl" />)}
          </SimpleGrid>
        ) : (
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="sm" style={{ alignItems: 'stretch' }}>
            {bestSellers.map((product: any) => (
              <Card
                key={product.id}
                padding={0}
                radius="lg"
                withBorder
                style={{ borderColor: '#e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}
                className="hover:shadow-lg transition-all duration-300"
              >
                {/* Image Section */}
                <Box style={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                  <img
                    src={product.image_url || 'https://via.placeholder.com/300?text=Food'}
                    alt={product.product_name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <ActionIcon
                    variant="filled"
                    color="blue.7"
                    radius="xl"
                    size={28}
                    onClick={() => handleAddToCart(product)}
                    style={{ position: 'absolute', top: 8, right: 8, boxShadow: '0 2px 8px rgba(37,99,235,0.4)', zIndex: 10 }}
                  >
                    <IconPlus size={14} stroke={3} />
                  </ActionIcon>
                </Box>

                <Stack gap={3} p={10} style={{ flex: 1 }}>
                  <Text fw={700} size="13px" lineClamp={2} style={{ lineHeight: 1.3, color: '#1e293b' }}>
                    {product.product_name}
                  </Text>
                  <Text size="10px" c="dimmed" lineClamp={1} fw={500}>
                    {product.description || 'Hương vị tuyệt hảo'}
                  </Text>
                  <Group justify="space-between" align="center" mt="auto">
                    <Text fw={900} size="sm" c="blue.7">
                      {VND(Number(product.price))}
                    </Text>
                    <Text size="10px" fw={600} c="dimmed">{product.sales_count || 0} đã bán</Text>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>


      {/* STATS SECTION */}
      <Box py={60} className="bg-slate-50/50 border-t border-b border-slate-100">
        <Container size="lg">
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing={20}>
            {[
              { icon: IconTrendingUp, label: 'Đơn hàng', val: '12k+', color: 'blue' },
              { icon: IconClock, label: 'Phục vụ', val: '5min', color: 'orange' },
              { icon: IconStar, label: 'Đánh giá', val: '4.9/5', color: 'yellow' },
              { icon: IconTruck, label: 'Đối tác', val: '20+', color: 'green' },
            ].map((stat, i) => (
              <Paper key={i} p="lg" radius="xl" withBorder className="text-center bg-white shadow-sm border-slate-200/60">
                <ThemeIcon size={40} radius="xl" color={stat.color} variant="light" mb="sm" className="mx-auto">
                  <stat.icon size={20} />
                </ThemeIcon>
                <Title order={3} fw={900} size={20}>{stat.val}</Title>
                <Text c="dimmed" size="10px" fw={700} tt="uppercase" lts="0.5px" mt={2}>{stat.label}</Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Container size="lg" py={80}>
        <Stack gap={40}>
          <Box className="text-center max-w-xl mx-auto">
            <Badge variant="light" color="blue" size="md" radius="md" mb="xs">TỔNG QUAN DỊCH VỤ</Badge>
            <Title order={2} size={28} fw={900} className="tracking-tight text-slate-800">Tại sao nên chọn IUH Food Court?</Title>
          </Box>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={20}>
            {[
              {
                icon: IconTruck,
                title: 'Phục vụ nhanh',
                desc: 'Món ăn được chuẩn bị và phục vụ ngay sau khi bạn đặt đơn.',
                color: 'blue'
              },
              {
                icon: IconShieldCheck,
                title: 'An toàn vệ sinh',
                desc: 'Nguyên liệu được kiểm duyệt 100%, đảm bảo an toàn thực phẩm.',
                color: 'green'
              },
              {
                icon: IconStar,
                title: 'Giá cả ưu đãi',
                desc: 'Mức giá dành riêng cho sinh viên với nhiều combo tiết kiệm.',
                color: 'orange'
              },
            ].map((feat, i) => (
              <Paper key={i} p="xl" radius="24px" withBorder className="border-slate-100 hover:shadow-xl transition-all duration-300 bg-white">
                <ThemeIcon size={50} radius="14px" color={feat.color} variant="light" mb="lg">
                  <feat.icon size={24} />
                </ThemeIcon>
                <Title order={3} fw={800} size={18} mb="xs">{feat.title}</Title>
                <Text size="sm" c="slate.6" fw={500} className="leading-relaxed">{feat.desc}</Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      {/* PREMIUM CTA SECTION - REFINED */}
      <Container size="lg" pb={80}>
        <Paper
          radius={32}
          p={{ base: 40, md: 60 }}
          className="relative overflow-hidden shadow-2xl bg-[#0051a8] border border-blue-400/20"
        >
          <Box className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-400/30 rounded-full blur-[80px] -mr-32 -mt-16" />
          <Box className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-[40px] -ml-16 -mb-16" />

          <Stack align="center" gap={30} className="relative z-10 text-center">
            <Box>
              <Title order={2} size={32} fw={900} c="white" className="tracking-tight leading-tight">
                Trải nghiệm đặt món <br />
                <Text component="span" c="blue.1" inherit className="font-black text-blue-100/90">thế hệ mới</Text> ngay?
              </Title>
              <Text size="md" c="blue.0" opacity={0.9} fw={600} mt="md" className="max-w-md mx-auto leading-relaxed">
                Tham gia cùng 5,000+ sinh viên đang tận hưởng dịch vụ tiện lợi nhất tại trường đại học của chúng ta.
              </Text>
            </Box>
            <Button
              size="lg"
              radius="xl"
              h={56}
              px={40}
              variant="white"
              color="blue.8"
              fw={900}
              className="shadow-xl text-md font-black hover:-translate-y-1 transition-all active:scale-95"
              onClick={() => navigate('/menu')}
            >
              BẮT ĐẦU NGAY!
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
