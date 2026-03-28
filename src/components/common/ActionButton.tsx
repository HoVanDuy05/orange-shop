import { Button, ButtonProps, ActionIcon } from '@mantine/core';
import { IconArrowLeft, IconPlus, IconMinus, IconTrash, IconChevronRight } from '@tabler/icons-react';

interface ActionButtonProps extends ButtonProps {
  type?: 'back' | 'add' | 'remove' | 'delete' | 'next';
  onClick?: () => void;
  iconOnly?: boolean;
}

export const ActionButton = ({ type, iconOnly, children, ...props }: ActionButtonProps) => {
  const icons: Record<string, any> = {
    back: IconArrowLeft,
    add: IconPlus,
    remove: IconMinus,
    delete: IconTrash,
    next: IconChevronRight,
  };

  const Icon = type ? icons[type] : null;

  if (iconOnly && Icon) {
    return (
      <ActionIcon 
        variant="light" 
        color="brand" 
        radius="xl" 
        size="lg" 
        {...(props as any)}
      >
        <Icon size={18} stroke={3} />
      </ActionIcon>
    );
  }

  return (
    <Button
      variant="light"
      color="brand"
      radius="xl"
      fw={900}
      leftSection={Icon && !iconOnly ? <Icon size={18} stroke={3} /> : undefined}
      {...props}
    >
      {children || (type === 'back' ? 'Quay lại' : type === 'add' ? 'Thêm món' : type)}
    </Button>
  );
};
