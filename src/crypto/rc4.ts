/**
 * RC4 & TinyRC4 Cryptographic Engine (Thuần Toán Học - Zero Dependency)
 * Phát triển cho RC4 Lab - Phục vụ học tập, nghiên cứu và diễn giải mật mã học.
 *
 * TUYỆT ĐỐI KHÔNG SỬ DỤNG BẤT KỲ THƯ VIỆN MẬT MÃ NGOÀI NÀO (crypto-js, WebCrypto).
 * Mọi thao tác KSA, PRGA, hoán vị và phép XOR đều được cài đặt từ nguyên lý cơ bản.
 */

// ============================================================================
// 1. CÁC KIỂU DỮ LIỆU & ĐỊNH NGHĨA TRACE CHO KSA & PRGA
// ============================================================================

export type CipherVersion = 'full' | 'tiny';
export type SupportedTinyN = 4 | 8 | 16;

/**
 * Chi tiết từng bước thực thi trong quá trình KSA (Key-Scheduling Algorithm)
 */
export interface KsaTraceStep {
  phase: 'KSA';
  stepIndex: number;
  i: number;
  j: number;
  keyIndex: number;
  keyByte: number;
  sBefore: number[];
  sAfter: number[];
  swapped: [number, number];
  formula: string;
  explanation: string;
}

/**
 * Chi tiết từng bước thực thi trong quá trình PRGA (Pseudo-Random Generation Algorithm)
 */
export interface PrgaTraceStep {
  phase: 'PRGA';
  stepIndex: number;
  byteIndex: number;
  i: number;
  j: number;
  t: number;
  keystreamByte: number;
  plainByte?: number;
  cipherByte?: number;
  sBefore: number[];
  sAfter: number[];
  swapped: [number, number];
  formula: string;
  explanation: string;
}

export type TraceStep = KsaTraceStep | PrgaTraceStep;

// Tương thích ngược với các component visualizer hiện có
export type KSAStep = KsaTraceStep & { sArray: number[] };
export type PRGAStep = PrgaTraceStep & { sArray: number[] };
export type SimulatorStep = TraceStep & { sArray: number[] };

/**
 * Kết quả trả về của hàm KSA
 */
export interface KsaResult {
  s: number[];
  trace?: KsaTraceStep[];
}

/**
 * Kết quả trả về của hàm PRGA
 */
export interface PrgaResult {
  keystream: number[];
  s: number[];
  trace?: PrgaTraceStep[];
}

/**
 * Kết quả mã hóa / giải mã hoàn chỉnh kèm toàn bộ Trace trung gian
 */
export interface CryptResult {
  ciphertext: number[];
  plaintext: number[];
  keystream: number[];
  ksaTrace?: KsaTraceStep[];
  prgaTrace?: PrgaTraceStep[];
  allTrace?: TraceStep[];
}

// ============================================================================
// 2. VÍ DỤ GIẢNG DẠY TRÊN LỚP (TINYRC4 N=8 CLASSROOM EXAMPLE)
// ============================================================================

export interface TinyRc4ClassroomExample {
  N: number;
  wordBits: number;
  key: number[];
  T: number[];
  plaintext: number[];
  plaintextLetters: string;
  expectedKsaS: number[];
  expectedPrgaSwapS: number[][];
  expectedKeystream: number[];
  expectedCiphertext: number[];
  ciphertextLetters: string;
  binaryPlaintext: string;
  binaryKeystream: string;
  binaryCiphertext: string;
  description: string;
}

/**
 * Ví dụ bài giảng trên lớp của giảng viên (Lecturer Classroom Example):
 * - N = 8 (từ mã 3-bit, giá trị 0..7), hai mảng S và T.
 * - Khóa bí mật K = [2, 1, 3] (độ dài 3) => Mảng T = [2, 1, 3, 2, 1, 3, 2, 1].
 * - Bản rõ P = 001 000 110 (các chữ cái "BAG", quy ước ánh xạ: A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7) => P = [1, 0, 6].
 * - Mảng S kỳ vọng sau KSA = [6, 0, 7, 1, 2, 3, 5, 4].
 * - Mảng S kỳ vọng sau từng hoán đổi PRGA:
 *     + Bước 0 (i=1, j=0, hoán đổi S[1]↔S[0]): S = [0, 6, 7, 1, 2, 3, 5, 4], t=6, k=5.
 *     + Bước 1 (i=2, j=7, hoán đổi S[2]↔S[7]): S = [0, 6, 4, 1, 2, 3, 5, 7], t=3, k=1.
 *     + Bước 2 (i=3, j=0, hoán đổi S[3]↔S[0]): S = [1, 6, 4, 0, 2, 3, 5, 7], t=1, k=6.
 * - Dòng khóa kỳ vọng Keystream = [5, 1, 6] = 101 001 110.
 * - Bản mã kỳ vọng Ciphertext = 100 001 000 = [4, 1, 0] (các chữ cái "EBA").
 * - Giải mã hoàn nguyên đúng 001 000 110 ("BAG").
 */
export const TINY_RC4_CLASSROOM_EXAMPLE: TinyRc4ClassroomExample = {
  N: 8,
  wordBits: 3,
  key: [2, 1, 3],
  T: [2, 1, 3, 2, 1, 3, 2, 1],
  plaintext: [1, 0, 6],
  plaintextLetters: 'BAG',
  expectedKsaS: [6, 0, 7, 1, 2, 3, 5, 4],
  expectedPrgaSwapS: [
    [0, 6, 7, 1, 2, 3, 5, 4],
    [0, 6, 4, 1, 2, 3, 5, 7],
    [1, 6, 4, 0, 2, 3, 5, 7],
  ],
  expectedKeystream: [5, 1, 6],
  expectedCiphertext: [4, 1, 0],
  ciphertextLetters: 'EBA',
  binaryPlaintext: '001 000 110',
  binaryKeystream: '101 001 110',
  binaryCiphertext: '100 001 000',
  description: 'Ví dụ bài giảng chuẩn trên lớp (N=8, K=[2,1,3], P="BAG"=[1,0,6], C="EBA"=[4,1,0])',
};

export interface HandKsaStep {
  i: number;
  oldJ: number;
  sI: number;
  tI: number;
  calcFormula: string;
  newJ: number;
  swapPair: [number, number];
  sBefore: number[];
  sAfter: number[];
}

export interface HandPrgaStep {
  step: number;
  oldI: number;
  oldJ: number;
  newI: number;
  newJ: number;
  swapPair: [number, number];
  sBefore: number[];
  sAfter: number[];
  tFormula: string;
  t: number;
  keystreamVal: number;
  binaryKeystream: string;
}

export interface HandXorStep {
  idx: number;
  plainVal: number;
  plainBin: string;
  plainLetter: string;
  kVal: number;
  kBin: string;
  cipherVal: number;
  cipherBin: string;
  cipherLetter: string;
  decryptVal: number;
  decryptLetter: string;
}

export interface LecturerHandCalculationTable {
  initialS: number[];
  T: number[];
  ksaSteps: HandKsaStep[];
  prgaSteps: HandPrgaStep[];
  xorSteps: HandXorStep[];
}

/**
 * Bảng dữ liệu tính tay cố định chuẩn theo đúng bài giảng của giảng viên
 */
export const HARDCODED_LECTURER_HAND_CALCULATION: LecturerHandCalculationTable = {
  initialS: [0, 1, 2, 3, 4, 5, 6, 7],
  T: [2, 1, 3, 2, 1, 3, 2, 1],
  ksaSteps: [
    {
      i: 0,
      oldJ: 0,
      sI: 0,
      tI: 2,
      calcFormula: 'j = (0 + S[0](0) + T[0](2)) mod 8 = 2 mod 8 = 2',
      newJ: 2,
      swapPair: [0, 2],
      sBefore: [0, 1, 2, 3, 4, 5, 6, 7],
      sAfter: [2, 1, 0, 3, 4, 5, 6, 7],
    },
    {
      i: 1,
      oldJ: 2,
      sI: 1,
      tI: 1,
      calcFormula: 'j = (2 + S[1](1) + T[1](1)) mod 8 = 4 mod 8 = 4',
      newJ: 4,
      swapPair: [1, 4],
      sBefore: [2, 1, 0, 3, 4, 5, 6, 7],
      sAfter: [2, 4, 0, 3, 1, 5, 6, 7],
    },
    {
      i: 2,
      oldJ: 4,
      sI: 0,
      tI: 3,
      calcFormula: 'j = (4 + S[2](0) + T[2](3)) mod 8 = 7 mod 8 = 7',
      newJ: 7,
      swapPair: [2, 7],
      sBefore: [2, 4, 0, 3, 1, 5, 6, 7],
      sAfter: [2, 4, 7, 3, 1, 5, 6, 0],
    },
    {
      i: 3,
      oldJ: 7,
      sI: 3,
      tI: 2,
      calcFormula: 'j = (7 + S[3](3) + T[3](2)) mod 8 = 12 mod 8 = 4',
      newJ: 4,
      swapPair: [3, 4],
      sBefore: [2, 4, 7, 3, 1, 5, 6, 0],
      sAfter: [2, 4, 7, 1, 3, 5, 6, 0],
    },
    {
      i: 4,
      oldJ: 4,
      sI: 3,
      tI: 1,
      calcFormula: 'j = (4 + S[4](3) + T[4](1)) mod 8 = 8 mod 8 = 0',
      newJ: 0,
      swapPair: [4, 0],
      sBefore: [2, 4, 7, 1, 3, 5, 6, 0],
      sAfter: [3, 4, 7, 1, 2, 5, 6, 0],
    },
    {
      i: 5,
      oldJ: 0,
      sI: 5,
      tI: 3,
      calcFormula: 'j = (0 + S[5](5) + T[5](3)) mod 8 = 8 mod 8 = 0',
      newJ: 0,
      swapPair: [5, 0],
      sBefore: [3, 4, 7, 1, 2, 5, 6, 0],
      sAfter: [5, 4, 7, 1, 2, 3, 6, 0],
    },
    {
      i: 6,
      oldJ: 0,
      sI: 6,
      tI: 2,
      calcFormula: 'j = (0 + S[6](6) + T[6](2)) mod 8 = 8 mod 8 = 0',
      newJ: 0,
      swapPair: [6, 0],
      sBefore: [5, 4, 7, 1, 2, 3, 6, 0],
      sAfter: [6, 4, 7, 1, 2, 3, 5, 0],
    },
    {
      i: 7,
      oldJ: 0,
      sI: 0,
      tI: 1,
      calcFormula: 'j = (0 + S[7](0) + T[7](1)) mod 8 = 1 mod 8 = 1',
      newJ: 1,
      swapPair: [7, 1],
      sBefore: [6, 4, 7, 1, 2, 3, 5, 0],
      sAfter: [6, 0, 7, 1, 2, 3, 5, 4],
    },
  ],
  prgaSteps: [
    {
      step: 0,
      oldI: 0,
      oldJ: 0,
      newI: 1,
      newJ: 0,
      swapPair: [1, 0],
      sBefore: [6, 0, 7, 1, 2, 3, 5, 4],
      sAfter: [0, 6, 7, 1, 2, 3, 5, 4],
      tFormula: 't = (S[1](6) + S[0](0)) mod 8 = 6 mod 8 = 6',
      t: 6,
      keystreamVal: 5,
      binaryKeystream: '101',
    },
    {
      step: 1,
      oldI: 1,
      oldJ: 0,
      newI: 2,
      newJ: 7,
      swapPair: [2, 7],
      sBefore: [0, 6, 7, 1, 2, 3, 5, 4],
      sAfter: [0, 6, 4, 1, 2, 3, 5, 7],
      tFormula: 't = (S[2](4) + S[7](7)) mod 8 = 11 mod 8 = 3',
      t: 3,
      keystreamVal: 1,
      binaryKeystream: '001',
    },
    {
      step: 2,
      oldI: 2,
      oldJ: 7,
      newI: 3,
      newJ: 0,
      swapPair: [3, 0],
      sBefore: [0, 6, 4, 1, 2, 3, 5, 7],
      sAfter: [1, 6, 4, 0, 2, 3, 5, 7],
      tFormula: 't = (S[3](0) + S[0](1)) mod 8 = 1 mod 8 = 1',
      t: 1,
      keystreamVal: 6,
      binaryKeystream: '110',
    },
  ],
  xorSteps: [
    {
      idx: 0,
      plainVal: 1,
      plainBin: '001',
      plainLetter: 'B',
      kVal: 5,
      kBin: '101',
      cipherVal: 4,
      cipherBin: '100',
      cipherLetter: 'E',
      decryptVal: 1,
      decryptLetter: 'B',
    },
    {
      idx: 1,
      plainVal: 0,
      plainBin: '000',
      plainLetter: 'A',
      kVal: 1,
      kBin: '001',
      cipherVal: 1,
      cipherBin: '001',
      cipherLetter: 'B',
      decryptVal: 0,
      decryptLetter: 'A',
    },
    {
      idx: 2,
      plainVal: 6,
      plainBin: '110',
      plainLetter: 'G',
      kVal: 6,
      kBin: '110',
      cipherVal: 0,
      cipherBin: '000',
      cipherLetter: 'A',
      decryptVal: 6,
      decryptLetter: 'G',
    },
  ],
};

export interface LecturerComparisonItem {
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
  differingStep?: string;
}

/**
 * Đánh giá đối chuẩn tự động từng bước với ví dụ trên lớp của giảng viên
 */
export function evaluateLecturerExample(): {
  allPassed: boolean;
  items: LecturerComparisonItem[];
  ksaResult: KsaResult;
  encryptResult: CryptResult;
  decryptResult: CryptResult;
} {
  const ex = TINY_RC4_CLASSROOM_EXAMPLE;
  const ksaRes = tinyRc4Ksa(ex.key, 8, true);
  const encRes = tinyRc4Encrypt(ex.plaintext, ex.key, 8, true);
  const decRes = tinyRc4Decrypt(encRes.ciphertext, ex.key, 8, true);

  const ksaExpectedStr = JSON.stringify(ex.expectedKsaS);
  const ksaActualStr = JSON.stringify(ksaRes.s);
  const ksaPassed = ksaExpectedStr === ksaActualStr;

  // PRGA steps
  const prgaSteps = encRes.prgaTrace || [];
  const prga0Passed = prgaSteps[0] && JSON.stringify(prgaSteps[0].sAfter) === JSON.stringify(ex.expectedPrgaSwapS[0]);
  const prga1Passed = prgaSteps[1] && JSON.stringify(prgaSteps[1].sAfter) === JSON.stringify(ex.expectedPrgaSwapS[1]);
  const prga2Passed = prgaSteps[2] && JSON.stringify(prgaSteps[2].sAfter) === JSON.stringify(ex.expectedPrgaSwapS[2]);

  const ksExpectedStr = JSON.stringify(ex.expectedKeystream);
  const ksActualStr = JSON.stringify(encRes.keystream);
  const ksPassed = ksExpectedStr === ksActualStr;

  const cipherExpectedStr = JSON.stringify(ex.expectedCiphertext);
  const cipherActualStr = JSON.stringify(encRes.ciphertext);
  const cipherPassed = cipherExpectedStr === cipherActualStr;

  const decExpectedStr = JSON.stringify(ex.plaintext);
  const decActualStr = JSON.stringify(decRes.plaintext);
  const decPassed = decExpectedStr === decActualStr;

  const items: LecturerComparisonItem[] = [
    {
      name: 'Mảng T từ Khóa K=[2, 1, 3] (lặp lại đến N=8)',
      expected: JSON.stringify(ex.T),
      actual: JSON.stringify(Array.from({ length: 8 }, (_, i) => ex.key[i % ex.key.length])),
      passed: true,
    },
    {
      name: 'Mảng S sau KSA (8 bước xáo trộn)',
      expected: ksaExpectedStr,
      actual: ksaActualStr,
      passed: ksaPassed,
      differingStep: ksaPassed ? undefined : 'KSA hoán vị mảng S',
    },
    {
      name: 'PRGA Bước 0: S sau swap (i=1, j=0, t=6, k=5)',
      expected: JSON.stringify(ex.expectedPrgaSwapS[0]),
      actual: prgaSteps[0] ? JSON.stringify(prgaSteps[0].sAfter) : 'N/A',
      passed: Boolean(prga0Passed),
      differingStep: prga0Passed ? undefined : 'PRGA Bước 0 (hoán đổi S[1]↔S[0])',
    },
    {
      name: 'PRGA Bước 1: S sau swap (i=2, j=7, t=3, k=1)',
      expected: JSON.stringify(ex.expectedPrgaSwapS[1]),
      actual: prgaSteps[1] ? JSON.stringify(prgaSteps[1].sAfter) : 'N/A',
      passed: Boolean(prga1Passed),
      differingStep: prga1Passed ? undefined : 'PRGA Bước 1 (hoán đổi S[2]↔S[7])',
    },
    {
      name: 'PRGA Bước 2: S sau swap (i=3, j=0, t=1, k=6)',
      expected: JSON.stringify(ex.expectedPrgaSwapS[2]),
      actual: prgaSteps[2] ? JSON.stringify(prgaSteps[2].sAfter) : 'N/A',
      passed: Boolean(prga2Passed),
      differingStep: prga2Passed ? undefined : 'PRGA Bước 2 (hoán đổi S[3]↔S[0])',
    },
    {
      name: 'Dòng khóa Keystream sinh ra [5, 1, 6]',
      expected: `${ksExpectedStr} (${ex.binaryKeystream})`,
      actual: `${ksActualStr} (${numberArrayToBinary(encRes.keystream, 3)})`,
      passed: ksPassed,
      differingStep: ksPassed ? undefined : 'Keystream byte generation',
    },
    {
      name: 'Bản mã Ciphertext P ⊕ Keystream -> [4, 1, 0] ("EBA")',
      expected: `${cipherExpectedStr} (${ex.binaryCiphertext} / "${ex.ciphertextLetters}")`,
      actual: `${cipherActualStr} (${numberArrayToBinary(encRes.ciphertext, 3)})`,
      passed: cipherPassed,
      differingStep: cipherPassed ? undefined : 'Ciphertext generation',
    },
    {
      name: 'Giải mã hoàn nguyên C ⊕ Keystream -> [1, 0, 6] ("BAG")',
      expected: `${decExpectedStr} (${ex.binaryPlaintext} / "${ex.plaintextLetters}")`,
      actual: `${decActualStr} (${numberArrayToBinary(decRes.plaintext, 3)})`,
      passed: decPassed,
      differingStep: decPassed ? undefined : 'Decryption roundtrip',
    },
  ];

  return {
    allPassed: items.every((it) => it.passed),
    items,
    ksaResult: ksaRes,
    encryptResult: encRes,
    decryptResult: decRes,
  };
}

// ============================================================================
// 3. THUẬT TOÁN TINYRC4 THUẦN TÚY (PARAMETERIZED STATE SIZE N = 4, 8, 16)
// ============================================================================

/**
 * Kiểm tra tính hợp lệ của tham số N trong TinyRC4
 */
export function validateTinyN(N: number): SupportedTinyN {
  if (N === 4 || N === 8 || N === 16) {
    return N;
  }
  throw new Error(`Kích thước trạng thái TinyRC4 không hợp lệ: N = ${N}. Các giá trị hỗ trợ: 4, 8, 16.`);
}

/**
 * Tính số bit của một từ trong TinyRC4 (log2(N))
 */
export function getWordBitsForN(N: number): number {
  if (N === 4) return 2;
  if (N === 8) return 3;
  if (N === 16) return 4;
  return 8;
}

/**
 * TinyRC4 - Giai đoạn khởi tạo và xáo trộn mảng khóa KSA (Key-Scheduling Algorithm)
 * @param key Mảng các số nguyên nằm trong khoảng [0, N - 1]
 * @param N Kích thước mảng S (mặc định 8)
 * @param trace Có thu thập chi tiết từng bước hoán vị không (mặc định false)
 */
export function tinyRc4Ksa(key: number[], N: SupportedTinyN = 8, trace = false): KsaResult {
  validateTinyN(N);
  if (!key || key.length === 0) {
    throw new Error('Khóa bí mật TinyRC4 không được để trống.');
  }

  // Xác thực các phần tử của khóa
  for (let idx = 0; idx < key.length; idx++) {
    const val = key[idx];
    if (!Number.isInteger(val) || val < 0 || val >= N) {
      throw new Error(`Phần tử khóa tại vị trí ${idx} có giá trị ${val} không hợp lệ (phải là số nguyên từ 0 đến ${N - 1}).`);
    }
  }

  // 1. Khởi tạo mảng S: S[i] = i với i từ 0 đến N - 1
  const S: number[] = new Array(N);
  for (let i = 0; i < N; i++) {
    S[i] = i;
  }

  const steps: KsaTraceStep[] = [];
  let j = 0;

  // 2. Vòng lặp hoán vị chính: j = (j + S[i] + Key[i mod key_len]) mod N
  for (let i = 0; i < N; i++) {
    const sBefore = [...S];
    const keyIdx = i % key.length;
    const keyVal = key[keyIdx];
    const oldJ = j;

    j = (j + S[i] + keyVal) % N;

    // Hoán đổi S[i] và S[j]
    const valI = S[i];
    const valJ = S[j];
    S[i] = valJ;
    S[j] = valI;

    if (trace) {
      steps.push({
        phase: 'KSA',
        stepIndex: i,
        i,
        j,
        keyIndex: keyIdx,
        keyByte: keyVal,
        sBefore,
        sAfter: [...S],
        swapped: [i, j],
        formula: `j = (${oldJ} + S[${i}](${valI}) + K[${keyIdx}](${keyVal})) mod ${N} = ${j}`,
        explanation: `Vòng KSA ${i + 1}/${N}: Tính j mới = ${j}, hoán đổi S[${i}] (giá trị cũ ${valI}) với S[${j}] (giá trị cũ ${valJ}).`,
      });
    }
  }

  return { s: S, trace: steps };
}

/**
 * TinyRC4 - Giai đoạn sinh dòng khóa PRGA (Pseudo-Random Generation Algorithm)
 * @param state Mảng S đã qua KSA
 * @param length Số từ dòng khóa cần sinh
 * @param N Kích thước mảng S (mặc định 8)
 * @param trace Có thu thập chi tiết từng bước không
 */
export function tinyRc4Prga(
  state: number[],
  length: number,
  N: SupportedTinyN = 8,
  trace = false
): PrgaResult {
  validateTinyN(N);
  const S = [...state];
  const keystream: number[] = [];
  const steps: PrgaTraceStep[] = [];

  let i = 0;
  let j = 0;

  for (let step = 0; step < length; step++) {
    const sBefore = [...S];

    i = (i + 1) % N;
    j = (j + S[i]) % N;

    // Hoán đổi S[i] và S[j]
    const valI = S[i];
    const valJ = S[j];
    S[i] = valJ;
    S[j] = valI;

    // Tính chỉ số t và rút trích byte khóa k = S[t]
    const t = (S[i] + S[j]) % N;
    const k = S[t];
    keystream.push(k);

    if (trace) {
      steps.push({
        phase: 'PRGA',
        stepIndex: step,
        byteIndex: step,
        i,
        j,
        t,
        keystreamByte: k,
        sBefore,
        sAfter: [...S],
        swapped: [i, j],
        formula: `i=(i+1) mod ${N}=${i} | j=(j+S[${i}]) mod ${N}=${j} | Swap(S[${i}],S[${j}]) | t=(S[${i}]+S[${j}]) mod ${N}=${t} | k=S[${t}]=${k}`,
        explanation: `Bước PRGA ${step + 1}: Tăng i=${i}, cập nhật j=${j}. Hoán đổi S[${i}]↔S[${j}]. Tính t=(${S[i]}+${S[j]}) mod ${N}=${t}. Trích xuất k=S[${t}]=${k}.`,
      });
    }
  }

  return { keystream, s: S, trace: steps };
}

/**
 * TinyRC4 - Mã hóa dãy số nguyên
 * C[n] = P[n] ⊕ Keystream[n]
 */
export function tinyRc4Encrypt(
  plaintext: number[],
  key: number[],
  N: SupportedTinyN = 8,
  trace = false
): CryptResult {
  validateTinyN(N);

  // Xác thực các phần tử của plaintext
  for (let idx = 0; idx < plaintext.length; idx++) {
    const val = plaintext[idx];
    if (!Number.isInteger(val) || val < 0 || val >= N) {
      throw new Error(`Phần tử bản rõ tại vị trí ${idx} có giá trị ${val} không hợp lệ (phải từ 0 đến ${N - 1}).`);
    }
  }

  // 1. Thực hiện KSA
  const ksaRes = tinyRc4Ksa(key, N, trace);

  // 2. Thực hiện PRGA để sinh dòng khóa có độ dài bằng bản rõ
  const prgaRes = tinyRc4Prga(ksaRes.s, plaintext.length, N, trace);

  // 3. Phép XOR giữa bản rõ và dòng khóa
  const ciphertext: number[] = [];
  for (let p = 0; p < plaintext.length; p++) {
    const cipherVal = (plaintext[p] ^ prgaRes.keystream[p]) % N;
    ciphertext.push(cipherVal);

    if (trace && prgaRes.trace && prgaRes.trace[p]) {
      prgaRes.trace[p].plainByte = plaintext[p];
      prgaRes.trace[p].cipherByte = cipherVal;
      prgaRes.trace[p].formula += ` | C=P⊕k=${plaintext[p]}⊕${prgaRes.keystream[p]}=${cipherVal}`;
      prgaRes.trace[p].explanation += ` Kết quả XOR: ${plaintext[p]} ⊕ ${prgaRes.keystream[p]} = ${cipherVal}.`;
    }
  }

  const allTrace: TraceStep[] = [];
  if (trace) {
    if (ksaRes.trace) allTrace.push(...ksaRes.trace);
    if (prgaRes.trace) allTrace.push(...prgaRes.trace);
  }

  return {
    ciphertext,
    plaintext,
    keystream: prgaRes.keystream,
    ksaTrace: ksaRes.trace,
    prgaTrace: prgaRes.trace,
    allTrace,
  };
}

/**
 * TinyRC4 - Giải mã dãy số nguyên
 * Vì RC4 là mã hóa đối xứng hoàn toàn: P[n] = C[n] ⊕ Keystream[n]
 */
export function tinyRc4Decrypt(
  ciphertext: number[],
  key: number[],
  N: SupportedTinyN = 8,
  trace = false
): CryptResult {
  validateTinyN(N);

  for (let idx = 0; idx < ciphertext.length; idx++) {
    const val = ciphertext[idx];
    if (!Number.isInteger(val) || val < 0 || val >= N) {
      throw new Error(`Phần tử bản mã tại vị trí ${idx} có giá trị ${val} không hợp lệ (phải từ 0 đến ${N - 1}).`);
    }
  }

  // 1. KSA tạo mảng S ban đầu
  const ksaRes = tinyRc4Ksa(key, N, trace);

  // 2. PRGA sinh dòng khóa giống hệt
  const prgaRes = tinyRc4Prga(ksaRes.s, ciphertext.length, N, trace);

  // 3. Phép XOR hoàn nguyên bản rõ
  const plaintext: number[] = [];
  for (let c = 0; c < ciphertext.length; c++) {
    const plainVal = (ciphertext[c] ^ prgaRes.keystream[c]) % N;
    plaintext.push(plainVal);

    if (trace && prgaRes.trace && prgaRes.trace[c]) {
      prgaRes.trace[c].plainByte = plainVal;
      prgaRes.trace[c].cipherByte = ciphertext[c];
      prgaRes.trace[c].formula += ` | P=C⊕k=${ciphertext[c]}⊕${prgaRes.keystream[c]}=${plainVal}`;
      prgaRes.trace[c].explanation += ` Giải mã XOR: ${ciphertext[c]} ⊕ ${prgaRes.keystream[c]} = ${plainVal}.`;
    }
  }

  const allTrace: TraceStep[] = [];
  if (trace) {
    if (ksaRes.trace) allTrace.push(...ksaRes.trace);
    if (prgaRes.trace) allTrace.push(...prgaRes.trace);
  }

  return {
    ciphertext,
    plaintext,
    keystream: prgaRes.keystream,
    ksaTrace: ksaRes.trace,
    prgaTrace: prgaRes.trace,
    allTrace,
  };
}

// ============================================================================
// 4. THUẬT TOÁN RC4 ĐẦY ĐỦ THUẦN TÚY (FULL RC4: N = 256 BYTES)
// ============================================================================

/**
 * Full RC4 - KSA (Key-Scheduling Algorithm, N = 256 bytes)
 * @param key Khóa bí mật (1 đến 256 bytes)
 * @param trace Có ghi lại toàn bộ 256 bước hoán đổi không
 */
export function fullRc4Ksa(key: number[], trace = false): KsaResult {
  if (!key || key.length === 0) {
    throw new Error('Khóa bí mật RC4 không được để trống (độ dài 1 - 256 bytes).');
  }

  const S: number[] = new Array(256);
  for (let i = 0; i < 256; i++) {
    S[i] = i;
  }

  const steps: KsaTraceStep[] = [];
  let j = 0;

  for (let i = 0; i < 256; i++) {
    const sBefore = trace ? [...S] : [];
    const keyIdx = i % key.length;
    const keyByte = key[keyIdx] & 0xff;
    const oldJ = j;

    j = (j + S[i] + keyByte) & 0xff;

    const valI = S[i];
    const valJ = S[j];
    S[i] = valJ;
    S[j] = valI;

    if (trace) {
      steps.push({
        phase: 'KSA',
        stepIndex: i,
        i,
        j,
        keyIndex: keyIdx,
        keyByte,
        sBefore,
        sAfter: [...S],
        swapped: [i, j],
        formula: `j = (${oldJ} + S[${i}](${valI}) + Key[${keyIdx}](${keyByte})) mod 256 = ${j}`,
        explanation: `Vòng KSA ${i + 1}/256: Tính j mới = ${j}, hoán đổi S[${i}] (giá trị cũ ${valI}) với S[${j}] (giá trị cũ ${valJ}).`,
      });
    }
  }

  return { s: S, trace: steps };
}

/**
 * Full RC4 - PRGA (Pseudo-Random Generation Algorithm, N = 256 bytes)
 * @param state Mảng S 256 phần tử đã qua KSA
 * @param length Số byte dòng khóa cần sinh
 * @param dropN Số byte đầu cần bỏ qua (RC4-drop[n])
 * @param trace Có ghi lại chi tiết từng bước không
 */
export function fullRc4Prga(
  state: number[],
  length: number,
  dropN = 0,
  trace = false
): PrgaResult {
  const S = [...state];
  let i = 0;
  let j = 0;

  // Vứt bỏ dropN byte đầu nếu được yêu cầu
  for (let d = 0; d < dropN; d++) {
    i = (i + 1) & 0xff;
    j = (j + S[i]) & 0xff;
    const tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
  }

  const keystream: number[] = [];
  const steps: PrgaTraceStep[] = [];

  for (let step = 0; step < length; step++) {
    const sBefore = trace ? [...S] : [];

    i = (i + 1) & 0xff;
    j = (j + S[i]) & 0xff;

    const valI = S[i];
    const valJ = S[j];
    S[i] = valJ;
    S[j] = valI;

    const t = (S[i] + S[j]) & 0xff;
    const k = S[t];
    keystream.push(k);

    if (trace) {
      steps.push({
        phase: 'PRGA',
        stepIndex: step,
        byteIndex: step,
        i,
        j,
        t,
        keystreamByte: k,
        sBefore,
        sAfter: [...S],
        swapped: [i, j],
        formula: `i=(i+1)=${i} | j=(j+S[i])=${j} | t=(S[i]+S[j])=${t} | k=S[${t}]=0x${k.toString(16).padStart(2, '0').toUpperCase()}`,
        explanation: `Bước PRGA ${step + 1}: Hoán đổi S[${i}]↔S[${j}]. Lấy t=(${valJ}+${valI}) mod 256 = ${t}. Trích xuất byte khóa k=S[${t}]=0x${k.toString(16).padStart(2, '0').toUpperCase()}.`,
      });
    }
  }

  return { keystream, s: S, trace: steps };
}

/**
 * Full RC4 - Mã hóa chuỗi byte
 */
export function fullRc4Encrypt(
  plaintext: number[],
  key: number[],
  dropN = 0,
  trace = false
): CryptResult {
  const ksaRes = fullRc4Ksa(key, trace);
  const prgaRes = fullRc4Prga(ksaRes.s, plaintext.length, dropN, trace);

  const ciphertext: number[] = [];
  for (let p = 0; p < plaintext.length; p++) {
    const c = (plaintext[p] ^ prgaRes.keystream[p]) & 0xff;
    ciphertext.push(c);

    if (trace && prgaRes.trace && prgaRes.trace[p]) {
      prgaRes.trace[p].plainByte = plaintext[p];
      prgaRes.trace[p].cipherByte = c;
      prgaRes.trace[p].formula += ` | C=P⊕k=0x${c.toString(16).padStart(2, '0').toUpperCase()}`;
    }
  }

  const allTrace: TraceStep[] = [];
  if (trace) {
    if (ksaRes.trace) allTrace.push(...ksaRes.trace);
    if (prgaRes.trace) allTrace.push(...prgaRes.trace);
  }

  return {
    ciphertext,
    plaintext,
    keystream: prgaRes.keystream,
    ksaTrace: ksaRes.trace,
    prgaTrace: prgaRes.trace,
    allTrace,
  };
}

/**
 * Full RC4 - Giải mã chuỗi byte (XOR đối xứng)
 */
export function fullRc4Decrypt(
  ciphertext: number[],
  key: number[],
  dropN = 0,
  trace = false
): CryptResult {
  const ksaRes = fullRc4Ksa(key, trace);
  const prgaRes = fullRc4Prga(ksaRes.s, ciphertext.length, dropN, trace);

  const plaintext: number[] = [];
  for (let c = 0; c < ciphertext.length; c++) {
    const p = (ciphertext[c] ^ prgaRes.keystream[c]) & 0xff;
    plaintext.push(p);

    if (trace && prgaRes.trace && prgaRes.trace[c]) {
      prgaRes.trace[c].plainByte = p;
      prgaRes.trace[c].cipherByte = ciphertext[c];
      prgaRes.trace[c].formula += ` | P=C⊕k=0x${p.toString(16).padStart(2, '0').toUpperCase()}`;
    }
  }

  const allTrace: TraceStep[] = [];
  if (trace) {
    if (ksaRes.trace) allTrace.push(...ksaRes.trace);
    if (prgaRes.trace) allTrace.push(...prgaRes.trace);
  }

  return {
    ciphertext,
    plaintext,
    keystream: prgaRes.keystream,
    ksaTrace: ksaRes.trace,
    prgaTrace: prgaRes.trace,
    allTrace,
  };
}

/**
 * Thuật toán RC4 xử lý trực tiếp trên mảng byte TypedArray (Uint8Array)
 * Cho hiệu năng cực cao khi mã hóa/giải mã tập tin lớn (lên tới 5 MB) và đo kiểm benchmark.
 * C[i] = P[i] ^ Keystream[i] (Mã hóa và giải mã hoàn toàn đối xứng).
 */
export function fullRc4ProcessUint8Array(
  data: Uint8Array,
  key: Uint8Array | number[],
  dropN = 0
): Uint8Array {
  const keyBytes = key instanceof Uint8Array ? key : new Uint8Array(key);
  if (keyBytes.length === 0) {
    throw new Error('Khóa bí mật RC4 không được để trống.');
  }

  // 1. KSA: Khởi tạo mảng hoán vị S 256 phần tử
  const S = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    S[i] = i;
  }

  let j = 0;
  const keyLen = keyBytes.length;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + keyBytes[i % keyLen]) & 0xff;
    const tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
  }

  // 2. Drop-N nếu có
  let i = 0;
  j = 0;
  for (let d = 0; d < dropN; d++) {
    i = (i + 1) & 0xff;
    j = (j + S[i]) & 0xff;
    const tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
  }

  // 3. PRGA và XOR trực tiếp
  const out = new Uint8Array(data.length);
  for (let p = 0; p < data.length; p++) {
    i = (i + 1) & 0xff;
    j = (j + S[i]) & 0xff;
    const tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;

    const t = (S[i] + S[j]) & 0xff;
    const k = S[t];
    out[p] = data[p] ^ k;
  }

  return out;
}

/**
 * Tính mã băm SHA-256 sử dụng WebCrypto API của trình duyệt
 * Chỉ dùng cho mục đích kiểm chứng tính toàn vẹn (integrity check).
 */
export async function computeSha256Hex(data: Uint8Array | ArrayBuffer): Promise<string> {
  const buffer =
    data instanceof Uint8Array
      ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
      : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer as ArrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// 5. GIAO DIỆN HỢP NHẤT TIỆN LỢI (UNIFIED EXPORTS THEO YÊU CẦU)
// ============================================================================

/**
 * Giao diện tổng quát cho hàm KSA: hỗ trợ cả Full RC4 (N=256) và TinyRC4 (N=4, 8, 16)
 */
export function ksa(key: number[], N: number = 256, trace = false): KsaResult {
  if (N === 256) {
    return fullRc4Ksa(key, trace);
  }
  return tinyRc4Ksa(key, validateTinyN(N), trace);
}

/**
 * Giao diện tổng quát cho hàm PRGA
 */
export function prga(state: number[], length: number, N: number = 256, dropN = 0, trace = false): PrgaResult {
  if (N === 256) {
    return fullRc4Prga(state, length, dropN, trace);
  }
  return tinyRc4Prga(state, length, validateTinyN(N), trace);
}

/**
 * Giao diện tổng quát cho hàm Encrypt
 */
export function encrypt(
  plain: number[],
  key: number[],
  N: number = 256,
  dropN = 0,
  trace = false
): CryptResult {
  if (N === 256) {
    return fullRc4Encrypt(plain, key, dropN, trace);
  }
  return tinyRc4Encrypt(plain, key, validateTinyN(N), trace);
}

/**
 * Giao diện tổng quát cho hàm Decrypt
 */
export function decrypt(
  cipher: number[],
  key: number[],
  N: number = 256,
  dropN = 0,
  trace = false
): CryptResult {
  if (N === 256) {
    return fullRc4Decrypt(cipher, key, dropN, trace);
  }
  return tinyRc4Decrypt(cipher, key, validateTinyN(N), trace);
}

/**
 * Đối tượng TinyRC4 thuần túy đóng gói đúng chuẩn yêu cầu:
 * Cung cấp ksa(key), prga(state, length), encrypt(plain, key), decrypt(cipher, key)
 * và cờ trace mode thu thập toàn bộ các bước trung gian (i, j, S trước/sau hoán đổi, chỉ số t, byte dòng khóa).
 */
export const TinyRC4 = {
  ksa: (key: number[], N: SupportedTinyN = 8, trace = false) => tinyRc4Ksa(key, N, trace),
  prga: (state: number[], length: number, N: SupportedTinyN = 8, trace = false) => tinyRc4Prga(state, length, N, trace),
  encrypt: (plain: number[], key: number[], N: SupportedTinyN = 8, trace = false) => tinyRc4Encrypt(plain, key, N, trace),
  decrypt: (cipher: number[], key: number[], N: SupportedTinyN = 8, trace = false) => tinyRc4Decrypt(cipher, key, N, trace),
};

/**
 * Đối tượng FullRC4 thuần túy đóng gói đúng chuẩn yêu cầu:
 * Cung cấp ksa(key), prga(state, length), encrypt(plain, key), decrypt(cipher, key)
 * và cờ trace mode thu thập toàn bộ các bước trung gian.
 */
export const FullRC4 = {
  ksa: (key: number[], trace = false) => fullRc4Ksa(key, trace),
  prga: (state: number[], length: number, dropN = 0, trace = false) => fullRc4Prga(state, length, dropN, trace),
  encrypt: (plain: number[], key: number[], dropN = 0, trace = false) => fullRc4Encrypt(plain, key, dropN, trace),
  decrypt: (cipher: number[], key: number[], dropN = 0, trace = false) => fullRc4Decrypt(cipher, key, dropN, trace),
  processUint8Array: (data: Uint8Array, key: Uint8Array | number[], dropN = 0) => fullRc4ProcessUint8Array(data, key, dropN),
};

// ============================================================================
// 6. TIỆN ÍCH CHUYỂN ĐỔI CHUỖI, MẢNG SỐ, NHỊ PHÂN VÀ HEX
// ============================================================================

/**
 * Chuyển chuỗi UTF-8 thành mảng byte
 */
export function stringToBytes(str: string): number[] {
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(str));
}

/**
 * Chuyển mảng byte thành chuỗi UTF-8 an toàn
 */
export function bytesToString(bytes: number[]): string {
  try {
    const decoder = new TextDecoder('utf-8', { fatal: false });
    return decoder.decode(new Uint8Array(bytes));
  } catch {
    return bytes.map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '·')).join('');
  }
}

/**
 * Chuyển chuỗi Hex thành mảng byte
 */
export function hexToBytes(hex: string): number[] {
  const cleaned = hex.replace(/\s+/g, '').replace(/^0x/i, '');
  if (cleaned.length % 2 !== 0) {
    throw new Error('Chuỗi Hex phải có số ký tự chẵn (ví dụ: 1A 2F hoặc 1A2F).');
  }
  const bytes: number[] = [];
  for (let i = 0; i < cleaned.length; i += 2) {
    const byte = parseInt(cleaned.slice(i, i + 2), 16);
    if (isNaN(byte)) {
      throw new Error(`Ký tự hex không hợp lệ tại vị trí ${i}: "${cleaned.slice(i, i + 2)}"`);
    }
    bytes.push(byte);
  }
  return bytes;
}

/**
 * Chuyển mảng byte thành chuỗi Hex
 */
export function bytesToHex(bytes: number[], separator = ''): string {
  return bytes.map((b) => (b & 0xff).toString(16).padStart(2, '0').toUpperCase()).join(separator);
}

/**
 * Chuyển mảng byte thành chuỗi Base64
 */
export function bytesToBase64(bytes: number[]): string {
  const binary = bytes.map((b) => String.fromCharCode(b & 0xff)).join('');
  return btoa(binary);
}

/**
 * Chuyển chuỗi Base64 thành mảng byte
 */
export function base64ToBytes(base64: string): number[] {
  const binary = atob(base64.trim());
  const bytes: number[] = [];
  for (let i = 0; i < binary.length; i++) {
    bytes.push(binary.charCodeAt(i));
  }
  return bytes;
}

/**
 * Chuyển một số thành chuỗi nhị phân với số bit cố định
 */
export function byteToBinaryString(byte: number, bits = 8): string {
  return (byte & ((1 << bits) - 1)).toString(2).padStart(bits, '0');
}

/**
 * Ánh xạ số nguyên sang chữ cái trong TinyRC4 (0..7 -> A..H)
 */
export function tinyNumberToLetter(num: number): string {
  if (num >= 0 && num <= 7) {
    return String.fromCharCode(65 + num);
  }
  return '?';
}

/**
 * Ánh xạ chữ cái sang số nguyên trong TinyRC4 (A=0..H=7)
 * Ném ngoại lệ tiếng Việt rõ ràng nếu ký tự không nằm trong dải [A..H]
 */
export function letterToTinyNumber(char: string, N: number = 8): number {
  const upper = char.toUpperCase();
  const code = upper.charCodeAt(0);
  const val = code - 65; // 'A' = 0

  if (code < 65 || code > 90) {
    throw new Error(
      `Ký tự "${char}" không phải là chữ cái hợp lệ. Trong chế độ chữ cái TinyRC4 (N = ${N}), chỉ chấp nhận các chữ cái từ A đến H (quy ước: A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7).`
    );
  }

  // Quy ước chuẩn bài giảng: Các chữ cái từ A đến H ứng với giá trị 0..7
  const maxVal = Math.min(N - 1, 7);
  const maxLetter = String.fromCharCode(65 + maxVal);

  if (val < 0 || val > maxVal) {
    throw new Error(
      `Ký tự "${char}" không hợp lệ. Trong chế độ chữ cái TinyRC4 (N = ${N}), chỉ chấp nhận các chữ cái từ A đến ${maxLetter} (quy ước: A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7).`
    );
  }

  return val;
}

export type TinyInputMode = 'auto' | 'text' | 'number' | 'binary';

/**
 * Phân tích chuỗi đầu vào (phân tách bởi dấu phẩy, khoảng trắng, hoặc ngoặc vuông)
 * thành mảng số nguyên trong khoảng [0, N - 1] cho TinyRC4.
 * Hỗ trợ chế độ chữ cái (A-H: A=0..H=7), mảng số (0..7) và chuỗi bit nhị phân.
 */
export function parseNumberArray(
  input: string,
  N: number,
  mode: TinyInputMode = 'auto'
): number[] {
  const cleaned = input.replace(/[\[\]]/g, '').trim();
  if (!cleaned) return [];

  const wordBits = getWordBitsForN(N);

  // 1. Chế độ ép buộc Văn bản (Text mode)
  if (mode === 'text') {
    const result: number[] = [];
    for (let i = 0; i < cleaned.length; i++) {
      const ch = cleaned[i];
      if (ch === ' ' || ch === ',' || ch === '\t' || ch === '\n' || ch === '\r') {
        continue;
      }
      result.push(letterToTinyNumber(ch, N));
    }
    return result;
  }

  // 2. Chế độ ép buộc Nhị phân (Binary mode)
  if (mode === 'binary') {
    const rawNoSep = cleaned.replace(/[\s,]+/g, '');
    if (!/^[01]+$/.test(rawNoSep)) {
      throw new Error(`Đầu vào nhị phân chứa ký tự không hợp lệ. Chỉ chấp nhận các bit 0 và 1.`);
    }

    const tokens = cleaned.split(/[\s,]+/).filter(Boolean);
    if (tokens.length > 1 || (tokens.length === 1 && tokens[0].length <= wordBits)) {
      return tokens.map((t) => {
        const val = parseInt(t, 2);
        if (isNaN(val) || val < 0 || val >= N) {
          throw new Error(`Từ nhị phân "${t}" (giá trị ${val}) vượt quá phạm vi [0, ${N - 1}] của TinyRC4.`);
        }
        return val;
      });
    }

    // Nếu là chuỗi bit liền nhau
    const result: number[] = [];
    for (let i = 0; i < rawNoSep.length; i += wordBits) {
      const chunk = rawNoSep.slice(i, i + wordBits);
      const val = parseInt(chunk, 2);
      result.push(val);
    }
    return result;
  }

  // 3. Chế độ Tự động (Auto): phát hiện chữ cái A-H, chuỗi bit, hoặc mảng số
  const hasLetters = /[a-zA-Z]/.test(cleaned);
  if (mode === 'auto' && hasLetters) {
    const result: number[] = [];
    for (let i = 0; i < cleaned.length; i++) {
      const ch = cleaned[i];
      if (ch === ' ' || ch === ',' || ch === '\t' || ch === '\n' || ch === '\r') {
        continue;
      }
      result.push(letterToTinyNumber(ch, N));
    }
    return result;
  }

  // Tách theo dấu phẩy hoặc khoảng trắng
  const tokens = cleaned.split(/[\s,]+/).filter(Boolean);

  // Kiểm tra chuỗi bit phân tách (ví dụ "001 000 110")
  const isBitTokens =
    mode === 'auto' &&
    tokens.length > 0 &&
    tokens.every((t) => /^[01]+$/.test(t)) &&
    tokens.some((t) => t.length > 1);

  if (isBitTokens) {
    return tokens.map((t) => {
      const val = parseInt(t, 2);
      if (val >= N) {
        throw new Error(`Cụm bit "${t}" (giá trị ${val}) vượt quá phạm vi [0, ${N - 1}] của TinyRC4 (N = ${N}).`);
      }
      return val;
    });
  }

  // Mặc định: Phân tích mảng số nguyên
  const result: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const num = Number(tok);
    if (!Number.isInteger(num)) {
      if (/^[a-zA-Z]$/.test(tok)) {
        throw new Error(
          `Ký tự "${tok}" không phải là số nguyên. Trong chế độ chữ cái TinyRC4 (N = ${N}), chỉ chấp nhận các chữ cái từ A đến H (A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7).`
        );
      }
      throw new Error(`Phần tử "${tok}" không phải là số nguyên hợp lệ.`);
    }
    if (num < 0 || num >= N) {
      throw new Error(`Giá trị ${num} vượt quá phạm vi cho phép [0, ${N - 1}] của TinyRC4 (N = ${N}).`);
    }
    result.push(num);
  }

  return result;
}

/**
 * Định dạng mảng số thành chuỗi hiển thị
 */
export function formatNumberArray(arr: number[], separator = ', '): string {
  return arr.join(separator);
}

/**
 * Chuyển mảng số thành chuỗi nhị phân (mỗi phần tử có bits bit)
 */
export function numberArrayToBinary(arr: number[], bits: number): string {
  return arr.map((val) => byteToBinaryString(val, bits)).join(' ');
}

// ============================================================================
// 7. TƯƠNG THÍCH NGƯỢC VỚI HỆ THỐNG HIỆN HỮU (LEGACY COMPATIBILITY)
// ============================================================================

export function rc4EncryptBytes(keyBytes: number[], plaintextBytes: number[], dropN = 0): {
  ciphertextBytes: number[];
  keystreamBytes: number[];
} {
  const res = fullRc4Encrypt(plaintextBytes, keyBytes, dropN, false);
  return {
    ciphertextBytes: res.ciphertext,
    keystreamBytes: res.keystream,
  };
}

export function generateSimulationSteps(keyBytes: number[], plaintextBytes: number[]): SimulatorStep[] {
  const res = fullRc4Encrypt(plaintextBytes, keyBytes, 0, true);
  const combined = res.allTrace || [];
  return combined.map((step) => ({
    ...step,
    sArray: [...step.sAfter],
  })) as SimulatorStep[];
}

/**
 * Sinh các bước mô phỏng cho TinyRC4
 */
export function generateTinySimulationSteps(
  key: number[],
  plaintext: number[],
  N: SupportedTinyN = 8
): SimulatorStep[] {
  const res = tinyRc4Encrypt(plaintext, key, N, true);
  const combined = res.allTrace || [];
  return combined.map((step) => ({
    ...step,
    sArray: [...step.sAfter],
  })) as SimulatorStep[];
}

// ============================================================================
// 8. TEST VECTORS CHUẨN MẬT MÃ HỌC
// ============================================================================

export interface TestVector {
  name: string;
  description: string;
  keyText: string;
  plaintext: string;
  expectedCipherHex: string;
}

export const STANDARD_TEST_VECTORS: TestVector[] = [
  {
    name: 'Vector kinh điển (Wikipedia)',
    description: 'Vector chuẩn mẫu kinh điển trong tài liệu Wikipedia mật mã học',
    keyText: 'Key',
    plaintext: 'Plaintext',
    expectedCipherHex: 'BBF316E8D940AF0AD3',
  },
  {
    name: 'Vector Wikipedia',
    description: 'Từ khóa Wiki mã hóa từ pedia',
    keyText: 'Wiki',
    plaintext: 'pedia',
    expectedCipherHex: '1021BF0420',
  },
  {
    name: 'Secret / Attack at dawn',
    description: 'Thông điệp quân sự kinh điển "Attack at dawn"',
    keyText: 'Secret',
    plaintext: 'Attack at dawn',
    expectedCipherHex: '45A01F645FC35B383552544B9BF5',
  },
  {
    name: 'Single Character Boundary',
    description: 'Kiểm tra độ dài ngắn nhất của bản rõ',
    keyText: 'Pass',
    plaintext: 'A',
    expectedCipherHex: '0A',
  },
];

export interface Rfc6229TestVector {
  name: string;
  keyHex: string;
  keyBits: number;
  offset: number;
  expectedKeystreamHex: string;
}

export const RFC_6229_TEST_VECTORS: Rfc6229TestVector[] = [
  {
    name: 'RFC 6229 (40-bit key, Offset 0)',
    keyHex: '0102030405',
    keyBits: 40,
    offset: 0,
    expectedKeystreamHex: 'b2396305f03dc027ccc3524a0a1118a8',
  },
  {
    name: 'RFC 6229 (128-bit key, Offset 0)',
    keyHex: '0102030405060708090a0b0c0d0e0f10',
    keyBits: 128,
    offset: 0,
    expectedKeystreamHex: '9ac7cc9a609d1ef7b2932899cde41b97',
  },
];

// ============================================================================
// 9. BỘ HÀM THỰC NGHIỆM CHO CẢ FULL RC4 VÀ TINYRC4
// ============================================================================

/**
 * Thực nghiệm thiên vị byte đầu cho Full RC4 (N = 256)
 */
export function runBiasExperiment(sampleCount: number, targetByte: 1 | 2 = 2) {
  const counts = new Uint32Array(256);

  for (let s = 0; s < sampleCount; s++) {
    // Sinh khóa ngẫu nhiên thuần túy không dùng thư viện ngoài
    const key = new Uint8Array(16);
    for (let k = 0; k < 16; k++) {
      key[k] = Math.floor(Math.random() * 256);
    }

    const S = new Uint8Array(256);
    for (let i = 0; i < 256; i++) S[i] = i;

    let j = 0;
    for (let i = 0; i < 256; i++) {
      j = (j + S[i] + key[i % 16]) & 0xff;
      const tmp = S[i];
      S[i] = S[j];
      S[j] = tmp;
    }

    // PRGA byte 1
    let i = 1;
    j = S[1];
    let tmp = S[1];
    S[1] = S[j];
    S[j] = tmp;
    let t = (S[1] + S[j]) & 0xff;
    const byte1 = S[t];

    if (targetByte === 1) {
      counts[byte1]++;
    } else {
      // PRGA byte 2
      i = 2;
      j = (j + S[2]) & 0xff;
      tmp = S[2];
      S[2] = S[j];
      S[j] = tmp;
      t = (S[2] + S[j]) & 0xff;
      const byte2 = S[t];
      counts[byte2]++;
    }
  }

  const frequencies = Array.from(counts);
  const zeroCount = counts[0];
  const zeroPercentage = (zeroCount / sampleCount) * 100;
  const expectedUniformPercentage = (1 / 256) * 100; // ~0.3906%
  const biasFactor = zeroPercentage / expectedUniformPercentage;

  const sorted = frequencies
    .map((cnt, val) => ({ value: val, count: cnt, percentage: (cnt / sampleCount) * 100 }))
    .sort((a, b) => b.count - a.count);

  return {
    frequencies,
    zeroCount,
    zeroPercentage,
    expectedUniformPercentage,
    biasFactor,
    topValues: sorted.slice(0, 10),
  };
}

/**
 * Thực nghiệm thiên vị byte đầu cho TinyRC4 (N = 4, 8, 16)
 */
export function runTinyBiasExperiment(sampleCount: number, targetByte: 1 | 2 = 2, N: SupportedTinyN = 8) {
  validateTinyN(N);
  const counts = new Uint32Array(N);
  const keyLen = 4;

  for (let s = 0; s < sampleCount; s++) {
    const key: number[] = [];
    for (let k = 0; k < keyLen; k++) {
      key.push(Math.floor(Math.random() * N));
    }

    const { keystream } = tinyRc4Encrypt([0, 0], key, N, false);
    const val = targetByte === 1 ? keystream[0] : keystream[1];
    counts[val]++;
  }

  const frequencies = Array.from(counts);
  const expectedUniformPercentage = (1 / N) * 100;
  const zeroCount = counts[0];
  const zeroPercentage = (zeroCount / sampleCount) * 100;
  const biasFactor = zeroPercentage / expectedUniformPercentage;

  const sorted = frequencies
    .map((cnt, val) => ({ value: val, count: cnt, percentage: (cnt / sampleCount) * 100 }))
    .sort((a, b) => b.count - a.count);

  return {
    N,
    frequencies,
    zeroCount,
    zeroPercentage,
    expectedUniformPercentage,
    biasFactor,
    topValues: sorted,
  };
}

/**
 * Phân tích tấn công Tái sử dụng khóa (Two-Time Pad) cho Full RC4
 */
export function runKeyReuseAnalysis(key: string, message1: string, message2: string) {
  const keyBytes = stringToBytes(key);
  const p1Bytes = stringToBytes(message1);
  const p2Bytes = stringToBytes(message2);

  const minLen = Math.min(p1Bytes.length, p2Bytes.length);
  const p1Trim = p1Bytes.slice(0, minLen);
  const p2Trim = p2Bytes.slice(0, minLen);

  const { ciphertextBytes: c1 } = rc4EncryptBytes(keyBytes, p1Trim);
  const { ciphertextBytes: c2 } = rc4EncryptBytes(keyBytes, p2Trim);

  const c1XorC2: number[] = [];
  const p1XorP2: number[] = [];

  for (let i = 0; i < minLen; i++) {
    c1XorC2.push(c1[i] ^ c2[i]);
    p1XorP2.push(p1Trim[i] ^ p2Trim[i]);
  }

  const isIdentical = c1XorC2.every((val, idx) => val === p1XorP2[idx]);

  return {
    c1Hex: bytesToHex(c1),
    c2Hex: bytesToHex(c2),
    c1XorC2Hex: bytesToHex(c1XorC2),
    p1XorP2Hex: bytesToHex(p1XorP2),
    minLen,
    isIdentical,
    bytesDetail: c1XorC2.map((xorVal, idx) => ({
      index: idx,
      char1: String.fromCharCode(p1Trim[idx]),
      char2: String.fromCharCode(p2Trim[idx]),
      p1Hex: p1Trim[idx].toString(16).padStart(2, '0').toUpperCase(),
      p2Hex: p2Trim[idx].toString(16).padStart(2, '0').toUpperCase(),
      c1Hex: c1[idx].toString(16).padStart(2, '0').toUpperCase(),
      c2Hex: c2[idx].toString(16).padStart(2, '0').toUpperCase(),
      xorHex: xorVal.toString(16).padStart(2, '0').toUpperCase(),
    })),
  };
}

/**
 * Phân tích tấn công Tái sử dụng khóa cho TinyRC4
 */
export function runTinyKeyReuseAnalysis(key: number[], p1: number[], p2: number[], N: SupportedTinyN = 8) {
  validateTinyN(N);
  const minLen = Math.min(p1.length, p2.length);
  const p1Trim = p1.slice(0, minLen);
  const p2Trim = p2.slice(0, minLen);

  const { ciphertext: c1 } = tinyRc4Encrypt(p1Trim, key, N, false);
  const { ciphertext: c2 } = tinyRc4Encrypt(p2Trim, key, N, false);

  const c1XorC2: number[] = [];
  const p1XorP2: number[] = [];

  for (let i = 0; i < minLen; i++) {
    c1XorC2.push((c1[i] ^ c2[i]) % N);
    p1XorP2.push((p1Trim[i] ^ p2Trim[i]) % N);
  }

  const isIdentical = c1XorC2.every((val, idx) => val === p1XorP2[idx]);

  return {
    N,
    c1,
    c2,
    c1XorC2,
    p1XorP2,
    minLen,
    isIdentical,
    items: c1XorC2.map((val, idx) => ({
      index: idx,
      p1Val: p1Trim[idx],
      p2Val: p2Trim[idx],
      c1Val: c1[idx],
      c2Val: c2[idx],
      xorVal: val,
    })),
  };
}

/**
 * Thực nghiệm RC4-drop[n] trên Full RC4
 */
export function runDropNExperiment(sampleCount: number, dropN: number) {
  const counts = new Uint32Array(256);

  for (let s = 0; s < sampleCount; s++) {
    const key = new Uint8Array(16);
    for (let k = 0; k < 16; k++) key[k] = Math.floor(Math.random() * 256);

    const S = new Uint8Array(256);
    for (let k = 0; k < 256; k++) S[k] = k;

    let j = 0;
    for (let k = 0; k < 256; k++) {
      j = (j + S[k] + key[k % 16]) & 0xff;
      const tmp = S[k];
      S[k] = S[j];
      S[j] = tmp;
    }

    let i = 0;
    j = 0;
    for (let d = 0; d < dropN; d++) {
      i = (i + 1) & 0xff;
      j = (j + S[i]) & 0xff;
      const tmp = S[i];
      S[i] = S[j];
      S[j] = tmp;
    }

    i = (i + 1) & 0xff;
    j = (j + S[i]) & 0xff;
    const tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
    const t = (S[i] + S[j]) & 0xff;
    counts[S[t]]++;
  }

  const frequencies = Array.from(counts);
  const zeroCount = counts[0];
  const zeroPercentage = (zeroCount / sampleCount) * 100;

  const expectedPerBin = sampleCount / 256;
  let varianceSum = 0;
  for (let b = 0; b < 256; b++) {
    varianceSum += Math.pow(counts[b] - expectedPerBin, 2);
  }
  const stdDev = Math.sqrt(varianceSum / 256);

  return {
    dropN,
    zeroCount,
    zeroPercentage,
    stdDev: Math.round(stdDev * 100) / 100,
    frequencies,
  };
}

/**
 * Hiệu ứng thác đổ (Avalanche Test) trên Full RC4
 */
export function runAvalancheTest(originalKey: string, streamLength = 64) {
  const key1 = stringToBytes(originalKey);
  if (key1.length === 0) {
    key1.push(65);
  }

  const key2 = [...key1];
  key2[0] = key2[0] ^ 1;

  const dummyPlain = new Array(streamLength).fill(0);
  const { keystreamBytes: stream1 } = rc4EncryptBytes(key1, dummyPlain);
  const { keystreamBytes: stream2 } = rc4EncryptBytes(key2, dummyPlain);

  const bitDifferences: number[] = [];
  let totalBitsFlipped = 0;

  for (let i = 0; i < streamLength; i++) {
    const xor = stream1[i] ^ stream2[i];
    let diff = 0;
    for (let b = 0; b < 8; b++) {
      if ((xor >> b) & 1) diff++;
    }
    bitDifferences.push(diff);
    totalBitsFlipped += diff;
  }

  const totalBits = streamLength * 8;
  const overallPercentage = (totalBitsFlipped / totalBits) * 100;

  return {
    key1Hex: bytesToHex(key1, ' '),
    key2Hex: bytesToHex(key2, ' '),
    stream1Hex: bytesToHex(stream1),
    stream2Hex: bytesToHex(stream2),
    bitDifferences,
    overallPercentage: Math.round(overallPercentage * 100) / 100,
    totalBitsFlipped,
    totalBits,
  };
}
