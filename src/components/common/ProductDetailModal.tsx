import { useState } from 'react';
import {
  Box, Text, Stack, Group, ActionIcon,
  Button, Textarea,
  Divider
} from '@mantine/core';
import { IconMinus, IconPlus, IconX, IconShare } from '@tabler/icons-react';
import { useUserStore } from '../../store/userStore';

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN').format(n) + 'đ';

interface ProductDetailModalProps {
  product: {
    id: number;
    product_name: string;
    price: number;
    image_url?: string;
    description?: string;
    category_name?: string;
  } | null;
  opened: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, opened, onClose }: ProductDetailModalProps) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useUserStore();

  if (!product || !opened) return null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        quantity: 1
      });
    }
    setQty(1);
    onClose();
  };

  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden'
      }}
    >
      {/* ── 1. FIXED IMAGE ── */}
      <Box style={{ position: 'relative', flexShrink: 0 }}>
        <Box style={{ width: '100%', paddingBottom: '75%', position: 'relative', overflow: 'hidden' }}>
          <img
            src={product.image_url || '/placeholder-food.png'}
            alt={product.product_name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block'
            }}
          />
        </Box>

        <ActionIcon
          onClick={onClose}
          size={32} radius="xl" variant="white"
          style={{ position: 'absolute', top: 12, left: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        >
          <IconX size={16} />
        </ActionIcon>

        <ActionIcon
          size={32} radius="xl" variant="white"
          style={{ position: 'absolute', top: 12, right: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        >
          <IconShare size={14} />
        </ActionIcon>
      </Box>

      {/* ── 2. SCROLLABLE CONTENT ── */}
      <Box style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fff' }}>
        <Box px={16} pt={16}>
          <Stack gap={12}>
            <Group justify="space-between" align="flex-start" wrap="nowrap" gap={12}>
              <Text
                fw={700}
                size="md"
                lineClamp={2}
                style={{ color: '#0f172a', lineHeight: 1.4, flex: 1 }}
              >
                {product.product_name}
              </Text>
              <Text
                fw={700}
                size="md"
                style={{ color: '#0f172a', flexShrink: 0 }}
              >
                {formatVND(Number(product.price))}
              </Text>
            </Group>

            <Divider />

            <Stack gap={6}>
              <Text fw={700} size="sm" c="gray.8">Mô tả sản phẩm</Text>
              <Text size="13px" c="dimmed" style={{ lineHeight: 1.6 }}>
                {product.description || 'Chưa có mô tả cho sản phẩm này.'}
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* ── 3. FIXED BOTTOM BAR ── */}
      <Box
        px={16}
        pb={24}
        pt={12}
        bg="white"
        style={{
          flexShrink: 0,
          borderTop: '1px solid #f1f5f9',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
        }}
      >
        <Group gap="md" wrap="nowrap">
          {/* Smaller Quantity Selector */}
          <Group gap={8} style={{ flexShrink: 0 }}>
            <ActionIcon
              variant="outline" color="gray" radius="xl" size={28}
              onClick={() => setQty(q => Math.max(1, q - 1))}
              disabled={qty <= 1}
              style={{ borderColor: '#e2e8f0' }}
            >
              <IconMinus size={10} />
            </ActionIcon>

            <Text fw={700} size="sm" w={20} ta="center">{qty}</Text>

            <ActionIcon
              variant="filled" color="brand" radius="xl" size={28}
              onClick={() => setQty(q => q + 1)}
            >
              <IconPlus size={10} />
            </ActionIcon>
          </Group>

          {/* Smaller Add Button */}
          <Button
            radius="xl"
            color="brand"
            h={44}
            fw={700}
            size="sm"
            style={{ flex: 1 }}
            onClick={handleAdd}
          >
            Thêm vào giỏ · {formatVND(Number(product.price) * qty)}
          </Button>
        </Group>
      </Box>
    </Box>
  );
}