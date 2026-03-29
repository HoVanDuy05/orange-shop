import {
  Container, Text, Group,
  Title, Stack, Box, Skeleton, ScrollArea,
  SimpleGrid
} from '@mantine/core';
import {
  IconArrowRight
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAppQuery } from '../hooks/useAppQuery';
import { useBrandTheme } from '../providers/BrandThemeProvider';
import { ProductItem } from '../components/common/ProductItem';

export default function Home() {
  const navigate = useNavigate();
  const { activeTheme } = useBrandTheme();

  const { data: categories = [], isLoading: loadingCats } = useAppQuery('categories', '/categories');
  const { data: products = [], isLoading: loadingProds } = useAppQuery('products', '/products');

  const productList = Array.isArray(products) ? products : [];
  const categoryList = Array.isArray(categories) ? categories : [];

  // Random 5 sản phẩm hoặc lấy 5 sản phẩm mới nhất
  const getTodayProducts = () => {
    if (productList.length === 0) return [];

    // 50% random, 50% mới nhất
    const useRandom = Math.random() > 0.5;

    if (useRandom) {
      // Random 5 sản phẩm
      const shuffled = [...productList].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 5);
    } else {
      // 5 sản phẩm mới nhất (theo id giảm dần)
      return [...productList]
        .sort((a: any, b: any) => (b.id || 0) - (a.id || 0))
        .slice(0, 5);
    }
  };

  const todayProducts = getTodayProducts();

  // Best sellers cho section khác (nếu cần)
  const bestSellers = [...productList]
    .sort((a: any, b: any) => (b.sales_count || 0) - (a.sales_count || 0))
    .slice(0, 6);

  return (
    <Box bg="#f8fafc" pb={100}>
      {/* ── HERO SECTION ── */}
      <Box
        style={{
          background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)`,
          minHeight: '220px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '16px 16px'
          }}
        />
        <Container size="lg" py={32} style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <Stack align="center" gap="xs" style={{ textAlign: 'center' }}>
            <Text size="10px" fw={900} tt="uppercase" lts="2px" c="white" opacity={0.9}>
              {activeTheme?.brand_name || 'ORANGE CATERING'}
            </Text>
            <Title order={1} c="white" fw={900} size={24} style={{ lineHeight: 1.1, textTransform: 'uppercase' }}>
              Giải pháp ẩm thực<br />doanh nghiệp
            </Title>
            <Text size="10px" c="white" opacity={0.7} fw={600} tt="uppercase" lts="1px">
              Chuẩn mực suất ăn cao cấp
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* ── CATEGORY CIRCLES ── */}
      <Box bg="white" py={20} mb={10} style={{ borderBottom: '1px solid #f1f5f9' }}>
        <Container size="lg" px="md">
          <Group justify="space-between" mb={12} px={4}>
            <Text fw={800} size="13px" style={{ color: '#0f172a' }}>DANH MỤC</Text>
            <Text size="11px" c="brand" fw={700} style={{ cursor: 'pointer' }} onClick={() => navigate('/menu')}>Xem tất cả</Text>
          </Group>
          <ScrollArea scrollbars="x" offsetScrollbars>
            <Group wrap="nowrap" gap={12} px={4}>
              {loadingCats ? (
                Array(5).fill(0).map((_, i) => (
                  <Box key={i} style={{ flexShrink: 0, width: 64, textAlign: 'center' }}>
                    <Skeleton width={48} height={48} radius="xl" mx="auto" />
                    <Skeleton height={8} width={30} radius="xl" mx="auto" mt={6} />
                  </Box>
                ))
              ) : (
                categoryList.map((c: any) => (
                  <Box
                    key={c.id}
                    onClick={() => navigate(`/menu`)}
                    style={{ flexShrink: 0, width: 64, textAlign: 'center', cursor: 'pointer' }}
                  >
                    <Box
                      style={{
                        width: 48, height: 48, borderRadius: '50%', margin: '0 auto',
                        overflow: 'hidden', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0'
                      }}
                    >
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.category_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🍽️</Box>
                      )}
                    </Box>
                    <Text size="10px" fw={700} mt={6} lineClamp={1} c="gray.7">{c.category_name}</Text>
                  </Box>
                ))
              )}
            </Group>
          </ScrollArea>
        </Container>
      </Box>

      {/* ── BEST SELLERS ── */}
      <Container size="lg" py={20} px="md">
        <Group justify="space-between" mb={16} align="flex-end">
          <Stack gap={2}>
            <Text fw={800} size="14px" style={{ color: '#0f172a' }}>GỢI Ý HÔM NAY</Text>
            <Text c="dimmed" size="10px" fw={600}>Những món ăn được đặt nhiều nhất</Text>
          </Stack>
          <Group gap={4} style={{ cursor: 'pointer' }} onClick={() => navigate('/menu')}>
            <Text size="11px" c="brand" fw={700}>Xem thêm</Text>
            <IconArrowRight size={12} color="var(--brand-primary)" />
          </Group>
        </Group>

        <Box>
          {loadingProds ? (
            <SimpleGrid cols={{ base: 2, sm: 2, lg: 2 }} spacing="md">
              {Array(6).fill(0).map((_, i) => (
                <Stack key={i} gap="xs">
                  <Skeleton height={150} radius="16px" />
                  <Skeleton height={14} width="80%" radius="xl" />
                  <Skeleton height={16} width="40%" radius="xl" />
                </Stack>
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid cols={{ base: 2, sm: 2, lg: 2 }} spacing="12px">
              {todayProducts.map((product: any) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  variant="grid"
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Container>
    </Box>
  );
}
