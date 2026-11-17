import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Utensils,
  RefreshCw,
  Plus,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { apiClient, AnalyzedMealData } from '../../services/apiClient';
import { r2StorageService } from '../../services/r2StorageService';
import { useApp } from '../../context/AppContext';

interface AIFoodScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIFoodScannerModal: React.FC<AIFoodScannerModalProps> = ({ isOpen, onClose }) => {
  const { addMealLog, showToast } = useApp();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [userHint, setUserHint] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<AnalyzedMealData | null>(null);
  const [analysisSource, setAnalysisSource] = useState<string>('');
  const [mealCategory, setMealCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isCameraActive, setIsCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setAnalyzedResult(null);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Start live webcam/device camera
  const startCamera = async () => {
    try {
      setAnalyzedResult(null);
      setImagePreview(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      showToast('Camera access denied or not available. Please upload a file instead.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture still from webcam video
  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setImagePreview(dataUrl);
      setMimeType('image/jpeg');
      stopCamera();
    }
  };

  // Trigger Gemini Vision AI analysis
  const handleAnalyzePhoto = async () => {
    if (!imagePreview) return;
    setIsScanning(true);
    setAnalyzedResult(null);

    try {
      const response = await apiClient.analyzeFoodPhoto(imagePreview, mimeType, userHint);
      if (response.success && response.data) {
        setAnalyzedResult(response.data);
        setAnalysisSource(response.source || 'Gemini Vision AI');
        // Persist photo to Cloudflare R2
        r2StorageService.uploadFoodScanPhoto(imagePreview, 'usr_sunilraj_001').catch(() => {});
        showToast(`Analyzed ${response.data.dishName}!`);
      } else {
        showToast(response.error || 'Failed to analyze meal photo.');
      }
    } catch (err) {
      showToast('Vision scan failed. Please check your image.');
    } finally {
      setIsScanning(false);
    }
  };

  // Add the AI analyzed dish directly into today's diary
  const handleAddToDiary = () => {
    if (!analyzedResult) return;

    addMealLog({
      foodId: `ai_snap_${Date.now()}`,
      foodName: analyzedResult.dishName,
      mealType: mealCategory,
      portions: 1,
      calories: analyzedResult.calories,
      proteinG: analyzedResult.proteinG,
      carbsG: analyzedResult.carbsG,
      fatG: analyzedResult.fatG,
      fiberG: analyzedResult.fiberG
    });

    handleClose();
    showToast(`Logged ${analyzedResult.dishName} (${analyzedResult.calories} kcal) to ${mealCategory}!`);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-border bg-brand-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-yellow text-slate-950">
                  Gemini Vision AI
                </span>
                <span className="text-xs text-slate-400">Nutritional Snapshot</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                AI Food Snap & Macro Scanner
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-brand-hover transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Top Options: Upload or Camera */}
          {!imagePreview && !isCameraActive && (
            <div className="border-2 border-dashed border-brand-border hover:border-brand-yellow/50 rounded-2xl p-8 text-center transition space-y-4 bg-brand-dark/50">
              <div className="w-16 h-16 rounded-2xl bg-brand-card mx-auto flex items-center justify-center text-brand-yellow shadow-inner">
                <Utensils className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Upload or Snap a Photo of Your Meal</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Take a photo or upload an image of your breakfast, lunch, or dinner. Gemini Vision will identify the dish, calculate portions in household measures, and estimate calories and macros.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-5 rounded-xl bg-brand-card hover:bg-brand-hover border border-brand-border text-xs font-bold text-slate-200 flex items-center gap-2 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-brand-yellow" />
                  <span>Choose Photo File</span>
                </button>

                <button
                  type="button"
                  onClick={startCamera}
                  className="py-2.5 px-5 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-xs font-extrabold text-slate-950 flex items-center gap-2 transition shadow-md shadow-brand-yellow/15 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Use Device Camera</span>
                </button>
              </div>
            </div>
          )}

          {/* Live Camera View */}
          {isCameraActive && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-brand-border shadow-inner">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="py-2 px-4 rounded-xl bg-black/70 backdrop-blur-md text-slate-300 text-xs font-semibold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={capturePhotoFromCamera}
                  className="py-2.5 px-6 rounded-xl bg-brand-yellow text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-brand-yellow/30 hover:scale-105 transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* Image Preview & Scanner Visual */}
          {imagePreview && (
            <div className="space-y-4 animate-fadeIn">
              <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-brand-border aspect-video max-h-64 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Captured Meal"
                  className="w-full h-full object-cover"
                />

                {/* Animated Scanner Laser Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-brand-yellow/10 pointer-events-none flex flex-col justify-between p-4">
                    <div className="w-full h-1 bg-brand-yellow shadow-[0_0_15px_#e2f163] animate-bounce" />
                    <div className="text-center">
                      <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-brand-yellow text-xs font-bold font-mono tracking-wider animate-pulse">
                        Analyzing Food Biometrics & Indian Macro Database...
                      </span>
                    </div>
                    <div className="w-full h-1 bg-brand-yellow shadow-[0_0_15px_#e2f163]" />
                  </div>
                )}

                {/* Re-snap Button */}
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setAnalyzedResult(null);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 backdrop-blur-md text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>
              </div>

              {/* Optional user prompt hint */}
              {!analyzedResult && !isScanning && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userHint}
                    onChange={e => setUserHint(e.target.value)}
                    placeholder="Optional hint: e.g. Masala Dosa with sambar, 2 rotis with dal..."
                    className="flex-1 px-4 py-2.5 bg-brand-dark border border-brand-border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-yellow"
                  />
                  <button
                    type="button"
                    onClick={handleAnalyzePhoto}
                    className="py-2.5 px-5 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-md shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Nutrition</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analyzed Results Card */}
          {analyzedResult && (
            <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-4 animate-slideUp">
              {/* Dish Title & Meta */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
                      {analyzedResult.regionalCategory}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {analyzedResult.confidencePct}% AI Match
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {analyzedResult.dishName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Portion: <strong className="text-slate-200">{analyzedResult.servingEstimate}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-brand-yellow font-mono">
                    {analyzedResult.calories}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total kcal</div>
                </div>
              </div>

              {/* 4 Macro Cards */}
              <div className="grid grid-cols-4 gap-2.5 pt-1 text-center">
                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block">Protein</span>
                  <div className="text-base font-black text-emerald-300 font-mono mt-0.5">
                    {analyzedResult.proteinG}g
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
                  <span className="text-[10px] font-bold uppercase text-amber-400 block">Carbs</span>
                  <div className="text-base font-black text-amber-300 font-mono mt-0.5">
                    {analyzedResult.carbsG}g
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
                  <span className="text-[10px] font-bold uppercase text-rose-400 block">Fats</span>
                  <div className="text-base font-black text-rose-300 font-mono mt-0.5">
                    {analyzedResult.fatG}g
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-950/20 border border-sky-500/30">
                  <span className="text-[10px] font-bold uppercase text-sky-400 block">Fiber</span>
                  <div className="text-base font-black text-sky-300 font-mono mt-0.5">
                    {analyzedResult.fiberG}g
                  </div>
                </div>
              </div>

              {/* Nutritional Insights */}
              <div className="space-y-1.5 p-3 rounded-xl bg-brand-dark/80 border border-brand-border/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Gemini Sports Nutrition Insights:
                </span>
                {analyzedResult.insights.map((insight, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow flex-shrink-0 mt-1.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>

              {/* Meal Category & Add to Diary */}
              <div className="pt-3 border-t border-brand-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-medium mr-1">Log as:</span>
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMealCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border transition cursor-pointer ${
                        mealCategory === cat
                          ? 'bg-brand-yellow text-slate-950 border-brand-yellow font-bold'
                          : 'bg-brand-dark text-slate-400 border-brand-border hover:border-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddToDiary}
                  className="py-2.5 px-6 rounded-xl bg-brand-yellow hover:bg-brand-yellowDark text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 transition cursor-pointer hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Today's Diary</span>
                </button>
              </div>
            </div>
          )}

          {/* Nutrition Data & Disclaimer Footer Notice */}
          <div className="p-3 rounded-xl bg-brand-dark/60 border border-brand-border/60 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
              <span>AI Nutrition Engine • Multimodal Analysis</span>
            </span>
            <span>ICMR-NIN Food Composition Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};
