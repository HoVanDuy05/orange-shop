import { useState } from 'react';
import { Box, Text, Stack, ActionIcon, Group, Badge } from '@mantine/core';
import { IconPlus, IconShoppingCartPlus } from '@tabler/icons-react';
import { useUserStore } from '../../store/userStore';
import { ProductDetailModal } from './ProductDetailModal';

export interface ProductItemData {
  id: number;
  product_name: string;
  price: number;
  image_url?: string;
  description?: string;
  category_name?: string;
}

export interface ProductItemProps {
  product: ProductItemData;
  /** 'list' = hàng ngang (GrabFood style) | 'grid' = lưới vuông */
  variant?: 'list' | 'grid';
}

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export function ProductItem({ product, variant = 'list' }: ProductItemProps) {
  const { cart, addToCart } = useUserStore();
  const [detailOpen, setDetailOpen] = useState(false);

  const cartItem = cart.find(i => i.id === product.id);
  const qtyInCart = cartItem?.quantity || 0;

  const handleAddDirect = (e: React.MouseEvent) => {
    e.stopPropagation(); // Không mở modal khi bấm nút +
    addToCart({
      id: product.id,
      quantity: 1
    });
  };

  // ── GRID variant ─────────────────────────────────────────────
  if (variant === 'grid') {
    return (
      <>
        <Box
          bg="white"
          onClick={() => setDetailOpen(true)}
          style={{
            maxWidth: 200,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            cursor: 'pointer'
          }}
        >
          {/* Ảnh vuông 1:1 */}
          <Box style={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden' }}>
            <img
              src={product.image_url || '/placeholder-food.png'}
              alt={product.product_name}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block'
              }}
            />
            <ActionIcon
              variant="filled" color="brand" radius="xl" size={26}
              onClick={handleAddDirect}
              style={{
                position: 'absolute', top: 8, right: 8, zIndex: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              {qtyInCart > 0 ? (
                <Text size="10px" fw={800} c="white">x{qtyInCart}</Text>
              ) : (
                <IconPlus size={14} stroke={3} />
              )}
            </ActionIcon>
          </Box>

          <Stack gap={2} p={8} pt={6}>
            <Text fw={600} size="xs" lineClamp={2} style={{ color: '#1e293b', lineHeight: 1.3 }}>
              {product.product_name}
            </Text>
            {product.description && (
              <Text size="10px" c="dimmed" fs="italic" lineClamp={1}>
                {product.description}
              </Text>
            )}
            <Group justify="space-between" align="center" mt={2}>
              <Text fw={800} size="xs" style={{ color: '#0f172a' }}>
                {formatVND(Number(product.price))}
              </Text>
              {qtyInCart > 0 && (
                <Badge size="xs" variant="light" color="brand">
                  {qtyInCart}
                </Badge>
              )}
            </Group>
          </Stack>
        </Box >

        <ProductDetailModal
          product={product}
          opened={detailOpen}
          onClose={() => setDetailOpen(false)}
        />
      </>
    );
  }

  // ── LIST variant (GrabFood horizontal) ───────────────────────
  return (
    <>
      <Box
        bg="white"
        px={16}
        py={14}
        onClick={() => setDetailOpen(true)}
        style={{
          borderBottom: '1px solid #f1f5f9',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        className="active:bg-slate-50"
      >
        <Group align="center" wrap="nowrap" gap={14}>
          {/* Ảnh vuông trái */}
          <Box
            style={{
              position: 'relative',
              width: 88,
              height: 88,
              flexShrink: 0,
              borderRadius: 12,
              overflow: 'hidden',
              backgroundColor: '#f8fafc'
            }}
          >
            <img
              src={product.image_url || '/placeholder-food.png'}
              alt={product.product_name}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block'
              }}
            />
          </Box>

          {/* Thông tin phải */}
          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            <Text fw={700} size="sm" lineClamp={2} style={{ color: '#0f172a', lineHeight: 1.4 }}>
              {product.product_name}
            </Text>

            {product.category_name && (
              <Badge variant="light" color="brand" size="xs" radius="sm" fw={700} w="fit-content">
                {product.category_name}
              </Badge>
            )}

            {product.description && (
              <Text size="11px" c="dimmed" lineClamp={1}>
                {product.description}
              </Text>
            )}

            <Group justify="space-between" align="center" mt={2}>
              <Text fw={900} size="md" c="brand">
                {formatVND(Number(product.price))}
              </Text>

              <ActionIcon
                variant="filled" color="brand" radius="xl" size={28}
                onClick={handleAddDirect}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)', flexShrink: 0 }}
              >
                {qtyInCart > 0 ? (
                  <Text size="10px" fw={800} c="white">x{qtyInCart}</Text>
                ) : (
                  <IconShoppingCartPlus size={16} stroke={2} />
                )}
              </ActionIcon>
            </Group>
          </Stack>
        </Group>
      </Box>

      <ProductDetailModal
        product={product}
        opened={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
