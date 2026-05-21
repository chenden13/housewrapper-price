import React from 'react';
import { PriceInquiryPage } from './PriceInquiryPage';
import { ShieldCheck } from 'lucide-react';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 頂部導航列 / 品牌標識 */}
      <nav style={{ 
        padding: '15px 30px', 
        background: '#fff', 
        borderBottom: '2px solid #fb923c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 6px -1px rgba(251, 146, 60, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="./logo.jpg" alt="好室多膜 LOGO" style={{ width: '60px', height: 'auto', borderRadius: '8px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: '#fb923c' }}>好室多膜</h1>
            <div style={{ fontSize: '0.9rem', color: '#fb923c', fontWeight: 'bold', letterSpacing: '2px' }}>HOUSE WRAPPER</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f97316', fontSize: '1rem', fontWeight: '800', background: '#fff7ed', padding: '8px 16px', borderRadius: '20px', border: '1px solid #ffedd5' }}>
          <ShieldCheck size={20} /> 好室多膜專屬查價系統
        </div>
      </nav>

      {/* 內容區塊 */}
      <main style={{ flex: 1, padding: '20px 0' }}>
        <PriceInquiryPage vehicleMaster={[]} />
      </main>

      {/* 底部資訊 */}
      <footer style={{ padding: '40px 20px', textAlign: 'center', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px' }}>
          © 2026 好室多膜 House Wrapper. All rights reserved.
        </p>
        <div style={{ color: '#94a3b8', fontSize: '0.8rem', maxWidth: '600px', margin: '0 auto' }}>
          * 本系統提供之價格僅供參考，實際施工費用將根據車況、耗材選擇及現場評估為準。歡迎聯繫各分店進行精確報價。
        </div>
      </footer>
    </div>
  );
}

export default App;
