import {
  Box, Text, Group,
  TextInput, ScrollArea, Skeleton, Stack, Container
} from '@mantine/core';
import {
  IconSearch, IconToolsKitchen2
} from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppQuery } from '../hooks/useAppQuery';
import { ProductItem } from '../components/common/ProductItem';

interface CategoryCircleProps {
  imageUrl?: string;
  label: string;
  active: boolean;
  categoryId: string;
  onClick?: () => void;
}

function CategoryCircle({
  imageUrl,
  label,
  active,
  categoryId,
  onClick
}: CategoryCircleProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (categoryId !== 'all') {
      navigate(`/category/${categoryId}`);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Box
      onClick={handleClick}
      style={{
        flexShrink: 0,
        width: 64,
        cursor: 'pointer',
        textAlign: 'center'
      }}
    >
      {/* Vòng tròn ảnh */}
      <Box
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          margin: '0 auto',
          border: active ? '2.5px solid var(--brand-primary)' : '2px solid #e2e8f0',
          overflow: 'hidden',
          backgroundColor: imageUrl ? 'transparent' : (active ? 'var(--brand-primary)' : '#f1f5f9'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          boxShadow: active ? '0 0 0 3px rgba(var(--brand-primary-rgb), 0.15)' : 'none'
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Text size="16px" style={{ lineHeight: 1 }}>🍽️</Text>
        )}
      </Box>

      {/* Tên danh mục */}
      <Text
        size="10px"
        fw={active ? 800 : 600}
        mt={6}
        lineClamp={2}
        style={{
          color: active ? 'var(--brand-primary)' : '#475569',
          lineHeight: 1.3,
          wordBreak: 'break-word'
        }}
      >
        {label}
      </Text>
    </Box>
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const scrollAreaRef = useRef(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: productsData, isLoading: loadingProds } = useAppQuery(
    `products-${activeCategory}-${debouncedSearch}`,
    '/products',
    {
      categoryId: activeCategory === 'all' ? undefined : (activeCategory || undefined),
      search: debouncedSearch || undefined
    }
  );

  const { data: categoriesData, isLoading: loadingCats } = useAppQuery('categories', '/categories');

  const allProducts = Array.isArray(productsData) ? productsData : (productsData?.products || []);
  const categoryList = Array.isArray(categoriesData) ? categoriesData : [];

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  return (
    <Box bg="#f5f5f5" mih="100vh" pb={100}>
      {/* CATEGORY CIRCLES — GrabFood style */}
      <Box
        bg="white"
        py={12}
        style={{
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <Container size="lg" px="md">
          <Group justify="space-between" mb={12} px={4}>
            <Text fw={800} size="13px" style={{ color: '#0f172a' }}>DANH MỤC</Text>
            <Text size="11px" c="dimmed" fw={600}>Tất cả</Text>
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
                  <CategoryCircle
                    key={c.id}
                    categoryId={String(c.id)}
                    label={c.category_name}
                    imageUrl={c.image_url}
                    active={activeCategory === String(c.id)}
                    onClick={() => setActiveCategory(String(c.id))}
                  />
                ))
              )}
            </Group>
          </ScrollArea>
        </Container>
      </Box>

      {/* SEARCH BAR */}
      <Box
        pt={12}
        pb={12}
        px={16}
        bg="white"
        style={{
          borderBottom: '1px solid #f1f5f9',
          position: 'sticky',
          top: 60, // Header height
          zIndex: 100
        }}
      >
        <Box style={{
          borderRadius: 12,
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0'
        }} px={14} py={8}>
          <Group gap="xs" wrap="nowrap">
            <IconSearch size={16} color="#64748b" />
            <TextInput
              placeholder="Tìm kiếm món ăn..."
              size="sm"
              variant="unstyled"
              style={{ flex: 1 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              styles={{
                input: {
                  fontSize: 13,
                  fontWeight: 500,
                  background: 'transparent',
                  color: '#475569',
                  placeholder: { color: '#94a3b8' }
                }
              }}
            />
          </Group>
        </Box>
      </Box>

      {/* PRODUCT LIST */}
      <Box mt={8}>
        <ScrollArea
          ref={scrollAreaRef}
          h="calc(100vh - 250px)"
        >
          <Container size="full" px={0}>
            <Stack gap={0} mt={4}>
              {loadingProds ? (
                Array(5).fill(0).map((_, i) => (
                  <Box key={i} bg="white" px={16} py={14} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Group gap={14} wrap="nowrap">
                      <Skeleton width={88} height={88} radius={12} style={{ flexShrink: 0 }} />
                      <Stack gap={8} style={{ flex: 1 }}>
                        <Skeleton height={14} width="80%" radius="sm" />
                        <Skeleton height={12} width="50%" radius="sm" />
                        <Skeleton height={16} width="30%" radius="sm" />
                      </Stack>
                    </Group>
                  </Box>
                ))
              ) : allProducts.length > 0 ? (
                allProducts.map((product: any) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    variant="list"
                  />
                ))
              ) : (
                !loadingProds && (
                  <Box py={50} ta="center">
                    <IconToolsKitchen2 size={48} color="#cbd5e1" />
                    <Text fw={600} c="dimmed" mt={12}>Không tìm thấy sản phẩm nào</Text>
                    <Text size="sm" c="dimmed" mt={4}>Thử tìm kiếm với từ khóa khác</Text>
                  </Box>
                )
              )}
            </Stack>
          </Container>
        </ScrollArea>
      </Box>
    </Box>
  );
}
