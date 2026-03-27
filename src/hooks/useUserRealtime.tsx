import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../api/supabaseClient';
import { notifications } from '@mantine/notifications';
import { useUserStore } from '../store/userStore';
import { IconBellRinging, IconTruck, IconCircleCheck } from '@tabler/icons-react';
import { usePushSubscription } from './usePushSubscription';

const STATUS_TEXT: Record<string, string> = {
  pending: 'Đơn hàng đang chờ thanh toán.',
  confirmed: 'Đơn hàng đã được tiếp nhận!',
  paid: 'Đã thanh toán thành công. Nhà bếp đang chuẩn bị món cho bạn!',
  done: 'Món ăn đã xong! Vui lòng tới quầy nhận nhé 🍲',
  cancelled: 'Đơn hàng đã bị huỷ.'
};

const STATUS_ICON: Record<string, any> = {
  confirmed: IconCircleCheck,
  paid: IconCircleCheck,
  done: IconTruck,
  cancelled: IconCircleCheck,
};

export const useUserRealtime = () => {
  const queryClient = useQueryClient();
  const { phoneNumber } = useUserStore();
  
  // Kích hoạt nhận Web Push Notification ngay khi có SĐT
  usePushSubscription(phoneNumber);

  useEffect(() => {
    if (!phoneNumber) return;



    const playDoneSound = () => {
      let count = 0;
      const play = () => {
        if (count >= 5) return;
        try {
          const audio = new Audio('/done.wav');
          audio.play().catch(() => { });
          audio.onended = () => {
            count++;
            // Nghỉ 500ms giữa các lần lặp cho dễ nghe
            setTimeout(play, 500);
          };
          console.log(`🔔 Phát âm thanh HOÀN THÀNH Lần ${count + 1}`);
        } catch (e) { }
      };
      play();
    };

    const playBell = () => {
      try {
        const audio = new Audio('https://raw.githubusercontent.com/shixuewen/ding-sound/master/ding.mp3');
        audio.play().catch(() => { });
        // Phát tiếng thứ 2 sau 300ms để thành "Ting Ting" 🔔🔔
        setTimeout(() => {
          const audio2 = new Audio('https://raw.githubusercontent.com/shixuewen/ding-sound/master/ding.mp3');
          audio2.play().catch(() => { });
        }, 300);
      } catch (e) { }
    };

    console.log(`🔌 useUserRealtime: Kết nối cho SĐT ${phoneNumber}`);

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
          const newStatus = payload.new.order_status;
          const oldStatus = payload.old.order_status;

          if (newStatus !== oldStatus) {
            const message = STATUS_TEXT[newStatus];
            if (message) {
              // 🔔 PHÂN BIỆT ÂM THANH THEO TRẠNG THÁI
              if (newStatus === 'done') {
                playDoneSound();
              } else if (newStatus === 'cancelled') {
                playBell();
              }

              const Icon = STATUS_ICON[newStatus] || IconBellRinging;
              notifications.show({
                title: '🔔 Cập nhật đơn hàng',
                message,
                color: newStatus === 'cancelled' ? 'red' : 'blue',
                icon: <Icon size={20} />,
                autoClose: 10000,
              });
            }
            
            // 🔄 Xóa bộ đệm và tải lại danh sách đơn hàng
            queryClient.invalidateQueries({ queryKey: [`orders-${phoneNumber}`] });
            // 🔄 TẢI LẠI TRANG CHI TIẾT ĐƠN HÀNG (QUAN TRỌNG)
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
