# BÁO CÁO PHÂN TÍCH TOÀN DIỆN DỰ ÁN RC4 LAB (READ-ONLY AUDIT REPORT)

> **Dự án:** RC4 Lab — Nền tảng Học tập & Mô phỏng Mã hóa Dòng Tương tác  
> **Môn học:** An toàn Thông tin (Information Security)  
> **Kiến trúc:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Firebase Auth & Firestore (PWA)  
> **Thời gian đánh giá:** 10/2026  
> **Trạng thái:** Hoàn thành phân tích tĩnh & đối chuẩn toán học chuyên sâu  

---

## 1. SƠ ĐỒ DỰ ÁN (PROJECT MAP)

### 1.1. Cây thư mục và vai trò các tệp tin

```
RC4 Prototype_1/
├── .env                              # Biến môi trường cục bộ (đã tạo từ .env.example)
├── .env.example                      # Mẫu biến môi trường (Vite Firebase & App URL)
├── .gitignore                        # Cấu hình bỏ qua tệp git (node_modules, dist, .env*)
├── LICENSE                           # Giấy phép mã nguồn mở MIT kèm Disclaimer học thuật
├── README.md                         # Tài liệu hướng dẫn dự án (Tiếng Việt 100%)
├── bun.lock                          # Khóa phiên bản gói của Bun (phát sinh từ AI Studio)
├── dev-dist/                         # Thư mục sinh Service Worker tạm thời của Vite PWA
│   ├── sw.js
│   └── workbox-afac4cd2.js
├── firebase-applet-config.json       # Cấu hình Firebase nhúng trực tiếp từ AI Studio (CHỨA API KEY THẬT)
├── firebase-blueprint.json           # Lược đồ thực thể NoSQL Firestore của AI Studio
├── firestore.rules                   # Quy tắc bảo mật Cloud Firestore phân quyền theo người dùng
├── index.html                        # Điểm khởi đầu HTML5, cấu hình PWA meta, dark theme, font Google
├── metadata.json                     # Metadata dự án AI Studio
├── package.json                      # Quản lý dependencies, scripts (dev, build, lint, clean)
├── public/                           # Tài nguyên tĩnh phục vụ PWA & Download
│   ├── apple-touch-icon.png          # Biểu tượng iOS PWA
│   ├── favicon.ico                   # Favicon trình duyệt
│   ├── icon.svg                      # Biểu tượng vector
│   ├── manifest.json                 # Web App Manifest cho PWA
│   ├── pwa-192x192.png               # Icon 192px PWA
│   ├── pwa-512x512.png               # Icon 512px PWA
│   ├── pwa-maskable-512x512.png      # Icon maskable 512px PWA
│   └── rc4_cli.py                    # Bản sao CLI Python để người dùng tải trực tiếp
├── rc4_cli.py                        # Script Python CLI độc lập mã hóa/giải mã & test vectors
├── security_spec.md                  # Đặc tả an toàn bảo mật Firestore ("Dirty Dozen" test cases)
├── src/
│   ├── App.tsx                       # Component điều phối chính: Tab routing, Auth state, Modal
│   ├── main.tsx                      # Entry point React: render App, đăng ký PWA Service Worker
│   ├── index.css                     # Cấu hình Tailwind CSS (@import "tailwindcss")
│   ├── components/
│   │   ├── AuthModal.tsx             # Modal đăng nhập / đăng ký Email & Google Sign-In
│   │   ├── DisclaimerBanner.tsx      # Banner cảnh báo an toàn mật mã học dán cố định đỉnh trang
│   │   ├── FileCipherPanel.tsx       # Bảng mã hóa/giải mã tập tin (Text, Ảnh < 5MB) + SHA-256 WebCrypto
│   │   ├── Footer.tsx                # Chân trang với điều hướng nhanh, chuẩn RFC và trích dẫn
│   │   ├── Navbar.tsx                # Thanh điều hướng sticky với 15 tabs, user profile, PWA install
│   │   └── rc4-diagrams/             # Bộ sơ đồ khối toán học trực quan (SVG/React)
│   │       ├── OverallFlowDiagram.tsx# Sơ đồ khối tổng thể luồng KSA -> PRGA -> XOR
│   │       ├── KsaFlowDiagram.tsx    # Sơ đồ khối chi tiết vòng lặp KSA
│   │       └── PrgaFlowDiagram.tsx   # Sơ đồ khối chi tiết vòng lặp PRGA & trích xuất dòng khóa
│   ├── crypto/
│   │   └── rc4.ts                    # LÕI THUẬT TOÁN: Thuần toán học 100%, không phụ thuộc thư viện ngoài
│   ├── data/
│   │   └── quizQuestions.ts          # Ngân hàng 10 câu hỏi trắc nghiệm RC4 kèm lời giải thích toán học
│   ├── firebase/
│   │   ├── auth.ts                   # Xử lý đăng nhập Google, Email/Password, đăng xuất, đồng bộ profile
│   │   ├── config.ts                 # Khởi tạo Firebase App, Auth, Firestore instance
│   │   ├── errors.ts                 # Chuẩn hóa mã lỗi Firebase sang thông điệp tiếng Việt
│   │   └── firestore.ts              # Các thao tác CRUD & Realtime subscriptions Firestore theo userId
│   ├── pwa/
│   │   ├── OfflineIndicator.tsx      # Thông báo trạng thái Offline/Online không làm gián đoạn UI
│   │   ├── PWAInstallButton.tsx      # Nút bấm & Modal hướng dẫn cài đặt PWA (Desktop/Android/iOS)
│   │   └── usePWAInstall.ts          # Custom Hook bắt sự kiện beforeinstallprompt & standalone mode
│   └── views/
│       ├── AnalysisView.tsx          # Trang phân tích KSA, PRGA, so sánh AES/ChaCha20, các đòn tấn công
│       ├── ApplicationsView.tsx      # Trang lịch sử ứng dụng (WEP, WPA, SSL) và dòng thời gian khai tử
│       ├── ArchitectureView.tsx      # Trang tài liệu kiến trúc kỹ thuật hệ thống
│       ├── BenchmarkView.tsx         # Trang đo đạc hiệu năng (1KB - 5MB) so sánh đối chứng AES-GCM
│       ├── CipherToolView.tsx        # Trang công cụ mã hóa/giải mã văn bản/hex/TinyRC4 có lưu lịch sử
│       ├── DownloadView.tsx          # Trang tải về Python CLI, mã nguồn, cài đặt PWA
│       ├── ExperimentsView.tsx       # Phòng thí nghiệm: Bias test, Key reuse, RC4-drop[n], Avalanche
│       ├── HandCalculationView.tsx   # Trang tính tay ví dụ bài giảng N=8, K=[2,1,3], P="BAG", kèm 3 sơ đồ SVG
│       ├── HistoryView.tsx           # Trang xem và quản lý lịch sử mã hóa, thí nghiệm, điểm thi
│       ├── HomeView.tsx              # Trang chủ: Tổng quan RC4, Stream vs Block, lộ trình học tập
│       ├── OpenSourceView.tsx        # Trang mã nguồn mở, giấy phép MIT, danh mục thư viện bên thứ ba
│       ├── QuizView.tsx              # Trang làm bài trắc nghiệm 10 câu có chấm điểm & hiệu ứng pháo hoa
│       ├── TestingView.tsx           # Trang chạy 16 ca kiểm thử tự động (Test vectors, Round-trip, Edge)
│       ├── UxDesignView.tsx          # Trang tài liệu thiết kế UX/UI (Personas, User Flow, Wireframe)
│       └── VisualizerView.tsx        # Bộ mô phỏng từng bước mảng trạng thái S (Full RC4 16x16 & TinyRC4)
├── tsconfig.json                     # Cấu hình TypeScript compiler (ES2022, bundler, paths alias @/*)
└── vite.config.ts                    # Cấu hình Vite, Tailwind CSS plugin, VitePWA cấu hình cache offline
```

### 1.2. Điểm nhập (Entry Point) & Cơ chế Điều hướng (Routing)

* **Entry Point:** [index.html](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/index.html) tải [src/main.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/main.tsx) $\rightarrow$ đăng ký PWA Service Worker $\rightarrow$ render [src/App.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/App.tsx).
* **Cơ chế Routing:** Sử dụng **State-based Tab Routing** trong [src/App.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/App.tsx) thông qua state `activeTab: NavTab` với 15 tab định danh. Không dùng `react-router-dom` giúp ứng dụng chuyển tab tức thì không tải lại trang, duy trì trạng thái mô phỏng liên tục và chạy offline trơn tru trong chế độ PWA.
* **Liên kết giữa các trang:**
  * [Navbar.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/components/Navbar.tsx) chứa toàn bộ 15 tab với icon và badge tương ứng.
  * [HomeView.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/views/HomeView.tsx) chứa các CTA card dẫn nhanh tới `visualizer`, `hand_calculation`, `cipher`, `experiments`, `benchmark`, `quiz`.
  * [Footer.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/components/Footer.tsx) liên kết đến tất cả các trang học thuật và kỹ thuật.

### 1.3. Phân tích Thư viện phụ thuộc (Dependencies) trong package.json

| Thư viện | Khai báo | Thực tế có dùng? | Vị trí sử dụng / Nhận xét |
| :--- | :--- | :---: | :--- |
| `react`, `react-dom` | `^19.0.1` | **CÓ** | Khung giao diện toàn bộ ứng dụng |
| `typescript` | `^7.0.2` | **CÓ** | Trình biên dịch TypeScript |
| `vite` | `^8.3.0` | **CÓ** | Bundler & Dev server |
| `@tailwindcss/vite`, `tailwindcss` | `^4.3.3` | **CÓ** | Styling toàn bộ giao diện Dark Theme |
| `lucide-react` | `^0.546.0` | **CÓ** | Bộ biểu tượng icon xuyên suốt các view |
| `firebase` | `^12.19.0` | **CÓ** | Auth (Google, Email) & Cloud Firestore |
| `vite-plugin-pwa` | `^1.3.0` | **CÓ** | Đóng gói Service Worker & Web App Manifest |
| `canvas-confetti` | `^1.9.4` | **CÓ** | Hiệu ứng pháo hoa khi đạt điểm cao trong `QuizView.tsx` |
| `@google/genai` | `^2.4.0` | **KHÔNG** | ❌ Dư thừa (do Google AI Studio tự sinh ra template, mã nguồn không hề gọi Gemini API) |
| `express`, `@types/express` | `^4.21.2` | **KHÔNG** | ❌ Dư thừa (ứng dụng là SPA tĩnh, không có backend Express) |
| `dotenv` | `^17.2.3` | **KHÔNG** | ❌ Dư thừa (Vite tự xử lý biến môi trường qua `import.meta.env`) |
| `motion` | `^12.23.24` | **KHÔNG** | ❌ Dư thừa (chỉ được nhắc tên trong OpenSourceView, không import trong code) |

---

## 2. KIỂM TRA SỨC KHỎE DỰ ÁN (HEALTH CHECK)

### 2.1. Kết quả thực thi `npm run build` và `npm run lint`

1. **`npm run lint` (`tsc --noEmit`):**
   * **Kết quả:** Thất bại (Exit code 1).
   * **Nguyên nhân chi tiết:** Thư mục `node_modules/` chưa được cài đặt trong thư mục dự án (chỉ có `package.json` và `bun.lock`). Trình biên dịch `tsc` hệ thống báo lỗi không tìm thấy các tệp định kiểu (type definitions) được cấu hình trong `tsconfig.json`:
     * `error TS2688: Cannot find type definition file for 'vite-plugin-pwa/client'.`
     * `error TS2688: Cannot find type definition file for 'vite/client'.`
2. **`npm run build` (`vite build`):**
   * **Kết quả:** Thất bại (Exit code 1).
   * **Nguyên nhân:** Lệnh `vite` không tồn tại do chưa chạy `npm install` để sinh thư mục thực thi cục bộ `node_modules/.bin/vite`.

### 2.2. Kiểm tra công việc dở dang & Xung đột mã (Half-finished Work & Conflicts)

* **TODO / FIXME / STUB:** Không có thẻ `TODO` hay `FIXME` bỏ ngỏ trong toàn bộ thư mục `src/`.
* **Trang / Route trỏ đến tệp không tồn tại:** 100% 15 tab trong `Navbar.tsx` đều có component tương ứng trong `src/views/` và được import đầy đủ trong `App.tsx`. Không có trang nào bị thiếu (missing route).
* **Tệp bị cắt cụt (Truncated files):** Tất cả các tệp `.tsx`, `.ts`, `.py`, `.json` đều có cấu trúc đóng mở ngoặc nguyên vẹn, không bị dừng đột ngột giữa chừng do chạm giới hạn token của AI Studio.
* **Xung đột & Dư thừa mã (Duplicated Code):**
  1. **Tệp `rc4_cli.py` bị nhân bản 3 nơi:**
     * `./rc4_cli.py` (tại thư mục gốc dự án)
     * `./public/rc4_cli.py` (trong thư mục tĩnh)
     * Chuỗi hằng số `PYTHON_CLI_CODE` bên trong `src/views/DownloadView.tsx` (dòng 31-150)
     $\rightarrow$ Dễ dẫn đến lệch pha khi sửa lỗi thuật toán hoặc cập nhật tính năng.
  2. **Lỗi mã hóa ký tự CP1252 trên Windows của `rc4_cli.py`:**
     * Khi chạy trực tiếp `python rc4_cli.py --test` trên terminal Windows PowerShell mặc định, script bị crash ngay lập tức với lỗi:
       `UnicodeEncodeError: 'charmap' codec can't encode character '\u1ed8'` do in tiếng Việt có dấu mà không cấu hình `sys.stdout.reconfigure(encoding='utf-8')`.

---

## 3. BẢNG KIỂM TRA YÊU CẦU DỰ ÁN (REQUIREMENT CHECKLIST)

| STT | Hạng mục yêu cầu | Đánh giá | Tệp tin minh chứng (Evidence) | Chi tiết nhận xét |
| :---: | :--- | :---: | :--- | :--- |
| **a** | Cài đặt từ đầu 2 phiên bản: TinyRC4 (N=4,8,16; mặc định 8; từ 3-bit) và Full RC4 (256 bytes), thuần túy không UI | **DONE** | [src/crypto/rc4.ts](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/crypto/rc4.ts#L521-L1005) | Cài đặt 100% scratch với `tinyRc4Ksa`, `tinyRc4Prga`, `fullRc4Ksa`, `fullRc4Prga`, `TinyRC4`, `FullRC4`. Không dùng bất kỳ thư viện mật mã nào. |
| **b** | Mã hóa VÀ giải mã cho cả 2 phiên bản, có cờ `trace` trả về đầy đủ bước trung gian | **DONE** | [src/crypto/rc4.ts](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/crypto/rc4.ts#L642-L947) | Đầy đủ `tinyRc4Encrypt`, `tinyRc4Decrypt`, `fullRc4Encrypt`, `fullRc4Decrypt`. Khi `trace=true`, trả về `i, j, sBefore, sAfter, swapped, t, k, formula, explanation`. |
| **c** | Đầy đủ các trang: Giới thiệu, Phân tích (KSA/PRGA, so sánh AES/ChaCha20, an toàn), Ứng dụng thực tế, Visualizer, Mã hóa/Giải mã, Thực nghiệm (bias, key reuse, RC4-drop, avalanche), Quiz, Lịch sử, Mã nguồn mở, Kiến trúc, UX/UI, Kiểm thử | **DONE** | [src/views/](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/views/) | Cả 12 trang theo yêu cầu (cộng thêm Benchmark, Download, HandCalculation = 15 trang) đều đã được xây dựng hoàn chỉnh, nội dung tiếng Việt chuyên sâu. |
| **d** | Trang tính tay TinyRC4 kèm sơ đồ khối SVG/React cho luồng tổng thể, KSA, PRGA | **DONE** | [src/views/HandCalculationView.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/views/HandCalculationView.tsx)<br>[src/components/rc4-diagrams/](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/components/rc4-diagrams/) | Đã có `OverallFlowDiagram.tsx`, `KsaFlowDiagram.tsx`, `PrgaFlowDiagram.tsx` vẽ bằng SVG động, đồng bộ trực tiếp với các bước tính tay. |
| **e** | Chế độ mã hóa tập tin (File mode): Text hoặc ảnh nhỏ trên trình duyệt, kiểm chứng SHA-256 round-trip | **DONE** | [src/components/FileCipherPanel.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/components/FileCipherPanel.tsx) | Hỗ trợ tải tệp text/ảnh, mã hóa qua `fullRc4ProcessUint8Array`, vẽ noise canvas, tính SHA-256 qua WebCrypto và đối chiếu toàn vẹn 100%. |
| **f** | Trang đo hiệu năng (Performance Benchmark: thời gian vs kích thước dữ liệu) | **DONE** | [src/views/BenchmarkView.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/views/BenchmarkView.tsx) | Đo trên 5 khối (1KB, 10KB, 100KB, 1MB, 5MB), tính throughput (MB/s), min/max/avg, vẽ đồ thị SVG Linear/Log, đối chiếu WebCrypto AES-GCM. |
| **g** | Bộ kiểm thử: $\ge$ 3 ca tự viết, RFC 6229 / test vectors chuẩn, ví dụ TinyRC4, round-trip, bảng kết quả kèm xuất file | **PARTIAL** | [src/views/TestingView.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/views/TestingView.tsx) | Có 16 test cases (RFC 6229, Wikipedia, Tactical Dawn, TinyRC4, Round-trip, Edge cases) nhưng **THIẾU NÚT XUẤT KẾT QUẢ RA FILE (Export CSV/JSON)** trong `TestingView`. |
| **h** | Firebase: Đăng nhập Email/Google, Firestore lưu lịch sử/kết quả/quiz riêng theo user, rules hạn chế theo user, trang công khai chạy không cần login | **BROKEN** | [src/firebase/config.ts](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/firebase/config.ts)<br>[firestore.rules](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/firestore.rules) | 1. Trang public hoạt động tốt không cần login.<br>2. **LỖI:** `firestore.rules` chặn lưu TinyRC4 (`inputFormat` chỉ cho `text, hex`, trong khi `CipherToolView` gửi `tiny-N8`).<br>3. `config.ts` import cứng tệp JSON của AI Studio chứa API key thật thay vì dùng `import.meta.env`. |
| **i** | PWA: `manifest.json`, service worker đã đăng ký, nút cài đặt hoạt động, hỗ trợ offline | **DONE** | [public/manifest.json](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/public/manifest.json)<br>[src/main.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/main.tsx)<br>[src/pwa/](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/pwa/) | Đăng ký qua `virtual:pwa-register`, cấu hình Workbox cache fonts/assets trong `vite.config.ts`, hook `usePWAInstall`, nút `PWAInstallButton`, banner `OfflineIndicator`. |
| **j** | Tải về Python CLI độc lập (`rc4_cli.py`) có encrypt/decrypt và `--test` | **PARTIAL** | [rc4_cli.py](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/rc4_cli.py) | Đã có encrypt/decrypt và `--test`, tuy nhiên: 1) Crash trên Windows console do lỗi mã hóa Unicode tiếng Việt; 2) Chưa hỗ trợ chế độ TinyRC4 trong CLI. |
| **k** | Mã nguồn mở: README.md (tiếng Việt), LICENSE (MIT), .env.example, không lộ API key cứng trong toàn repo | **BROKEN** | [firebase-applet-config.json](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/firebase-applet-config.json) | README, LICENSE, .env.example đầy đủ chuẩn mực. Tuy nhiên, tệp `firebase-applet-config.json` chứa mã khóa cứng `apiKey: "AIzaSyDe0he5-ojsFZO4ey9nqKzFz7LmiEhDZk0"` đang nằm công khai trong repo. |

---

## 4. KIỂM ĐỊNH TÍNH ĐÚNG ĐẮN CỦA THUẬT TOÁN (ALGORITHM CORRECTNESS CHECK)

Đã thiết lập script kiểm định độc lập tại scratch space ngoài repository (`verify_rc4.py`) và chạy kiểm tra qua Python 3.13. Kết quả đối chiếu chi tiết:

### 4.1. Đối chuẩn Ví dụ Giảng viên trên lớp (Lecturer's TinyRC4 Example)

* **Tham số đầu vào:**
  * Kích thước mảng: $N = 8$ (từ mã 3-bit, giá trị $0 \dots 7$)
  * Khóa bí mật: $K = [2, 1, 3]$ (độ dài 3)
  * Mảng lặp khóa: $T[i] = K[i \pmod 3] \Rightarrow T = [2, 1, 3, 2, 1, 3, 2, 1]$
  * Bản rõ: $001\ 000\ 110_2$ ứng với các chữ cái `"BAG"` (quy ước $A=0 \dots H=7 \Rightarrow P = [1, 0, 6]$)
* **Kết quả từng giai đoạn:**
  * **KSA:** Công thức $j = (j + S[i] + T[i]) \pmod 8$, hoán đổi $S[i] \leftrightarrow S[j]$.  
    $\Rightarrow$ Mảng $S$ sau KSA thu được: `[6, 0, 7, 1, 2, 3, 5, 4]` (**CHÍNH XÁC 100%**).
  * **PRGA Bước 0:** $i = 1, j = (0 + S[1]) \pmod 8 = 0$. Hoán đổi $S[1] \leftrightarrow S[0] \Rightarrow S = [0, 6, 7, 1, 2, 3, 5, 4]$.  
    $t = (S[1] + S[0]) \pmod 8 = (6 + 0) \pmod 8 = 6 \Rightarrow k_0 = S[6] = 5$ ($101_2$) (**CHÍNH XÁC 100%**).
  * **PRGA Bước 1:** $i = 2, j = (0 + S[2]) \pmod 8 = 7$. Hoán đổi $S[2] \leftrightarrow S[7] \Rightarrow S = [0, 6, 4, 1, 2, 3, 5, 7]$.  
    $t = (S[2] + S[7]) \pmod 8 = (4 + 7) \pmod 8 = 3 \Rightarrow k_1 = S[3] = 1$ ($001_2$) (**CHÍNH XÁC 100%**).
  * **PRGA Bước 2:** $i = 3, j = (7 + S[3]) \pmod 8 = 0$. Hoán đổi $S[3] \leftrightarrow S[0] \Rightarrow S = [1, 6, 4, 0, 2, 3, 5, 7]$.  
    $t = (S[3] + S[0]) \pmod 8 = (0 + 1) \pmod 8 = 1 \Rightarrow k_2 = S[1] = 6$ ($110_2$) (**CHÍNH XÁC 100%**).
  * **Dòng khóa (Keystream):** `[5, 1, 6]` ($101\ 001\ 110_2$) (**CHÍNH XÁC 100%**).
  * **Bản mã (Ciphertext):** $C = P \oplus K = [1\oplus 5, 0\oplus 1, 6\oplus 6] = [4, 1, 0]$ ($100\ 001\ 000_2 \Rightarrow$ `"EBA"`) (**CHÍNH XÁC 100%**).
  * **Giải mã (Decryption):** $P = C \oplus K = [4\oplus 5, 1\oplus 1, 0\oplus 6] = [1, 0, 6]$ ($001\ 000\ 110_2 \Rightarrow$ `"BAG"`) (**CHÍNH XÁC 100%**).

### 4.2. Đối chuẩn Test Vectors Quốc Tế của Full RC4 (N = 256)

1. **RFC 6229 / Standard Vector 1:**
   * Key: `"Key"` (`[0x4B, 0x65, 0x79]`)
   * Plaintext: `"Plaintext"`
   * Ciphertext Hex thực tế thu được: `BBF316E8D940AF0AD3` (**CHÍNH XÁC 100%**).
2. **Wikipedia Reference Vector:**
   * Key: `"Wiki"`
   * Plaintext: `"pedia"`
   * Ciphertext Hex thực tế thu được: `1021BF0420` (**CHÍNH XÁC 100%**).
3. **Tactical Dawn Military Vector:**
   * Key: `"Secret"`
   * Plaintext: `"Attack at dawn"`
   * Ciphertext Hex thực tế thu được: `45A01F645FC35B383552544B9BF5` (**CHÍNH XÁC 100%**).

### 4.3. Đánh giá Thuật ngữ & Các tuyên bố sai lệch trong Giao diện (Terminology Audit)

1. **Khẳng định về WebCrypto đối với RC4:**
   * **Kết quả:** KHÔNG CÓ bất kỳ tuyên bố sai lệch nào trong code hoặc UI gán RC4 vào WebCrypto API. WebCrypto chỉ được dùng duy nhất cho:
     * Tính mã băm `SHA-256` kiểm tra toàn vẹn tệp ([src/crypto/rc4.ts#L1011](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/crypto/rc4.ts#L1011), [src/components/FileCipherPanel.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/components/FileCipherPanel.tsx)).
     * Chạy thuật toán đối chứng AES-GCM trong [src/views/BenchmarkView.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/views/BenchmarkView.tsx).
2. **Tuyên bố sai lệch thuật ngữ: "S-Box" thay vì "Mảng S" (CẦN SỬA):**
   * Trong mật mã học, **S-Box (Substitution-Box)** là bảng thế phi tuyến tĩnh (như trong DES, AES Rijndael S-Box). Thuật toán RC4 **hoàn toàn không có S-Box**, mà là **mảng trạng thái hoán vị $S$ (Permutation State Array)** gồm $N$ phần tử được hoán vị liên tục trong bộ nhớ.
   * Hiện tại, giao diện của ứng dụng đang dùng nhầm thuật ngữ "S-Box" tại 8 vị trí:
     * `Navbar.tsx` (dòng 63): Nhãn tab hiển thị `"Mô Phỏng S-Box"`.
     * `VisualizerView.tsx` (dòng 233, 566): `"TinyRC4 (1 Hàng S-Box)"`, `"Ma Trận Trạng Thái S-Box (16x16 = 256 Ô)"`.
     * `DownloadView.tsx` (dòng 521): `"cho phép mô phỏng S-Box 16x16"`.
     * `AnalysisView.tsx` (dòng 201): `"Mảng trạng thái hoán vị S-box 256 byte"`.
     * `PWAInstallButton.tsx` (dòng 160): `"lưu trữ cục bộ mảng S-Box"`.
     * `Footer.tsx` (dòng 52): `"Mô phỏng ma trận 16x16 S-Box"`.
     * `README.md` (dòng 75): `"Mô phỏng Ma trận 16x16 S-Box"`.
3. **Thư viện ngoài trong Lõi Mật mã:**
   * Tệp `src/crypto/rc4.ts` không import bất kỳ thư viện nào (`crypto-js`, `node:crypto`, v.v.). Thuần túy toán tử nguyên thủy `[]`, `^`, `%`, `& 0xff`.

---

## 5. BẢO MẬT & CHẤT LƯỢNG MÃ NGUỒN (SECURITY & CODE QUALITY)

### 5.1. Phân tích Firestore Security Rules (`firestore.rules`)

* **Điểm mạnh:**
  * Áp dụng nguyên tắc phòng vệ theo chiều sâu (Defense-in-depth): Mặc định cấm toàn bộ `match /{document=**} { allow read, write: if false; }`.
  * Phân quyền chặt chẽ theo `request.auth.uid == userId` (ngăn đọc chéo dữ liệu giữa các sinh viên).
  * Quy tắc bất biến (Immutability): Cấm sửa đổi bản ghi chạy mã hóa (`encryption_runs`), thực nghiệm (`experiment_runs`), và điểm thi (`quiz_scores`).
  * Giới hạn kích thước xâu ký tự nghiêm ngặt (tránh tấn công làm cạn kiệt tài nguyên - Denial of Wallet).
* **Lỗ hổng logic nghiêm trọng (Bug):**
  * Trong hàm `isValidEncryptionRun(data)`:
    ```javascript
    data.inputFormat in ['text', 'hex'] &&
    data.outputFormat in ['hex', 'base64'] &&
    ```
  * Nhưng trong component [src/views/CipherToolView.tsx](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/views/CipherToolView.tsx#L228-L229):
    ```typescript
    inputFormat: cipherVersion === 'full' ? inputFormat : `tiny-N${tinyN}`,
    outputFormat: cipherVersion === 'full' ? outputFormat : tinyDisplayFormat,
    ```
  * Khi người dùng thực hiện mã hóa TinyRC4 và bấm "Lưu vào Lịch sử", giá trị `inputFormat` là `'tiny-N8'`, `outputFormat` là `'numbers'` hoặc `'binary'` $\Rightarrow$ **Bị Firestore Rules từ chối ngay lập tức với lỗi `permission-denied`!**

### 5.2. Khóa bí mật và thông tin nhạy cảm (Hard-coded Secrets)

* **Phát hiện:** Tệp `firebase-applet-config.json` chứa khóa Firebase API Key thật:
  ```json
  "apiKey": "AIzaSyDe0he5-ojsFZO4ey9nqKzFz7LmiEhDZk0"
  ```
* **Vấn đề cấu hình:**
  * [src/firebase/config.ts](file:///c:/Users/Admin/Downloads/RC4%20Prototype_1/src/firebase/config.ts#L4) import cứng tệp JSON này:
    `import firebaseConfig from '../../firebase-applet-config.json';`
  * Dẫn đến: Tệp `.env` và các biến môi trường `VITE_FIREBASE_*` bị bỏ qua hoàn toàn. Khi người khác clone dự án hoặc đưa lên môi trường mới, ứng dụng vẫn trỏ về Firebase applet cũ hoặc báo lỗi nếu xóa file JSON.

### 5.3. Tách biệt kiến trúc (Architectural Separation)

* **Lõi giải thuật vs Giao diện:** Tách biệt xuất sắc. Toàn bộ logic KSA/PRGA/Trace tập trung trong `src/crypto/rc4.ts`, hoàn toàn độc lập với React state và DOM.
* **Component Modularity:** Phân chia rõ ràng thành `components/`, `components/rc4-diagrams/`, `views/`, `firebase/`, `pwa/`.
* **Chất lượng chú thích (Comment Quality):** Cực kỳ chi tiết, diễn giải từng bước toán học bằng tiếng Việt chuẩn mực sư phạm.

---

## 6. KẾ HOẠCH XỬ LÝ ƯU TIÊN (PRIORITIZED FIX PLAN)

Dưới đây là danh sách các lỗi và cải tiến cần thực hiện, được phân loại theo mức độ ưu tiên và chia thành các nhóm nhỏ (batches) độc lập:

### 🔴 NHÓM 1 (BATCH 1): SỬA LỖI NỀN TẢNG & XÂY DỰNG DỰ ÁN (P0 - Blocks Build & Platform)
> **Mục tiêu:** Khôi phục `node_modules`, giải quyết triệt để lỗi biên dịch `tsc` và `vite build`, đảm bảo `npm run build` và `npm run lint` đạt 100% Pass.

1. **[P0] Cài đặt dependencies cục bộ:**
   * *Tệp tin:* `package.json`, `node_modules/`
   * *Hành động:* Chạy `npm install` để khôi phục các gói từ `package.json`.
   * *Ước tính:* Nhỏ (Small).
2. **[P0] Loại bỏ dependencies thừa và dọn dẹp `package.json`:**
   * *Tệp tin:* `package.json`
   * *Hành động:* Loại bỏ `@google/genai`, `express`, `@types/express`, `dotenv`, `motion` không sử dụng; loại bỏ capability Gemini trong `metadata.json`.
   * *Ước tính:* Nhỏ (Small).
3. **[P0] Xác thực `npm run lint` (`tsc --noEmit`) và `npm run build`:**
   * *Tệp tin:* `tsconfig.json`, `vite.config.ts`
   * *Hành động:* Chạy xác minh type-check và build bundle tĩnh vào `dist/`.
   * *Ước tính:* Nhỏ (Small).

---

### 🟠 NHÓM 2 (BATCH 2): SỬA LỖI BẢO MẬT & ĐỒNG BỘ CẤU HÌNH FIREBASE (P0 - Security & Core Correctness)
> **Mục tiêu:** Xử lý rò rỉ API key, đồng bộ cấu hình qua `.env`, và sửa Firestore Rules để hỗ trợ lưu lịch sử TinyRC4.

4. **[P0] Sửa lỗi Firestore Rules chặn bản ghi TinyRC4:**
   * *Tệp tin:* `firestore.rules`, `security_spec.md`, `firebase-blueprint.json`
   * *Hành động:* Mở rộng `isValidEncryptionRun` để chấp nhận `inputFormat in ['text', 'hex', 'tiny-N4', 'tiny-N8', 'tiny-N16']` và `outputFormat in ['hex', 'base64', 'numbers', 'binary']`.
   * *Ước tính:* Nhỏ (Small).
5. **[P0] Chuyển đổi Firebase Config sang đọc biến môi trường Vite (`import.meta.env`):**
   * *Tệp tin:* `src/firebase/config.ts`, `.gitignore`, `firebase-applet-config.json`
   * *Hành động:* Cập nhật `config.ts` ưu tiên đọc `import.meta.env.VITE_FIREBASE_*`, fallback an toàn nếu thiếu; ẩn/loại bỏ API key nhạy cảm khỏi repo git.
   * *Ước tính:* Vừa (Medium).

---

### 🟡 NHÓM 3 (BATCH 3): HOÀN THIỆN CLI PYTHON & XÓA TRÙNG LẶP MÃ (P1 - Missing Requirements)
> **Mục tiêu:** Khắc phục crash UTF-8 trên Windows cho `rc4_cli.py`, bổ sung tính năng TinyRC4 cho CLI, và hợp nhất các bản sao.

6. **[P1] Sửa lỗi Unicode Encoding crash trên Windows cho `rc4_cli.py`:**
   * *Tệp tin:* `rc4_cli.py`, `public/rc4_cli.py`, `src/views/DownloadView.tsx`
   * *Hành động:* Bổ sung cấu hình `sys.stdout.reconfigure(encoding='utf-8')` ngay đầu script để chạy mượt mà trên mọi terminal Windows CP1252.
   * *Ước tính:* Nhỏ (Small).
7. **[P1] Bổ sung chế độ TinyRC4 (N=4, 8, 16) và test vector giảng viên vào Python CLI:**
   * *Tệp tin:* `rc4_cli.py`, `public/rc4_cli.py`, `src/views/DownloadView.tsx`
   * *Hành động:* Thêm cờ `--tiny [N]`, hàm `tiny_rc4_crypt`, và tích hợp ca kiểm tra ví dụ giảng viên $N=8, K=[2,1,3], P=[1,0,6]$ vào lệnh `--test`.
   * *Ước tính:* Vừa (Medium).

---

### 🟢 NHÓM 4 (BATCH 4): BỔ SUNG TÍNH NĂNG XUẤT TEST SUITE & CHUẨN HÓA THUẬT NGỮ (P1/P2 - Polish & Standards)
> **Mục tiêu:** Thêm tính năng xuất file kết quả kiểm thử trong `TestingView`, và chuẩn hóa thuật ngữ "Mảng trạng thái S" thay vì "S-Box".

8. **[P1] Bổ sung tính năng Xuất kết quả kiểm thử (Export Results CSV/JSON) trong `TestingView`:**
   * *Tệp tin:* `src/views/TestingView.tsx`
   * *Hành động:* Thêm nút "Xuất Kết Quả Kiểm Thử (CSV / JSON)" tải về máy báo cáo 16 ca test.
   * *Ước tính:* Nhỏ (Small).
9. **[P2] Chuẩn hóa thuật ngữ "Mảng hoán vị S" thay thế "S-Box" trên toàn bộ giao diện:**
   * *Tệp tin:* `Navbar.tsx`, `VisualizerView.tsx`, `DownloadView.tsx`, `AnalysisView.tsx`, `PWAInstallButton.tsx`, `Footer.tsx`, `README.md`
   * *Hành động:* Thay thế hoặc làm rõ: RC4 sử dụng "Mảng trạng thái hoán vị $S$ kích thước $N$" (hiển thị dưới dạng lưới 16x16 để quan sát), phân biệt rõ với khối thay thế phi tuyến tĩnh (S-Box) của AES/DES.
   * *Ước tính:* Vừa (Medium).

---

## 7. KẾT LUẬN & ĐỀ XUẤT

Dự án **RC4 Lab** sở hữu chất lượng thuật toán cốt lõi và giao diện xuất sắc:
* 100% công thức toán học KSA, PRGA, hoán vị và XOR đều trùng khớp chính xác từng bit với ví dụ bài giảng của giảng viên và chuẩn RFC quốc tế.
* Hệ thống giao diện trực quan, giàu tính giáo dục với 15 view chuyên đề, sơ đồ khối SVG sinh động, hỗ trợ PWA offline toàn diện.
* Các vấn đề phát hiện đều là các lỗi cấu hình phụ trợ (thiếu `node_modules`, crash encoding console Windows, rules chặn lưu TinyRC4, và nhầm lẫn thuật ngữ S-Box).

---
**Which batch should I fix first?**
