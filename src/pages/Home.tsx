import {
  Container, Text, Group,
  Title, Stack, Box, Skeleton, ScrollArea,
  SimpleGrid, Paper, Badge, ActionIcon
} from '@mantine/core';
import {
  IconArrowRight, IconClock, IconDiscount, IconTrendingUp, IconMapPin, IconStar,
  IconFireExtinguisher
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAppQuery } from '../hooks/useAppQuery';
import { useBrandTheme } from '../providers/BrandThemeProvider';
import { ProductItem } from '../components/common/ProductItem';

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function Home() {
  const navigate = useNavigate();
  const { activeTheme } = useBrandTheme();

  const { data: categoriesData, isLoading: loadingCats } = useAppQuery('categories', '/categories');
  const { data: productsData, isLoading: loadingProds } = useAppQuery('products', '/products');

  const productList = Array.isArray(productsData) ? productsData : (productsData?.products || []);
  const categoryList = Array.isArray(categoriesData) ? categoriesData : [];

  // Lấy 10 sản phẩm mới nhất (theo id giảm dần)
  const latestProducts = [...productList]
    .sort((a: any, b: any) => (b.id || 0) - (a.id || 0))
    .slice(0, 10);

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
              {latestProducts.map((product: any) => (
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

      {/* ── PROMO BANNER ── */}
      <Box bg="white" py={20} px="md">
        <Container size="lg">
          <Paper
            p={16}
            radius="xl"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
              color: 'white'
            }}
          >
            <Group justify="space-between" align="center">
              <Stack gap={4}>
                <Group gap="xs">
                  <IconDiscount size={20} />
                  <Text fw={800} size="lg">Ưu đãi đặc biệt</Text>
                </Group>
                <Text size="sm" opacity={0.9}>Giảm 20% cho đơn hàng đầu tiên</Text>
              </Stack>
              <Badge size="lg" color="white" c="orange" fw={700} radius="md">
                ORANGE20
              </Badge>
            </Group>
          </Paper>
        </Container>
      </Box>

      {/* ── FLASH SALE ── */}
      <Box bg="white" py={16}>
        <Container size="lg" px="md">
          <Group justify="space-between" mb={12}>
            <Group gap="xs">
              <IconFireExtinguisher size={20} color="#ef4444" />
              <Text fw={800} size="14px" style={{ color: '#0f172a' }}>Flash Sale</Text>
              <Badge color="red" size="sm" radius="sm">
                <Group gap={4}>
                  <IconClock size={10} />
                  <Text size="xs" fw={700}>02:34:15</Text>
                </Group>
              </Badge>
            </Group>
            <Text size="11px" c="dimmed" style={{ cursor: 'pointer' }}>Xem tất cả</Text>
          </Group>

          <ScrollArea scrollbars="x" offsetScrollbars>
            <Group wrap="nowrap" gap={12}>
              {loadingProds ? (
                Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} w={140} h={180} radius="md" />
                ))
              ) : (
                latestProducts.slice(0, 5).map((p: any) => (
                  <Paper key={p.id} w={140} p={12} radius="lg" style={{ flexShrink: 0, border: '1px solid #f1f5f9' }}>
                    <Box w={116} h={100} style={{ borderRadius: 12, overflow: 'hidden', background: '#f8fafc' }}>
                      <img src={p.image_url || '/placeholder-food.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Text fw={700} size="xs" mt={8} lineClamp={1}>{p.product_name}</Text>
                    <Group gap={4} mt={4}>
                      <Text fw={800} size="sm" c="brand">{formatVND(p.price || 0)}</Text>
                      <Text size="xs" c="dimmed" td="line-through">{formatVND((p.price || 0) * 1.2)}</Text>
                    </Group>
                  </Paper>
                ))
              )}
            </Group>
          </ScrollArea>
        </Container>
      </Box>

      {/* ── NEARBY POPULAR ── */}
      <Box bg="white" py={16} mt={12}>
        <Container size="lg" px="md">
          <Group gap="xs" mb={12}>
            <IconMapPin size={18} color="#f97316" />
            <Text fw={800} size="14px" style={{ color: '#0f172a' }}>Phổ biến gần bạn</Text>
          </Group>

          <ScrollArea scrollbars="x" offsetScrollbars>
            <Group wrap="nowrap" gap={12}>
              {loadingProds ? (
                Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} w={200} h={120} radius="xl" />
                ))
              ) : (
                categoryList.slice(0, 4).map((c: any) => (
                  <Paper
                    key={c.id}
                    w={200}
                    h={120}
                    p={16}
                    radius="xl"
                    style={{
                      flexShrink: 0,
                      background: `linear-gradient(135deg, ${c.color || '#f97316'} 0%, ${c.color || '#fb923c'}55 100%),
                                  linear-gradient(135deg, #ffedd5 0%, #fff7ed 100%)`,
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate('/menu')}
                  >
                    <Stack gap={4} style={{ position: 'relative', zIndex: 1 }}>
                      <Text fw={800} size="md" c="white">{c.category_name}</Text>
                      <Group gap={4}>
                        <IconStar size={12} color="white" fill="white" />
                        <Text size="xs" c="white" fw={600}>4.{Math.floor(Math.random() * 5) + 5}</Text>
                      </Group>
                      <Text size="xs" c="white" opacity={0.9}>{Math.floor(Math.random() * 20) + 5} phút</Text>
                    </Stack>
                    {c.image_url && (
                      <img
                        src={c.image_url}
                        style={{
                          position: 'absolute',
                          right: -10,
                          bottom: -10,
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          opacity: 0.9
                        }}
                      />
                    )}
                  </Paper>
                ))
              )}
            </Group>
          </ScrollArea>
        </Container>
      </Box>

      {/* ── TRENDING ── */}
      <Box bg="white" py={16} mt={12} mb={80}>
        <Container size="lg" px="md">
          <Group gap="xs" mb={12}>
            <IconTrendingUp size={18} color="#f97316" />
            <Text fw={800} size="14px" style={{ color: '#0f172a' }}>Đang được quan tâm</Text>
          </Group>

          <SimpleGrid cols={1} spacing="xs">
            {loadingProds ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} h={60} radius="lg" />
              ))
            ) : (
              latestProducts.slice(0, 3).map((p: any, idx: number) => (
                <Paper
                  key={p.id}
                  p={12}
                  radius="lg"
                  style={{ border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <Box w={36} h={36} style={{ borderRadius: 10, background: `linear-gradient(135deg, #f97316${20 + idx * 10} 0%, #fb923c${20 + idx * 10} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text fw={900} size="md" c="white">{idx + 1}</Text>
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <Text fw={700} size="sm">{p.product_name}</Text>
                    <Text size="xs" c="dimmed">{Math.floor(Math.random() * 500) + 100} đã đặt tuần này</Text>
                  </Box>
                  <IconArrowRight size={16} color="#94a3b8" />
                </Paper>
              ))
            )}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}
