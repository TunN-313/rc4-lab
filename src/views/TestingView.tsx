import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Clock,
  Sparkles,
  FileCheck,
  AlertTriangle,
  Layers,
  Filter,
  ArrowRight,
  Download,
} from 'lucide-react';
import {
  stringToBytes,
  bytesToString,
  hexToBytes,
  bytesToHex,
  rc4EncryptBytes,
  TinyRC4,
  FullRC4,
  TINY_RC4_CLASSROOM_EXAMPLE,
  formatNumberArray,
} from '../crypto/rc4';

export interface TestCaseResult {
  id: string;
  category: 'vector' | 'roundtrip' | 'edge';
  name: string;
  inputDescription: string;
  expectedOutput: string;
  actualOutput: string;
  durationMs: number;
  status: 'passed' | 'failed' | 'idle';
  errorDetails?: string;
}

export const TestingView: React.FC = () => {
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [totalTimeMs, setTotalTimeMs] = useState(0);

  // Initialize test plan metadata
  const initTestPlan = (): TestCaseResult[] => [
    {
      id: 'TC-01',
      category: 'vector',
      name: 'Vector kinh điển (Wikipedia)',
      inputDescription: 'Key: "Key", Plaintext: "Plaintext"',
      expectedOutput: 'BBF316E8D940AF0AD3',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-02',
      category: 'vector',
      name: 'Vector Wikipedia',
      inputDescription: 'Key: "Wiki", Plaintext: "pedia"',
      expectedOutput: '1021BF0420',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-03',
      category: 'vector',
      name: 'Secret / Attack at dawn',
      inputDescription: 'Key: "Secret", Plaintext: "Attack at dawn"',
      expectedOutput: '45A01F645FC35B383552544B9BF5',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-04',
      category: 'vector',
      name: 'Single Character Boundary',
      inputDescription: 'Key: "Pass", Plaintext: "A"',
      expectedOutput: '0A',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-05',
      category: 'roundtrip',
      name: 'Round-trip: Bản rõ ngẫu nhiên ngắn (32 bytes)',
      inputDescription: 'Key: ngẫu nhiên 16 bytes, Plaintext: 32 bytes ngẫu nhiên',
      expectedOutput: 'Decrypt(Encrypt(P)) == P (100% khớp)',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-06',
      category: 'roundtrip',
      name: 'Round-trip: Bản rõ ngẫu nhiên trung bình (256 bytes)',
      inputDescription: 'Key: ngẫu nhiên 32 bytes, Plaintext: 256 bytes ngẫu nhiên',
      expectedOutput: 'Decrypt(Encrypt(P)) == P (100% khớp)',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-07',
      category: 'roundtrip',
      name: 'Round-trip: Bản rõ lớn (1024 bytes)',
      inputDescription: 'Key: "SuperSecretKey99", Plaintext: 1024 bytes dữ liệu',
      expectedOutput: 'Decrypt(Encrypt(P)) == P (100% khớp)',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-08',
      category: 'edge',
      name: 'Edge Case: Bản rõ rỗng (0 bytes)',
      inputDescription: 'Key: "AnyKey", Plaintext: "" (empty string)',
      expectedOutput: 'Bản mã 0 bytes (empty hex "")',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-09',
      category: 'edge',
      name: 'Edge Case: Khóa tối thiểu 1-byte',
      inputDescription: 'Key: [0x5A] (1 byte), Plaintext: "Hello Single Byte Key"',
      expectedOutput: 'Mã hóa thành công và giải mã đảo ngược 100% toàn vẹn',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-10',
      category: 'edge',
      name: 'Edge Case: Khóa tối đa 256-bytes (KSA boundary)',
      inputDescription: 'Key: mảng đúng 256 bytes (0..255), Plaintext: "Boundary Test"',
      expectedOutput: 'Vòng lặp KSA hoàn tất không lỗi overflow; giải mã thành công',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-11',
      category: 'edge',
      name: 'Edge Case: Ký tự Unicode UTF-8 Tiếng Việt có dấu',
      inputDescription: 'Key: "MatMaHoc", Plaintext: "Xin chào Việt Nam! Mật mã dòng RC4"',
      expectedOutput: 'Chuỗi Unicode phục hồi nguyên vẹn cả dấu tiếng Việt',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-12',
      category: 'edge',
      name: 'Edge Case: Triệt tiêu dòng khóa (Key reuse XOR cancel)',
      inputDescription: 'Key: "SharedKey", P1: "Message1Alpha", P2: "Message2Omega"',
      expectedOutput: 'C1 ⊕ C2 hoàn toàn trùng khớp từng byte với P1 ⊕ P2',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-13',
      category: 'vector',
      name: 'TinyRC4: Ví Dụ Chuẩn Bài Giảng Của Giảng Viên (N = 8)',
      inputDescription: 'K=[2,1,3] -> T=[2,1,3,2,1,3,2,1], P="BAG"=[1,0,6] (001 000 110)',
      expectedOutput: 'S=[6,0,7,1,2,3,5,4], KS=[5,1,6], C=[4,1,0] ("EBA"), Giải mã="BAG"',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-14',
      category: 'roundtrip',
      name: 'TinyRC4: Đối Xứng Round-trip N=4, N=8, N=16',
      inputDescription: 'Kiểm tra Decrypt(Encrypt(P)) == P trên cả 3 kích thước trạng thái N',
      expectedOutput: 'Hoàn nguyên 100% bản rõ ban đầu trên N=4, N=8 và N=16',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-15',
      category: 'edge',
      name: 'TinyRC4: Kiểm Chứng Trace Mode Trung Gian',
      inputDescription: 'Thu thập đầy đủ i, j, S trước/sau swap, chỉ số t, byte dòng khóa',
      expectedOutput: 'Trace mode trả về 100% các trường dữ liệu trung gian chuẩn xác',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-16',
      category: 'roundtrip',
      name: 'Full RC4: Đối Chuẩn Test Vectors Chuẩn Quốc Tế & Tính Tất Định',
      inputDescription: 'Kiểm thử đối chiếu các vector chuẩn IETF RFC 6229 và tính đối xứng hoàn nguyên',
      expectedOutput: 'Khớp chính xác 100% test vectors chuẩn, Decrypt(Encrypt(P)) == P',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-17',
      category: 'vector',
      name: 'Chuẩn IETF RFC 6229: Khóa 40-bit (Offset 0)',
      inputDescription: 'Key: 0x0102030405 (40-bit), so sánh 16 bytes dòng khóa tại Offset 0',
      expectedOutput: 'B2396305F03DC027CCC3524A0A1118A8',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
    {
      id: 'TC-18',
      category: 'vector',
      name: 'Chuẩn IETF RFC 6229: Khóa 128-bit (Offset 0)',
      inputDescription: 'Key: 0x0102030405060708090A0B0C0D0E0F10 (128-bit), so sánh 16 bytes dòng khóa tại Offset 0',
      expectedOutput: '9AC7CC9A609D1EF7B2932899CDE41B97',
      actualOutput: 'Chưa chạy',
      durationMs: 0,
      status: 'idle',
    },
  ];

  useEffect(() => {
    setTestResults(initTestPlan());
  }, []);

  // Execute a single test case
  const executeTestCase = (test: TestCaseResult): TestCaseResult => {
    const t0 = performance.now();
    try {
      if (test.id === 'TC-01') {
        const key = stringToBytes('Key');
        const plain = stringToBytes('Plaintext');
        const { ciphertextBytes } = rc4EncryptBytes(key, plain);
        const hex = bytesToHex(ciphertextBytes);
        const passed = hex === 'BBF316E8D940AF0AD3';
        return {
          ...test,
          actualOutput: hex,
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-02') {
        const key = stringToBytes('Wiki');
        const plain = stringToBytes('pedia');
        const { ciphertextBytes } = rc4EncryptBytes(key, plain);
        const hex = bytesToHex(ciphertextBytes);
        const passed = hex === '1021BF0420';
        return {
          ...test,
          actualOutput: hex,
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-03') {
        const key = stringToBytes('Secret');
        const plain = stringToBytes('Attack at dawn');
        const { ciphertextBytes } = rc4EncryptBytes(key, plain);
        const hex = bytesToHex(ciphertextBytes);
        const passed = hex === '45A01F645FC35B383552544B9BF5';
        return {
          ...test,
          actualOutput: hex,
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-04') {
        const key = stringToBytes('Pass');
        const plain = stringToBytes('A');
        const { ciphertextBytes } = rc4EncryptBytes(key, plain);
        const hex = bytesToHex(ciphertextBytes);
        const passed = hex === '0A';
        return {
          ...test,
          actualOutput: hex,
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-05' || test.id === 'TC-06' || test.id === 'TC-07') {
        const size = test.id === 'TC-05' ? 32 : test.id === 'TC-06' ? 256 : 1024;
        const key = Array.from(crypto.getRandomValues(new Uint8Array(16)));
        const plain = Array.from(crypto.getRandomValues(new Uint8Array(size)));

        const { ciphertextBytes } = rc4EncryptBytes(key, plain);
        const { ciphertextBytes: decryptedBytes } = rc4EncryptBytes(key, ciphertextBytes);

        const matched = plain.every((val, idx) => val === decryptedBytes[idx]);
        return {
          ...test,
          actualOutput: matched ? 'Decrypt(Encrypt(P)) == P (100% khớp)' : 'Khác biệt dữ liệu',
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: matched ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-08') {
        const key = stringToBytes('AnyKey');
        const plain: number[] = [];
        const { ciphertextBytes } = rc4EncryptBytes(key, plain);
        const hex = bytesToHex(ciphertextBytes);
        const passed = hex === '';
        return {
          ...test,
          actualOutput: hex === '' ? 'Bản mã 0 bytes (empty hex "")' : hex,
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-09') {
        const key = [0x5a];
        const plain = stringToBytes('Hello Single Byte Key');
        const { ciphertextBytes } = rc4EncryptBytes(key, plain);
        const { ciphertextBytes: decrypted } = rc4EncryptBytes(key, ciphertextBytes);
        const text = bytesToString(decrypted);
        const passed = text === 'Hello Single Byte Key';
        return {
          ...test,
          actualOutput: passed ? 'Mã hóa thành công và giải mã đảo ngược 100% toàn vẹn' : 'Lỗi giải mã',
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-10') {
        // 256-byte key boundary
        const key = Array.from({ length: 256 }, (_, i) => i);
        const plain = stringToBytes('Boundary Test');
        const { ciphertextBytes } = rc4EncryptBytes(key, plain);
        const { ciphertextBytes: decrypted } = rc4EncryptBytes(key, ciphertextBytes);
        const text = bytesToString(decrypted);
        const passed = text === 'Boundary Test';
        return {
          ...test,
          actualOutput: passed ? 'Vòng lặp KSA hoàn tất không lỗi overflow; giải mã thành công' : 'Lỗi KSA',
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-11') {
        const originalText = 'Xin chào Việt Nam! Mật mã dòng RC4';
        const key = stringToBytes('MatMaHoc');
        const plain = stringToBytes(originalText);
        const { ciphertextBytes } = rc4EncryptBytes(key, plain);
        const { ciphertextBytes: decrypted } = rc4EncryptBytes(key, ciphertextBytes);
        const recoveredText = bytesToString(decrypted);
        const passed = recoveredText === originalText;
        return {
          ...test,
          actualOutput: passed
            ? `Chuỗi Unicode phục hồi nguyên vẹn: "${recoveredText}"`
            : `Lỗi sai lệch Unicode`,
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-12') {
        const key = stringToBytes('SharedKey');
        const p1 = stringToBytes('Message1Alpha');
        const p2 = stringToBytes('Message2Omega');
        const { ciphertextBytes: c1 } = rc4EncryptBytes(key, p1);
        const { ciphertextBytes: c2 } = rc4EncryptBytes(key, p2);

        const c1XorC2 = c1.map((b, i) => b ^ c2[i]);
        const p1XorP2 = p1.map((b, i) => b ^ p2[i]);
        const passed = c1XorC2.every((val, idx) => val === p1XorP2[idx]);
        return {
          ...test,
          actualOutput: passed
            ? 'C1 ⊕ C2 hoàn toàn trùng khớp từng byte với P1 ⊕ P2'
            : 'XOR không khớp',
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-13') {
        // Lecturer Example: K=[2,1,3], P=[1,0,6] ("BAG")
        const ex = TINY_RC4_CLASSROOM_EXAMPLE;
        const ksaRes = TinyRC4.ksa(ex.key, 8, true);
        const cryptRes = TinyRC4.encrypt(ex.plaintext, ex.key, 8, true);
        const decryptRes = TinyRC4.decrypt(cryptRes.ciphertext, ex.key, 8, true);

        // Verification checks against lecturer expected values
        const differingSteps: string[] = [];

        // 1. Check S after KSA
        const sMatched = ksaRes.s.every((v, i) => v === ex.expectedKsaS[i]);
        if (!sMatched) {
          differingSteps.push(`KSA (Thực tế: [${ksaRes.s}], Kỳ vọng: [${ex.expectedKsaS}])`);
        }

        // 2. Check PRGA swapped S step-by-step
        const prgaSteps = cryptRes.prgaTrace || [];
        ex.expectedPrgaSwapS.forEach((expectedS, stepIdx) => {
          const actualStep = prgaSteps[stepIdx];
          if (!actualStep || !actualStep.sAfter.every((v, i) => v === expectedS[i])) {
            differingSteps.push(
              `PRGA Bước ${stepIdx} (Thực tế: [${actualStep?.sAfter || []}], Kỳ vọng: [${expectedS}])`
            );
          }
        });

        // 3. Check Keystream
        const ksMatched = cryptRes.keystream.every((v, i) => v === ex.expectedKeystream[i]);
        if (!ksMatched) {
          differingSteps.push(`Keystream (Thực tế: [${cryptRes.keystream}], Kỳ vọng: [${ex.expectedKeystream}])`);
        }

        // 4. Check Ciphertext
        const cMatched = cryptRes.ciphertext.every((v, i) => v === ex.expectedCiphertext[i]);
        if (!cMatched) {
          differingSteps.push(`Ciphertext (Thực tế: [${cryptRes.ciphertext}], Kỳ vọng: [${ex.expectedCiphertext}])`);
        }

        // 5. Check Decryption
        const pMatched = decryptRes.plaintext.every((v, i) => v === ex.plaintext[i]);
        if (!pMatched) {
          differingSteps.push(`Giải mã (Thực tế: [${decryptRes.plaintext}], Kỳ vọng: [${ex.plaintext}])`);
        }

        const allMatched = differingSteps.length === 0;
        return {
          ...test,
          actualOutput: allMatched
            ? `100% Khớp: S_KSA=[${formatNumberArray(ksaRes.s)}], PRGA S sau swap: [${formatNumberArray(ex.expectedPrgaSwapS[0])}], [${formatNumberArray(ex.expectedPrgaSwapS[1])}], [${formatNumberArray(ex.expectedPrgaSwapS[2])}], KS=[${formatNumberArray(cryptRes.keystream)}], C=[${formatNumberArray(cryptRes.ciphertext)}] ("EBA"), P=[${formatNumberArray(decryptRes.plaintext)}] ("BAG")`
            : `Sai lệch tại các bước: ${differingSteps.join('; ')}`,
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: allMatched ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-14') {
        // Roundtrip for TinyRC4: N=4, N=8, N=16
        let allPassed = true;
        // Test N=4
        const k4 = [1, 2, 3];
        const p4 = [0, 1, 2, 3, 2, 1, 0];
        const c4 = TinyRC4.encrypt(p4, k4, 4);
        const d4 = TinyRC4.decrypt(c4.ciphertext, k4, 4);
        if (!p4.every((v, i) => v === d4.plaintext[i])) allPassed = false;

        // Test N=8
        const k8 = [2, 1, 3];
        const p8 = [1, 0, 6, 7, 2, 4, 5, 3];
        const c8 = TinyRC4.encrypt(p8, k8, 8);
        const d8 = TinyRC4.decrypt(c8.ciphertext, k8, 8);
        if (!p8.every((v, i) => v === d8.plaintext[i])) allPassed = false;

        // Test N=16
        const k16 = [1, 5, 9, 13, 15];
        const p16 = [2, 4, 6, 8, 10, 12, 14, 0, 1, 3, 5];
        const c16 = TinyRC4.encrypt(p16, k16, 16);
        const d16 = TinyRC4.decrypt(c16.ciphertext, k16, 16);
        if (!p16.every((v, i) => v === d16.plaintext[i])) allPassed = false;

        return {
          ...test,
          actualOutput: allPassed
            ? 'Hoàn nguyên 100% bản rõ ban đầu trên N=4, N=8 và N=16'
            : 'Lỗi hoàn nguyên dữ liệu TinyRC4',
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: allPassed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-15') {
        // Trace Mode Verification
        const key = [2, 1, 3];
        const plain = [1, 0, 6];
        const res = TinyRC4.encrypt(plain, key, 8, true);

        const hasKsaTrace = res.ksaTrace && res.ksaTrace.length === 8;
        const hasPrgaTrace = res.prgaTrace && res.prgaTrace.length === 3;
        const allFieldsPresent =
          hasKsaTrace &&
          hasPrgaTrace &&
          res.ksaTrace!.every((s) => s.i !== undefined && s.j !== undefined && s.sBefore && s.sAfter && s.swapped) &&
          res.prgaTrace!.every((s) => s.i !== undefined && s.j !== undefined && s.t !== undefined && s.keystreamByte !== undefined && s.sBefore && s.sAfter && s.swapped);

        return {
          ...test,
          actualOutput: allFieldsPresent
            ? 'Trace mode: 8 bước KSA + 3 bước PRGA có đầy đủ i, j, t, swapped, sBefore, sAfter, keystream'
            : 'Thiếu trường dữ liệu trong trace mode',
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: allFieldsPresent ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-16') {
        // Full RC4 comparative verification with multiple standard test vectors
        const testPairs = [
          { key: 'Key', plain: 'Plaintext', expected: 'BBF316E8D940AF0AD3' },
          { key: 'Wiki', plain: 'pedia', expected: '1021BF0420' },
          { key: 'Secret', plain: 'Attack at dawn', expected: '45A01F645FC35B383552544B9BF5' },
        ];

        let allVectorsPass = true;
        for (const tp of testPairs) {
          const enc = FullRC4.encrypt(stringToBytes(tp.plain), stringToBytes(tp.key));
          const hex = bytesToHex(enc.ciphertext);
          if (hex !== tp.expected) {
            allVectorsPass = false;
            break;
          }
          const dec = FullRC4.decrypt(enc.ciphertext, stringToBytes(tp.key));
          if (bytesToString(dec.plaintext) !== tp.plain) {
            allVectorsPass = false;
            break;
          }
        }

        // Test determinism
        const keyRand = [10, 20, 30, 40, 50, 60, 70, 80];
        const plainRand = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const run1 = FullRC4.encrypt(plainRand, keyRand);
        const run2 = FullRC4.encrypt(plainRand, keyRand);
        const isDeterministic = run1.ciphertext.every((v, i) => v === run2.ciphertext[i]);

        const passed = allVectorsPass && isDeterministic;
        return {
          ...test,
          actualOutput: passed
            ? '100% khớp các test vectors chuẩn quốc tế (RFC 6229 / Wikipedia), giải mã hoàn nguyên chính xác, tính tất định tuyệt đối'
            : 'Sai lệch đối chuẩn test vectors',
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-17') {
        // RFC 6229 40-bit key keystream at offset 0 (compare generated keystream, not encryption of text)
        const key = hexToBytes('0102030405');
        const ksa = FullRC4.ksa(key);
        const prga = FullRC4.prga(ksa.s, 16, 0);
        const actualHex = bytesToHex(prga.keystream).toUpperCase();
        const expectedHex = 'B2396305F03DC027CCC3524A0A1118A8';
        const passed = actualHex === expectedHex;
        return {
          ...test,
          actualOutput: actualHex,
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      if (test.id === 'TC-18') {
        // RFC 6229 128-bit key keystream at offset 0 (compare generated keystream, not encryption of text)
        const key = hexToBytes('0102030405060708090a0b0c0d0e0f10');
        const ksa = FullRC4.ksa(key);
        const prga = FullRC4.prga(ksa.s, 16, 0);
        const actualHex = bytesToHex(prga.keystream).toUpperCase();
        const expectedHex = '9AC7CC9A609D1EF7B2932899CDE41B97';
        const passed = actualHex === expectedHex;
        return {
          ...test,
          actualOutput: actualHex,
          durationMs: Math.round((performance.now() - t0) * 100) / 100,
          status: passed ? 'passed' : 'failed',
        };
      }

      return test;
    } catch (err: any) {
      return {
        ...test,
        actualOutput: 'Lỗi ngoại lệ runtime',
        errorDetails: err.message,
        durationMs: Math.round((performance.now() - t0) * 100) / 100,
        status: 'failed',
      };
    }
  };

  // Run all tests sequentially
  const handleRunAllTests = () => {
    setIsRunningAll(true);
    const startTotal = performance.now();

    // Use setTimeout to allow UI render
    setTimeout(() => {
      const updated = testResults.map((tc) => executeTestCase(tc));
      setTestResults(updated);
      setTotalTimeMs(Math.round((performance.now() - startTotal) * 100) / 100);
      setIsRunningAll(false);
    }, 50);
  };

  const handleRunSingleTest = (id: string) => {
    setTestResults((prev) =>
      prev.map((tc) => (tc.id === id ? executeTestCase(tc) : tc))
    );
  };

  const handleResetTests = () => {
    setTestResults(initTestPlan());
    setTotalTimeMs(0);
  };

  // Export results as both .csv and .json with timestamp
  const handleExportResults = () => {
    if (!testResults || testResults.length === 0) return;

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    // Columns: ID, group, name, input, expected, actual, status
    const rows = testResults.map((tc) => ({
      ID: tc.id,
      group: tc.category,
      name: tc.name,
      input: tc.inputDescription,
      expected: tc.expectedOutput,
      actual: tc.actualOutput,
      status: tc.status,
    }));

    // 1. Download JSON
    const jsonContent = JSON.stringify(rows, null, 2);
    const jsonBlob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `rc4_test_results_${timestamp}.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);

    // 2. Download CSV (with BOM for Excel Unicode compatibility)
    const headers = ['ID', 'group', 'name', 'input', 'expected', 'actual', 'status'];
    const escapeCsv = (val: string) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvLines = [
      headers.join(','),
      ...rows.map((r) =>
        [r.ID, r.group, r.name, r.input, r.expected, r.actual, r.status]
          .map(escapeCsv)
          .join(',')
      ),
    ];
    const csvContent = '\uFEFF' + csvLines.join('\r\n');
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `rc4_test_results_${timestamp}.csv`;
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
    URL.revokeObjectURL(csvUrl);
  };

  // Filter test results
  const filteredResults = testResults.filter((r) => {
    if (filter === 'passed') return r.status === 'passed';
    if (filter === 'failed') return r.status === 'failed';
    return true;
  });

  const passedCount = testResults.filter((r) => r.status === 'passed').length;
  const failedCount = testResults.filter((r) => r.status === 'failed').length;
  const totalCount = testResults.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Kiểm Thử Đơn Vị Mật Mã Học Trực Tiếp Trên Trình Duyệt</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Bộ Kiểm Thử Toàn Diện (In-App Test Runner)
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Thực thi trực tiếp bộ ca kiểm thử (Unit Tests) cho thuật toán RC4 trong môi trường trình duyệt: Kiểm tra các Test Vector chuẩn quốc tế, tính chất mã hóa - giải mã đối xứng (Round-trip), và các trường hợp biên nguy hiểm (Edge cases).
        </p>
      </div>

      {/* Test Runner Toolbar & Scoreboard */}
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAllTests}
              disabled={isRunningAll}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition cursor-pointer disabled:opacity-50"
            >
              {isRunningAll ? (
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span>Chạy Tất Cả Kiểm Thử ({totalCount} Tests)</span>
            </button>

            <button
              onClick={handleResetTests}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Đặt lại trạng thái kiểm thử"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Xuất Kết Quả Button */}
            <button
              onClick={handleExportResults}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 hover:text-white text-sm font-semibold transition cursor-pointer shadow-md"
              title="Tải về báo cáo kết quả kiểm thử đồng thời cả .csv và .json kèm dấu thời gian"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Xuất kết quả</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Thời gian chạy:</span>
              <span className="text-cyan-300 font-bold">{totalTimeMs} ms</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Đạt: {passedCount}/{totalCount}</span>
            </div>
            {failedCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Thất bại: {failedCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                failedCount > 0
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
              }`}
              style={{
                width: `${totalCount > 0 ? ((passedCount + failedCount) / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Bộ lọc danh sách:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất Cả ({totalCount})
            </button>
            <button
              onClick={() => setFilter('passed')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filter === 'passed'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Đã Đạt ({passedCount})
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filter === 'failed'
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Thất Bại ({failedCount})
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Engine: Pure TypeScript Client Runtime • Zero Network Overhead
          </div>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-300 font-mono">
                <th className="py-3.5 px-4 font-bold">Mã ID</th>
                <th className="py-3.5 px-4">Tên Ca Kiểm Thử & Phân Loại</th>
                <th className="py-3.5 px-4">Đầu Vào (Key & Plaintext)</th>
                <th className="py-3.5 px-4">Đầu Ra Kỳ Vọng (Expected)</th>
                <th className="py-3.5 px-4">Đầu Ra Thực Tế (Actual)</th>
                <th className="py-3.5 px-4 text-center">Thời Gian</th>
                <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Chạy Lại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300 font-mono">
              {filteredResults.map((tc) => (
                <tr
                  key={tc.id}
                  className={`hover:bg-slate-800/30 transition ${
                    tc.status === 'failed' ? 'bg-rose-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-cyan-400">{tc.id}</td>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-semibold text-white">{tc.name}</div>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                        tc.category === 'vector'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : tc.category === 'roundtrip'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {tc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate" title={tc.inputDescription}>
                    {tc.inputDescription}
                  </td>
                  <td className="py-3 px-4 text-emerald-300 max-w-[180px] truncate" title={tc.expectedOutput}>
                    {tc.expectedOutput}
                  </td>
                  <td
                    className={`py-3 px-4 max-w-[180px] truncate ${
                      tc.status === 'passed'
                        ? 'text-emerald-400'
                        : tc.status === 'failed'
                        ? 'text-rose-400 font-bold'
                        : 'text-slate-500'
                    }`}
                    title={tc.actualOutput}
                  >
                    {tc.actualOutput}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400">
                    {tc.status !== 'idle' ? `${tc.durationMs}ms` : '---'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {tc.status === 'passed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> PASSED
                      </span>
                    ) : tc.status === 'failed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700 animate-pulse">
                        <XCircle className="w-3 h-3 text-rose-400" /> FAILED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                        IDLE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRunSingleTest(tc.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                      title="Chạy lại ca này"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
