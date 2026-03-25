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
  Image,
} from '@mantine/core';
import {
  IconChevronRight,
  IconStar,
  IconTruck,
  IconShieldCheck,
  IconTrendingUp,
  IconClock
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* MODERN HERO SECTION */}
      <Box className="relative overflow-hidden bg-white pt-10 sm:pt-12 md:pt-10 pb-20 sm:pb-24 md:pb-20">
        <Box
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] -mr-[200px] -mt-[200px]"
        />
        <Box
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[100px] -ml-[100px] -mb-[100px]"
        />

        <Container size="lg" className="relative z-10 px-4 sm:px-6">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" verticalSpacing="lg">
            <Stack gap="xl">
              <Box>
                <Badge
                  variant="gradient"
                  gradient={{ from: 'blue.7', to: 'indigo.7' }}
                  className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 h-8 sm:h-10 md:h-10 fw-900 shadow-lg shadow-blue-500/20"
                >
                  IUH FOOD COURT 2024
                </Badge>
              </Box>

              <Title order={1} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl fw-900 tracking-tighter text-slate-900 leading-[1.05]">
                Thực phẩm <br />
                <Text component="span" variant="gradient" gradient={{ from: 'blue.7', to: 'indigo.8' }} inherit className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  sạch cho sinh viên
                </Text>
              </Title>

              <Text className="text-base sm:text-lg md:text-xl text-slate-600 fw-600 max-w-md leading-relaxed">
                Hệ thống đặt món trực tuyến thông minh giúp sinh viên IUH tiết kiệm thời gian và đảm bảo sức khỏe mỗi ngày.
              </Text>

              <Group gap="xl" mt="md">
                <Button
                  className="text-base sm:text-lg md:text-xl font-black shadow-2xl shadow-blue-500/30 transition-standard hover:-translate-y-1 active:scale-95 h-14 sm:h-16 md:h-16 px-6 sm:px-8 md:px-10"
                  variant="filled"
                  color="blue.7"
                  radius="xl"
                  onClick={() => navigate('/menu')}
                  rightSection={<IconChevronRight size={22} />}
                >
                  Đặt món ngay
                </Button>

                {/* Removed student stats group */}
              </Group>
            </Stack>

            <Box className="relative">
              <Box className="absolute inset-0 bg-blue-600 rounded-full blur-[80px] opacity-20 transform scale-90 translate-y-10" />
              <Paper
                radius="xl"
                className="overflow-hidden shadow-premium-xl border-4 sm:border-8 md:border-[12px] border-white relative z-10 aspect-[4/5] max-w-xs sm:max-w-sm md:max-w-md mx-auto"
              >
                <Image
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000"
                  alt="Healthy Food"
                  className="w-full h-full object-cover"
                />
                <Box className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6">
                  <Paper p="md" radius="lg" className="glass shadow-2xl">
                    <Group justify="space-between">
                      <Box>
                        <Text fw={800} size="sm" c="blue.8">Salad Ức Gà</Text>
                        <Text c="dimmed" size="xs" fw={700}>Best Seller tháng này</Text>
                      </Box>
                      <Badge color="green" variant="light" size="md" radius="md">35.000đ</Badge>
                    </Group>
                  </Paper>
                </Box>
              </Paper>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* STATS SECTION */}
      <Container size="lg" py={60}>
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing={30}>
          {[
            { icon: IconTrendingUp, label: 'Đơn hàng', val: '12k+', color: 'blue' },
            { icon: IconClock, label: 'Phục vụ', val: '5min', color: 'orange' },
            { icon: IconStar, label: 'Đánh giá', val: '4.9/5', color: 'yellow' },
            { icon: IconTruck, label: 'Đối tác', val: '20+', color: 'green' },
          ].map((stat, i) => (
            <Paper key={i} p="xl" radius="25px" withBorder className="text-center group hover:border-blue-200 transition-standard">
              <ThemeIcon size={50} radius="xl" color={stat.color} variant="light" mb="md" className="mx-auto group-hover:scale-110 transition-standard">
                <stat.icon size={26} />
              </ThemeIcon>
              <Title order={3} fw={900} size={24}>{stat.val}</Title>
              <Text c="dimmed" size="xs" fw={700} tt="uppercase" lts="1px" mt={4}>{stat.label}</Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>

      {/* FEATURES SECTION */}
      <Box bg="slate.0" py={100}>
        <Container size="lg">
          <Stack gap={60}>
            <Box className="text-center max-w-2xl mx-auto">
              <Badge variant="light" color="blue" size="xl" radius="md" mb="md">TỔNG QUAN DỊCH VỤ</Badge>
              <Title order={2} size={36} fw={900} className="tracking-tight leading-tight">Tại sao nên chọn IUH Food Court?</Title>
            </Box>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={40}>
              {[
                {
                  icon: IconTruck,
                  title: 'Phục vụ nhanh',
                  desc: 'Món ăn được chuẩn bị và phục vụ ngay sau khi bạn đặt đơn qua hệ thống.',
                  color: 'blue'
                },
                {
                  icon: IconShieldCheck,
                  title: 'An toàn vệ sinh',
                  desc: 'Nguyên liệu được kiểm duyệt 100% từ nhà cung cấp uy tín, đảm bảo an toàn thực phẩm.',
                  color: 'green'
                },
                {
                  icon: IconStar,
                  title: 'Giá cả ưu đãi',
                  desc: 'Mức giá dành riêng cho sinh viên với nhiều combo tiết kiệm và thẻ tích điểm.',
                  color: 'orange'
                },
              ].map((feat, i) => (
                <Paper key={i} p={40} radius="30px" withBorder className="border-slate-100 hover:shadow-2xl transition-standard group bg-white">
                  <ThemeIcon size={64} radius="20px" color={feat.color} variant="light" mb="xl">
                    <feat.icon size={32} />
                  </ThemeIcon>
                  <Title order={3} fw={900} size={22} mb="md">{feat.title}</Title>
                  <Text size="md" c="slate.6" fw={500} className="leading-relaxed">{feat.desc}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* PREMIUM CTA SECTION */}
      <Container size="lg" pt={100} pb={140}>
        <Paper
          radius={40}
          p={60}
          className="relative overflow-hidden shadow-2xl shadow-blue-500/20 bg-[#00458e] border border-blue-400/20"
        >
          <Box className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] -mr-40 -mt-20" />
          <Box className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[50px] -ml-20 -mb-20" />

          <Stack align="center" gap={40} className="relative z-10 text-center">
            <Box>
              <Title order={2} size={42} fw={900} c="white" className="tracking-tight leading-tight">
                Tải nghiệm đặt món <br />
                <Text component="span" c="blue.1" inherit>thế hệ mới</Text> ngay?
              </Title>
              <Text size="xl" c="blue.0" opacity={0.8} fw={600} mt="lg" className="max-w-xl mx-auto">
                Tham gia cùng 5,000+ sinh viên đang tận hưởng dịch vụ tiện lợi nhất tại trường đại học của chúng ta.
              </Text>
            </Box>
            <Button
              size="xl"
              radius="xl"
              h={75}
              px={60}
              variant="white"
              color="blue.8"
              fw={900}
              className="shadow-2xl shadow-black/20 text-lg md:text-xl font-black hover:-translate-y-1 transition-standard hover:scale-105"
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
