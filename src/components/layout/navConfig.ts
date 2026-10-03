import React from 'react';
import {
  BookOpen,
  Radio,
  Binary,
  Calculator,
  Cpu,
  KeyRound,
  Zap,
  Download,
  FlaskConical,
  HelpCircle,
  Layers,
  Palette,
  FileCheck,
  Code2,
  History,
  GraduationCap,
  Wrench,
  FolderGit2,
  LucideIcon,
} from 'lucide-react';

export type NavGroup =
  | 'home_group'
  | 'learn_group'
  | 'tools_group'
  | 'experiments_group'
  | 'project_group';

export type NavTab =
  | 'home'
  | 'apps'
  | 'analysis'
  | 'hand_calculation'
  | 'visualizer'
  | 'cipher'
  | 'benchmark'
  | 'download'
  | 'experiments'
  | 'quiz'
  | 'architecture'
  | 'ux_design'
  | 'testing'
  | 'opensource'
  | 'history';

export interface NavPageItem {
  id: NavTab;
  label: string;
  shortDesc: string;
  icon: LucideIcon;
  groupId: NavGroup;
  badge?: string;
}

export interface NavGroupConfig {
  id: NavGroup;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  description: string;
  defaultPage: NavTab;
  pageIds: NavTab[];
}

export const NAV_GROUPS: Record<NavGroup, NavGroupConfig> = {
  home_group: {
    id: 'home_group',
    label: 'Trang Chủ',
    shortLabel: 'Trang chủ',
    icon: BookOpen,
    description: 'Tổng quan mã hóa dòng RC4 và lịch sử bảo mật',
    defaultPage: 'home',
    pageIds: ['home', 'apps'],
  },
  learn_group: {
    id: 'learn_group',
    label: 'Học Tập & Mô Phỏng',
    shortLabel: 'Học',
    icon: GraduationCap,
    description: 'Lý thuyết toán học, ví dụ tính tay và mô phỏng trực quan',
    defaultPage: 'visualizer',
    pageIds: ['analysis', 'visualizer', 'hand_calculation'],
  },
  tools_group: {
    id: 'tools_group',
    label: 'Bộ Công Cụ',
    shortLabel: 'Công cụ',
    icon: Wrench,
    description: 'Mã hóa/giải mã, đo kiểm hiệu năng và công cụ CLI',
    defaultPage: 'cipher',
    pageIds: ['cipher', 'benchmark', 'download'],
  },
  experiments_group: {
    id: 'experiments_group',
    label: 'Thực Nghiệm & Đánh Giá',
    shortLabel: 'Thực nghiệm',
    icon: FlaskConical,
    description: 'Thí nghiệm thiên vị, tấn công tái sử dụng khóa và trắc nghiệm',
    defaultPage: 'experiments',
    pageIds: ['experiments', 'quiz'],
  },
  project_group: {
    id: 'project_group',
    label: 'Dự Án & Kiểm Thử',
    shortLabel: 'Dự án',
    icon: FolderGit2,
    description: 'Kiến trúc hệ thống, thiết kế UX/UI, bộ ca kiểm thử và mã nguồn',
    defaultPage: 'testing',
    pageIds: ['architecture', 'ux_design', 'testing', 'opensource'],
  },
};

export const NAV_PAGES: Record<NavTab, NavPageItem> = {
  // Nhóm 1: Trang chủ
  home: {
    id: 'home',
    label: 'Giới Thiệu Tổng Quan',
    shortDesc: 'Khái niệm mã hóa dòng, lịch sử Ron Rivest 1987 và cấu trúc RC4',
    icon: BookOpen,
    groupId: 'home_group',
  },
  apps: {
    id: 'apps',
    label: 'Ứng Dụng Thực Tế',
    shortDesc: 'Lịch sử ứng dụng trong WEP, SSL/TLS và dòng thời gian khai tử',
    icon: Radio,
    groupId: 'home_group',
  },

  // Nhóm 2: Học tập
  analysis: {
    id: 'analysis',
    label: 'Phân Tích KSA & PRGA',
    shortDesc: 'Giải phẫu toán học KSA, PRGA, XOR và 4 điểm yếu kinh điển',
    icon: Binary,
    groupId: 'learn_group',
  },
  hand_calculation: {
    id: 'hand_calculation',
    label: 'Ví Dụ Tính Tay TinyRC4',
    shortDesc: 'Từng bước tính tay ví dụ bài giảng N=8, K=[2,1,3], P=[1,0,6]',
    icon: Calculator,
    groupId: 'learn_group',
    badge: 'Bài giảng',
  },
  visualizer: {
    id: 'visualizer',
    label: 'Mô Phỏng Mảng S',
    shortDesc: 'Mô phỏng hoạt họa từng bước hoán vị mảng S (16x16 & 1 hàng)',
    icon: Cpu,
    groupId: 'learn_group',
    badge: 'Trực quan',
  },

  // Nhóm 3: Công cụ
  cipher: {
    id: 'cipher',
    label: 'Mã Hóa & Giải Mã',
    shortDesc: 'Công cụ mật mã hóa trực tiếp dữ liệu văn bản, chuỗi Hex và tập tin',
    icon: KeyRound,
    groupId: 'tools_group',
  },
  benchmark: {
    id: 'benchmark',
    label: 'Đo Hiệu Năng',
    shortDesc: 'Đo đạc tốc độ xử lý (MB/s) trên 5 khối dữ liệu và đối chứng AES-GCM',
    icon: Zap,
    groupId: 'tools_group',
    badge: 'Hiệu năng',
  },
  download: {
    id: 'download',
    label: 'Tải Về & Python CLI',
    shortDesc: 'Tải về script Python độc lập public/rc4_cli.py và cài đặt PWA',
    icon: Download,
    groupId: 'tools_group',
    badge: 'CLI',
  },

  // Nhóm 4: Thực nghiệm
  experiments: {
    id: 'experiments',
    label: 'Phòng Thí Nghiệm',
    shortDesc: 'Thí nghiệm thiên vị Mantin-Shamir, Key reuse, RC4-drop, Avalanche',
    icon: FlaskConical,
    groupId: 'experiments_group',
    badge: 'Thực nghiệm',
  },
  quiz: {
    id: 'quiz',
    label: 'Trắc Nghiệm Kiến Thức',
    shortDesc: 'Bộ câu hỏi trắc nghiệm mật mã học kèm lời giải thích toán học',
    icon: HelpCircle,
    groupId: 'experiments_group',
    badge: 'Trắc nghiệm',
  },

  // Nhóm 5: Dự án
  architecture: {
    id: 'architecture',
    label: 'Kiến Trúc Kỹ Thuật',
    shortDesc: 'Sơ đồ hệ thống, luồng dữ liệu, bảo mật và thiết kế PWA',
    icon: Layers,
    groupId: 'project_group',
  },
  ux_design: {
    id: 'ux_design',
    label: 'Thiết Kế UX/UI',
    shortDesc: 'Personas, User Flow, Wireframe và hệ thống Design Tokens Cyber',
    icon: Palette,
    groupId: 'project_group',
  },
  testing: {
    id: 'testing',
    label: 'Kiểm Thử Tự Động',
    shortDesc: 'Bộ ca kiểm thử tự động (RFC 6229, Wikipedia, TinyRC4, Round-trip)',
    icon: FileCheck,
    groupId: 'project_group',
    badge: 'Kiểm thử',
  },
  opensource: {
    id: 'opensource',
    label: 'Mã Nguồn Mở',
    shortDesc: 'Giấy phép MIT, danh mục thư viện bên thứ ba và cam kết học thuật',
    icon: Code2,
    groupId: 'project_group',
    badge: 'MIT',
  },

  // Menu phụ: Tài khoản
  history: {
    id: 'history',
    label: 'Lịch Sử Cá Nhân',
    shortDesc: 'Nhật ký các lần chạy mã hóa, thực nghiệm và điểm thi trắc nghiệm',
    icon: History,
    groupId: 'home_group', // fallback group for history
    badge: 'Cá nhân',
  },
};

/**
 * Tìm nhóm chính chứa trang được chỉ định
 */
export function getGroupForPage(page: NavTab): NavGroup {
  return NAV_PAGES[page]?.groupId || 'home_group';
}

/**
 * Lấy danh sách các trang con thuộc một nhóm chính
 */
export function getPagesForGroup(group: NavGroup): NavPageItem[] {
  const groupConfig = NAV_GROUPS[group];
  if (!groupConfig) return [];
  return groupConfig.pageIds.map((id) => NAV_PAGES[id]).filter(Boolean);
}

/**
 * Danh sách toàn bộ 15 trang của ứng dụng để kiểm tra tính toàn vẹn
 */
export const ALL_PAGE_KEYS: NavTab[] = [
  'home',
  'apps',
  'analysis',
  'hand_calculation',
  'visualizer',
  'cipher',
  'benchmark',
  'download',
  'experiments',
  'quiz',
  'architecture',
  'ux_design',
  'testing',
  'opensource',
  'history',
];

export interface ContextSection {
  heading: string;
  content: string | React.ReactNode;
}

export interface ContextPanelData {
  title: string;
  subtitle: string;
  badge?: string;
  sections: ContextSection[];
  tips?: string[];
}

/**
 * Bảng thông tin ngữ cảnh cho Right Sidebar tương ứng với từng trang
 */
export const CONTEXT_PANEL_DATA: Record<NavTab, ContextPanelData> = {
  home: {
    title: 'Tổng Quan Mã Hóa Dòng',
    subtitle: 'Khái niệm & Bản chất toán học',
    badge: 'Cơ bản',
    sections: [
      {
        heading: 'Mã hóa dòng vs Mã hóa khối',
        content:
          'RC4 là thuật toán mã hóa dòng (Stream Cipher): xử lý dữ liệu từng byte/từ mã liên tục thông qua dòng khóa giả ngẫu nhiên (Keystream), khác với mã hóa khối (AES/DES) gom dữ liệu thành các khối cố định (128/64-bit).',
      },
      {
        heading: 'Lịch sử Ron Rivest 1987',
        content:
          'Được thiết kế năm 1987 bởi Ron Rivest cho RSA Data Security. Ban đầu là bí mật thương mại, mã nguồn bị rò rỉ ẩn danh lên diễn đàn Cypherpunks năm 1994 (nguồn gốc tên gọi ARCFOUR).',
      },
      {
        heading: 'Cấu trúc 3 giai đoạn',
        content:
          'Khóa đầu vào (1-256 byte) → KSA (xáo trộn mảng hoán vị S) → PRGA (sinh dòng khóa k) → XOR với bản rõ để tạo bản mã.',
      },
    ],
    tips: [
      'RC4 có tính chất đối xứng hoàn toàn: thuật toán mã hóa và giải mã giống hệt nhau nhờ phép XOR.',
    ],
  },
  apps: {
    title: 'Ứng Dụng Thực Tế',
    subtitle: 'WEP, TLS và chuẩn thay thế',
    badge: 'Bảo mật',
    sections: [
      {
        heading: 'Lỗ hổng WEP (802.11b)',
        content:
          'Giao thức WEP sử dụng IV 24-bit quá ngắn và nối trực tiếp IV với khóa bí mật (IV + Key), dẫn đến các đòn tấn công FMS và Fluhrer-Mantin-Shamir khôi phục khóa trong vài phút.',
      },
      {
        heading: 'Lệnh cấm RFC 7465',
        content:
          'Năm 2015, IETF ban hành RFC 7465 cấm hoàn toàn RC4 trong tất cả các phiên bản TLS/SSL do các cuộc tấn công thiên vị dòng khóa (Bar Mitzvah, RC4 NOMORE).',
      },
      {
        heading: 'Thuật toán thay thế hiện đại',
        content:
          'Các chuẩn mã hóa dòng AEAD an toàn được khuyến nghị thay thế: ChaCha20-Poly1305 (RFC 8439) và AES-GCM (NIST SP 800-38D).',
      },
    ],
    tips: [
      'Không bao giờ sử dụng RC4 cho các hệ thống phần mềm hoặc truyền thông dữ liệu thực tế.',
    ],
  },
  analysis: {
    title: 'Toán Học KSA & PRGA',
    subtitle: 'Giải phẫu thuật toán RC4',
    badge: 'Toán học',
    sections: [
      {
        heading: 'Mảng hoán vị S không phải S-Box',
        content:
          'RC4 sử dụng mảng trạng thái hoán vị động S gồm N phần tử (mặc định 256 bytes), liên tục thay đổi vị trí qua từng bước. RC4 hoàn toàn không có bảng thế phi tuyến tĩnh (S-Box) như trong AES hay DES.',
      },
      {
        heading: 'Công thức vòng lặp KSA',
        content:
          'Khởi tạo S[i] = i. Sau đó: j = (j + S[i] + K[i mod keylen]) mod N; hoán đổi S[i] ↔ S[j] qua N vòng lặp.',
      },
      {
        heading: 'Công thức sinh khóa PRGA',
        content:
          'i = (i + 1) mod N; j = (j + S[i]) mod N; hoán đổi S[i] ↔ S[j]; t = (S[i] + S[j]) mod N; byte dòng khóa k = S[t].',
      },
      {
        heading: 'Tính tự nghịch đảo của XOR',
        content:
          'C = P ⊕ k ⟺ P = C ⊕ k. Nhờ đó, cùng một hàm xử lý có thể dùng cho cả mã hóa và giải mã.',
      },
    ],
    tips: [
      'Thời gian KSA là O(N), sinh mỗi byte khóa trong PRGA chỉ tốn O(1) phép toán nguyên thủy.',
    ],
  },
  hand_calculation: {
    title: 'Ví Dụ Tính Tay TinyRC4',
    subtitle: 'Đối chuẩn bài giảng lớp học',
    badge: 'N = 8',
    sections: [
      {
        heading: 'Thông số ví dụ bài giảng',
        content:
          'Kích thước N = 8 (từ mã 3-bit, 0..7). Khóa K = [2, 1, 3] (độ dài 3). Mảng lặp T = [2, 1, 3, 2, 1, 3, 2, 1]. Bản rõ: "BAG" tương ứng P = [1, 0, 6].',
      },
      {
        heading: 'Kết quả kỳ vọng KSA',
        content:
          'Sau 8 vòng xáo trộn KSA, mảng S thu được: [6, 0, 7, 1, 2, 3, 5, 4] (chính xác 100% đối chuẩn bài giảng).',
      },
      {
        heading: 'Kết quả PRGA & Bản mã',
        content:
          'Keystream sinh ra: [5, 1, 6] (101 001 110₂). Bản mã C = P ⊕ k: [4, 1, 0] (100 001 000₂ / "EBA"). Giải mã: [4, 1, 0] ⊕ [5, 1, 6] = [1, 0, 6] ("BAG").',
      },
      {
        heading: 'Bảng quy ước chữ cái A-H',
        content:
          'A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7. Dùng cho cả biểu diễn nhị phân 3-bit và ký tự gợi nhớ.',
      },
    ],
    tips: [
      'Theo dõi các sơ đồ khối SVG động bên dưới trang để xem từng phép hoán đổi tương ứng.',
    ],
  },
  visualizer: {
    title: 'Mô Phỏng Hoạt Họa Mảng S',
    subtitle: 'Theo dõi con trỏ thời gian thực',
    badge: 'Live Step',
    sections: [
      {
        heading: 'Chú giải con trỏ',
        content:
          '• Con trỏ i (Cyan): duyệt tuần tự mảng S.\n• Con trỏ j (Amber): tích lũy chỉ số ngẫu nhiên theo khóa.\n• Chỉ số t / k (Purple): vị trí tra cứu byte dòng khóa k = S[t].\n• Hoán vị (Emerald): hai ô vừa đổi chỗ S[i] ↔ S[j].',
      },
      {
        heading: 'Chế độ hiển thị',
        content:
          'Hỗ trợ chuyển đổi giữa TinyRC4 (mảng 1 hàng N=4, 8, 16) và Full RC4 (ma trận 16x16 = 256 ô). Có thể chọn hiển thị số Hex hoặc Thập phân.',
      },
      {
        heading: 'Điều khiển mô phỏng',
        content:
          'Sử dụng thanh công cụ để Chạy tự động, Tạm dừng, Bước tiếp, Nhảy đến PRGA hoặc Reset lại từ đầu.',
      },
    ],
    tips: [
      'Phím tắt: có thể thay đổi thanh tốc độ từ 80ms đến 1200ms để quan sát kỹ từng phép hoán vị.',
    ],
  },
  cipher: {
    title: 'Công Cụ Mật Mã',
    subtitle: 'Văn bản, Chuỗi Hex & Tập tin',
    badge: 'Công cụ',
    sections: [
      {
        heading: 'Định dạng đầu vào & đầu ra',
        content:
          'Hỗ trợ dữ liệu dạng văn bản UTF-8 hoặc chuỗi Hex. Kết quả có thể xuất dạng Hex hoặc Base64. Trong chế độ TinyRC4 hỗ trợ thêm mảng số và chữ cái A-H.',
      },
      {
        heading: 'Mã hóa tập tin & Kiểm chứng SHA-256',
        content:
          'Mã hóa trực tiếp file text hoặc ảnh nhỏ dưới 5MB. SHA-256 dùng để đối chiếu bản gốc và bản giải mã (kiểm chứng tính toàn vẹn round-trip).',
      },
      {
        heading: 'Vector chuẩn tích hợp',
        content:
          'Có thể chọn nhanh các vector chuẩn của Wikipedia, RFC 6229 và ví dụ bài giảng để kiểm tra độ chính xác.',
      },
    ],
    tips: [
      'Nút "Hoán đổi I/O" cho phép đưa kết quả vừa giải mã thành đầu vào để kiểm tra tính đối xứng.',
    ],
  },
  benchmark: {
    title: 'Đo Kiểm Hiệu Năng',
    subtitle: 'Tốc độ thực thi vs Kích thước',
    badge: 'Hiệu năng',
    sections: [
      {
        heading: 'Phương pháp đo đạc',
        content:
          'Thực hiện mã hóa liên tục trên 5 khối dữ liệu: 1KB, 10KB, 100KB, 1MB và 5MB. Tính toán Throughput (MB/s), thời gian min/max và trung bình.',
      },
      {
        heading: 'Đối chứng với AES-GCM',
        content:
          'So sánh hiệu năng thực tế của RC4 chạy trên JavaScript thuần với WebCrypto API (AES-GCM có tăng tốc phần cứng AES-NI).',
      },
      {
        heading: 'Đồ thị biểu diễn',
        content:
          'Hỗ trợ chế độ xem thang đo Tuyến tính (Linear) và Logarit (Log scale) để thấy rõ xu hướng tăng trưởng O(n).',
      },
    ],
    tips: [
      'RC4 có ưu thế tốc độ trên phần cứng cũ nhưng không bù đắp được các rủi ro bảo mật nghiêm trọng.',
    ],
  },
  download: {
    title: 'Công Cụ Dòng Lệnh Python',
    subtitle: 'public/rc4_cli.py & PWA',
    badge: 'Standalone',
    sections: [
      {
        heading: 'Tệp CLI duy nhất',
        content:
          'Script độc lập public/rc4_cli.py cài đặt thuần túy Full RC4 và TinyRC4. Không phụ thuộc thư viện ngoài, tương thích mọi terminal Windows UTF-8.',
      },
      {
        heading: 'Ví dụ lệnh cơ bản',
        content:
          '• python public/rc4_cli.py encrypt --key Key --text Plaintext\n• python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "BAG" --trace\n• python public/rc4_cli.py encrypt-file --key "Pass" --in f.txt --out f.enc\n• python public/rc4_cli.py --test',
      },
      {
        heading: 'PWA Ngoại tuyến (Offline)',
        content:
          'Cài đặt ứng dụng trực tiếp từ trình duyệt, hoạt động trơn tru 100% kể cả khi mất kết nối mạng nhờ Service Worker.',
      },
    ],
    tips: [
      'Nút "Sao chép mã" cho phép lấy toàn bộ mã nguồn script trực tiếp vào clipboard.',
    ],
  },
  experiments: {
    title: 'Phòng Thí Nghiệm Mật Mã',
    subtitle: 'Thực nghiệm thiên vị & Tấn công',
    badge: 'Lab',
    sections: [
      {
        heading: 'Thiên vị Mantin-Shamir (Byte #2)',
        content:
          'Thực nghiệm chứng minh: byte thứ hai của dòng khóa Z₂ bằng 0 với xác suất ≈ 2/256 = 1/128 (gấp đôi mức ngẫu nhiên 1/256).',
      },
      {
        heading: 'Tấn công tái sử dụng khóa (Two-Time Pad)',
        content:
          'Khi cùng khóa RC4 mã hóa 2 bản rõ khác nhau: C₁ ⊕ C₂ = P₁ ⊕ P₂. Kẻ tấn công dùng phương pháp kéo đoán từ (Crib Dragging) khôi phục cả hai bản rõ.',
      },
      {
        heading: 'Khắc phục bằng RC4-drop[n]',
        content:
          'RFC 7465 cấm RC4 trong TLS. Nghiên cứu của Mironov đề xuất vứt khoảng 768 đến 3072 byte đầu; RFC 4345 (SSH) vứt 1536 byte đầu để triệt tiêu thiên vị khởi tạo.',
      },
      {
        heading: 'Kiểm thử tuyết lở (Avalanche Effect)',
        content:
          'Đo lường mức độ biến đổi bit của dòng khóa khi chỉ thay đổi đúng 1 bit của khóa ban đầu (lý tưởng đạt xấp xỉ 50%).',
      },
    ],
    tips: [
      'Có thể chọn sinh từ 5.000 đến 50.000 mẫu ngẫu nhiên để thấy rõ phân bố thiên vị trên biểu đồ.',
    ],
  },
  quiz: {
    title: 'Kiểm Tra Kiến Thức',
    subtitle: 'Bộ câu hỏi trắc nghiệm RC4',
    badge: 'Đánh giá',
    sections: [
      {
        heading: 'Nội dung kiểm tra',
        content:
          'Bộ câu hỏi trắc nghiệm bao quát các chủ đề: nguyên lý KSA/PRGA, tính chất phép XOR, lỗ hổng WEP, thiên vị Mantin-Shamir và quy định RFC 7465.',
      },
      {
        heading: 'Phản hồi toán học tức thì',
        content:
          'Mỗi câu hỏi đều đi kèm lời giải thích toán học chi tiết cho từng phương án, giúp củng cố kiến thức ngay khi làm bài.',
      },
      {
        heading: 'Xếp loại & Lưu điểm',
        content:
          'Đánh giá kết quả theo thang điểm phần trăm, hiệu ứng pháo hoa khi đạt điểm xuất sắc và lưu điểm vào lịch sử cá nhân (Cloud Firestore).',
      },
    ],
    tips: [
      'Đăng nhập tài khoản để tự động đồng bộ kết quả làm bài lên bảng xếp hạng cá nhân.',
    ],
  },
  architecture: {
    title: 'Kiến Trúc Kỹ Thuật',
    subtitle: 'Clean Architecture & PWA',
    badge: 'Tech Stack',
    sections: [
      {
        heading: 'Công nghệ cốt lõi',
        content:
          'Lõi RC4 tự cài đặt, không dùng thư viện mật mã; giao diện dùng React, Tailwind, Firebase. Đóng gói PWA với Vite Plugin PWA.',
      },
      {
        heading: 'Tách biệt kiến trúc',
        content:
          'Tách biệt triệt để lõi mật mã (src/crypto/rc4.ts thuần TypeScript không phụ thuộc DOM) với các thành phần giao diện (src/views/, src/components/).',
      },
      {
        heading: 'Quản lý trạng thái & Lưu trữ',
        content:
          'State-based Tab Routing kết hợp URL Hash giúp chuyển view tức thì. Dữ liệu người dùng đồng bộ qua Cloud Firestore với quy tắc phân quyền ABAC.',
      },
    ],
    tips: [
      'Ứng dụng hoạt động 100% offline không cần server backend.',
    ],
  },
  ux_design: {
    title: 'Thiết Kế Trải Nghiệm UX/UI',
    subtitle: 'Cybersecurity Lab Theme',
    badge: 'Design System',
    sections: [
      {
        heading: 'Bảng màu đặc trưng (Design Tokens)',
        content:
          '• Nền Dark Cyber: Slate-950, Slate-900\n• Con trỏ i: Neon Cyan\n• Con trỏ j: Amber / Yellow\n• Tra cứu t / k: Purple\n• Hoán vị / Thành công: Emerald Green\n• Lỗi / Cảnh báo: Rose Red / Amber',
      },
      {
        heading: 'Typography',
        content:
          'Kết hợp font Fira Code cho dữ liệu nhị phân, chuỗi hex, mã nguồn và font Inter cho văn bản diễn giải sư phạm.',
      },
      {
        heading: 'Khả năng tiếp cận (Accessibility - a11y)',
        content:
          'Độ tương phản màu sắc cao, hỗ trợ điều hướng bàn phím (Tab, Enter, Escape), viền tiêu điểm rõ ràng và nhãn ARIA đầy đủ.',
      },
    ],
    tips: [
      'Thiết kế responsive thích ứng linh hoạt từ màn hình điện thoại di động đến màn hình Ultra-wide 2K/4K.',
    ],
  },
  testing: {
    title: 'Bộ Ca Kiểm Thử Tự Động',
    subtitle: 'Đối chuẩn Test Vectors chuẩn mực',
    badge: 'Unit Tests',
    sections: [
      {
        heading: 'Bộ ca kiểm thử toàn diện',
        content:
          'Bao gồm các Test Vectors chuẩn: Wikipedia, RFC 6229 (khóa 40-bit & 128-bit), Tactical Dawn, ví dụ bài giảng TinyRC4 và các ca kiểm thử biên (Edge Cases).',
      },
      {
        heading: 'Kiểm tra Round-Trip',
        content:
          'Mã hóa và giải mã lại chuỗi văn bản Unicode tiếng Việt, đảm bảo bản rõ sau giải mã hoàn toàn trùng khớp với bản gốc.',
      },
      {
        heading: 'Tính năng Xuất Báo Cáo',
        content:
          'Cho phép tải về báo cáo kết quả kiểm thử dưới dạng tệp CSV (kèm UTF-8 BOM hiển thị chuẩn trên Excel) hoặc tệp JSON có gắn dấu thời gian.',
      },
    ],
    tips: [
      'Nhấn "Chạy tất cả kiểm thử" để kiểm tra tính toàn vẹn thuật toán ngay trên trình duyệt.',
    ],
  },
  opensource: {
    title: 'Mã Nguồn Mở & Giấy Phép',
    subtitle: 'MIT License & Cam kết học thuật',
    badge: 'Mã nguồn mở',
    sections: [
      {
        heading: 'Giấy phép phần mềm MIT',
        content:
          'Toàn bộ mã nguồn dự án được phát hành theo giấy phép MIT License, cho phép tự do nghiên cứu, chỉnh sửa và đóng góp cho cộng đồng.',
      },
      {
        heading: 'Tuyên bố miễn trừ an toàn',
        content:
          'Dự án phục vụ mục đích giáo dục và nghiên cứu an toàn thông tin phi thương mại. Tuyệt đối không sử dụng RC4 để bảo vệ dữ liệu thực tế.',
      },
      {
        heading: 'Đóng góp mã nguồn',
        content:
          'Kho lưu trữ chính thức được lưu trữ trên GitHub. Các đóng góp tuân thủ quy chuẩn Conventional Commits và vượt qua bài kiểm tra lint/build.',
      },
    ],
    tips: [
      'Xem mã nguồn script dòng lệnh tại tệp public/rc4_cli.py.',
    ],
  },
  history: {
    title: 'Lịch Sử Cá Nhân',
    subtitle: 'Đồng bộ Cloud Firestore',
    badge: 'Tài khoản',
    sections: [
      {
        heading: 'Dữ liệu nhật ký hoạt động',
        content:
          'Lưu trữ an toàn các phiên chạy mã hóa (Full RC4 & TinyRC4), kết quả thí nghiệm thiên vị và bảng điểm các bài thi trắc nghiệm.',
      },
      {
        heading: 'Quy tắc bảo mật ABAC',
        content:
          'Firestore Security Rules phân quyền chặt chẽ theo UID người dùng. Mỗi sinh viên chỉ có thể đọc và ghi dữ liệu của chính mình.',
      },
      {
        heading: 'Tính bất biến (Immutability)',
        content:
          'Dữ liệu điểm thi và nhật ký một khi đã ghi nhận sẽ không thể bị chỉnh sửa, đảm bảo tính khách quan trong đánh giá học tập.',
      },
    ],
    tips: [
      'Nếu chưa đăng nhập, các tính năng mô phỏng và mật mã vẫn hoạt động bình thường trên trình duyệt.',
    ],
  },
};
