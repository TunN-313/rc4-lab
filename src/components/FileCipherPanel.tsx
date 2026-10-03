import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileCode,
  Image as ImageIcon,
  Lock,
  Unlock,
  Download,
  CheckCircle2,
  XCircle,
  FileCheck,
  ShieldCheck,
  Zap,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Hash,
  Eye,
} from 'lucide-react';
import {
  stringToBytes,
  fullRc4ProcessUint8Array,
  computeSha256Hex,
} from '../crypto/rc4';

export const FileCipherPanel: React.FC = () => {
  // 1. ORIGINAL FILE STATE (ENCRYPTION INPUT)
  const [origFile, setOrigFile] = useState<File | null>(null);
  const [origBytes, setOrigBytes] = useState<Uint8Array | null>(null);
  const [origSha256, setOrigSha256] = useState<string | null>(null);
  const [origPreviewUrl, setOrigPreviewUrl] = useState<string | null>(null);
  const [origTextPreview, setOrigTextPreview] = useState<string | null>(null);
  const [imageDims, setImageDims] = useState<{ width: number; height: number } | null>(null);

  // Encryption Settings & Results
  const [encKey, setEncKey] = useState<string>('MySecretKey2026');
  const [encDropN, setEncDropN] = useState<number>(0);
  const [encryptedBytes, setEncryptedBytes] = useState<Uint8Array | null>(null);
  const [encryptTimeMs, setEncryptTimeMs] = useState<number | null>(null);
  const [encryptedSha256, setEncryptedSha256] = useState<string | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);

  // 2. ENCRYPTED FILE STATE (DECRYPTION INPUT)
  const [decInputFile, setDecInputFile] = useState<File | null>(null);
  const [decInputBytes, setDecInputBytes] = useState<Uint8Array | null>(null);
  const [decKey, setDecKey] = useState<string>('MySecretKey2026');
  const [decDropN, setDecDropN] = useState<number>(0);
  const [decryptedBytes, setDecryptedBytes] = useState<Uint8Array | null>(null);
  const [decryptedSha256, setDecryptedSha256] = useState<string | null>(null);
  const [decryptedPreviewUrl, setDecryptedPreviewUrl] = useState<string | null>(null);
  const [decryptedTextPreview, setDecryptedTextPreview] = useState<string | null>(null);
  const [decryptTimeMs, setDecryptTimeMs] = useState<number | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Error messages
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [decUploadError, setDecUploadError] = useState<string | null>(null);

  // Canvas for noise visualizer
  const noiseCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (origPreviewUrl) URL.revokeObjectURL(origPreviewUrl);
      if (decryptedPreviewUrl) URL.revokeObjectURL(decryptedPreviewUrl);
    };
  }, [origPreviewUrl, decryptedPreviewUrl]);

  // Draw encrypted noise onto canvas
  useEffect(() => {
    if (!encryptedBytes || !noiseCanvasRef.current) return;
    const canvas = noiseCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed canvas size for noise display
    const width = 280;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;
    const totalPixels = width * height;
    const encLen = encryptedBytes.length;

    for (let p = 0; p < totalPixels; p++) {
      const b1 = encryptedBytes[(p * 3) % encLen];
      const b2 = encryptedBytes[(p * 3 + 1) % encLen];
      const b3 = encryptedBytes[(p * 3 + 2) % encLen];

      const idx = p * 4;
      data[idx] = b1;
      data[idx + 1] = b2;
      data[idx + 2] = b3;
      data[idx + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
  }, [encryptedBytes]);

  // Handle uploading the original file
  const handleOriginalFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 5 MB
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(
        `Kích thước tập tin (${(file.size / 1024 / 1024).toFixed(2)} MB) vượt quá giới hạn 5 MB. Vui lòng chọn tập tin nhỏ hơn.`
      );
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(buffer);
      setOrigFile(file);
      setOrigBytes(uint8);

      // Reset previous results
      setEncryptedBytes(null);
      setEncryptTimeMs(null);
      setEncryptedSha256(null);

      // Compute SHA-256 of original file using WebCrypto API
      const hash = await computeSha256Hex(uint8);
      setOrigSha256(hash);

      // Preview setup
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setOrigPreviewUrl(url);
        setOrigTextPreview(null);

        // Get dimensions
        const img = new Image();
        img.onload = () => {
          setImageDims({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = url;
      } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.json') || file.name.endsWith('.md')) {
        setOrigPreviewUrl(null);
        setImageDims(null);
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const text = decoder.decode(uint8.slice(0, 2000));
        setOrigTextPreview(text);
      } else {
        setOrigPreviewUrl(null);
        setOrigTextPreview(null);
        setImageDims(null);
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Lỗi đọc tập tin');
    }
  };

  // Perform RC4 encryption on the uploaded file
  const handleEncryptFile = async () => {
    if (!origBytes || !origFile) return;
    if (!encKey.trim()) {
      setUploadError('Vui lòng nhập khóa bí mật để mã hóa.');
      return;
    }

    setIsEncrypting(true);
    setUploadError(null);

    // Yield to event loop to render loading state
    await new Promise((resolve) => setTimeout(resolve, 30));

    try {
      const keyBytes = stringToBytes(encKey);
      const t0 = performance.now();
      const encrypted = fullRc4ProcessUint8Array(origBytes, keyBytes, encDropN);
      const elapsed = performance.now() - t0;

      setEncryptedBytes(encrypted);
      setEncryptTimeMs(Math.round(elapsed * 100) / 100);

      // Calculate SHA-256 of encrypted file
      const encHash = await computeSha256Hex(encrypted);
      setEncryptedSha256(encHash);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Lỗi mã hóa tập tin');
    } finally {
      setIsEncrypting(false);
    }
  };

  // Download encrypted file
  const handleDownloadEncrypted = () => {
    if (!encryptedBytes || !origFile) return;
    const blob = new Blob([encryptedBytes as unknown as BlobPart], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${origFile.name}.enc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Quick action: Forward encrypted output to decryption input
  const handleForwardToDecryption = async () => {
    if (!encryptedBytes || !origFile) return;
    const fakeFile = new File([encryptedBytes as unknown as BlobPart], `${origFile.name}.enc`, {
      type: 'application/octet-stream',
    });
    setDecInputFile(fakeFile);
    setDecInputBytes(encryptedBytes);
    setDecKey(encKey);
    setDecDropN(encDropN);
    setDecryptedBytes(null);
    setDecryptedSha256(null);
    setDecryptedPreviewUrl(null);
    setDecryptedTextPreview(null);
    setDecryptTimeMs(null);
    setDecUploadError(null);
  };

  // Handle uploading an encrypted file for decryption
  const handleDecryptedFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setDecUploadError(
        `Kích thước tập tin (${(file.size / 1024 / 1024).toFixed(2)} MB) vượt quá 5 MB.`
      );
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(buffer);
      setDecInputFile(file);
      setDecInputBytes(uint8);

      // Reset previous decrypt result
      setDecryptedBytes(null);
      setDecryptedSha256(null);
      setDecryptedPreviewUrl(null);
      setDecryptedTextPreview(null);
      setDecryptTimeMs(null);
    } catch (err: unknown) {
      setDecUploadError(err instanceof Error ? err.message : 'Lỗi đọc tập tin giải mã');
    }
  };

  // Perform RC4 decryption on the encrypted bytes
  const handleDecryptFile = async () => {
    if (!decInputBytes || !decInputFile) return;
    if (!decKey.trim()) {
      setDecUploadError('Vui lòng nhập khóa bí mật để giải mã.');
      return;
    }

    setIsDecrypting(true);
    setDecUploadError(null);

    await new Promise((resolve) => setTimeout(resolve, 30));

    try {
      const keyBytes = stringToBytes(decKey);
      const t0 = performance.now();
      // RC4 encryption and decryption are completely symmetric XOR:
      const decrypted = fullRc4ProcessUint8Array(decInputBytes, keyBytes, decDropN);
      const elapsed = performance.now() - t0;

      setDecryptedBytes(decrypted);
      setDecryptTimeMs(Math.round(elapsed * 100) / 100);

      // Compute SHA-256 of decrypted file using WebCrypto API
      const decHash = await computeSha256Hex(decrypted);
      setDecryptedSha256(decHash);

      // Detect original file format from filename
      const targetName = decInputFile.name.replace(/\.enc$/i, '');
      const isImg =
        (origFile && origFile.type.startsWith('image/')) ||
        /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(targetName);
      const isTxt =
        (origFile && origFile.type.startsWith('text/')) ||
        /\.(txt|json|md|csv|xml|log|js|ts|html)$/i.test(targetName);

      if (isImg) {
        // Guess MIME type
        let mime = 'image/png';
        if (/\.jpe?g$/i.test(targetName)) mime = 'image/jpeg';
        else if (/\.gif$/i.test(targetName)) mime = 'image/gif';
        else if (/\.webp$/i.test(targetName)) mime = 'image/webp';
        else if (/\.svg$/i.test(targetName)) mime = 'image/svg+xml';

        const blob = new Blob([decrypted as unknown as BlobPart], { type: origFile ? origFile.type : mime });
        const url = URL.createObjectURL(blob);
        setDecryptedPreviewUrl(url);
        setDecryptedTextPreview(null);
      } else if (isTxt) {
        setDecryptedPreviewUrl(null);
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const text = decoder.decode(decrypted.slice(0, 2000));
        setDecryptedTextPreview(text);
      } else {
        setDecryptedPreviewUrl(null);
        setDecryptedTextPreview(null);
      }
    } catch (err: unknown) {
      setDecUploadError(err instanceof Error ? err.message : 'Lỗi giải mã tập tin');
    } finally {
      setIsDecrypting(false);
    }
  };

  // Download decrypted file
  const handleDownloadDecrypted = () => {
    if (!decryptedBytes || !decInputFile) return;
    const cleanName = decInputFile.name.endsWith('.enc')
      ? decInputFile.name.replace(/\.enc$/, '')
      : `decrypted_${decInputFile.name}`;

    const mime = origFile ? origFile.type : 'application/octet-stream';
    const blob = new Blob([decryptedBytes as unknown as BlobPart], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cleanName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Check if SHA-256 hashes match
  const isHashMatch =
    origSha256 !== null &&
    decryptedSha256 !== null &&
    origSha256.toLowerCase() === decryptedSha256.toLowerCase();

  return (
    <div className="space-y-8">
      {/* 1. LOCAL PRIVACY & 5MB LIMIT NOTICE BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-950 to-blue-950/80 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Chế Độ Mã Hóa Tập Tin & Hình Ảnh (File/Image Mode)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
                Client-Side Only
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Tập tin được xử lý 100% trong bộ nhớ trình duyệt bằng TypedArray (Uint8Array) thuần túy. <strong>Tuyệt đối không tải lên máy chủ hoặc cơ sở dữ liệu Firebase</strong>. Hỗ trợ tập tin văn bản và hình ảnh tối đa <strong>5 MB</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300">
            Tối đa: 5 MB
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300">
            SHA-256 WebCrypto
          </span>
        </div>
      </div>

      {/* 2. DUAL COLUMNS: ENCRYPT (LEFT) & DECRYPT (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ========================================================================= */}
        {/* PANEL A: MÃ HÓA TẬP TIN (ENCRYPT FILE) */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">1. Mã Hóa Tập Tin (Encrypt)</h3>
                  <p className="text-xs text-slate-400">Chọn ảnh (PNG, JPG, WebP) hoặc tập tin văn bản</p>
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-semibold">Full RC4 Engine</span>
            </div>

            {/* File Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tập tin đầu vào (Tối đa 5 MB):
              </label>
              <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-5 text-center transition bg-slate-950/60 group cursor-pointer">
                <input
                  type="file"
                  onChange={handleOriginalFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2 pointer-events-none">
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  {origFile ? (
                    <div>
                      <p className="text-sm font-bold text-cyan-300">{origFile.name}</p>
                      <p className="text-xs text-slate-400 font-mono">
                        {(origFile.size / 1024).toFixed(1)} KB • {origFile.type || 'binary/unknown'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-slate-300">
                        Kéo thả tập tin vào đây hoặc <span className="text-cyan-400 font-bold underline">chọn từ thiết bị</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Hỗ trợ PNG, JPG, WebP, GIF, SVG, TXT, JSON, MD, CSV (Dưới 5 MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {uploadError && (
                <div className="mt-2 text-xs text-rose-400 font-mono flex items-center gap-1.5 p-2 rounded-lg bg-rose-950/40 border border-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* Original File Preview & SHA-256 Hash */}
            {origFile && origSha256 && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    Xem trước bản rõ gốc (Original Preview)
                  </span>
                  {imageDims && (
                    <span className="text-[11px] font-mono text-slate-400">
                      {imageDims.width} × {imageDims.height} px
                    </span>
                  )}
                </div>

                {/* Image preview */}
                {origPreviewUrl && (
                  <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-800 max-h-56 flex items-center justify-center p-2">
                    <img
                      src={origPreviewUrl}
                      alt="Ảnh gốc trước khi mã hóa"
                      className="max-h-48 object-contain rounded"
                    />
                  </div>
                )}

                {/* Text preview */}
                {origTextPreview && (
                  <pre className="max-h-36 overflow-y-auto p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {origTextPreview}
                  </pre>
                )}

                {/* SHA-256 Hash of Original */}
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono space-y-1">
                  <div className="text-slate-400 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-cyan-400" />
                    <span>Mã băm SHA-256 của tập tin gốc (WebCrypto API):</span>
                  </div>
                  <div className="text-cyan-300 break-all select-all font-bold">
                    {origSha256}
                  </div>
                </div>
              </div>
            )}

            {/* Key & Drop-N Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Khóa bí mật RC4:
                </label>
                <input
                  type="text"
                  value={encKey}
                  onChange={(e) => setEncKey(e.target.value)}
                  placeholder="Nhập khóa bí mật..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Bỏ qua Drop-N byte đầu:
                  </label>
                  <span className="text-xs font-mono text-cyan-400">{encDropN} byte</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1024"
                  step="64"
                  value={encDropN}
                  onChange={(e) => setEncDropN(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Action Button: Encrypt */}
            <button
              onClick={handleEncryptFile}
              disabled={!origBytes || isEncrypting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isEncrypting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang mã hóa tập tin...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Mã Hóa Tập Tin Với RC4</span>
                </>
              )}
            </button>
          </div>

          {/* Encryption Results & Noise Canvas Preview */}
          {encryptedBytes && (
            <div className="pt-5 mt-5 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Đã mã hóa thành công
                </span>
                {encryptTimeMs !== null && origFile && (
                  <span className="text-slate-400">
                    {encryptTimeMs} ms •{' '}
                    {(
                      origFile.size /
                      1024 /
                      1024 /
                      (Math.max(0.1, encryptTimeMs) / 1000)
                    ).toFixed(1)}{' '}
                    MB/s
                  </span>
                )}
              </div>

              {/* Noise Preview Canvas */}
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Minh họa tập tin mã hóa dưới dạng nhiễu hạt (Noise Preview):
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Pseudo-random Static</span>
                </div>

                <div className="flex justify-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <canvas
                    ref={noiseCanvasRef}
                    className="rounded shadow-inner border border-slate-800 max-h-52 w-auto"
                    title="Mảng byte mã hóa RC4 được vẽ trực tiếp lên Canvas minh họa tính ngẫu nhiên"
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Dòng khóa RC4 đã phân tán toàn bộ cấu trúc hình ảnh ban đầu thành nhiễu trắng giả ngẫu nhiên, không để lại bất kỳ hình bóng hay hoa văn nhận diện nào.
                </p>
              </div>

              {/* SHA-256 of Encrypted output */}
              {encryptedSha256 && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-1">
                  <span className="text-slate-400">Mã băm SHA-256 tập tin mã hóa:</span>
                  <div className="text-purple-300 break-all select-all font-bold">
                    {encryptedSha256}
                  </div>
                </div>
              )}

              {/* Download & Forward actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDownloadEncrypted}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-semibold text-xs transition cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Về Tập Tin ({origFile?.name}.enc)</span>
                </button>

                <button
                  onClick={handleForwardToDecryption}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
                  title="Chuyển dữ liệu mã hóa sang ô giải mã bên phải để kiểm tra ngay"
                >
                  <span>Chuyển Sang Giải Mã</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PANEL B: GIẢI MÃ TẬP TIN (DECRYPT FILE) */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Unlock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">2. Giải Mã Tập Tin (Decrypt)</h3>
                  <p className="text-xs text-slate-400">Tải lên tập tin .enc hoặc dùng kết quả mã hóa</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">Hoàn nguyên đối xứng</span>
            </div>

            {/* Encrypted File Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tập tin đã mã hóa (.enc):
              </label>
              <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-5 text-center transition bg-slate-950/60 group cursor-pointer">
                <input
                  type="file"
                  onChange={handleDecryptedFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2 pointer-events-none">
                  <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition">
                    <FileCode className="w-5 h-5" />
                  </div>
                  {decInputFile ? (
                    <div>
                      <p className="text-sm font-bold text-emerald-300">{decInputFile.name}</p>
                      <p className="text-xs text-slate-400 font-mono">
                        {(decInputFile.size / 1024).toFixed(1)} KB • Tập tin mã hóa
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-slate-300">
                        Chọn tập tin <span className="text-emerald-400 font-bold">.enc</span> cần giải mã
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Hoặc bấm nút "Chuyển Sang Giải Mã" từ bảng bên trái
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {decUploadError && (
                <div className="mt-2 text-xs text-rose-400 font-mono flex items-center gap-1.5 p-2 rounded-lg bg-rose-950/40 border border-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{decUploadError}</span>
                </div>
              )}
            </div>

            {/* Key & Drop-N Settings for Decryption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Khóa giải mã (Phải khớp với khóa mã hóa):
                </label>
                <input
                  type="text"
                  value={decKey}
                  onChange={(e) => setDecKey(e.target.value)}
                  placeholder="Nhập khóa giải mã..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-emerald-300 font-mono focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Bỏ qua Drop-N byte đầu:
                  </label>
                  <span className="text-xs font-mono text-emerald-400">{decDropN} byte</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1024"
                  step="64"
                  value={decDropN}
                  onChange={(e) => setDecDropN(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Action Button: Decrypt */}
            <button
              onClick={handleDecryptFile}
              disabled={!decInputBytes || isDecrypting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isDecrypting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang giải mã tập tin...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Giải Mã Tập Tin Với RC4</span>
                </>
              )}
            </button>
          </div>

          {/* Decryption Results & SHA-256 Verification */}
          {decryptedBytes && (
            <div className="pt-5 mt-5 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Đã hoàn tất giải mã
                </span>
                {decryptTimeMs !== null && decInputFile && (
                  <span className="text-slate-400">{decryptTimeMs} ms</span>
                )}
              </div>

              {/* Decrypted Preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    Xem trước tập tin sau giải mã (Decrypted Preview)
                  </span>
                </div>

                {/* Decrypted image */}
                {decryptedPreviewUrl && (
                  <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-800 max-h-56 flex items-center justify-center p-2">
                    <img
                      src={decryptedPreviewUrl}
                      alt="Ảnh sau khi giải mã"
                      className="max-h-48 object-contain rounded"
                    />
                  </div>
                )}

                {/* Decrypted text */}
                {decryptedTextPreview && (
                  <pre className="max-h-36 overflow-y-auto p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {decryptedTextPreview}
                  </pre>
                )}
              </div>

              {/* MANDATORY REQUIREMENT: SHA-256 INTEGRITY COMPARISON */}
              <div
                className={`p-4 rounded-xl border text-xs font-mono space-y-2.5 ${
                  isHashMatch
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : origSha256
                    ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-500/10'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-2">
                    {isHashMatch ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : origSha256 ? (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <FileCheck className="w-4 h-4 text-cyan-400" />
                    )}
                    <span>Kiểm chứng toàn vẹn SHA-256 (WebCrypto API):</span>
                  </span>

                  {isHashMatch ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/40">
                      KHỚP TUYỆT ĐỐI (100% INTEGRITY)
                    </span>
                  ) : origSha256 ? (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] border border-rose-500/40">
                      KHÔNG KHỚP (SAI KHÓA HOẶC BIẾN ĐỔI)
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Chưa có tập tin gốc đối chiếu</span>
                  )}
                </div>

                <div className="space-y-1.5 text-[11px] pt-1 border-t border-slate-800/80">
                  {origSha256 && (
                    <div>
                      <span className="text-slate-400">SHA-256 Gốc: </span>
                      <span className="text-cyan-300 break-all select-all font-bold">
                        {origSha256}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400">SHA-256 Giải mã: </span>
                    <span
                      className={`break-all select-all font-bold ${
                        isHashMatch ? 'text-emerald-300' : origSha256 ? 'text-rose-300' : 'text-slate-200'
                      }`}
                    >
                      {decryptedSha256}
                    </span>
                  </div>
                </div>

                {isHashMatch && (
                  <p className="text-[11px] text-emerald-300/90 font-sans pt-1">
                    ✔ Thuật toán RC4 đã hoàn nguyên 100% từng byte dữ liệu ban đầu mà không có bất kỳ sai lệch nào.
                  </p>
                )}
              </div>

              {/* Download Decrypted File */}
              <button
                onClick={handleDownloadDecrypted}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Tải Về Tập Tin Đã Giải Mã</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
