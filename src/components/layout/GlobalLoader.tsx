import { useEffect, useState } from 'react';
import { Box, Text, Stack, Transition, Loader, Center, Group } from '@mantine/core';
import { IconToolsKitchen2, IconCoffee, IconGlassFull } from '@tabler/icons-react';

/**
 * Global Loader for Orange Cafe
 * Premium design with entry/exit animations
 */
export const GlobalLoader = () => {
  const [mounted, setMounted] = useState(true);
  const [iconIndex, setIconIndex] = useState(0);

  // Rotating food icons animation
  useEffect(() => {
    const iconTimer = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % 3);
    }, 400);

    const timer = setTimeout(() => {
      setMounted(false);
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearInterval(iconTimer);
    };
  }, []);

  const icons = [
    <IconToolsKitchen2 size={48} color="#f97316" stroke={1.5} key="kitchen" />,
    <IconCoffee size={48} color="#f97316" stroke={1.5} key="coffee" />,
    <IconGlassFull size={48} color="#f97316" stroke={1.5} key="drink" />
  ];

  return (
    <Transition mounted={mounted} transition="fade" duration={600} timingFunction="ease">
      {(styles) => (
        <Center
          style={{
            ...styles,
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'white',
          }}
        >
          <Stack align="center" gap={24}>
            {/* Animated Food Icon */}
            <Transition
              mounted={mounted}
              transition="pop"
              duration={400}
              timingFunction="ease"
            >
              {(logoStyles) => (
                <Box
                  style={{
                    ...logoStyles,
                    position: 'relative',
                    animation: 'bounce 0.6s ease infinite alternate'
                  }}
                >
                  <Box
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 40px rgba(249, 115, 22, 0.15)'
                    }}
                  >
                    {icons[iconIndex]}
                  </Box>
                </Box>
              )}
            </Transition>

            {/* Content Container */}
            <Stack gap={8} align="center">
              <Text
                fw={900}
                size="22px"
                c="orange.8"
                style={{ opacity: 0.9, letterSpacing: '1px' }}
              >
                Orange Cafe
              </Text>

              <Group gap="xs" align="center">
                <Loader color="orange" type="dots" size="sm" />
                <Text
                  size="xs"
                  fw={600}
                  c="dimmed"
                  tt="uppercase"
                  style={{ opacity: 0.6, letterSpacing: '1px' }}
                >
                  Đang khởi tạo
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Center>
      )}
    </Transition>
  );
};
