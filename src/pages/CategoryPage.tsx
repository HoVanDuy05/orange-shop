import {
  Box, Text, Group, Stack, Container, Skeleton, Title, ActionIcon
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppQuery } from '../hooks/useAppQuery';
import { ProductItem } from '../components/common/ProductItem';

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoryId = parseInt(id || '0');

  const { data: categoryData } = useAppQuery(`category-${id}`, `/categories/${id}`);
  const { data: productsData, isLoading } = useAppQuery(
    `category-products-${id}`,
    '/products',
    { categoryId: categoryId }
  );

  const category = categoryData;
  const products = Array.isArray(productsData) ? productsData :
    productsData?.products || [];

  return (
    <Box bg="#fafafa" mih="100vh" pb={100}>
      {/* Header */}
      <Box bg="white" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #f0f0f0' }}>
        <Container size="sm" py={16}>
          <Group>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => navigate('/menu')}
              radius="xl"
              size="lg"
            >
              <IconArrowLeft size={24} />
            </ActionIcon>
            <Title order={3} size="h5" fw={600}>
              {category?.category_name || 'Danh mục'}
            </Title>
          </Group>
        </Container>
      </Box>

      <Container size="sm" py={24} px="md">
        <Stack gap="lg">
          {/* Category Info */}
          {category && (
            <Box
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                borderRadius: 16,
                padding: 24,
                color: 'white'
              }}
            >
              <Group gap="md">
                {category.image_url && (
                  <img
                    src={category.image_url}
                    alt={category.category_name}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      objectFit: 'cover'
                    }}
                  />
                )}
                <Stack gap={4}>
                  <Text fw={700} size="lg">{category.category_name}</Text>
                  <Text size="sm" opacity={0.9}>
                    {products.length} sản phẩm
                  </Text>
                </Stack>
              </Group>
            </Box>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <Group gap="md">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height={200} radius="md" style={{ flex: '1 1 calc(50% - 8px)' }} />
              ))}
            </Group>
          ) : products.length === 0 ? (
            <Box py={60} style={{ textAlign: 'center' }}>
              <Text c="dimmed" size="lg" fw={500}>Không có sản phẩm nào</Text>
              <Text c="dimmed" size="sm" mt={4}>Danh mục này chưa có sản phẩm</Text>
            </Box>
          ) : (
            <Group gap="md" align="flex-start">
              {products.map((product: any) => (
                <Box key={product.id} style={{ flex: '1 1 calc(50% - 8px)', minWidth: 0 }}>
                  <ProductItem product={product} />
                </Box>
              ))}
            </Group>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
