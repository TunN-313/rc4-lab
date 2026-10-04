export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const RC4_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Ai là người thiết kế thuật toán mã hóa RC4 và vào năm nào?',
    options: [
      'Whitfield Diffie & Martin Hellman (1976)',
      'Ron Rivest (1987) tại RSA Data Security',
      'Claude Shannon (1949) tại Bell Labs',
      'Joan Daemen & Vincent Rijmen (1998)',
    ],
    correctIndex: 1,
    explanation:
      'RC4 được Ron Rivest (đồng sáng lập RSA Security) thiết kế vào năm 1987. Ban đầu nó là bí mật thương mại nhưng mã nguồn bị rò rỉ nặc danh vào năm 1994 trên danh sách gửi thư Cypherpunks.',
  },
  {
    id: 2,
    question: 'RC4 thuộc loại thuật toán mật mã nào sau đây?',
    options: [
      'Mã hóa khối đối xứng (Block cipher) với kích thước khối 128 bit',
      'Mã hóa bất đối xứng khóa công khai (Public-key cryptography)',
      'Mã hóa dòng đối xứng (Symmetric stream cipher)',
      'Hàm băm mật mã một chiều (Cryptographic hash function)',
    ],
    correctIndex: 2,
    explanation:
      'RC4 là thuật toán mã hóa dòng đối xứng (Stream cipher). Nó sinh ra một dòng khóa giả ngẫu nhiên liên tục và kết hợp từng byte với bản rõ bằng phép XOR.',
  },
  {
    id: 3,
    question: 'Mảng trạng thái nội bộ S của RC4 có đặc điểm cấu trúc như thế nào?',
    options: [
      'Một ma trận 4x4 gồm 16 byte giống S-box của AES',
      'Một mảng 256 phần tử (0..255), chứa hoán vị của tất cả các giá trị từ 0 đến 255',
      'Hai thanh ghi dịch phản hồi tuyến tính (LFSR) 64 bit',
      'Một mảng 512 bit được khởi tạo từ hàm băm SHA-256',
    ],
    correctIndex: 1,
    explanation:
      'Mảng trạng thái S gồm đúng 256 byte, ban đầu được khởi tạo S[i] = i (0..255). Toàn bộ quá trình mã hóa dựa trên việc liên tục hoán đổi vị trí các phần tử trong hoán vị này.',
  },
  {
    id: 4,
    question: 'Thuật toán KSA (Key-Scheduling Algorithm) trong RC4 thực hiện nhiệm vụ gì?',
    options: [
      'Tạo trực tiếp dòng khóa đầu ra để XOR với bản rõ',
      'Kiểm tra tính toàn vẹn của thông điệp (MAC)',
      'Khởi tạo và trộn ngẫu nhiên mảng trạng thái S dựa trên khóa bí mật qua 256 vòng lặp',
      'Chia bản rõ thành các khối dữ liệu 64 bit',
    ],
    correctIndex: 2,
    explanation:
      'KSA (Key-Scheduling Algorithm) dùng khóa bí mật (độ dài 1-256 byte) để trộn hoán vị mảng S thông qua công thức j = (j + S[i] + key[i % keylen]) mod 256 và hoán đổi S[i] ↔ S[j] đúng 256 lần.',
  },
  {
    id: 5,
    question: 'Phép toán logic nào được sử dụng để kết hợp dòng khóa (Keystream) và bản rõ (Plaintext) trong RC4?',
    options: [
      'Phép cộng theo modulo 256 (Modular Addition)',
      'Phép XOR bit (Exclusive OR, ký hiệu ⊕)',
      'Phép nhân trong trường Galois GF(2⁸)',
      'Phép dịch vòng bit trái (Bitwise Circular Shift)',
    ],
    correctIndex: 1,
    explanation:
      'Phép toán XOR (⊕) được sử dụng: Ciphertext = Plaintext ⊕ Keystream. Vì tính chất A ⊕ B ⊕ B = A, việc giải mã chỉ đơn giản là XOR lại Ciphertext với cùng Keystream.',
  },
  {
    id: 6,
    question: 'Lỗ hổng thiên vị Mantin-Shamir (2001) trong RC4 chỉ ra điều gì ở các byte dòng khóa đầu tiên?',
    options: [
      'Byte thứ nhất luôn luôn bằng giá trị 0xFF',
      'Byte thứ 2 của dòng khóa có xác suất nhận giá trị 0x00 cao gấp đôi bình thường (~1/128 thay vì 1/256)',
      'Các số nguyên tố không bao giờ xuất hiện ở 10 byte đầu',
      'Dòng khóa lặp lại chu kỳ sau mỗi 64 byte',
    ],
    correctIndex: 1,
    explanation:
      'Mantin và Shamir đã chứng minh byte thứ hai của dòng khóa RC4 bị thiên vị thống kê nặng nề, có xác suất bằng 0x00 xấp xỉ 1/128 (~0.78%), gần gấp đôi xác suất phân phối đều lý tưởng (1/256 ≈ 0.39%).',
  },
  {
    id: 7,
    question: 'Tấn công FMS (Fluhrer, Mantin, Shamir) khai thác lỗ hổng nào của RC4 trong giao thức bảo mật Wi-Fi WEP cổ điển?',
    options: [
      'WEP ghép Vector khởi tạo IV ngắn (24-bit) gửi công khai ngay trước khóa bí mật, tạo ra các "khóa yếu" (weak keys)',
      'Kẻ tấn công can thiệp vào tần số vô tuyến làm nhiễu sóng',
      'WEP sử dụng kích thước khối 64-bit bị tấn công Birthday attack',
      'Tường lửa của Router Wi-Fi không lọc các gói tin ICMP Ping',
    ],
    correctIndex: 0,
    explanation:
      'Trong WEP, khóa RC4 được ghép từ 24-bit IV (gửi công khai trong mỗi gói Wi-Fi) + khóa chia sẻ bí mật. Thuật toán KSA bị rò rỉ thông tin khóa khi gặp các IV yếu, cho phép phần mềm như Aircrack-ng khôi phục toàn bộ mật khẩu sau khi bắt đủ vài chục ngàn gói tin.',
  },
  {
    id: 8,
    question: 'Nếu người gửi vô tình tái sử dụng cùng một khóa RC4 cho hai bản rõ khác nhau (P₁ và P₂), nguy cơ bảo mật là gì?',
    options: [
      'Không nguy hiểm vì thuật toán sinh số giả ngẫu nhiên có độ entropy cao',
      'Kẻ nghe trộm có thể tính được C₁ ⊕ C₂ = P₁ ⊕ P₂, từ đó áp dụng kỹ thuật Crib-Dragging để giải mã thông điệp mà không cần biết khóa',
      'Bản mã thứ hai sẽ tự động bị hỏng và không thể giải mã',
      'Khóa bí mật sẽ tự động đảo ngược về 0x00',
    ],
    correctIndex: 1,
    explanation:
      'Vì C₁ = P₁ ⊕ K và C₂ = P₂ ⊕ K, nên C₁ ⊕ C₂ = P₁ ⊕ P₂ (dòng khóa K bị triệt tiêu hoàn toàn). Kẻ tấn công có thể áp dụng kỹ thuật đoán từ mẫu (Crib-dragging) và tần suất ngôn ngữ để khôi phục toàn bộ P₁ và P₂.',
  },
  {
    id: 9,
    question: 'Giải pháp RC4-drop[n] (ví dụ RC4-drop[768] hoặc RC4-drop[3072]) được đề xuất nhằm mục đích gì?',
    options: [
      'Tăng kích thước mảng S từ 256 lên 768 phần tử',
      'Vứt bỏ n byte đầu tiên của dòng khóa trước khi mã hóa dữ liệu để triệt tiêu các thiên vị thống kê ban đầu',
      'Nén bản rõ để giảm dung lượng mạng',
      'Thêm mã kiểm tra chẵn lẻ CRC32 vào cuối bản tin',
    ],
    correctIndex: 1,
    explanation:
      'RC4-drop[n] vứt bỏ n byte đầu tiên do PRGA sinh ra (ví dụ 768 hoặc 3072 byte đầu) nhằm tránh các thiên vị thống kê ban đầu. Tuy nhiên nó chỉ là biện pháp chắp vá và không khắc phục được các thiên vị dài hạn khác.',
  },
  {
    id: 10,
    question: 'Tiêu chuẩn RFC 7465 do tổ chức IETF công bố vào năm 2015 đưa ra quyết định gì về RC4 trong giao thức TLS?',
    options: [
      'Khuyến nghị nâng cấp khóa RC4 lên 256 bit',
      'Cấm hoàn toàn việc sử dụng tất cả các bộ mã hóa (cipher suites) dựa trên RC4 trong mọi phiên bản TLS',
      'Yêu cầu kết hợp RC4 với thuật toán RSA',
      'Chỉ cho phép sử dụng RC4 cho các kết nối nội bộ',
    ],
    correctIndex: 1,
    explanation:
      'RFC 7465 chính thức cấm việc đàm phán hoặc sử dụng bất kỳ bộ mã hóa RC4 nào trong mọi phiên bản TLS/SSL vì các cuộc tấn công thu hồi bản rõ (như Bar Mitzvah, RC4 NOMORE) có thể trích xuất cookie phiên HTTPS sau vài triệu yêu cầu.',
  },
];
