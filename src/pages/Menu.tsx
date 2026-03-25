import React, { useState } from 'react';
import {
  Container,
  SimpleGrid,
  Card,
  Badge,
  Text,
  Group,
  Tabs,
  Title,
  Loader,
  Center,
  Stack,
  ActionIcon,
  Box,
  TextInput,
} from '@mantine/core';
import { useAppQuery } from '../hooks/useAppQuery';
import { IconSearch, IconPlus, IconMeat } from '@tabler/icons-react';
import { useUserStore } from '../store/userStore';
import { notifications } from '@mantine/notifications';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string | null>('all');
  const [search, setSearch] = useState('');
  const { addToCart } = useUserStore();

  const { data: categories = [], isLoading: loadingCats } = useAppQuery('categories', '/categories');
  const { data: products = [], isLoading: loadingProds } = useAppQuery('products', '/products', {
    categoryId: activeCategory === 'all' ? undefined : (activeCategory || undefined),
    search: search || undefined
  });

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
    <Box bg="white" mih="100vh" style={{ overflowX: 'hidden' }}>
      {/* PROFESSIONAL MENU HEADER */}
      <Box pt={20} pb={10} className="bg-white border-b border-slate-50">
        <Container size="lg">
          <Stack gap="md">
            <Box>
              <Badge variant="dot" color="blue.7" size="xs" mb={4} fw={700}>THỰC ĐƠN IUH</Badge>
              <Title order={1} size="22px" fw={900} className="tracking-tight text-slate-800 uppercase">Ăn gì hôm nay? 🍱</Title>
              <Text c="dimmed" size="xs" fw={500}>Khám phá tinh hoa ẩm thực tại Food Court.</Text>
            </Box>

            <TextInput
              placeholder="Tìm món ngon..."
              radius="xl"
              size="md"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              leftSection={<IconSearch size={16} color="#94a3b8" />}
              styles={{
                input: {
                  backgroundColor: '#f1f5f9',
                  border: '1.5px solid #e2e8f0',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderRadius: 999,
                },
                wrapper: { width: '100%' }
              }}
            />
          </Stack>
        </Container>
      </Box>

      {/* COMPACT CATEGORY NAV */}
      <Box style={{ position: 'sticky', top: 59, zIndex: 50, backgroundColor: 'white', borderBottom: '1px solid #f1f5f9', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Container size="lg">
          <Tabs
            value={activeCategory}
            onChange={setActiveCategory}
            variant="pills"
            radius="xl"
            color="blue.7"
            styles={{
              root: { overflowX: 'auto' },
              list: { gap: 6, flexWrap: 'nowrap', padding: '10px 0' },
              tab: {
                fontWeight: 800,
                fontSize: '12px',
                whiteSpace: 'nowrap',
                padding: '6px 16px',
              }
            }}
          >
            <Tabs.List>
              <Tabs.Tab value="all">Tất cả</Tabs.Tab>
              {categories.map((cat: any) => (
                <Tabs.Tab key={cat.id} value={cat.id.toString()}>
                  {cat.category_name}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Container>
      </Box>

      <Container size="lg" pb={140} px="sm">
        {loadingProds ? (
          <Center py={100}><Loader color="blue.7" size="md" variant="bars" /></Center>
        ) : (
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="sm">
            {products.map((product: any) => (
              <Card
                key={product.id}
                padding={0}
                radius="lg"
                withBorder
                style={{ borderColor: '#e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {/* Image with overflow:hidden clipping */}
                <Box style={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden', backgroundColor: '#f1f5f9', borderRadius: '12px 12px 0 0' }}>
                  <img
                    src={product.image_url || 'https://via.placeholder.com/300?text=Food'}
                    alt={product.product_name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e: any) => { e.target.src = 'https://via.placeholder.com/300?text=Food'; }}
                  />
                  {/* + button absolute top-right of card */}
                  <ActionIcon
                    variant="filled"
                    color="blue.7"
                    radius="xl"
                    size={32}
                    onClick={() => handleAddToCart(product)}
                    style={{ position: 'absolute', top: 8, right: 8, boxShadow: '0 2px 8px rgba(37,99,235,0.4)' }}
                  >
                    <IconPlus size={16} stroke={3} />
                  </ActionIcon>
                </Box>

                <Stack gap={3} p={10} style={{ flex: 1 }}>
                  <Text fw={700} size="13px" lineClamp={2} style={{ lineHeight: 1.3, color: '#1e293b' }}>
                    {product.product_name}
                  </Text>

                  {product.description && (
                    <Text size="10px" c="dimmed" lineClamp={1} fw={500}>
                      {product.description}
                    </Text>
                  )}

                  <Text fw={900} size="sm" c="blue.7" mt={2}>
                    {Number(product.price).toLocaleString()}đ
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {!loadingProds && products.length === 0 && (
          <Center py={100} className="flex-col gap-4 text-center">
            <IconMeat size={40} className="opacity-10" />
            <Text c="dimmed" fw={700} size="xs">Chưa tìm thấy món này bạn ơi.</Text>
          </Center>
        )}
      </Container>
    </Box >
  );
}
