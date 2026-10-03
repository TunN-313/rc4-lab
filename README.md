# RC4 Lab — Nền Tảng Học Tập & Mô Phỏng Mã Hóa Dòng RC4 Trực Quan

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-ffca28.svg)](https://firebase.google.com/)

> **⚠️ CẢNH BÁO AN TOÀN MẬT MÃ HỌC (EDUCATIONAL DISCLAIMER):**
> **RC4 Lab** là dự án mã nguồn mở phục vụ mục đích học tập, nghiên cứu và diễn giải trực quan nguyên lý hoạt động của mã hóa dòng đối xứng (Stream Cipher). Thuật toán **RC4 (Rivest Cipher 4)** đã lỗi thời, chứa nhiều lỗ hổng toán học nghiêm trọng và **bị cấm triệt để trong giao thức TLS theo chuẩn IETF RFC 7465**. Tuyệt đối **KHÔNG SỬ DỤNG RC4** để bảo vệ dữ liệu thực tế, hệ thống sản xuất hay thông tin nhạy cảm.

---

## 📌 Giới Thiệu Dự Án

**RC4 Lab** là một ứng dụng web Single-Page Application (SPA) tương tác toàn diện, được thiết kế riêng cho sinh viên ngành An toàn thông tin, kỹ sư bảo mật và những người yêu thích mật mã học tại Việt Nam.

Toàn bộ ứng dụng được Việt hóa 100%, trang bị giao diện phòng thí nghiệm an ninh mạng (*Cybersecurity Lab Dark Theme*) hiện đại, mang đến góc nhìn trực quan từ cấp độ từng bit nhị phân đến các cuộc tấn công nổi tiếng trong lịch sử mật mã học.

---

## ✨ Các Tính Năng Nổi Bật

1. **Giới Thiệu Thuật Toán (Home):**
   - Lịch sử ra đời bởi Ron Rivest (1987, RSA Data Security) và vụ rò rỉ mã nguồn ẩn danh chấn động năm 1994 (nguồn gốc cái tên ARCFOUR / ARC4).
   - So sánh trực quan cơ chế mã hóa dòng (Stream Cipher) vs mã hóa khối (Block Cipher).
   - Sơ đồ đường ống 3 giai đoạn và bảng tóm tắt thông số kỹ thuật.

2. **Phân Tích Chi Tiết KSA & PRGA (Analysis):**
   - Giải phẫu thuật toán xáo trộn khóa **KSA** ($j = (j + S[i] + K) \pmod{256}$, hoán đổi $S[i] \leftrightarrow S[j]$ qua 256 vòng).
   - Giải phẫu thuật toán sinh dòng khóa **PRGA** ($i, j$, con trỏ $t$, sinh byte $K$).
   - Bản chất đối xứng của phép toán XOR: $C = P \oplus K \iff P = C \oplus K$.
   - Bảng so sánh đa chiều: **RC4 vs AES (Block) vs ChaCha20 (Modern Stream)**.
   - Phân tích 4 lỗ hổng kinh điển: Thiên vị Mantin-Shamir, Tấn công WEP FMS (IV 24-bit), Tái sử dụng khóa (Two-Time Pad), và Lệnh cấm TLS theo RFC 7465.

3. **Ứng Dụng Thực Tế & Lịch Sử (Applications):**
   - Các hệ thống từng dùng RC4: WEP (802.11b), WPA-TKIP, SSL/TLS (HTTPS), Microsoft RDP, MPPE, BitTorrent MSE/PE, Adobe PDF.
   - Dòng thời gian khai tử (1987 $\rightarrow$ 1994 $\rightarrow$ 2001 $\rightarrow$ 2013 $\rightarrow$ 2015 RFC 7465).
   - Khuyến nghị các thuật toán AEAD hiện đại thay thế: **ChaCha20-Poly1305** và **AES-256-GCM**.

4. **Bộ Mô Phỏng Ma Trận 16x16 (Step-by-Step Visualizer):**
   - Biểu diễn mảng trạng thái $S[256]$ thành ma trận 16 hàng $\times$ 16 cột (0x00 đến 0xFF).
   - Con trỏ $i$ (neon cyan), $j$ (amber), vị trí hoán đổi (emerald) và tra cứu $t$ (purple) nổi bật kèm hiệu ứng animation.
   - Điều khiển linh hoạt: Tự động chạy (Play), Tạm dừng, Tới 1 bước, Nhảy nhanh sang PRGA, Reset, Thanh trượt tốc độ (50ms – 1000ms), Chuyển đổi HEX/DEC.
   - Bảng theo dõi phép XOR từng byte và dạng nhị phân 8-bit thời gian thực.

5. **Công Cụ Mã Hóa & Giải Mã (Cipher Tool):**
   - Hỗ trợ định dạng Văn bản (UTF-8) hoặc chuỗi HEX; xuất ra chuỗi HEX hoặc Base64.
   - Tích hợp sẵn bộ Test Vectors chuẩn: RFC 6229 (`Key`/`Plaintext` $\rightarrow$ `BBF316E8D940AF0AD3`), Wikipedia, Tactical Dawn, Single Char.
   - Chức năng đổi chiều xử lý (Swap Input/Output) và sao chép vào Clipboard.

6. **Phòng Thực Nghiệm Mật Mã Học (Experiments Lab):**
   - **a. Keystream bias test:** Sinh $N$ khóa ngẫu nhiên ($5.000$ – $50.000$), vẽ biểu đồ cột 256 giá trị và làm nổi bật thiên vị của byte thứ 2 về $0$ ($\approx 1/128$ thay vì $1/256$, hệ số thiên vị $\approx 2.0\times$).
   - **b. Key reuse attack:** Chứng minh $C_1 \oplus C_2 = P_1 \oplus P_2$ và công cụ kéo trượt từ đoán (*Crib Dragging*) để khôi phục bản rõ mà không cần khóa.
   - **c. RC4-drop[n]:** Đánh giá mức độ đồng đều khi loại bỏ $0, 256, 768, 1024, 3072$ bytes đầu tiên.
   - **d. Avalanche test:** Lật 1-bit khóa và đo mức phân tán bit trong dòng khóa sinh ra so với tỷ lệ lý tưởng $50\%$.

7. **Bài Trắc Nghiệm Kiến Thức (Quiz):**
   - 10 câu hỏi trắc nghiệm chất lượng cao có phản hồi giải thích toán học chi tiết ngay lập tức cho từng lựa chọn.
   - Đánh giá năng lực, phần trăm chính xác, xếp loại và hiệu ứng pháo hoa chúc mừng khi đạt điểm cao.

8. **Trình Kiểm Thử Tự Động (In-App Test Runner):**
   - Chạy 12 ca kiểm thử Unit Tests ngay trong trình duyệt: 4 Test Vectors chuẩn, 3 ca Round-trip ngẫu nhiên, và 5 trường hợp biên (chuỗi rỗng, khóa 1-byte, khóa 256-bytes, Unicode tiếng Việt có dấu, triệt tiêu dòng khóa).
   - Đo thời gian thực thi (ms), hiển thị trạng thái Passed/Failed trực quan.

9. **Lưu Trữ Cá Nhân Đám Mây (Cloud History):**
   - Đăng nhập an toàn qua tài khoản Google hoặc Email/Mật khẩu.
   - Tự động đồng bộ và quản lý lịch sử mã hóa, kết quả thí nghiệm và bảng điểm thi qua Firebase Firestore với quy tắc bảo mật ABAC.

---

## 📸 Ảnh Chụp Màn Hình (Screenshots)

| Mô phỏng mảng trạng thái hoán vị S (Lưới 16x16 để quan sát) | Thực nghiệm Thiên vị Byte #2 |
| :---: | :---: |
| ![Visualizer Placeholder](https://raw.githubusercontent.com/hoanglong128980/rc4-lab/main/docs/screenshots/visualizer.png) | ![Experiments Placeholder](https://raw.githubusercontent.com/hoanglong128980/rc4-lab/main/docs/screenshots/experiments.png) |

| Công cụ Mã hóa & Test Vectors | Trắc nghiệm Kiến thức 10 Câu |
| :---: | :---: |
| ![Cipher Tool Placeholder](https://raw.githubusercontent.com/hoanglong128980/rc4-lab/main/docs/screenshots/cipher.png) | ![Quiz Placeholder](https://raw.githubusercontent.com/hoanglong128980/rc4-lab/main/docs/screenshots/quiz.png) |

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend:**
  - [React 19](https://react.dev/) — Thư viện xây dựng giao diện tương tác theo component.
  - [TypeScript 5](https://www.typescriptlang.org/) — Đảm bảo an toàn kiểu dữ liệu cho các phép toán mảng byte và modulo 256.
  - [Vite 8](https://vitejs.dev/) — Công cụ đóng gói siêu tốc với Native ES Modules.
  - [Tailwind CSS v4](https://tailwindcss.com/) — Framework tiện ích CSS hiện đại, tối ưu giao diện dark theme.
  - [Lucide React](https://lucide.dev/) — Bộ icon vector giao diện phòng lab.
  - [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) — Hiệu ứng pháo hoa chúc mừng.
  - [Vite Plugin PWA](https://vite-pwa-org.netlify.app/) — Đóng gói Progressive Web App (PWA) & bộ nhớ đệm Offline Service Worker.
- **Backend & Cloud Services:**
  - [Firebase Authentication](https://firebase.google.com/products/auth) — Quản lý phiên đăng nhập Google OAuth 2.0 & Email/Password.
  - [Cloud Firestore](https://firebase.google.com/products/firestore) — Cơ sở dữ liệu NoSQL đám mây thời gian thực (`onSnapshot`).
  - [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started) — Kiểm soát quyền truy cập dữ liệu cá nhân theo thuộc tính (ABAC).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Yêu cầu môi trường
- [Node.js](https://nodejs.org/) phiên bản 18.0.0 trở lên.
- Trình quản lý gói `npm` hoặc `pnpm` / `yarn`.

### 2. Các bước cài đặt

```bash
# 1. Clone kho lưu trữ mã nguồn
git clone https://github.com/hoanglong128980/rc4-lab.git
cd rc4-lab

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Thiết lập biến môi trường
cp .env.example .env
```

### 3. Cấu hình Firebase
Tạo dự án trên [Firebase Console](https://console.firebase.google.com/), bật **Authentication** (Google và Email/Password) và **Cloud Firestore**. Cập nhật các biến môi trường trong file `.env`:

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="du-an-cua-ban.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="du-an-cua-ban"
VITE_FIREBASE_FIRESTORE_DATABASE_ID="(default)"
VITE_FIREBASE_STORAGE_BUCKET="du-an-cua-ban.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="1:...:web:..."
```

*(Lưu ý: Ứng dụng đọc trực tiếp cấu hình Firebase từ biến môi trường qua file `.env`. Nếu chưa cấu hình, ứng dụng vẫn chạy 100% các tính năng mô phỏng và mật mã ở chế độ Ngoại tuyến / Offline).*

### 4. Chạy chế độ phát triển (Development)

```bash
npm run dev
```

Mở trình duyệt và truy cập: `http://localhost:3000`

### 5. Đóng gói bản phát hành (Production Build)

```bash
npm run build
npm run preview
```

---

## 🧪 Kiểm Thử (Testing)

Dự án cung cấp 3 phương thức kiểm thử:

1. **Kiểm tra cú pháp & Type Safety (CLI):**
   ```bash
   npm run lint
   ```
2. **Trình chạy kiểm thử trực tiếp trên Web (In-App Test Runner):**
   - Mở ứng dụng, vào tab **"Kiểm Thử"** trên thanh điều hướng.
   - Nhấn **"Chạy Tất Cả Kiểm Thử (16 Tests)"** để thực thi tự động toàn bộ ca kiểm thử trên trình duyệt (kèm tính năng xuất báo cáo CSV / JSON).
3. **Bộ kiểm định Test Vectors tích hợp trong Python CLI:**
   ```bash
   python public/rc4_cli.py --test
   ```

---

## 💻 Công Cụ Dòng Lệnh Độc Lập (Python CLI — `public/rc4_cli.py`)

Tệp mã nguồn CLI độc lập duy nhất được lưu trữ tại `public/rc4_cli.py`, người dùng có thể tải về trực tiếp từ giao diện trang **"Tải Về"** của ứng dụng.

### 1. Mã hóa & Giải mã Full RC4 (N = 256):
```bash
# Mã hóa văn bản xuất chuỗi Hex (Vector chuẩn RFC / Wikipedia):
python public/rc4_cli.py encrypt --key Key --text Plaintext
# Kết quả: BBF316E8D940AF0AD3

# Giải mã chuỗi Hex hoàn nguyên bản rõ UTF-8:
python public/rc4_cli.py decrypt --key Key --hex BBF316E8D940AF0AD3 --format text
# Kết quả: Plaintext

# Mã hóa xuất định dạng Base64:
python public/rc4_cli.py encrypt --key "MatKhau123" --text "Du lieu bi mat" --format base64

# Khắc phục thiên vị Mantin-Shamir với biến thể RC4-drop[768]:
python public/rc4_cli.py encrypt --key "SafeKey" --text "Payload" --drop 768
```

### 2. Chế độ TinyRC4 (N = 4, 8, 16):
```bash
# Ví dụ bài giảng giảng viên (N = 8, Key=[2,1,3], Plaintext=[1,0,6] / "BAG"):
python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "1,0,6"
# Kết quả: 4, 1, 0

# Nhập dạng chữ cái A-H (N = 8, "BAG" -> [1,0,6]):
python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "BAG" --format text
# Kết quả: EBA

# Nhập dạng cụm bit nhị phân (3-bit words cho N=8):
python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "001 000 110" --format binary
# Kết quả: 100 001 000

# Giải mã hoàn nguyên dữ liệu gốc:
python public/rc4_cli.py decrypt --tiny 8 --key "2,1,3" --text "4,1,0"
# Kết quả: 1, 0, 6

# Bật cờ --trace in toàn bộ các bước trung gian KSA, PRGA, mảng S, t và keystream:
python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "BAG" --trace
```

### 3. Chế độ tập tin & Đối chiếu mã băm SHA-256 (File Mode):
```bash
# Mã hóa tệp tin và tính mã băm SHA-256:
python public/rc4_cli.py encrypt-file --key "SecretKey123" --in document.pdf --out document.enc

# Giải mã tệp tin và đối chiếu toàn vẹn với tệp gốc:
python public/rc4_cli.py decrypt-file --key "SecretKey123" --in document.enc --out document_dec.pdf --compare document.pdf
```

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
rc4-lab/
├── .env.example             # File mẫu biến môi trường
├── index.html               # Điểm vào HTML chính kèm font Fira Code / Inter
├── metadata.json            # Siêu dữ liệu AI Studio applet
├── package.json             # Danh sách dependencies & scripts
├── tsconfig.json            # Cấu hình TypeScript
├── vite.config.ts           # Cấu hình Vite & Tailwind CSS
├── firestore.rules          # Quy tắc bảo mật phân quyền Cloud Firestore (ABAC)
├── firebase-blueprint.json  # Định nghĩa sơ đồ lược đồ dữ liệu
├── LICENSE                  # Giấy phép mã nguồn mở MIT
├── README.md                # Tài liệu hướng dẫn dự án (Tiếng Việt)
├── public/                  # Tài nguyên tĩnh phục vụ PWA & Download
│   └── rc4_cli.py           # Công cụ CLI Python độc lập duy nhất (Full RC4 & TinyRC4)
└── src/
    ├── main.tsx             # Điểm khởi chạy React DOM
    ├── App.tsx              # Component gốc quản lý routing & trạng thái auth
    ├── index.css            # Tailwind CSS v4 & theme styling
    ├── crypto/
    │   └── rc4.ts           # Lõi mã hóa RC4 thuần: KSA, PRGA, XOR, Test Vectors, Bias
    ├── firebase/
    │   ├── config.ts        # Khởi tạo Firebase App, Auth, Firestore
    │   ├── auth.ts          # Đăng nhập Email/Mật khẩu & Google Popup
    │   ├── firestore.ts     # Thao tác đọc/ghi lịch sử cá nhân (Realtime sync)
    │   └── errors.ts        # Xử lý & chuẩn hóa lỗi bảo mật Firestore
    ├── data/
    │   └── quizQuestions.ts # 10 câu hỏi trắc nghiệm mật mã học chuyên sâu
    ├── components/
    │   ├── Navbar.tsx       # Thanh điều hướng responsive
    │   ├── Footer.tsx       # Chân trang & liên kết tham chiếu RFC 7465
    │   ├── DisclaimerBanner.tsx # Cảnh báo an toàn mật mã học
    │   └── AuthModal.tsx    # Modal đăng nhập / đăng ký người dùng
    └── views/
        ├── HomeView.tsx         # Trang Giới thiệu & Lịch sử rò rỉ 1994
        ├── AnalysisView.tsx     # Phân tích KSA, PRGA & So sánh AES/ChaCha20
        ├── ApplicationsView.tsx # Ứng dụng thực tế WEP, TLS & Khai tử
        ├── VisualizerView.tsx   # Mô phỏng trực quan mảng trạng thái hoán vị S (lưới 16x16 để quan sát)
        ├── CipherToolView.tsx   # Công cụ mã hóa/giải mã & Test Vectors
        ├── ExperimentsView.tsx  # Thực nghiệm Thiên vị, Two-Time Pad, Drop-n
        ├── QuizView.tsx         # Bài trắc nghiệm 10 câu có phản hồi tức thì
        ├── TestingView.tsx      # Trình chạy kiểm thử Unit Tests in-app
        ├── ArchitectureView.tsx # Tài liệu Công nghệ & Kiến trúc hệ thống
        ├── UxDesignView.tsx     # Tài liệu Thiết kế UX/UI & Personas
        ├── OpenSourceView.tsx   # Thông tin giấy phép MIT & Đóng góp mã nguồn
        └── HistoryView.tsx      # Nhật ký lịch sử lưu trữ cá nhân
```

---

## 🤝 Đóng Góp Mã Nguồn (Contributing)

Chúng tôi luôn hoan nghênh mọi đóng góp từ cộng đồng học thuật và nghiên cứu mật mã học:

1. **Fork** kho lưu trữ mã nguồn này về tài khoản GitHub của bạn.
2. Tạo một nhánh tính năng mới: `git checkout -b feature/tinh-nang-moi`.
3. Kiểm tra code bằng lệnh `npm run lint` để đảm bảo không có lỗi TypeScript.
4. Viết commit rõ ràng theo chuẩn [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: bổ sung thêm test vector RFC mới`
   - `fix: sửa lỗi hiển thị màu con trỏ j trên mobile`
   - `docs: cập nhật tài liệu giải thích thiên vị Mantin-Shamir`
5. Tạo **Pull Request** kèm mô tả chi tiết nội dung thay đổi.

---

## 📄 Giấy Phép (License)

Dự án được phân phối dưới giấy phép **[MIT License](LICENSE)**. Bạn có quyền tự do sử dụng, sao chép, chỉnh sửa và phân phối lại cho mục đích nghiên cứu và giáo dục.

© 2026 Hoàng Long & Các cộng tác viên RC4 Lab.
