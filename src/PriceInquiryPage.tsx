import React, { useState, useMemo } from 'react';
import { Search, Tag, CheckSquare, ShieldCheck, Zap, Info, ArrowRight, Palette, Sun, LayoutPanelTop, MonitorPlay, Video, Car, Droplets, Sparkles, Gem, Wind, Waves, ChevronDown, ChevronUp, Star, Layers } from 'lucide-react';
import vehiclesData from './data/vehicles.json';
import detailingPrices from './data/detailing_prices.json';
import axColorsData from './data/axColors2026.json';

interface Vehicle {
  brand: string;
  model: string;
  size: string;
}

interface PriceInquiryPageProps {
  vehicleMaster: any[];
  onBack?: () => void;
  initialMode?: 'detailing' | 'film';
}

const PRICING_MATRIX: { [key: string]: { colorChange: number; ppf: number; frontPpf: number; tint: string; mirror: string } } = {
  'XS': { colorChange: 45000, ppf: 85000, frontPpf: 35000, tint: '8000~12000', mirror: '6000' },
  'S':  { colorChange: 50000, ppf: 90000, frontPpf: 35000, tint: '9000~13000', mirror: '6000' },
  'M':  { colorChange: 55000, ppf: 95000, frontPpf: 35000, tint: '10000~15000', mirror: '6500' },
  'L':  { colorChange: 60000, ppf: 100000, frontPpf: 35000, tint: '12000~18000', mirror: '6500' },
  'XL': { colorChange: 65000, ppf: 105000, frontPpf: 40000, tint: '15000~22000', mirror: '7000' },
  '2XL':{ colorChange: 75000, ppf: 110000, frontPpf: 45000, tint: '18000~28000', mirror: '7500' },
  '3XL':{ colorChange: 85000, ppf: 125000, frontPpf: 50000, tint: '22000~35000', mirror: '8000' },
};

const DETAILING_PRICING: Record<string, { wash: number; interior: number; miniDetail: number; fullDetail: number; coating: number }> = {
  'XS': { wash: 500, interior: 1500, miniDetail: 3000, fullDetail: 6000, coating: 8000 },
  'S':  { wash: 600, interior: 1800, miniDetail: 3500, fullDetail: 7000, coating: 10000 },
  'M':  { wash: 700, interior: 2000, miniDetail: 4000, fullDetail: 8000, coating: 12000 },
  'L':  { wash: 800, interior: 2500, miniDetail: 5000, fullDetail: 10000, coating: 15000 },
  'XL': { wash: 1000, interior: 3000, miniDetail: 6000, fullDetail: 12000, coating: 18000 },
  '2XL':{ wash: 1200, interior: 3500, miniDetail: 7000, fullDetail: 14000, coating: 22000 },
  '3XL':{ wash: 1500, interior: 4000, miniDetail: 8000, fullDetail: 16000, coating: 25000 },
};

const PPF_PRICING: Record<string, Record<string, number>> = {
  '亮面犀牛皮': {
    'AX (亮面)': 90000,
    'Pixel8bot (亮面)': 100000,
    '3M 100g (亮面)': 110000,
    '3M 150g (亮面)': 125000,
    '3M 200g (亮面)': 135000,
    'Stek Lite (亮面)': 130000
  },
  '消光犀牛皮': {
    'AX (消光)': 100000,
    'Pixel8bot (消光)': 110000,
    '3M 200m (消光)': 145000,
    'Stek Matte (消光)': 140000
  }
};

const FRONT_PPF_PRICING: Record<string, number> = {
  'Pixel8bit (迎風面)': 35000,
  '3M 150g (迎風面)': 45000,
  '3M 200g (迎風面)': 55000
};

const REAR_COATING_PRICING: Record<string, number> = {
  'Servfaces (一年期)': 12000,
  'CarPro (兩年期)': 18000
};

const TINT_PRICE_TABLE: Record<string, { m3: number; m3_sunroof: number; my: number; my_sunroof: number }> = {
  "極黑": { m3: 26500, m3_sunroof: 29500, my: 24500, my_sunroof: 32500 },
  "極透": { m3: 32500, m3_sunroof: 36500, my: 30500, my_sunroof: 40500 },
  "方案1: 前(透)後(黑)": { m3: 30500, m3_sunroof: 33500, my: 28500, my_sunroof: 36500 },
  "方案2: 前、天(透) 身(黑)": { m3: 30500, m3_sunroof: 34500, my: 28500, my_sunroof: 38500 },
  "XC MAX": { m3: 28500, m3_sunroof: 36500, my: 26500, my_sunroof: 34500 },
  "Smart": { m3: 34500, m3_sunroof: 42500, my: 32500, my_sunroof: 40500 },
  "方案3: 前(Smart)身、天(XC)": { m3: 28500, m3_sunroof: 36500, my: 26500, my_sunroof: 34500 },
  "Vega": { m3: 22500, m3_sunroof: 25500, my: 20500, my_sunroof: 26500 },
  "T4": { m3: 26500, m3_sunroof: 30500, my: 24500, my_sunroof: 31500 },
  "方案4: 前(T4)身、天(Vega)": { m3: 24500, m3_sunroof: 27500, my: 22500, my_sunroof: 28500 },
  "方案5: 前、天(T4) 身(Vega)": { m3: 24500, m3_sunroof: 28500, my: 22500, my_sunroof: 29500 },
  "FSK 冰鑽 KT": { m3: 37500, m3_sunroof: 42500, my: 28500, my_sunroof: 40500 },
  "舒熱佳 XE": { m3: 37500, m3_sunroof: 42500, my: 28500, my_sunroof: 40500 },
  "量子膜 ZX": { m3: 35500, m3_sunroof: 42500, my: 28500, my_sunroof: 40500 },
  "皇家 Supreme": { m3: 27500, m3_sunroof: 32500, my: 22500, my_sunroof: 32500 },
  "Xpel-X2 Plus": { m3: 30500, m3_sunroof: 35500, my: 26500, my_sunroof: 37500 },
};

const TINT_GROUPS: Record<string, string[]> = {
  "3M 系列": ["極黑", "極透", "方案1: 前(透)後(黑)", "方案2: 前、天(透) 身(黑)"],
  "桑馬克系列": ["XC MAX", "Smart", "方案3: 前(Smart)身、天(XC)"],
  "T4 / Vega 系列": ["Vega", "T4", "方案4: 前(T4)身、天(Vega)", "方案5: 前、天(T4) 身(Vega)"],
  "FSK 系列": ["FSK 冰鑽 KT"],
  "舒熱佳 系列": ["舒熱佳 XE"],
  "量子膜 系列": ["量子膜 ZX"],
  "皇家 系列": ["皇家 Supreme"],
  "Xpel 系列": ["Xpel-X2 Plus"]
};

const REC_DASHCAM_MODELS = {
  digitalMirrors: [
    { brand: '大邁', model: 'M996', price: 12800, note: '安裝於車外' },
    { brand: '快譯通', model: 'S95B', price: 14000, note: '安裝於車外' },
    { brand: '快譯通', model: 'S95A', price: 14000, note: '安裝於車內，夜視效果更佳，煥新Ｙ推薦' },
    { brand: '快譯通', model: 'S86', price: 12000, note: '安裝於車內，煥新Ｙ推薦' },
    { brand: 'DOD', model: 'T-one plus', price: 20000, note: '結合後鏡頭一體式' }
  ],
  dashcams: [
    { brand: '快譯通', model: 'V92GH', price: 11500, note: '' }
  ]
};

const calculateFrontPpfPrice = (base: number, size: string) => {
  if (['XS', 'S', 'M', 'L'].includes(size)) return base;
  if (size === 'XL') return base + 5000;
  if (size === '2XL') return base + 10000;
  return base;
};

const calculateRearCoatingPrice = (base: number, size: string) => {
  if (['XS', 'S', 'M'].includes(size)) return base;
  if (size === 'L') return base + 1000;
  if (size === 'XL') return base + 2000;
  if (size === '2XL') return base + 3000;
  return base;
};

const COLOR_WRAP_SERIES: Record<string, Record<string, number>> = {
  'AX': {
    'E系列': 60000,
    'V系列': 63000,
    'G系列': 65000,
    'T系列': 68000,
  },
  '3M': {
    'G/M/S系列': 70000,
    'GP/SP系列': 75000,
    'HG系列': 80000,
  }
};

const SIZE_OFFSET: Record<string, number> = {
  'XS': -5000,
  'S': 0,
  'M': 5000,
  'L': 10000,
  'XL': 15000,
  '2XL': 20000,
};

const calculateWrapPrice = (basePrice: number, size: string) => {
  return basePrice + (SIZE_OFFSET[size] || 0);
};

export const PriceInquiryPage: React.FC<PriceInquiryPageProps> = ({ vehicleMaster, onBack, initialMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [activeCategory, setActiveCategory] = useState<'detailing' | 'film'>( initialMode || 'detailing');
  const [expandedDetailing, setExpandedDetailing] = useState<string[]>([]);
  const [colorSearch, setColorSearch] = useState('');
  const [selectedColorSize, setSelectedColorSize] = useState<string>('M');

  // 直接使用內建的 vehiclesData
  const fullMaster = useMemo(() => {
    return vehiclesData as any[];
  }, []);

  const filteredVehicles = useMemo(() => {
    const raw = (searchTerm || '').trim().toLowerCase();
    if (!raw) return [];
    // normalize: remove hyphens, spaces, underscores for fuzzy matching
    const normalize = (s: string) => s.toLowerCase().replace(/[-\s_]/g, '');
    const term = normalize(raw);
    
    return fullMaster.filter(v => {
      const brand = v.brand.toLowerCase();
      const model = v.model.toLowerCase();
      const combined = `${brand} ${model}`.toLowerCase();
      // standard includes check
      if (brand.includes(raw) || model.includes(raw) || combined.includes(raw)) return true;
      // normalized fuzzy check (handles CR-V → CRV, MODEL Y → MODELY)
      const nBrand = normalize(v.brand);
      const nModel = normalize(v.model);
      const nCombined = `${nBrand}${nModel}`;
      return nBrand.includes(term) || nModel.includes(term) || nCombined.includes(term);
    }).slice(0, 15);
  }, [searchTerm, fullMaster]);

  const handleSelect = (v: any) => {
    setSelectedVehicle(v);
    setSearchTerm(`${v.brand} ${v.model}`);
  };

  const currentSize = selectedVehicle 
    ? (activeCategory === 'detailing' ? (selectedVehicle as any).detailingSize : selectedVehicle.size)
    : 'M';

  const pricing = selectedVehicle ? PRICING_MATRIX[currentSize] || PRICING_MATRIX['M'] : null;

  return (
    <div style={{ padding: '0 20px 40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {onBack && (
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.9rem', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
        >
          ← 返回首頁
        </button>
      )}
      <header style={{ marginBottom: '30px', textAlign: 'center', paddingTop: onBack ? '10px' : '20px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          {activeCategory === 'detailing' ? (
            <><Sparkles size={32} color="#fb923c" /> 汽車美容報價查詢</>
          ) : (
            <><Palette size={32} color="#fb923c" /> 貼膜施工報價查詢</>
          )}
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>輸入車型即可自動對應尺寸並查看各項服務建議售價</p>
        <div style={{ fontSize: '0.6rem', color: '#cbd5e1', marginTop: '4px' }}>
          DB: {fullMaster.length} | Filter: {filteredVehicles.length}
        </div>
      </header>

      {/* 搜尋區 */}
      <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 20px auto', zIndex: 100 }}>
        <div className="glass-panel" style={{ padding: '6px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ paddingLeft: '15px', color: '#94a3b8' }}>
            <Search size={22} />
          </div>
          <input
            type="search"
            placeholder="請輸入品牌或車型 (例如: Tesla, RAV4...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px 10px', fontSize: '1.1rem', outline: 'none', color: '#1e293b', fontWeight: '500' }}
          />
          {selectedVehicle && (
            <button 
              onClick={() => { setSelectedVehicle(null); setSearchTerm(''); }}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', color: '#64748b', fontSize: '0.85rem' }}
            >
              清除
            </button>
          )}
        </div>

        {/* 搜尋結果選單 */}
        {searchTerm && !selectedVehicle && (
          <div style={{ 
            marginTop: '12px',
            background: '#fff', 
            borderRadius: '16px', 
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', 
            border: '1px solid #e2e8f0', 
            overflow: 'hidden',
            zIndex: 100,
            position: 'absolute',
            width: '100%',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {filteredVehicles.length > 0 ? (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div style={{ padding: '12px 20px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  找到 {filteredVehicles.length} 個相符車型
                </div>
                {filteredVehicles.map((v, i) => (
                  <div 
                    key={i}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(v);
                    }}
                    style={{ 
                      padding: '16px 20px', 
                      cursor: 'pointer', 
                      borderBottom: i === filteredVehicles.length - 1 ? 'none' : '1px solid #f1f5f9', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      background: '#fff'
                    }}
                    className="search-item-hover"
                  >
                    <div>
                      <span style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.05rem' }}>{v.brand}</span>
                      <span style={{ marginLeft: '10px', color: '#64748b' }}>{v.model}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#e0e7ff', color: '#fb923c', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                        貼膜: {v.size || 'M'}
                      </span>
                      <span style={{ background: '#e0f2fe', color: '#fb923c', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                        洗車: {v.detailingSize || 'M'}
                      </span>
                      <ArrowRight size={16} color="#cbd5e1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94a3b8' }}>
                <Car size={32} style={{ opacity: 0.2, marginBottom: '10px' }} />
                <div style={{ fontWeight: 'bold' }}>找不到相符的車型</div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>請嘗試輸入品牌或型號 (例如: Toyota)</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 分類切換器 - 如果有 initialMode 就隱藏，避免混淆 */}
      {!initialMode && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          background: '#f1f5f9', 
          padding: '8px', 
          borderRadius: '20px', 
          maxWidth: '560px', 
          margin: '0 auto 40px auto',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <button 
            onClick={() => setActiveCategory('detailing')}
            style={{ 
              flex: 1,
              padding: '18px 24px', 
              borderRadius: '14px', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: '900',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: activeCategory === 'detailing' ? '#fff' : 'transparent',
              color: activeCategory === 'detailing' ? '#fb923c' : '#94a3b8',
              boxShadow: activeCategory === 'detailing' ? '0 4px 12px rgba(251,146,60,0.25)' : 'none',
              transition: 'all 0.25s'
            }}
          >
            <Sparkles size={22} /> 汽車美容
          </button>
          <button 
            onClick={() => setActiveCategory('film')}
            style={{ 
              flex: 1,
              padding: '18px 24px', 
              borderRadius: '14px', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: '900',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: activeCategory === 'film' ? '#fff' : 'transparent',
              color: activeCategory === 'film' ? '#fb923c' : '#94a3b8',
              boxShadow: activeCategory === 'film' ? '0 4px 12px rgba(251,146,60,0.25)' : 'none',
              transition: 'all 0.25s'
            }}
          >
            <Palette size={22} /> 貼膜服務
          </button>
        </div>
      )}

      {selectedVehicle ? (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          {/* 選中的車輛資訊 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px', 
            marginBottom: '30px', 
            background: activeCategory === 'detailing' 
              ? 'linear-gradient(135deg, #fb923c 0%, #c2410c 100%)' 
              : 'linear-gradient(135deg, #fb923c 0%, #c2410c 100%)', 
            padding: '25px 30px', 
            borderRadius: '24px', 
            color: '#fff', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
          }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={36} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.8rem', margin: 0, fontWeight: '900' }}>{selectedVehicle.brand} {selectedVehicle.model}</h3>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  貼膜尺寸: {selectedVehicle.size || 'M'}
                </span>
                <span style={{ background: 'rgba(255, 255, 255, 0.35)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
                  洗車/美容尺寸: {(selectedVehicle as any).detailingSize || 'M'}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: '1' }}>{currentSize}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>目前對應尺寸 ({activeCategory === 'detailing' ? '洗車美容' : '貼膜'})</div>
            </div>
          </div>

          {activeCategory === 'detailing' ? (
            /* 汽車美容報價內容 */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', gridColumn: 'span 2' }}>
                {[
                  { title: "保養洗車、基本護理", icon: Droplets, theme: { main: '#fb923c', bg: '#f0f9ff', border: '#e0f2fe' }, items: detailingPrices.filter(i => ["經典洗", "光澤整備", "深層特勤", "鏡透打底Lv.1", "鏡透打底Lv.2", "視界去污"].includes(i.itemName)) },
                  { title: "拋光鍍膜", icon: Sparkles, theme: { main: '#8b5cf6', bg: '#fff7ed', border: '#ffedd5' }, items: detailingPrices.filter(i => ["S1單層護盾", "S1雙層護盾", "S2單層護盾", "S2雙層護盾", "視界強化", "鋁圈守護"].includes(i.itemName)) },
                  { title: "貼膜車專屬方案", icon: ShieldCheck, theme: { main: '#10b981', bg: '#ecfdf5', border: '#d1fae5' }, items: detailingPrices.filter(i => ["膜淨行動", "膜車專護方案"].includes(i.itemName)) }
                ].map((group, gIdx) => {
                  const GroupIcon = group.icon;
                  return (
                  <div key={gIdx}>
                    <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '20px', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <GroupIcon size={24} color={group.theme.main} /> {group.title}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                      {group.items.map((item, idx) => {
                        const isExpanded = expandedDetailing.includes(group.title);
                        
                        // Calculate size multiplier offset based on 'S'
                  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
                  const sIndex = 1; // 'S' is index 1
                  const currentIndex = sizes.indexOf(currentSize as string);
                  const diff = currentIndex >= 0 ? currentIndex - sIndex : 0;
                  
                  // Calculate base price with offset
                  const computedBase = item.basePriceN + (diff * item.stepPrice);
                  
                  // Calculate member prices
                  const priceN = computedBase;
                  const priceS = Math.round(computedBase * item.discountS);
                  const priceSR = Math.round(computedBase * item.discountSR);
                  const priceUR = Math.round(computedBase * item.discountUR);

                  return (
                    <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                      <div 
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }}
                        onClick={() => setExpandedDetailing(prev => prev.includes(group.title) ? prev.filter(i => i !== group.title) : [...prev, group.title])}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: group.theme.main, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <GroupIcon size={20} /> {item.itemName}
                          </h4>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px', fontWeight: 'bold' }}>
                            {item.subtitle}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <div style={{ background: '#f8fafc', padding: '4px 10px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '900', color: '#0f172a', border: '1px solid #e2e8f0' }}>
                            $ {priceN.toLocaleString()}
                          </div>
                          <div style={{ color: '#94a3b8', marginTop: '6px' }}>
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #e2e8f0', animation: 'fadeIn 0.3s ease-out' }}>
                          <div style={{ background: group.theme.bg, padding: '15px', borderRadius: '12px', marginBottom: '20px', border: `1px solid ${group.theme.border}` }}>
                            <div style={{ fontSize: '0.9rem', color: group.theme.main, fontWeight: 'bold', marginBottom: '10px' }}>會員專屬報價 (已包含尺寸加價)</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
                              <div style={{ background: '#fff', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>一般 (N)</div>
                                <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '900' }}>${priceN.toLocaleString()}</div>
                              </div>
                              <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                                <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 'bold' }}>銀卡 (S)</div>
                                <div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: '900' }}>${priceS.toLocaleString()}</div>
                              </div>
                              <div style={{ background: '#fffbeb', padding: '8px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                                <div style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 'bold' }}>金卡 (SR)</div>
                                <div style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: '900' }}>${priceSR.toLocaleString()}</div>
                              </div>
                              <div style={{ background: '#fdf4ff', padding: '8px', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
                                <div style={{ fontSize: '0.7rem', color: '#c026d3', fontWeight: 'bold' }}>黑卡 (UR)</div>
                                <div style={{ fontSize: '0.9rem', color: '#a21caf', fontWeight: '900' }}>${priceUR.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                            {item.details ? item.details : <span style={{ opacity: 0.5 }}>無詳細說明</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                    </div>
                  </div>
                );
              })}
              </div>

              {/* 溫馨提示區 */}
              <div className="glass-panel col-span-2" style={{ padding: '15px 20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', gridColumn: 'span 2' }}>
                <Info size={18} color="#fb923c" />
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
                  💡 <strong>洗車美容報價說明：</strong>此頁面僅供對應車型之「美容/洗車尺寸級距」查詢。實際施工金額與工時評估，請洽門市技術人員或參閱店內實體價目表。
                </span>
              </div>

            </div>
          ) : (
            /* 貼膜服務報價內容 */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
            {/* 改色膜 */}
            <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: '#fb923c' }}>
                <Palette size={24} />
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>全車改色膜 - 品牌系列報價</h4>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* AX Series */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                    <div style={{ background: '#fb923c', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>AX</div>
                    <span style={{ fontWeight: 'bold', color: '#1e293b' }}>AX 品牌系列</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.entries(COLOR_WRAP_SERIES['AX']).map(([series, base]) => (
                      <div key={series} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: '#f8fafc', borderRadius: '10px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>{series}</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginRight: '3px' }}>$</span>
                          {calculateWrapPrice(base, selectedVehicle.size).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3M Series */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                    <div style={{ background: '#e11d48', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>3M</div>
                    <span style={{ fontWeight: 'bold', color: '#1e293b' }}>3M 品牌系列</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.entries(COLOR_WRAP_SERIES['3M']).map(([series, base]) => (
                      <div key={series} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: '#fff1f2', borderRadius: '10px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#991b1b', fontWeight: '600' }}>{series}</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#e11d48' }}>
                          <span style={{ fontSize: '0.8rem', color: '#f43f5e', marginRight: '3px', opacity: 0.6 }}>$</span>
                          {calculateWrapPrice(base, selectedVehicle.size).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '25px', padding: '15px 20px', background: '#fff7ed', borderRadius: '15px', border: '1px solid #ffedd5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: '#f97316', color: '#fff', padding: '6px', borderRadius: '10px' }}>
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#c2410c', fontSize: '0.95rem' }}>全車改色加購 - 迎風面犀牛皮</div>
                      <div style={{ fontSize: '0.75rem', color: '#f97316' }}>品牌: Pixel8bit (Hood+Fender)</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#c2410c' }}>
                    <span style={{ fontSize: '0.8rem', marginRight: '3px' }}>+ $</span>18,000
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}></div>
            </div>

            {/* 犀牛皮 (PPF) */}
            <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: '#10b981' }}>
                <ShieldCheck size={24} />
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>犀牛皮 (PPF) 專業保護膜報價</h4>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Full PPF */}
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '16px', background: '#10b981', borderRadius: '2px' }}></div>
                    全車保護方案 (Glossy / Matte)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries(PPF_PRICING).map(([category, items]) => (
                      <div key={category} style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '5px', paddingLeft: '5px' }}>{category}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {Object.entries(items).map(([name, base]) => (
                            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                              <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: '600' }}>{name}</span>
                              <span style={{ fontSize: '1rem', fontWeight: '800', color: '#064e3b' }}>
                                ${calculateWrapPrice(base, selectedVehicle.size).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Front PPF */}
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '16px', background: '#fb923c', borderRadius: '2px' }}></div>
                    重點防護 - 迎風面方案
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.entries(FRONT_PPF_PRICING).map(([name, base]) => (
                      <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #e0f2fe' }}>
                        <span style={{ fontSize: '0.9rem', color: '#f97316', fontWeight: '600' }}>{name}</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#c2410c' }}>
                          ${calculateFrontPpfPrice(base, selectedVehicle.size).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.8rem', color: '#f97316', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Zap size={14} /> 迎風面加購 - 後半車鍍膜
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Object.entries(REAR_COATING_PRICING).map(([name, base]) => (
                        <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>{name}</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#f97316' }}>
                            +${calculateRearCoatingPrice(base, selectedVehicle.size).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: '15px', padding: '10px 15px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '0.75rem', color: '#92400e', lineHeight: '1.6' }}>
                      <strong>迎風面包含：</strong>前保桿、引擎蓋、左右葉子板、後視鏡。
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 其他服務 (小項) */}
          <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
             {/* 隔熱紙方案 */}
             <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
                <h4 style={{ marginBottom: '20px', color: '#c2410c', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sun size={20} /> 隔熱紙專業方案
                </h4>
                
                {selectedVehicle.model?.toLowerCase().includes('model 3') || selectedVehicle.model?.toLowerCase().includes('model y') ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {Object.entries(TINT_GROUPS).map(([group, items]) => (
                      <div key={group} style={{ background: '#f8fafc', padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontWeight: 'bold', color: '#c2410c', fontSize: '0.9rem', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>{group}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {items.map(item => {
                            const prices = TINT_PRICE_TABLE[item];
                            const isM3 = selectedVehicle.model?.toLowerCase().includes('model 3');
                            const price = isM3 ? prices.m3 : prices.my;
                            const sunroofPrice = isM3 ? prices.m3_sunroof : prices.my_sunroof;
                            
                            return (
                              <div key={item} style={{ fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontWeight: '600' }}>
                                  <span>{item}</span>
                                  <span style={{ color: '#c2410c' }}>${price.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                                  <span>(含天窗方案)</span>
                                  <span>${sunroofPrice.toLocaleString()}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: '#fff7ed', padding: '20px', borderRadius: '15px', border: '1px dashed #fb923c', textAlign: 'center' }}>
                     <p style={{ color: '#c2410c', fontWeight: 'bold', margin: 0 }}>
                       最低 $ {pricing?.tint} 起
                     </p>
                     <p style={{ color: '#fba56a', fontSize: '0.85rem', margin: '5px 0 0 0' }}>
                       (依車型不同須詢問隔熱紙廠商實際報價)
                     </p>
                  </div>
                )}
             </div>

             {(selectedVehicle.model?.toLowerCase().includes('model 3') || selectedVehicle.model?.toLowerCase().includes('model y')) && (
               <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
                  <h4 style={{ marginBottom: '15px', color: '#1e293b', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MonitorPlay size={20} /> Tesla 安全升級首選 - 行車記錄器 ＆ 電子後視鏡
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>我們配合的專業廠商提供多種品牌與型號，皆可協助施工安裝，歡迎根據需求搭配選擇。</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MonitorPlay size={16} /> 電子後視鏡熱門推薦
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {REC_DASHCAM_MODELS.digitalMirrors.map(m => (
                          <div key={m.model} style={{ background: '#f8fafc', padding: '12px 15px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '700', color: '#1e293b' }}>{m.brand} {m.model}</span>
                              <span style={{ fontWeight: '800', color: '#fb923c' }}>${m.price.toLocaleString()}</span>
                            </div>
                            {m.note && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>{m.note}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Video size={16} /> 行車記錄器熱門推薦
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {REC_DASHCAM_MODELS.dashcams.map(m => (
                          <div key={m.model} style={{ background: '#f8fafc', padding: '12px 15px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '700', color: '#1e293b' }}>{m.brand} {m.model}</span>
                              <span style={{ fontWeight: '800', color: '#fb923c' }}>${m.price.toLocaleString()}</span>
                            </div>
                            {m.note && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>{m.note}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
               </div>
             )}

             {/* 其他配件 */}
             <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ marginBottom: '15px', color: '#1e293b', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LayoutPanelTop size={18} /> 其他配套服務
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 15px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' }}>電子後視鏡 (含工)</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#475569' }}>$ {pricing?.mirror}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 15px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' }}>鍍鉻件黑化包覆</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#475569' }}>$ 8,000 ~ 15,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    ) : (
        <div style={{ textAlign: 'center', padding: '100px 20px', background: '#f8fafc', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
          <div style={{ background: '#fff', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
             <Car size={48} color="#cbd5e1" />
          </div>
          <h3 style={{ color: '#64748b', fontSize: '1.5rem', marginBottom: '10px' }}>請輸入車型開始查詢</h3>
          <p style={{ color: '#94a3b8' }}>系統將根據母檔中的 S, M, L, XL 等規格自動呈現報價</p>
        </div>
      )}

      {/* ===== AX 2026 顏色查價區塊 ===== */}
      {(() => {
        const axColors = axColorsData as Array<{
          seq: number; series: string; seriesLabel: string;
          code: string; englishName: string; colorName: string;
          basePrice: number; extraPrice: number;
        }>;

        const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
        const BASE_COLOR_PRICES: Record<string, number> = {
          'XS': 60000, 'S': 60000, 'M': 65000, 'L': 70000, 'XL': 75000, '2XL': 80000
        };

        const filteredColors = colorSearch.trim().length >= 1
          ? axColors.filter(c => {
              const q = colorSearch.toLowerCase();
              return c.colorName.toLowerCase().includes(q) ||
                c.englishName.toLowerCase().includes(q) ||
                c.code.toLowerCase().includes(q) ||
                c.series.toLowerCase().includes(q);
            }).slice(0, 30)
          : [];

        const seriesBadgeColor: Record<string, { bg: string; text: string }> = {
          'E系列': { bg: '#eff6ff', text: '#2563eb' },
          'G-漸變系列': { bg: '#f0fdf4', text: '#16a34a' },
          'T-特調系列': { bg: '#fdf4ff', text: '#9333ea' },
          'V系列': { bg: '#fff7ed', text: '#ea580c' },
        };

        const extraLabel = (extra: number) => {
          if (extra === 0) return { label: '標準', color: '#64748b', bg: '#f1f5f9' };
          if (extra === 3000) return { label: '+3000', color: '#0369a1', bg: '#e0f2fe' };
          if (extra === 5000) return { label: '+5000', color: '#15803d', bg: '#dcfce7' };
          if (extra === 8000) return { label: '+8000', color: '#7c2d12', bg: '#fef3c7' };
          return { label: `+${extra}`, color: '#64748b', bg: '#f1f5f9' };
        };

        return (
          <div style={{ marginTop: '60px', borderTop: '2px solid #e2e8f0', paddingTop: '50px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                <Layers size={28} color="#fb923c" /> AX 2026 EV 顏色查價
              </h2>
              <p style={{ color: '#64748b' }}>輸入膜料顏色名稱、編號或英文，即可查看各尺寸施工價格</p>
            </div>

            {/* 搜尋框 */}
            <div style={{ maxWidth: '560px', margin: '0 auto 24px auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '12px 18px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <Search size={20} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="搜尋顏色名稱、編號或英文（例如：薔薇粉、E-E-109）"
                  value={colorSearch}
                  onChange={e => setColorSearch(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#1e293b', background: 'transparent' }}
                />
                {colorSearch && (
                  <button onClick={() => setColorSearch('')} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', color: '#64748b', fontSize: '0.8rem' }}>清除</button>
                )}
              </div>
            </div>

            {/* 尺寸選擇 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', alignSelf: 'center', marginRight: '4px' }}>選擇車型尺寸：</span>
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedColorSize(s)}
                  style={{
                    padding: '6px 16px', borderRadius: '20px',
                    border: `2px solid ${selectedColorSize === s ? '#fb923c' : '#e2e8f0'}`,
                    background: selectedColorSize === s ? '#fb923c' : '#fff',
                    color: selectedColorSize === s ? '#fff' : '#475569',
                    fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >{s}</button>
              ))}
            </div>

            {/* 搜尋結果 */}
            {colorSearch.trim().length >= 1 && (
              <div>
                {filteredColors.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                    <Palette size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <div style={{ fontWeight: 'bold' }}>找不到相符顏色</div>
                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>試試輸入顏色中文名、英文或編號</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                    {filteredColors.map((c, i) => {
                      const baseForSize = BASE_COLOR_PRICES[selectedColorSize] || 65000;
                      const finalPrice = baseForSize + c.extraPrice;
                      const extra = extraLabel(c.extraPrice);
                      const badge = seriesBadgeColor[c.series] || { bg: '#f8fafc', text: '#64748b' };
                      return (
                        <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                              <div style={{ fontWeight: '900', fontSize: '1.1rem', color: '#1e293b', marginBottom: '2px' }}>{c.colorName}</div>
                              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{c.englishName}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                              <span style={{ background: badge.bg, color: badge.text, padding: '3px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>{c.seriesLabel || c.series}</span>
                              {c.extraPrice > 0 && (
                                <span style={{ background: extra.bg, color: extra.color, padding: '3px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>{extra.label}</span>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', padding: '10px 14px', marginBottom: '10px' }}>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                              <div>編號：<strong style={{ color: '#1e293b' }}>{c.code}</strong></div>
                              <div style={{ marginTop: '2px' }}>尺寸 <strong>{selectedColorSize}</strong> 報價</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fb923c', lineHeight: 1 }}>${finalPrice.toLocaleString()}</div>
                              {c.extraPrice > 0 && (
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>底價 ${baseForSize.toLocaleString()} + 附加 ${c.extraPrice.toLocaleString()}</div>
                              )}
                            </div>
                          </div>
                          {/* 各尺寸速查 */}
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {SIZES.map(sz => {
                              const p = (BASE_COLOR_PRICES[sz] || 65000) + c.extraPrice;
                              const isSelected = sz === selectedColorSize;
                              return (
                                <div key={sz} onClick={() => setSelectedColorSize(sz)} style={{ flex: '1', minWidth: '48px', textAlign: 'center', padding: '5px 2px', borderRadius: '8px', background: isSelected ? '#fff7ed' : '#f8fafc', border: `1px solid ${isSelected ? '#fb923c' : '#e2e8f0'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '600' }}>{sz}</div>
                                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: isSelected ? '#fb923c' : '#475569' }}>${(p/1000).toFixed(0)}K</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 預設提示 */}
            {colorSearch.trim().length === 0 && (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                <Palette size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                <div style={{ fontWeight: 'bold', color: '#94a3b8', fontSize: '1rem' }}>共收錄 {axColors.length} 個 AX 2026 EV 系列顏色</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '6px' }}>E系列、G漸變、T特調、V液態金屬 — 輸入關鍵字即可查詢</div>
              </div>
            )}
          </div>
        );
      })()}

      <style>{`
        .search-item-hover:hover {
          background: #f8fafc;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
