import { useState } from 'react';
import { MarketplaceItem } from '../types';
import { ShoppingCart, Heart, ShieldCheck, MapPin, BadgeCheck, X, QrCode, CreditCard, CheckCircle2, Copy, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface MarketplaceDetailProps {
  item: MarketplaceItem;
  onClose: () => void;
  onBuySuccess: (itemId: string) => void;
}

export default function MarketplaceDetail({ item, onClose, onBuySuccess }: MarketplaceDetailProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'gopay' | 'ovo' | 'va_bca'>('qris');
  const [paymentStep, setPaymentStep] = useState<'selecting' | 'paying' | 'success'>('selecting');
  
  const [phoneNo, setPhoneNo] = useState('081234567890');
  const [copiedVa, setCopiedVa] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Formatting currency in Clean IDR (Indonesian Rupiah)
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const virtualAccountNo = '80777' + phoneNo.slice(-7);

  const handleCopyVa = () => {
    navigator.clipboard.writeText(virtualAccountNo);
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
  };

  const triggerPaymentSubmit = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentStep('success');
    }, 2000); // 2 second mock secure verification
  };

  const handleCompleteTransaction = () => {
    onBuySuccess(item.id);
    setShowPaymentModal(false);
    onClose();
  };

  return (
    <>
      {/* Outer detail container */}
      <div className="bg-white dark:bg-[#1e293b] border border-gray-150 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs">
        
        {/* Responsive layout Grid split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Area: Product Image */}
          <div className="relative h-64 md:h-[400px] bg-gray-100 dark:bg-slate-900 flex items-center justify-center">
            <img 
              src={item.image} 
              alt={item.title} 
              className="h-full w-full object-cover"
            />
            {/* Tag region */}
            <span className="absolute top-4 left-4 bg-blue-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-sm shadow-md">
              Maju Bersama UMKM
            </span>
            <span className="absolute top-4 right-4 bg-black/60 text-white font-bold text-[10px] px-2.5 py-1 rounded-full backdrop-blur-md">
              Kondisi: {item.condition}
            </span>
          </div>

          {/* Right Area: Product details / Actions */}
          <div className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Breadcrumbs / Category */}
              <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                <span>Kategori: {item.category}</span>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-650 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-snug">
                  {item.title}
                </h1>
                <p className="text-2xl md:text-3xl font-extrabold text-blue-605 dark:text-blue-500 mt-2">
                  {formatRupiah(item.price)}
                </p>
              </div>

              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <span>{item.location} • Indonesia Region</span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-slate-800/80 my-3" />

              {/* Description body */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Deskripsi Barang
                </h3>
                <p className="text-xs text-gray-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Seller details widget */}
              <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl flex items-center justify-between border border-gray-150/50 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.sellerAvatar} 
                    alt={item.sellerName} 
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1">
                      {item.sellerName}
                      <BadgeCheck className="h-4.5 w-4.5 text-blue-500 fill-blue-50" />
                    </h4>
                    <p className="text-[10px] text-gray-500">Penjual Terbuka • Respon Cepat</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-955/40 px-2 py-1 rounded-full shrink-0">
                  Rating: 4.9/5.0
                </span>
              </div>

            </div>

            {/* Buying action CTA */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center gap-3">
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl text-xs transition-colors cursor-pointer shadow-md"
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                Beli Produk Sekarang (Bayar Aman)
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Interactive Payment Gateway modal Simulation */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
            
            {/* Header / Cost outline */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                  Gerbang Pembayaran Aman
                </h3>
                <p className="text-[10px] text-blue-500 font-semibold mt-0.5">Sistem Integrasi idebagus Mid-Secure 🛡️</p>
              </div>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentStep('selecting');
                }}
                className="p-1 rounded-full hover:bg-gray-150 text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Step: Selecting payment method / checkout data */}
            {paymentStep === 'selecting' && (
              <div className="space-y-4">
                
                {/* Product quick summary info row */}
                <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-900 p-3 rounded-xl border border-gray-150 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-gray-700 dark:text-neutral-300 truncate max-w-[200px]">
                    {item.title}
                  </span>
                  <span className="font-bold text-blue-650 dark:text-blue-400 shrink-0">
                    {formatRupiah(item.price)}
                  </span>
                </div>

                {/* Subtitle instructions */}
                <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed mb-2">
                  Metode pembayaran lokal Indonesia terlengkap. Transaksi dijamin aman oleh escrow PT Ide Bagus Indonesia.
                </p>

                {/* Grid list of methods */}
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod('qris')}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                        : 'border-gray-200 dark:border-slate-800 hover:bg-gray-55 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <QrCode className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">QRIS (Gopay/OVO/Dana/LinkAja)</p>
                        <p className="text-[9px] text-gray-400">Scan QR Code dan bayar otomatis</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('gopay')}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      paymentMethod === 'gopay'
                        ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                        : 'border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">GoPay Instant</p>
                        <p className="text-[9px] text-gray-400">Konfirmasi via aplikasi Gojek</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('ovo')}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      paymentMethod === 'ovo'
                        ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                        : 'border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">OVO Cash Payment</p>
                        <p className="text-[9px] text-gray-400">Verifikasi instan via nomer OVO</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('va_bca')}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      paymentMethod === 'va_bca'
                        ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                        : 'border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-blue-800" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">BCA Virtual Account</p>
                        <p className="text-[9px] text-gray-400">Transfer manual dari m-BCA/ATM</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Continue button */}
                <button
                  onClick={() => setPaymentStep('paying')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-550 text-white font-extrabold text-xs rounded-2xl mt-4 cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  Lanjut ke Pembayaran
                  <ArrowRight className="h-4 w-4" />
                </button>

              </div>
            )}

            {/* Step: Paying details (Dynamic depending on method) */}
            {paymentStep === 'paying' && (
              <div className="space-y-4">
                         {paymentMethod === 'qris' && (
                  <div className="text-center space-y-3">
                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-350">Scan QRIS Nasional dengan e-Wallet favorit Anda</p>
                    
                    {/* Unique high contrast visual barcode mock */}
                    <div className="mx-auto w-52 h-52 bg-slate-50 dark:bg-slate-900 border-4 border-blue-500/25 p-3 rounded-2xl flex items-center justify-center shadow-inner relative">
                      <div className="grid grid-cols-4 gap-1.5 w-full h-full p-1 border bg-white border-dashed border-gray-155">
                        <div className="h-8 w-8 bg-black rounded-xs"></div>
                        <div className="h-8 w-8 bg-black rounded-xs col-start-4"></div>
                        <div className="col-span-4 flex items-center justify-center py-2">
                          <span className="font-extrabold text-lg text-blue-600 tracking-widest font-mono">
                            QRIS
                          </span>
                        </div>
                        <div className="h-8 w-8 bg-black rounded-xs row-start-4"></div>
                        <div className="h-8 w-8 bg-black rounded-xs row-start-4 col-start-4"></div>
                      </div>
                      
                      {/* Floating QR center seal */}
                      <span className="absolute bg-blue-600 text-white font-black text-[9px] px-1 py-0.5 rounded-sm shadow-md">
                        idebagus
                      </span>
                    </div>

                    <div className="text-[10px] text-gray-400">
                      Merchant: <span className="font-bold text-gray-700 dark:text-slate-300">idebagus.com Local Escrow</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'gopay' && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-350">Masukkan nomor Hanphone Gojek Anda:</p>
                    <input 
                      type="text" 
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      className="w-full rounded-xl border border-gray-205 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-[10px] text-gray-400">Saldo GoPay Anda akan dipotong setelah memasukkan pin di m-Gojek.</p>
                  </div>
                )}

                {paymentMethod === 'ovo' && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-350">Masukkan nomor handphone akun OVO Anda:</p>
                    <input 
                      type="text" 
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      className="w-full rounded-xl border border-gray-205 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-[10px] text-gray-400">Notifikasi verifikasi pembayaran akan dikirimkan langsung ke aplikasi OVO.</p>
                  </div>
                )}

                {paymentMethod === 'va_bca' && (
                  <div className="space-y-3 bg-gray-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-gray-150 dark:border-slate-800">
                    <p className="text-xs font-bold text-gray-700 dark:text-slate-200">Nomor BCA Virtual Account:</p>
                    
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-800">
                      <span className="font-mono font-bold text-sm tracking-widest text-[#005c93] dark:text-[#38bdf8]">
                        {virtualAccountNo}
                      </span>
                      <button
                        onClick={handleCopyVa}
                        className="p-1 rounded-lg hover:bg-gray-100 text-blue-500 shrink-0 flex items-center gap-1 text-[10px] font-semibold cursor-pointer"
                      >
                        <Copy className="h-4 w-4" />
                        {copiedVa ? 'Kopied!' : 'Salin'}
                      </button>
                    </div>

                    <div className="text-[10px] text-gray-400 space-y-1">
                      <p>1. Salin nomor Virtual Account di atas</p>
                      <p>2. Buka m-BCA, pilih m-Transfer &gt; BCA Virtual Account</p>
                      <p>3. Tempel nomor dan masukkan nominal pembayaran</p>
                    </div>
                  </div>
                )}

                {/* Confirm secure button / simulation triggers */}
                <div className="pt-4 border-t border-gray-100 dark:border-slate-800 font-sans">
                  <button
                    onClick={triggerPaymentSubmit}
                    disabled={isProcessingPayment}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menghubungkan ke Saluran Perbankan...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Saya Sudah Menyelesaikan Pembayaran
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* Step: Payment success */}
            {paymentStep === 'success' && (
              <div className="text-center py-6 space-y-4">
                <div className="h-16 w-16 rounded-full bg-blue-105 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mx-auto scale-110">
                  <CheckCircle2 className="h-10 w-10 fill-blue-50" />
                </div>
                
                <div>
                  <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">
                    Pembaruan Berhasil!
                  </h3>
                  <p className="text-xs text-blue-600 font-bold mt-1">
                    Midtrans Escrow Verified 🇲🇨
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                    Dana sebesar <span className="font-semibold text-gray-800 dark:text-white">{formatRupiah(item.price)}</span> aman! Penjual <span className="font-semibold">{item.sellerName}</span> segera diberitahu untuk mengirimkan barang ke tujuan Anda.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                  <button
                    onClick={handleCompleteTransaction}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-2xl cursor-pointer shadow-md"
                  >
                    Selesaikan Transaksi & Kembali
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
