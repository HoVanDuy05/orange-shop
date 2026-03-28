import { Title, TitleProps, Group, Image, Box, Text, UnstyledButton } from '@mantine/core';
import { useBrandTheme } from '../../providers/BrandThemeProvider';
import { useNavigate } from 'react-router-dom';

interface AppTitleProps extends TitleProps {
  showLogo?: boolean;
}

export const AppTitle = ({ showLogo = true, children, ...props }: AppTitleProps) => {
  const { activeTheme } = useBrandTheme();
  const navigate = useNavigate();

  if (showLogo) {
    return (
      <UnstyledButton onClick={() => navigate('/')}>
        <Group gap="xs" align="center">
          <Box p={6}>
            <Image
              src={activeTheme?.logo_url || '/logo-iuh.png'}
              h={44} w="auto" fit="contain"
            />
          </Box>
          <Box>
            <Title
              order={props.order || 1}
              fw={props.fw || 1000}
              size={props.size || 14}
              className="tracking-tighter"
              lineClamp={1}
              {...props}
            >
              {children || activeTheme?.brand_name || 'Orange Catering'}
            </Title>
            <Text size="10px" fw={900} c="brand" tt="uppercase" className="tracking-widest" mt={0}>
              Catering Services
            </Text>
          </Box>
        </Group>
      </UnstyledButton>
    );
  }

  return (
    <UnstyledButton onClick={() => navigate('/')}>
      <Title
        order={props.order || 1}
        fw={props.fw || 900}
        className="tracking-tight"
        {...props}
      >
        {children}
      </Title>
    </UnstyledButton>
  );
};
