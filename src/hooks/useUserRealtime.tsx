import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../api/supabaseClient';
import { notifications } from '@mantine/notifications';
import { useUserStore } from '../store/userStore';
import React from 'react';
import { IconBellRinging, IconChefHat, IconTruck, IconCircleCheck } from '@tabler/icons-react';

const STATUS_TEXT: Record<string, string> = {
  confirmed: 'Đơn hàng đã được nhận!',
  preparing: 'Món ăn đang được chế biến 👨‍🍳',
  done: 'Món ăn đã sẵn sàng! Vui lòng tới quầy nhận 🍲',
  paid: 'Đơn hàng đã thanh toán thành công. Cảm ơn bạn!',
  cancelled: 'Đơn hàng đã bị huỷ.'
};

const STATUS_ICON: Record<string, any> = {
  confirmed: IconCircleCheck,
  preparing: IconChefHat,
  done: IconTruck,
  paid: IconCircleCheck,
  cancelled: IconCircleCheck,
};

export const useUserRealtime = () => {
  const queryClient = useQueryClient();
  const { phoneNumber } = useUserStore();

  useEffect(() => {
    if (!phoneNumber) return;

    const channel = supabase
      .channel(`user-orders-${phoneNumber}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `customer_phone=eq.${phoneNumber}`
        },
        (payload) => {
          console.log('Update received for user order:', payload);
          
          const newStatus = payload.new.order_status;
          const oldStatus = payload.old.order_status;

          // Only notify if status actually changed
          if (newStatus !== oldStatus) {
            const message = STATUS_TEXT[newStatus];
            if (message) {
                const Icon = STATUS_ICON[newStatus] || IconBellRinging;
                notifications.show({
                    title: '🔔 Cập nhật đơn hàng',
                    message,
                    color: newStatus === 'cancelled' ? 'red' : 'blue',
                    icon: <Icon size={20} />,
                    autoClose: 10000,
                });
            }
            
            // Refetch current orders and current order detail if open
            queryClient.invalidateQueries({ queryKey: [`orders-${phoneNumber}`] });
            queryClient.invalidateQueries({ queryKey: [`order-${payload.new.id}`] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [phoneNumber, queryClient]);

  return null;
};
