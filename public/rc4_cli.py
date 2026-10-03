#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RC4 CLI - Công Cụ Dòng Lệnh Mã Hóa Dòng RC4 & TinyRC4 (Standalone Python 3)
Phát triển bởi RC4 Lab cho mục đích nghiên cứu và giáo dục mật mã học.

Khuyến cáo an toàn:
RC4 là thuật toán đã lỗi thời và chứa nhiều lỗ hổng toán học (bị cấm theo RFC 7465).
TUYỆT ĐỐI KHÔNG SỬ DỤNG ĐỂ BẢO VỆ DỮ LIỆU THỰC TẾ!

CÁC VÍ DỤ SỬ DỤNG:
===============================================================================
1. MÃ HÓA & GIẢI MÃ CHUẨN (FULL RC4 - N = 256):
   # Mã hóa văn bản xuất chuỗi Hex (Vector chuẩn RFC / Wikipedia):
   python public/rc4_cli.py encrypt --key Key --text Plaintext
   -> BBF316E8D940AF0AD3

   # Giải mã chuỗi Hex trả về văn bản gốc UTF-8:
   python public/rc4_cli.py decrypt --key Key --hex BBF316E8D940AF0AD3 --format text
   -> Plaintext

   # Mã hóa xuất định dạng Base64:
   python public/rc4_cli.py encrypt --key "MatKhau123" --text "Du lieu bi mat" --format base64

   # Khắc phục thiên vị byte đầu với biến thể RC4-drop[768]:
   python public/rc4_cli.py encrypt --key "SafeKey" --text "Payload" --drop 768

2. CHẾ ĐỘ TINYRC4 (N = 4, 8, 16):
   # Ví dụ bài giảng giảng viên (N = 8, Key=[2,1,3], Plaintext=[1,0,6] / "BAG"):
   python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "1,0,6"
   -> 4, 1, 0

   # Nhập dạng chữ cái A-H (N = 8, "BAG" -> [1,0,6]):
   python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "BAG" --format text
   -> EBA

   # Nhập dạng cụm bit nhị phân (3-bit cho N=8):
   python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "001 000 110" --format binary
   -> 100 001 000

   # Giải mã hoàn nguyên bản rõ:
   python public/rc4_cli.py decrypt --tiny 8 --key "2,1,3" --text "4,1,0"
   -> 1, 0, 6

   # Bật cờ --trace in chi tiết từng bước KSA, PRGA, mảng S, t và keystream:
   python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "BAG" --trace

3. CHẾ ĐỘ TẬP TIN (FILE CIPHER & SHA-256 INTEGRITY):
   # Mã hóa tệp tin và in mã băm SHA-256 đối chiếu:
   python public/rc4_cli.py encrypt-file --key "SecretKey123" --in document.pdf --out document.enc

   # Giải mã tệp tin và in mã băm SHA-256 kiểm chứng toàn vẹn:
   python public/rc4_cli.py decrypt-file --key "SecretKey123" --in document.enc --out document_dec.pdf

4. BỘ KIỂM ĐỊNH TÍCH HỢP (TEST SUITE):
   # Chạy toàn bộ Test Vectors chuẩn (Wikipedia, RFC 6229, TinyRC4 bài giảng, Round-trip):
   python public/rc4_cli.py --test
===============================================================================
"""

import sys
import os
import re
import argparse
import base64
import hashlib  # CHỈ dùng để tính và đối chiếu mã băm SHA-256 trong chế độ tệp, KHÔNG dùng trong lõi mã hóa

# Cấu hình UTF-8 cho console Windows để tránh UnicodeEncodeError
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# =============================================================================
# 1. LÕI MẬT MÃ FULL RC4 (N = 256) - THUẦN TOÁN HỌC 100%
# =============================================================================

def rc4_crypt(key_bytes: bytes, data_bytes: bytes, drop_n: int = 0) -> tuple[bytes, bytes]:
    """
    Thuật toán mã hóa dòng RC4 thuần túy (Pure RC4, N = 256).
    Trả về: (output_bytes, keystream_bytes)
    Do tính đối xứng của phép XOR: C = P ^ K và P = C ^ K.
    """
    if not key_bytes:
        raise ValueError("Khóa RC4 không được để trống (độ dài 1 - 256 bytes).")

    # 1. KSA (Key-Scheduling Algorithm)
    S = list(range(256))
    j = 0
    key_len = len(key_bytes)
    for i in range(256):
        j = (j + S[i] + key_bytes[i % key_len]) & 0xFF
        S[i], S[j] = S[j], S[i]

    # 2. Vứt bỏ n byte đầu nếu dùng biến thể RC4-drop[n]
    i = 0
    j = 0
    for _ in range(drop_n):
        i = (i + 1) & 0xFF
        j = (j + S[i]) & 0xFF
        S[i], S[j] = S[j], S[i]

    # 3. PRGA (Pseudo-Random Generation Algorithm) & XOR
    keystream = bytearray()
    output = bytearray()
    for b in data_bytes:
        i = (i + 1) & 0xFF
        j = (j + S[i]) & 0xFF
        S[i], S[j] = S[j], S[i]
        t = (S[i] + S[j]) & 0xFF
        k = S[t]
        keystream.append(k)
        output.append(b ^ k)

    return bytes(output), bytes(keystream)

# =============================================================================
# 2. LÕI MẬT MÃ TINYRC4 (N = 4, 8, 16) - ĐỐI CHUẨN BÀI GIẢNG GIẢNG VIÊN
# =============================================================================

def tiny_rc4_crypt(
    key: list[int],
    data: list[int],
    N: int = 8,
    trace: bool = False
) -> tuple[list[int], list[int], list[int], list[dict], list[dict]]:
    """
    Thuật toán TinyRC4 thuần túy cho kích thước N (4, 8, 16).
    Mảng lặp khóa T: T[i] = K[i mod key_len] với i từ 0 đến N-1.
    KSA: j = (j + S[i] + T[i]) mod N, hoán vị S[i] <-> S[j].
    PRGA:
        i = (i + 1) mod N
        j = (j + S[i]) mod N
        hoán vị S[i] <-> S[j]
        t = (S[i] + S[j]) mod N
        k = S[t]
        C = (P ^ k) mod N
    Trả về: (output_list, keystream_list, final_S_ksa, ksa_traces, prga_traces)
    """
    if N not in (4, 8, 16):
        raise ValueError(f"TinyRC4 chỉ hỗ trợ N in [4, 8, 16]. Giá trị hiện tại: N = {N}")
    if not key:
        raise ValueError("Khóa bí mật TinyRC4 không được để trống.")

    for idx, k_val in enumerate(key):
        if not isinstance(k_val, int) or k_val < 0 or k_val >= N:
            raise ValueError(f"Khóa tại vị trí {idx} có giá trị {k_val} không hợp lệ (phải từ 0 đến {N - 1}).")

    for idx, d_val in enumerate(data):
        if not isinstance(d_val, int) or d_val < 0 or d_val >= N:
            raise ValueError(f"Dữ liệu tại vị trí {idx} có giá trị {d_val} không hợp lệ (phải từ 0 đến {N - 1}).")

    # 1. Mảng T và Khởi tạo S
    S = list(range(N))
    key_len = len(key)
    T = [key[i % key_len] for i in range(N)]

    ksa_traces = []
    j = 0
    for i in range(N):
        s_before = list(S)
        old_j = j
        j = (j + S[i] + T[i]) % N
        val_i, val_j = S[i], S[j]
        S[i], S[j] = S[j], S[i]
        if trace:
            ksa_traces.append({
                "step": i,
                "i": i,
                "old_j": old_j,
                "j": j,
                "key_idx": i % key_len,
                "T_i": T[i],
                "val_i": val_i,
                "val_j": val_j,
                "s_before": s_before,
                "s_after": list(S),
                "swapped": (i, j),
            })

    final_s_ksa = list(S)

    # 2. PRGA & XOR
    prga_traces = []
    i = 0
    j = 0
    keystream = []
    output = []

    for step, val in enumerate(data):
        s_before = list(S)
        old_i, old_j = i, j
        i = (i + 1) % N
        j = (j + S[i]) % N
        val_i, val_j = S[i], S[j]
        S[i], S[j] = S[j], S[i]
        t = (S[i] + S[j]) % N
        k = S[t]
        out_val = (val ^ k) % N
        keystream.append(k)
        output.append(out_val)

        if trace:
            prga_traces.append({
                "step": step,
                "old_i": old_i,
                "i": i,
                "old_j": old_j,
                "j": j,
                "val_i": val_i,
                "val_j": val_j,
                "swapped": (i, j),
                "s_before": s_before,
                "s_after": list(S),
                "t": t,
                "k": k,
                "input_val": val,
                "output_val": out_val,
            })

    return output, keystream, final_s_ksa, ksa_traces, prga_traces

# =============================================================================
# 3. PHÂN TÍCH & ĐỊNH DẠNG ĐẦU VÀO / ĐẦU RA CHO TINYRC4
# =============================================================================

def parse_tiny_input(raw: str, N: int) -> list[int]:
    """
    Phân tích chuỗi đầu vào cho TinyRC4 (N in [4, 8, 16]):
    - Dạng mảng số phân tách bằng dấu phẩy/khoảng trắng: ví dụ "2,1,3" hoặc "1, 0, 6"
    - Dạng cụm nhị phân hoặc chuỗi bit liền: ví dụ "001 000 110" hoặc "001000110"
    - Dạng chữ cái (khi N = 8, từ A đến H: A=0, B=1, ..., H=7): ví dụ "BAG"
    """
    s = raw.strip()
    if not s:
        return []

    # Loại bỏ dấu ngoặc vuông nếu có
    if s.startswith("[") and s.endswith("]"):
        s = s[1:-1].strip()

    word_bits = {4: 2, 8: 3, 16: 4}.get(N, 3)

    # 1. Chữ cái (A-H cho N=8)
    has_letters = any(c.isalpha() for c in s)
    if has_letters:
        if N != 8:
            raise ValueError(f"Chế độ chữ cái chỉ áp dụng cho N = 8 (từ A đến H). Hiện tại N = {N}.")
        result = []
        for ch in s:
            if ch in " ,;\t\r\n":
                continue
            if not ch.isalpha():
                raise ValueError(f"Ký tự '{ch}' không hợp lệ trong chuỗi chữ cái TinyRC4.")
            upper = ch.upper()
            val = ord(upper) - ord('A')
            if val < 0 or val > 7:
                raise ValueError(
                    f"Ký tự '{ch}' không hợp lệ. TinyRC4 (N=8) chỉ chấp nhận các chữ cái từ A đến H (quy ước: A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7)."
                )
            result.append(val)
        return result

    # 2. Tách các token
    tokens = [t.strip() for t in re.split(r'[\s,;]+', s) if t.strip()]

    # Kiểm tra chuỗi các cụm nhị phân (ví dụ: "001 000 110")
    if tokens and all(re.fullmatch(r'[01]+', t) for t in tokens) and (len(tokens) > 1 or len(tokens[0]) <= word_bits):
        result = []
        for t in tokens:
            val = int(t, 2)
            if val >= N:
                raise ValueError(f"Cụm bit '{t}' (giá trị {val}) vượt quá phạm vi [0, {N - 1}] của TinyRC4 (N = {N}).")
            result.append(val)
        return result

    # Kiểm tra chuỗi bit liền nhau (ví dụ: "001000110")
    raw_no_sep = re.sub(r'[\s,;]+', '', s)
    if raw_no_sep and re.fullmatch(r'[01]+', raw_no_sep) and len(raw_no_sep) % word_bits == 0 and len(raw_no_sep) > word_bits:
        result = []
        for i in range(0, len(raw_no_sep), word_bits):
            chunk = raw_no_sep[i:i + word_bits]
            val = int(chunk, 2)
            result.append(val)
        return result

    # 3. Mặc định: Phân tích mảng số nguyên
    result = []
    for t in tokens:
        try:
            val = int(t)
        except ValueError:
            raise ValueError(f"Phần tử '{t}' không phải là số nguyên hợp lệ trong khoảng [0, {N - 1}].")
        if val < 0 or val >= N:
            raise ValueError(f"Giá trị {val} vượt quá phạm vi cho phép [0, {N - 1}] của TinyRC4 (N = {N}).")
        result.append(val)
    return result

def format_tiny_output(values: list[int], N: int, fmt: str) -> str:
    """Định dạng kết quả mảng số TinyRC4 theo format: numbers, binary, text/letters"""
    word_bits = {4: 2, 8: 3, 16: 4}.get(N, 3)
    if fmt == "binary":
        return " ".join(bin(v)[2:].zfill(word_bits) for v in values)
    elif fmt in ("text", "letters"):
        if N == 8:
            return "".join(chr(ord('A') + v) for v in values)
        else:
            return ", ".join(str(v) for v in values)
    else:  # numbers hoặc mặc định
        return ", ".join(str(v) for v in values)

def print_tiny_trace(
    key: list[int],
    data: list[int],
    output: list[int],
    keystream: list[int],
    final_s_ksa: list[int],
    ksa_traces: list[dict],
    prga_traces: list[dict],
    N: int,
    mode: str
):
    """In chi tiết toàn bộ các bước trung gian của thuật toán TinyRC4"""
    word_bits = {4: 2, 8: 3, 16: 4}.get(N, 3)
    key_len = len(key)
    T = [key[i % key_len] for i in range(N)]

    print("\n" + "=" * 70)
    print(f"  TINYRC4 TRACE CHI TIẾT (N = {N}, {word_bits}-bit words, Chế độ: {mode.upper()})")
    print("=" * 70)

    print("\n[GIAI ĐOẠN 1: KHOẢNG KHÓA VÀ KHO HÓA KSA]")
    print(f"  Khóa K        : {key} (độ dài = {key_len})")
    print(f"  Mảng lặp T    : {T}")
    print(f"  Mảng S ban đầu: {list(range(N))}")
    print("-" * 70)
    for step in ksa_traces:
        i = step["i"]
        old_j = step["old_j"]
        j = step["j"]
        val_i = step["val_i"]
        val_j = step["val_j"]
        t_i = step["T_i"]
        s_after = step["s_after"]
        print(f"  Vòng {i + 1:2d} (i={i}): j = ({old_j} + S[{i}]({val_i}) + T[{i}]({t_i})) mod {N} = {j}")
        print(f"            Hoán vị S[{i}] <-> S[{j}]  ==> S = {s_after}")

    print(f"\n  ==> Mảng S kết thúc KSA: {final_s_ksa}")

    print("\n[GIAI ĐOẠN 2: SINH DÒNG KHÓA PRGA & PHÉP TOÁN XOR]")
    print(f"  Dữ liệu vào   : {data}")
    print("-" * 70)
    for step in prga_traces:
        idx = step["step"]
        i = step["i"]
        j = step["j"]
        val_i = step["val_i"]
        val_j = step["val_j"]
        t = step["t"]
        k = step["k"]
        inp = step["input_val"]
        out = step["output_val"]
        s_after = step["s_after"]
        print(f"  Bước {idx + 1:2d}: i = (i+1) mod {N} = {i}, j = (j+S[{i}]) mod {N} = {j}")
        print(f"           Hoán vị S[{i}] <-> S[{j}]  ==> S = {s_after}")
        print(f"           t = (S[{i}]({val_j}) + S[{j}]({val_i})) mod {N} = {t} ==> k = S[{t}] = {k}")
        print(f"           XOR: {'P' if mode == 'encrypt' else 'C'} = {inp} ⊕ k({k}) ==> {'C' if mode == 'encrypt' else 'P'} = {out}")

    print("-" * 70)
    print(f"  Dòng khóa (Keystream) : {keystream} (nhị phân: {' '.join(bin(x)[2:].zfill(word_bits) for x in keystream)})")
    out_text = f" | chữ cái: '{format_tiny_output(output, N, 'text')}'" if N == 8 else ""
    print(f"  Kết quả ({'Bản mã' if mode == 'encrypt' else 'Bản rõ'})  : {output} (nhị phân: {' '.join(bin(x)[2:].zfill(word_bits) for x in output)}{out_text})")
    print("=" * 70 + "\n")

# =============================================================================
# 4. CHẾ ĐỘ MÃ HÓA / GIẢI MÃ TẬP TIN (FILE CIPHER & SHA-256)
# =============================================================================

def process_file(
    mode: str,
    key_bytes: bytes,
    in_path: str,
    out_path: str,
    drop_n: int = 0,
    compare_path: str | None = None
):
    """
    Mã hóa hoặc giải mã tập tin sử dụng RC4 chuẩn (N = 256).
    Tính và in mã băm SHA-256 của tệp gốc và tệp sau xử lý.
    Lưu ý: Thư viện hashlib CHỈ được dùng để so sánh toàn vẹn, tuyệt đối không dùng trong lõi mã hóa.
    """
    if not os.path.isfile(in_path):
        print(f"Lỗi: Tệp đầu vào không tồn tại: {in_path}", file=sys.stderr)
        sys.exit(1)

    try:
        with open(in_path, "rb") as f:
            in_data = f.read()
    except Exception as e:
        print(f"Lỗi khi đọc tệp đầu vào '{in_path}': {e}", file=sys.stderr)
        sys.exit(1)

    in_sha256 = hashlib.sha256(in_data).hexdigest()

    try:
        out_data, _ = rc4_crypt(key_bytes, in_data, drop_n=drop_n)
    except Exception as e:
        print(f"Lỗi xử lý RC4: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        with open(out_path, "wb") as f:
            f.write(out_data)
    except Exception as e:
        print(f"Lỗi khi ghi tệp kết quả '{out_path}': {e}", file=sys.stderr)
        sys.exit(1)

    out_sha256 = hashlib.sha256(out_data).hexdigest()

    action_label = "MÃ HÓA TẬP TIN" if mode == "encrypt-file" else "GIẢI MÃ TẬP TIN"
    print("=" * 70)
    print(f"  RC4 CLI - {action_label} THÀNH CÔNG")
    print("=" * 70)
    print(f"  Tệp nguồn (Input)       : {in_path} ({len(in_data):,} bytes)")
    print(f"  SHA-256 tệp nguồn       : {in_sha256}")
    print(f"  Tệp kết quả (Output)    : {out_path} ({len(out_data):,} bytes)")
    print(f"  SHA-256 tệp kết quả     : {out_sha256}")
    if drop_n > 0:
        print(f"  Số byte drop (RC4-drop) : {drop_n}")

    if compare_path:
        if os.path.isfile(compare_path):
            with open(compare_path, "rb") as cf:
                comp_data = cf.read()
            comp_sha256 = hashlib.sha256(comp_data).hexdigest()
            matched = (out_sha256 == comp_sha256)
            print("-" * 70)
            print(f"  Tệp đối chiếu gốc       : {compare_path} ({len(comp_data):,} bytes)")
            print(f"  SHA-256 tệp đối chiếu   : {comp_sha256}")
            if matched:
                print("  \033[92m[PASSED] Toàn vẹn 100%: Mã băm SHA-256 tệp giải mã TRÙNG KHỚP tệp gốc!\033[0m")
            else:
                print("  \033[91m[FAILED] Sai lệch: Mã băm SHA-256 không khớp với tệp gốc!\033[0m")
        else:
            print(f"  Cảnh báo: Tệp đối chiếu '{compare_path}' không tồn tại.", file=sys.stderr)

    print("=" * 70)

# =============================================================================
# 5. BỘ KIỂM ĐỊNH TEST VECTORS CHUẨN TÍCH HỢP (--test)
# =============================================================================

def run_built_in_tests() -> bool:
    """Thực thi kiểm định toàn diện các Test Vectors chuẩn mực của Full RC4 và TinyRC4"""
    print("=" * 70)
    print("  RC4 LAB CLI - BỘ KIỂM ĐỊNH TOÀN DIỆN MẬT MÃ HỌC & BÀI GIẢNG")
    print("=" * 70)

    all_passed = True

    # 1. Full RC4 Classic Vectors
    print("\n--- 1. Các Test Vector Kinh Điển Của Full RC4 (N = 256) ---")
    test_vectors = [
        {
            "name": "Vector kinh điển (Wikipedia)",
            "key": b"Key",
            "plain": b"Plaintext",
            "expected_hex": "BBF316E8D940AF0AD3"
        },
        {
            "name": "Vector Wikipedia",
            "key": b"Wiki",
            "plain": b"pedia",
            "expected_hex": "1021BF0420"
        },
        {
            "name": "Secret / Attack at dawn",
            "key": b"Secret",
            "plain": b"Attack at dawn",
            "expected_hex": "45A01F645FC35B383552544B9BF5"
        },
        {
            "name": "Single Character Boundary",
            "key": b"Pass",
            "plain": b"A",
            "expected_hex": "0A"
        }
    ]

    for idx, tv in enumerate(test_vectors, start=1):
        cipher, _ = rc4_crypt(tv["key"], tv["plain"])
        actual_hex = cipher.hex().upper()
        expected_hex = tv["expected_hex"].upper()
        passed = (actual_hex == expected_hex)
        if not passed:
            all_passed = False

        status = "\033[92m[PASSED]\033[0m" if passed else "\033[91m[FAILED]\033[0m"
        print(f"\n{status} Test #{idx}: {tv['name']}")
        print(f"  Key       : {tv['key'].decode('latin1', errors='replace')}")
        print(f"  Plaintext : {tv['plain'].decode('latin1', errors='replace')}")
        print(f"  Expected  : {expected_hex}")
        print(f"  Actual    : {actual_hex}")

    # 2. IETF RFC 6229 Vectors
    print("\n--- 2. Kiểm Tra Chuẩn IETF RFC 6229 (Dòng Khóa Keystream tại Offset 0) ---")
    rfc6229_vectors = [
        {
            "name": "RFC 6229 (Khóa 40-bit, 16 bytes dòng khóa đầu)",
            "key": bytes.fromhex("0102030405"),
            "expected_ks": "b2396305f03dc027ccc3524a0a1118a8"
        },
        {
            "name": "RFC 6229 (Khóa 128-bit, 16 bytes dòng khóa đầu)",
            "key": bytes.fromhex("0102030405060708090a0b0c0d0e0f10"),
            "expected_ks": "9ac7cc9a609d1ef7b2932899cde41b97"
        }
    ]
    for tv in rfc6229_vectors:
        _, ks = rc4_crypt(tv["key"], b"\x00" * 16)
        actual_ks = ks.hex().lower()
        expected_ks = tv["expected_ks"].lower()
        passed = (actual_ks == expected_ks)
        if not passed:
            all_passed = False
        status = "\033[92m[PASSED]\033[0m" if passed else "\033[91m[FAILED]\033[0m"
        print(f"\n{status} {tv['name']}")
        print(f"  Key Hex   : 0x{tv['key'].hex()}")
        print(f"  Expected  : {expected_ks}")
        print(f"  Actual    : {actual_ks}")

    # 3. Lecturer's TinyRC4 Example (N = 8, Key=[2,1,3], Plaintext=[1,0,6] / "BAG")
    print("\n--- 3. Ví Dụ Bài Giảng Giảng Viên TinyRC4 (N = 8, 3-bit Words) ---")
    tiny_N = 8
    tiny_key = [2, 1, 3]
    tiny_plain = [1, 0, 6]  # "BAG"
    expected_s_ksa = [6, 0, 7, 1, 2, 3, 5, 4]
    expected_keystream = [5, 1, 6]
    expected_cipher = [4, 1, 0]  # "EBA"

    out_cipher, actual_ks, actual_s_ksa, _, _ = tiny_rc4_crypt(tiny_key, tiny_plain, N=tiny_N)
    out_restored, _, _, _, _ = tiny_rc4_crypt(tiny_key, out_cipher, N=tiny_N)

    ksa_pass = (actual_s_ksa == expected_s_ksa)
    ks_pass = (actual_ks == expected_keystream)
    cipher_pass = (out_cipher == expected_cipher)
    decrypt_pass = (out_restored == tiny_plain)

    tiny_pass = ksa_pass and ks_pass and cipher_pass and decrypt_pass
    if not tiny_pass:
        all_passed = False

    t_status = "\033[92m[PASSED]\033[0m" if tiny_pass else "\033[91m[FAILED]\033[0m"
    print(f"\n{t_status} Ca kiểm thử TinyRC4 bài giảng: N = 8, Khóa = [2, 1, 3], Bản rõ = [1, 0, 6] ('BAG')")
    print(f"  Mảng S sau KSA : Mong đợi {expected_s_ksa} | Thực tế {actual_s_ksa} {'✓' if ksa_pass else '✗'}")
    print(f"  Dòng khóa (KS) : Mong đợi {expected_keystream} | Thực tế {actual_ks} {'✓' if ks_pass else '✗'}")
    print(f"  Bản mã (Cipher): Mong đợi {expected_cipher} ('EBA') | Thực tế {out_cipher} {'✓' if cipher_pass else '✗'}")
    print(f"  Giải mã phục hồi: Mong đợi {tiny_plain} ('BAG') | Thực tế {out_restored} {'✓' if decrypt_pass else '✗'}")

    # 4. File Mode Round-Trip & SHA-256 Verification Test
    print("\n--- 4. Kiểm Tra Toàn Vẹn Round-Trip Chế Độ Tệp (SHA-256) ---")
    mock_file_data = b"RC4 Lab File Mode Test: Nguyen Van A - An Toan Thong Tin 2026. " * 32
    mock_key = b"FileCipherVerificationKey_2026"
    mock_sha_orig = hashlib.sha256(mock_file_data).hexdigest()

    enc_bytes, _ = rc4_crypt(mock_key, mock_file_data)
    dec_bytes, _ = rc4_crypt(mock_key, enc_bytes)
    mock_sha_dec = hashlib.sha256(dec_bytes).hexdigest()

    file_pass = (mock_file_data == dec_bytes) and (mock_sha_orig == mock_sha_dec)
    if not file_pass:
        all_passed = False

    f_status = "\033[92m[PASSED]\033[0m" if file_pass else "\033[91m[FAILED]\033[0m"
    print(f"{f_status} Kiểm thử Round-trip tập tin ({len(mock_file_data)} bytes):")
    print(f"  SHA-256 ban đầu : {mock_sha_orig}")
    print(f"  SHA-256 giải mã : {mock_sha_dec}")

    # 5. Unicode String Round-Trip
    print("\n--- 5. Kiểm Tra Round-Trip Chuỗi Văn Bản Unicode ---")
    sample_text = "Xin chào Việt Nam! Mật mã học RC4 Stream Cipher 2026."
    key = b"ChuyenNganhATTT"
    enc, _ = rc4_crypt(key, sample_text.encode("utf-8"))
    dec, _ = rc4_crypt(key, enc)
    recovered = dec.decode("utf-8", errors="replace")
    rt_passed = (recovered == sample_text)
    if not rt_passed:
        all_passed = False

    rt_status = "\033[92m[PASSED]\033[0m" if rt_passed else "\033[91m[FAILED]\033[0m"
    print(f"{rt_status} Round-trip Unicode: \"{recovered}\"")

    print("\n" + "=" * 70)
    if all_passed:
        print("  KẾT QUẢ: 100% TẤT CẢ CÁC CA KIỂM THỬ ĐÃ VƯỢT QUA CHUẨN XÁC!")
    else:
        print("  KẾT QUẢ: CÓ CA KIỂM THỬ THẤT BẠI!")
    print("=" * 70)
    return all_passed

# =============================================================================
# 6. HÀM ĐIỀU PHỐI CHÍNH (MAIN CLI ENTRY POINT)
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="RC4 CLI - Bộ công cụ mã hóa dòng RC4 & TinyRC4 độc lập (Giáo dục & Nghiên cứu)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
CÁC VÍ DỤ SỬ DỤNG:
-------------------------------------------------------------------------------
1. Full RC4 (Mặc định):
   python public/rc4_cli.py encrypt --key Key --text Plaintext
   python public/rc4_cli.py decrypt --key Key --hex BBF316E8D940AF0AD3 --format text

2. TinyRC4 (N = 4, 8, 16; mặc định 8 khi không truyền số):
   python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "1,0,6"
   python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "BAG" --format text
   python public/rc4_cli.py decrypt --tiny 8 --key "2,1,3" --text "4,1,0"
   python public/rc4_cli.py encrypt --tiny 8 --key "2,1,3" --text "BAG" --trace

3. Mã hóa / Giải mã tập tin (kèm đối chiếu mã băm SHA-256):
   python public/rc4_cli.py encrypt-file --key "SecretKey" --in data.txt --out data.enc
   python public/rc4_cli.py decrypt-file --key "SecretKey" --in data.enc --out data_dec.txt --compare data.txt

4. Chạy bộ kiểm định tích hợp:
   python public/rc4_cli.py --test
-------------------------------------------------------------------------------
        """
    )

    parser.add_argument(
        "mode",
        nargs="?",
        choices=["encrypt", "decrypt", "encrypt-file", "decrypt-file"],
        help="Chế độ xử lý: encrypt, decrypt, encrypt-file, hoặc decrypt-file"
    )
    parser.add_argument("-k", "--key", type=str, help="Khóa bí mật (chuỗi ký tự UTF-8 cho Full RC4, hoặc mảng số/chữ cái cho TinyRC4)")
    parser.add_argument("--key-hex", type=str, help="Khóa bí mật dạng chuỗi Hex (chỉ dùng cho Full RC4)")
    parser.add_argument("-t", "--text", type=str, help="Dữ liệu đầu vào dạng văn bản hoặc chuỗi TinyRC4 ('1,0,6', 'BAG', '001 000 110')")
    parser.add_argument("-x", "--hex", type=str, help="Dữ liệu đầu vào dạng chuỗi Hex (Full RC4)")
    parser.add_argument("-f", "--format", choices=["hex", "base64", "text", "numbers", "binary"], default=None, help="Định dạng kết quả đầu ra")
    parser.add_argument("--tiny", nargs="?", const=8, type=int, choices=[4, 8, 16], help="Kích hoạt chế độ TinyRC4 với N phần tử (4, 8, 16; mặc định 8)")
    parser.add_argument("--trace", action="store_true", help="In chi tiết từng bước thực thi KSA, PRGA, mảng S, t và keystream")
    parser.add_argument("--drop", type=int, default=0, help="Số byte đầu vứt bỏ (RC4-drop[n], ví dụ: 768)")
    parser.add_argument("-i", "--in", dest="input_file", type=str, help="Đường dẫn tệp đầu vào cho chế độ encrypt-file / decrypt-file")
    parser.add_argument("-o", "--out", dest="output_file", type=str, help="Đường dẫn tệp kết quả cho chế độ encrypt-file / decrypt-file")
    parser.add_argument("--compare", type=str, help="Đường dẫn tệp gốc để đối chiếu SHA-256 sau khi giải mã tệp")
    parser.add_argument("--test", action="store_true", help="Chạy bộ kiểm định Test Vectors chuẩn tích hợp")

    args = parser.parse_args()

    # Xử lý cờ --test
    if args.test:
        success = run_built_in_tests()
        sys.exit(0 if success else 1)

    if not args.mode:
        parser.print_help()
        sys.exit(1)

    # =========================================================================
    # A. XỬ LÝ CHẾ ĐỘ TẬP TIN (encrypt-file / decrypt-file)
    # =========================================================================
    if args.mode in ("encrypt-file", "decrypt-file"):
        if not args.input_file or not args.output_file:
            print("Lỗi: Chế độ tệp yêu cầu cả --in (tệp nguồn) và --out (tệp đích).", file=sys.stderr)
            sys.exit(1)

        key_bytes = b""
        if args.key:
            key_bytes = args.key.encode("utf-8")
        elif args.key_hex:
            try:
                key_bytes = bytes.fromhex(args.key_hex.replace(" ", ""))
            except ValueError as e:
                print(f"Lỗi: Chuỗi hex của khóa không hợp lệ: {e}", file=sys.stderr)
                sys.exit(1)
        else:
            print("Lỗi: Bạn phải cung cấp khóa bí mật thông qua --key hoặc --key-hex.", file=sys.stderr)
            sys.exit(1)

        process_file(
            mode=args.mode,
            key_bytes=key_bytes,
            in_path=args.input_file,
            out_path=args.output_file,
            drop_n=args.drop,
            compare_path=args.compare
        )
        sys.exit(0)

    # =========================================================================
    # B. XỬ LÝ CHẾ ĐỘ TINYRC4 (--tiny [N])
    # =========================================================================
    if args.tiny is not None:
        tiny_N = args.tiny

        if not args.key:
            print("Lỗi: Chế độ TinyRC4 yêu cầu khóa bí mật qua --key (ví dụ: --key '2,1,3' hoặc --key 'CBD').", file=sys.stderr)
            sys.exit(1)

        try:
            parsed_key = parse_tiny_input(args.key, tiny_N)
        except Exception as e:
            print(f"Lỗi phân tích khóa TinyRC4: {e}", file=sys.stderr)
            sys.exit(1)

        # Đọc dữ liệu đầu vào
        raw_data = ""
        if args.text is not None:
            raw_data = args.text
        elif not sys.stdin.isatty():
            raw_data = sys.stdin.read().strip()
        else:
            print("Lỗi: Chế độ TinyRC4 yêu cầu dữ liệu qua --text hoặc STDIN (ví dụ: --text '1,0,6' hoặc --text 'BAG').", file=sys.stderr)
            sys.exit(1)

        try:
            parsed_data = parse_tiny_input(raw_data, tiny_N)
        except Exception as e:
            print(f"Lỗi phân tích dữ liệu TinyRC4: {e}", file=sys.stderr)
            sys.exit(1)

        try:
            output_list, keystream_list, final_s_ksa, ksa_traces, prga_traces = tiny_rc4_crypt(
                key=parsed_key,
                data=parsed_data,
                N=tiny_N,
                trace=args.trace
            )
        except Exception as e:
            print(f"Lỗi thực thi TinyRC4: {e}", file=sys.stderr)
            sys.exit(1)

        if args.trace:
            print_tiny_trace(
                key=parsed_key,
                data=parsed_data,
                output=output_list,
                keystream=keystream_list,
                final_s_ksa=final_s_ksa,
                ksa_traces=ksa_traces,
                prga_traces=prga_traces,
                N=tiny_N,
                mode=args.mode
            )

        fmt = args.format or "numbers"
        print(format_tiny_output(output_list, tiny_N, fmt))
        sys.exit(0)

    # =========================================================================
    # C. XỬ LÝ CHẾ ĐỘ FULL RC4 (N = 256)
    # =========================================================================
    key_bytes = b""
    if args.key:
        key_bytes = args.key.encode("utf-8")
    elif args.key_hex:
        try:
            key_bytes = bytes.fromhex(args.key_hex.replace(" ", ""))
        except ValueError as e:
            print(f"Lỗi: Chuỗi hex của khóa không hợp lệ: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print("Lỗi: Bạn phải cung cấp khóa bí mật thông qua --key hoặc --key-hex.", file=sys.stderr)
        sys.exit(1)

    data_bytes = b""
    if args.text is not None:
        data_bytes = args.text.encode("utf-8")
    elif args.hex is not None:
        try:
            data_bytes = bytes.fromhex(args.hex.replace(" ", ""))
        except ValueError as e:
            print(f"Lỗi: Chuỗi hex đầu vào không hợp lệ: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        if not sys.stdin.isatty():
            data_bytes = sys.stdin.buffer.read()
        else:
            print("Lỗi: Bạn phải cung cấp dữ liệu đầu vào thông qua --text, --hex hoặc qua đường ống STDIN.", file=sys.stderr)
            sys.exit(1)

    try:
        output_bytes, keystream_bytes = rc4_crypt(key_bytes, data_bytes, drop_n=args.drop)
    except Exception as e:
        print(f"Lỗi xử lý RC4: {e}", file=sys.stderr)
        sys.exit(1)

    fmt = args.format or "hex"
    if fmt == "hex":
        print(output_bytes.hex().upper())
    elif fmt == "base64":
        print(base64.b64encode(output_bytes).decode("ascii"))
    elif fmt == "text":
        try:
            print(output_bytes.decode("utf-8"))
        except UnicodeDecodeError:
            print("Cảnh báo: Dữ liệu không thể giải mã thành UTF-8 hợp lệ. Hiển thị dạng Hex thay thế:", file=sys.stderr)
            print(output_bytes.hex().upper())
    else:
        print(output_bytes.hex().upper())

if __name__ == "__main__":
    main()
