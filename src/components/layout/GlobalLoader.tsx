import { useEffect, useState } from 'react';
import { Box, Image, Text, Stack, Transition, Loader, Center, Group } from '@mantine/core';

/**
 * Global Loader for IUH Food Court
 * Premium design with entry/exit animations and IUH branding
 */
export const GlobalLoader = () => {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Elegant fade out after initialization
    const timer = setTimeout(() => {
      setMounted(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

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
          <Stack align="center" gap={30}>
            {/* Logo Container with Slide + Scale Animation */}
            <Transition 
              mounted={mounted} 
              transition="slide-up" 
              duration={800} 
              timingFunction="cubic-bezier(0.34, 1.56, 0.64, 1)"
            >
              {(logoStyles) => (
                <Box style={{ ...logoStyles, position: 'relative' }}>
                  <Image 
                    src="/logo-iuh.png" 
                    mah={60} 
                    w="auto" 
                    fit="contain"
                    style={{ 
                      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.08))',
                    }} 
                  />
                  {/* Subtle shine effect */}
                  <Box 
                    style={{ position: 'absolute', left: 0, right: 0, bottom: -32, display: 'flex', justifyContent: 'center' }}
                  >
                    <Box h={4} w={60} style={{ backgroundColor: '#2563eb', borderRadius: 2, opacity: 0.6 }} />
                  </Box>
                </Box>
              )}
            </Transition>

            {/* Content Container */}
            <Stack gap={10} align="center">
              <Text 
                fw={900} 
                size="20px" 
                c="blue.8" 
                tt="uppercase" 
                className="tracking-tight"
                style={{ opacity: 0.9, letterSpacing: '1.5px' }}
              >
                IUH Food Court
              </Text>
              
              <Group gap="xs" align="center">
                <Loader color="blue" type="dots" size="xs" />
                <Text 
                  size="xs" 
                  fw={700} 
                  c="dimmed" 
                  tt="uppercase"
                  style={{ opacity: 0.6, letterSpacing: '2px' }}
                >
                  ĐANG KHỞI TẠO HỆ THỐNG
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Center>
      )}
    </Transition>
  );
};
