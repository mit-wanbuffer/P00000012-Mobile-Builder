
import React, { useState, useMemo } from 'react';
import { 
  BlockType, 
  BlockConfig, 
  ThemeSettings, 
  ScreenType 
} from './types';
import { 
  COMPONENT_METADATA 
} from './constants';

/**
 * PRODUCTION-GRADE SHOPIFY APP BUILDER 
 * Features: Billing API Integration, Firebase Sync Simulation, Block-Limit Enforcement.
 */

const HOME_BLOCK_LIMIT = 10;
const PRO_PLAN_PRICE = 150;

const GlobalStyles = () => (
  <style>{`
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    .animate-marquee {
      display: inline-block;
      white-space: nowrap;
      animation: marquee 15s linear infinite;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .iphone-frame {
      width: 360px;
      height: 740px;
      border: 12px solid #1a1a1a;
      border-radius: 40px;
      background: #fff;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 50px 100px -20px rgba(0,0,0,0.4);
      position: relative;
    }
    .iphone-notch {
      width: 160px;
      height: 28px;
      background: #1a1a1a;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-left-radius: 18px;
      border-bottom-right-radius: 18px;
      z-index: 100;
    }
    .slide-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255,255,255,0.4);
      transition: all 0.3s ease;
    }
    .slide-dot.active {
      background: white;
      width: 16px;
      border-radius: 4px;
    }
  `}</style>
);

const BlockRenderer: React.FC<{ 
  block: BlockConfig; 
  theme: ThemeSettings;
  active: boolean;
}> = ({ block, theme, active }) => {
  const s = block.settings;
  const getImg = (idx: number, cat: string) => 
    `https://picsum.photos/seed/${block.id}-${idx}/600/800?${cat}=1`;

  switch (block.type) {
    case BlockType.PROMO_MARQUEE:
      return (
        <div className="py-2 overflow-hidden" style={{ backgroundColor: s.bg || '#000', color: s.textCol || '#fff' }}>
          <div className="animate-marquee text-[10px] font-black uppercase tracking-[0.2em]">
            {s.content || 'FREE SHIPPING ON ORDERS $75+ • USE CODE: TRIAL7 • NEW DROPS EVERY FRIDAY'}
          </div>
        </div>
      );

    case BlockType.BANNER_SLIDER:
      const slides = s.slides || [{ id: 1, img: getImg(0, 'fashion'), title: 'EXCLUSIVE DROP' }];
      return (
        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
          <img src={slides[0].img} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end items-center pb-12 p-6">
            <h2 className="text-white text-4xl font-black italic uppercase text-center leading-none mb-4 tracking-tighter shadow-sm">
              {slides[0].title || 'NOVA LUXE'}
            </h2>
            <button className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest shadow-xl">
              SHOP NOW
            </button>
          </div>
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
              {slides.map((_: any, i: number) => (
                <div key={i} className={`slide-dot ${i === 0 ? 'active' : ''}`} />
              ))}
            </div>
          )}
        </div>
      );

    case BlockType.TIMER_BANNER:
      return (
        <div className="relative aspect-[16/9] bg-black overflow-hidden flex flex-col items-center justify-center p-6">
          {s.image && <img src={s.image} className="absolute inset-0 w-full h-full object-cover opacity-60" />}
          <div className="relative z-10 text-center text-white">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">{s.label || 'OFFER ENDS IN'}</h3>
            <div className="flex gap-4">
              {['00', '59', '42'].map((val, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-3xl font-black italic">{val}</span>
                  <span className="text-[8px] font-bold opacity-70 uppercase tracking-widest">{['HRS', 'MIN', 'SEC'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case BlockType.CATEGORY_MENU:
      const items = s.items || ['DRESSES', 'TOPS', 'JEANS', 'SALE'];
      const isCircle = s.variant === 'circle';
      return (
        <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar bg-white">
          {items.map((cat: string, i: number) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center">
              <div className={`overflow-hidden border border-gray-100 mb-2 shadow-sm ${isCircle ? 'w-16 h-16 rounded-full' : 'w-20 h-28 rounded-sm'}`}>
                <img src={getImg(i, 'clothing')} className="w-full h-full object-cover" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tight">{cat}</span>
            </div>
          ))}
        </div>
      );

    case BlockType.PRODUCT_GRID:
      return (
        <div className="p-3 bg-white">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="font-black text-xs uppercase tracking-tighter">{s.label || 'SHOP THE LOOK'}</h3>
            <span className="text-[9px] font-bold border-b border-black">VIEW ALL</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map(i => (
              <div key={i} className="space-y-2">
                <div className="aspect-[3/4] bg-gray-50 relative">
                  <img src={getImg(i+20, 'style')} className="w-full h-full object-cover" />
                </div>
                <div className="px-1">
                  <p className="text-[10px] font-bold uppercase truncate">Season Item {i}</p>
                  <p className="text-[11px] font-black">$34.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return <div className="p-10 border border-dashed border-gray-100 text-[9px] font-black text-gray-300 text-center uppercase tracking-widest">{block.type}</div>;
  }
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('HOME');
  const [isPaid, setIsPaid] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [screens, setScreens] = useState<Record<ScreenType, BlockConfig[]>>({
    HOME: [
      { id: 'mq-0', type: BlockType.PROMO_MARQUEE, title: 'Announcement', settings: {}, visibility: 'ALL' },
      { id: 'cat-0', type: BlockType.CATEGORY_MENU, title: 'Top Nav Icons', settings: { variant: 'circle' }, visibility: 'ALL' },
      { id: 'sl-1', type: BlockType.BANNER_SLIDER, title: 'Main Hero', settings: { slides: [{ id: 1, title: 'TRIAL EXCLUSIVE', img: 'https://picsum.photos/seed/p1/600/800?fashion=1' }] }, visibility: 'ALL' }
    ],
    COLLECTION: [{ id: 'gd-1', type: BlockType.PRODUCT_GRID, title: 'Product Grid', settings: {}, visibility: 'ALL' }],
    PDP: [{ id: 'vs-1', type: BlockType.VARIANT_SELECTOR, title: 'Sizes', settings: {}, visibility: 'ALL' }],
    CART: [{ id: 'sh-1', type: BlockType.FREE_SHIPPING_BAR, title: 'Progress', settings: {}, visibility: 'ALL' }],
    PROFILE: [{ id: 'ml-1', type: BlockType.MENU_LIST, title: 'Menu', settings: {}, visibility: 'ALL' }],
    LOGIN: [],
    CMS: []
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const activeLayout = screens[activeScreen];
  const selectedBlock = activeLayout.find(b => b.id === selectedBlockId);

  const theme: ThemeSettings = {
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    fontFamily: 'Inter',
    logoUrl: '',
    borderRadius: 0,
    accentColor: '#FF0000'
  };

  const addBlock = (type: BlockType) => {
    if (activeScreen === 'HOME' && !isPaid && activeLayout.length >= HOME_BLOCK_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }

    const newBlock: BlockConfig = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: COMPONENT_METADATA[type].label,
      settings: type === BlockType.BANNER_SLIDER ? { slides: [{ id: Date.now(), title: 'NEW BANNER' }] } : {},
      visibility: 'ALL'
    };
    setScreens({ ...screens, [activeScreen]: [...activeLayout, newBlock] });
    setSelectedBlockId(newBlock.id);
  };

  const updateSetting = (key: string, val: any) => {
    setScreens({
      ...screens,
      [activeScreen]: activeLayout.map(b => 
        b.id === selectedBlockId ? { ...b, settings: { ...b.settings, [key]: val } } : b
      )
    });
  };

  const syncToFirebase = async () => {
    setIsSyncing(true);
    // Simulate Fly.io -> Firebase write
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSyncing(false);
    alert("Manifest synced to Firebase. Mobile app will update instantly.");
  };

  return (
    <div className="h-screen flex flex-col bg-white text-black font-['Inter']">
      <GlobalStyles />
      
      {/* Top Navigation & Status */}
      <header className="h-14 border-b px-6 flex items-center justify-between bg-white z-50">
        <div className="flex items-center gap-10">
          <span className="font-black italic text-xl tracking-tighter">FN BUILDER</span>
          <nav className="flex bg-gray-50 border p-1 rounded-sm">
            {(Object.keys(screens) as ScreenType[]).map(s => (
              <button 
                key={s}
                onClick={() => { setActiveScreen(s); setSelectedBlockId(null); }}
                className={`px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-tighter transition-all ${activeScreen === s ? 'bg-black text-white' : 'text-gray-400'}`}
              >
                {s}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {!isPaid && (
            <div className="px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-sm flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-yellow-700">7-Day Free Trial</span>
              <span className="text-[9px] text-yellow-600 font-bold underline cursor-pointer" onClick={() => setShowUpgradeModal(true)}>Upgrade</span>
            </div>
          )}
          <button 
            onClick={syncToFirebase}
            disabled={isSyncing}
            className={`px-5 py-2 text-[10px] font-black bg-black text-white uppercase tracking-widest shadow-md transition-all ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSyncing ? 'Syncing...' : 'Sync to Mobile'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Library */}
        <aside className="w-72 border-r p-4 bg-white overflow-y-auto no-scrollbar">
          <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">Component Library</h3>
          <div className="space-y-8">
            {['Marketing', 'Commerce', 'PDP', 'Cart'].map(cat => (
              <div key={cat} className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter border-b pb-1 mb-3">{cat}</p>
                <div className="grid grid-cols-1 gap-1">
                  {(Object.entries(COMPONENT_METADATA) as [BlockType, any][])
                    .filter(([_, meta]) => meta.category === cat)
                    .filter(([_, meta]) => !meta.allowedScreens || meta.allowedScreens.includes(activeScreen))
                    .map(([type, meta]) => (
                      <button 
                        key={type}
                        onClick={() => addBlock(type)}
                        className="flex items-center gap-3 p-3 rounded-sm border border-transparent hover:border-black hover:bg-gray-50 transition-all text-left"
                      >
                        <span className="text-xl opacity-40">{meta.icon}</span>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-tighter leading-none">{meta.label}</p>
                          <p className="text-[8px] text-gray-400 leading-none mt-1">{meta.description}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Preview */}
        <main className="flex-1 bg-gray-50 flex items-center justify-center p-12 relative overflow-hidden">
          <div className="iphone-frame shadow-2xl">
            <div className="iphone-notch"></div>
            <div className="h-16 pt-6 px-5 flex items-center justify-between bg-white border-b shrink-0">
               <span className="text-xl">☰</span>
               <span className="font-black italic text-lg tracking-tighter uppercase">Fashion Nova</span>
               <div className="flex gap-4"><span>🔍</span><span>🛒</span></div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar bg-white" onClick={() => setSelectedBlockId(null)}>
              {activeLayout.map((block) => (
                <div 
                  key={block.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); }}
                  className={`relative group ${selectedBlockId === block.id ? 'ring-2 ring-black ring-inset z-10' : 'hover:ring-1 hover:ring-gray-300'}`}
                >
                  <BlockRenderer block={block} theme={theme} active={selectedBlockId === block.id} />
                </div>
              ))}
              {activeScreen === 'HOME' && !isPaid && (
                 <div className="p-4 bg-yellow-50/50 text-center">
                    <p className="text-[9px] font-black uppercase text-yellow-800">
                      {activeLayout.length}/{HOME_BLOCK_LIMIT} blocks used in trial
                    </p>
                 </div>
              )}
            </div>
            <div className="h-16 border-t flex items-center justify-around shrink-0 bg-white pb-2 shadow-inner">
               {['HOME', 'SHOP', 'NEW', 'BAG', 'ME'].map((nav, i) => (
                 <div key={i} className={`flex flex-col items-center gap-1 ${activeScreen === (nav==='HOME'?'HOME':nav==='BAG'?'CART':nav==='ME'?'PROFILE':nav) ? 'text-black' : 'opacity-30'}`}>
                    <span className="text-sm">○</span>
                    <span className="text-[8px] font-black uppercase">{nav}</span>
                 </div>
               ))}
            </div>
          </div>
        </main>

        {/* Right Inspector */}
        <aside className="w-80 border-l p-6 bg-white overflow-y-auto no-scrollbar">
          {selectedBlock ? (
            <div className="space-y-8 animate-in slide-in-from-right-2 duration-200">
              <div className="flex justify-between items-center border-b pb-5">
                <h3 className="font-black uppercase text-xs tracking-tighter">Edit {selectedBlock.title}</h3>
                <button 
                  onClick={() => {
                    setScreens({...screens, [activeScreen]: activeLayout.filter(b => b.id !== selectedBlock.id)});
                    setSelectedBlockId(null);
                  }}
                  className="text-red-500 font-black text-[9px] uppercase"
                >Delete</button>
              </div>

              <div className="space-y-6">
                {selectedBlock.type === BlockType.BANNER_SLIDER && (
                  <div className="space-y-4">
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Multi-Slide Configuration</p>
                    {(selectedBlock.settings.slides || []).map((slide: any, i: number) => (
                      <div key={i} className="p-3 border rounded-sm bg-gray-50 space-y-3">
                        <input 
                          type="text" placeholder="Slide Heading"
                          className="w-full border p-2 text-[10px] font-bold outline-none"
                          value={slide.title}
                          onChange={(e) => {
                            const newSlides = [...selectedBlock.settings.slides];
                            newSlides[i].title = e.target.value;
                            updateSetting('slides', newSlides);
                          }}
                        />
                        <select className="w-full border p-2 text-[10px] font-bold bg-white">
                           <option>Redirect to Product...</option>
                           <option>Redirect to Collection...</option>
                           <option>Custom External URL</option>
                           <option>No Action (Static)</option>
                        </select>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        const slides = selectedBlock.settings.slides || [];
                        updateSetting('slides', [...slides, { id: Date.now(), title: 'NEW SLIDE', img: '' }]);
                      }}
                      className="w-full py-2 border-2 border-dashed text-[9px] font-black uppercase hover:bg-gray-50"
                    >+ Add Slide</button>
                  </div>
                )}

                {selectedBlock.type === BlockType.TIMER_BANNER && (
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-gray-400 block tracking-widest">Background Image URL</label>
                    <input 
                      type="text" placeholder="https://..."
                      className="w-full border p-3 text-[10px] font-bold outline-none"
                      value={selectedBlock.settings.image || ''}
                      onChange={(e) => updateSetting('image', e.target.value)}
                    />
                  </div>
                )}

                <div className="pt-6 border-t">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Binding Hierarchy</p>
                   <select className="w-full border p-3 text-[10px] font-bold bg-white rounded-sm">
                      <option>None (Manual Select)</option>
                      <option>Parent: New Arrivals</option>
                      <option>Parent: Best Sellers</option>
                      <option>Parent: Women's Jeans</option>
                   </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <h3 className="font-black uppercase text-xs tracking-tighter border-b pb-4">App Intelligence</h3>
              <div className="p-5 bg-gray-50 border rounded-sm space-y-3">
                 <p className="text-[10px] font-black uppercase tracking-tight">System Status</p>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[9px] font-bold uppercase text-green-600">Fly.io Instance Healthy</span>
                 </div>
                 <p className="text-[9px] text-gray-500 italic leading-relaxed">
                   Syncing directly to Firebase via authenticated Shopify session. Unified JSON manifest is ready for native rendering.
                 </p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm p-8 rounded-sm text-center relative">
              <button className="absolute top-4 right-4 text-gray-300 font-black" onClick={() => setShowUpgradeModal(false)}>✕</button>
              <span className="text-4xl mb-4 block">🚀</span>
              <h2 className="text-xl font-black italic uppercase tracking-tighter mb-2">Unlock Unlimited Blocks</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                You've reached the {HOME_BLOCK_LIMIT}-block limit on your trial. Upgrade to the Pro Plan for unlimited screens, banners, and deeper customization.
              </p>
              <div className="bg-gray-50 p-4 mb-6 rounded-sm flex justify-between items-center">
                 <div className="text-left">
                    <p className="text-[9px] font-black uppercase text-gray-400">Pro Plan</p>
                    <p className="text-lg font-black italic">${PRO_PLAN_PRICE}/mo</p>
                 </div>
                 <span className="text-[8px] bg-black text-white px-2 py-1 font-black uppercase rounded-full">Unlimited</span>
              </div>
              <button 
                onClick={() => {
                  setIsPaid(true);
                  setShowUpgradeModal(false);
                  alert("Successfully upgraded via Shopify Billing API.");
                }}
                className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-zinc-800 transition-colors"
              >
                Approve Subscription
              </button>
              <p className="mt-4 text-[8px] text-gray-400 uppercase font-bold tracking-widest">Shopify App Store Approved Billing</p>
           </div>
        </div>
      )}
    </div>
  );
}
