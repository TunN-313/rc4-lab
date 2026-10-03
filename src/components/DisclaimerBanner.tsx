import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside aria-label="Khuyến cáo an toàn mật mã học" className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200 text-xs sm:text-sm px-4 py-2.5 flex items-center justify-center gap-2.5 backdrop-blur-sm sticky top-0 z-50">
      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
      <div className="leading-snug text-center">
        <strong className="text-amber-300 font-semibold uppercase tracking-wider text-[11px] sm:text-xs mr-1">
          Cảnh Báo An Toàn:
        </strong>
        Hệ thống này chỉ phục vụ mục đích học tập, nghiên cứu và diễn giải trực quan mật mã học. Thuật toán RC4 đã lỗi thời, bị IETF cấm theo chuẩn RFC 7465 và chứa nhiều lỗ hổng toán học. Tuyệt đối <strong>không sử dụng RC4</strong> để mã hóa dữ liệu thực tế!
      </div>
    </aside>
  );
};
