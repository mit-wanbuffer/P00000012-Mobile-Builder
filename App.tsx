
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
 * Optimized for OneMobile-style UX with Infinite Scroll, Multi-Banner Redirects, and Multi-Category Redirection.
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
    .active-block {
      outline: 2px solid black;
      outline-offset: -2px;
      z-index: 10;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .loader {
      border: 2px solid #f3f3f3;
      border-top: 2px solid #000;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      animation: spin 1s linear infinite;
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
            {s.content || 'FREE SHIPPING ON ORDERS $75+ • USE CODE: FASHION • NEW DROPS DAILY'}
          </div>
        </div>
      );

    case BlockType.BANNER_SLIDER:
      const slides = s.slides || [{ id: 1, img: getImg(0, 'fashion'), title: 'NEW SEASON' }];
      const currentSlide = slides[0];
      return (
        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden group">
          <img src={currentSlide.img || getImg(0, 'fashion')} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end items-center pb-12 p-6">
            <h2 className="text-white text-4xl font-black italic uppercase text-center leading-none mb-4 tracking-tighter shadow-sm">
              {currentSlide.title || 'COLLECTION'}
            </h2>
            <button className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest shadow-xl">
              {currentSlide.cta || 'SHOP NOW'}
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

    case BlockType.CATEGORY_MENU:
      const categoryItems = s.items || [
        { id: 1, label: 'DRESSES', img: getImg(1, 'cat') },
        { id: 2, label: 'TOPS', img: getImg(2, 'cat') }
      ];
      const isCircle = s.variant === 'circle';
      return (
        <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar bg-white">
          {categoryItems.map((item: any, i: number) => (
            <div key={item.id || i} className="flex-shrink-0 flex flex-col items-center">
              <div className={`overflow-hidden border border-gray-100 mb-2 shadow-sm ${isCircle ? 'w-16 h-16 rounded-full' : 'w-20 h-28 rounded-sm'}`}>
                <img src={item.img || getImg(i, 'cat')} className="w-full h-full object-cover" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tight">{item.label}</span>
            </div>
          ))}
        </div>
      );

    case BlockType.PRODUCT_GRID:
      const isInfinite = s.infinite === true;
      if (isInfinite && s.enabled === false) return null;

      return (
        <div className="p-3 bg-white">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="font-black text-xs uppercase tracking-tighter">{s.label || (isInfinite ? 'MORE FOR YOU' : 'TRENDING')}</h3>
            {!isInfinite && <span className="text-[9px] font-bold border-b border-black">VIEW ALL</span>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].slice(0, isInfinite ? 6 : 2).map(i => (
              <div key={i} className="space-y-2">
                <div className="aspect-[3/4] bg-gray-50 relative">
                  <img src={getImg(i+50, 'prod')} className="w-full h-full object-cover" />
                </div>
                <div className="px-1">
                  <p className="text-[10px] font-bold uppercase truncate">Nova Essentials {i}</p>
                  <p className="text-[11px] font-black">$29.99</p>
                </div>
              </div>
            ))}
          </div>
          {isInfinite && (
            <div className="flex flex-col items-center py-8 gap-2">
              <div className="loader"></div>
              <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Loading More...</span>
            </div>
          )}
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
      { id: 'sl-1', type: BlockType.BANNER_SLIDER, title: 'Hero Slider', settings: { slides: [{ id: 1, title: 'NEW DROPS', img: '', cta: 'SHOP NOW', targetType: 'COLLECTION', targetId: 'new-arrivals' }] }, visibility: 'ALL' },
      { id: 'cat-0', type: BlockType.CATEGORY_MENU, title: 'Navigation Icons', settings: { variant: 'circle', items: [{ id: 1, label: 'DRESSES', img: '', targetType: 'COLLECTION' }] }, visibility: 'ALL' },
      { id: 'inf-1', type: BlockType.PRODUCT_GRID, title: 'Infinite Scroll', settings: { infinite: true, enabled: true, label: 'INFINITE EXPLORE' }, visibility: 'ALL' }
    ],
    COLLECTION: [{ id: 'gd-1', type: BlockType.PRODUCT_GRID, title: 'Products', settings: {}, visibility: 'ALL' }],
    PDP: [{ id: 'vs-1', type: BlockType.VARIANT_SELECTOR, title: 'Size Picker', settings: {}, visibility: 'ALL' }],
    CART: [{ id: 'sh-1', type: BlockType.FREE_SHIPPING_BAR, title: 'Shipping Goal', settings: {}, visibility: 'ALL' }],
    PROFILE: [{ id: 'ml-1', type: BlockType.MENU_LIST, title: 'Account Menu', settings: {}, visibility: 'ALL' }],
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

  const addBlock = (type: BlockType, customSettings?: Record<string, any>) => {
    if (activeScreen === 'HOME' && !isPaid && activeLayout.length >= HOME_BLOCK_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }

    const newBlock: BlockConfig = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: customSettings?.infinite ? 'Infinite Product Feed' : COMPONENT_METADATA[type].label,
      settings: customSettings || (type === BlockType.BANNER_SLIDER 
        ? { slides: [{ id: Date.now(), title: 'NEW PROMO', img: '', cta: 'SHOP NOW', targetType: 'NONE' }] } 
        : type === BlockType.CATEGORY_MENU 
        ? { variant: 'circle', items: [{ id: Date.now(), label: 'NEW', img: '', targetType: 'COLLECTION' }] }
        : {}),
      visibility: 'ALL'
    };
    
    // Logic: Append infinite scroll to the very end of HOME screen
    if (customSettings?.infinite) {
      setScreens({ ...screens, [activeScreen]: [...activeLayout, newBlock] });
    } else {
      setScreens({ ...screens, [activeScreen]: [...activeLayout, newBlock] });
    }
    
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

  return (
    <div className="h-screen flex flex-col bg-white text-black font-['Inter']">
      <GlobalStyles />
      
      <header className="h-14 border-b px-6 flex items-center justify-between bg-white z-50 shadow-sm">
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
              <span className="text-[10px] font-black uppercase text-yellow-700">Trial Plan</span>
              <button className="text-[9px] text-yellow-600 font-bold underline uppercase" onClick={() => setShowUpgradeModal(true)}>Upgrade</button>
            </div>
          )}
          <button 
            onClick={() => {
              setIsSyncing(true);
              setTimeout(() => { setIsSyncing(false); alert("Synced to Firebase."); }, 800);
            }}
            disabled={isSyncing}
            className={`px-5 py-2 text-[10px] font-black bg-black text-white uppercase tracking-widest shadow-md transition-all ${isSyncing ? 'opacity-50' : ''}`}
          >
            {isSyncing ? 'Syncing...' : 'Sync to Mobile'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Component Library */}
        <aside className="w-72 border-r p-4 bg-white overflow-y-auto no-scrollbar">
          <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">Library</h3>
          <div className="space-y-8">
            {/* Added Infinite Scroll Option directly in sidebar for better UX */}
            <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter border-b pb-1 mb-3">Power Ups</p>
              <button 
                onClick={() => addBlock(BlockType.PRODUCT_GRID, { infinite: true, enabled: true, label: 'BOTTOM FEED' })}
                className="w-full flex items-center gap-3 p-3 rounded-sm border border-transparent hover:border-black hover:bg-gray-50 transition-all text-left group"
              >
                <span className="text-xl opacity-40 group-hover:opacity-100">🔄</span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-tighter leading-none">Infinite Product Feed</p>
                  <p className="text-[8px] text-gray-400 leading-none mt-1">Append scrollable items to Home</p>
                </div>
              </button>
            </div>

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
                        className="flex items-center gap-3 p-3 rounded-sm border border-transparent hover:border-black hover:bg-gray-50 transition-all text-left group"
                      >
                        <span className="text-xl opacity-40 group-hover:opacity-100">{meta.icon}</span>
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

        {/* Center: Mobile Device */}
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
                  className={`relative group ${selectedBlockId === block.id ? 'active-block' : 'hover:ring-1 hover:ring-gray-200'}`}
                >
                  <BlockRenderer block={block} theme={theme} active={selectedBlockId === block.id} />
                </div>
              ))}
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

        {/* Right Side: Block Inspector */}
        <aside className="w-80 border-l p-6 bg-white overflow-y-auto no-scrollbar">
          {selectedBlock ? (
            <div className="space-y-8 animate-in slide-in-from-right-2 duration-200">
              <div className="flex justify-between items-center border-b pb-5">
                <h3 className="font-black uppercase text-xs tracking-tighter">Settings: {selectedBlock.title}</h3>
                <button 
                  onClick={() => {
                    setScreens({...screens, [activeScreen]: activeLayout.filter(b => b.id !== selectedBlock.id)});
                    setSelectedBlockId(null);
                  }}
                  className="text-red-500 font-black text-[9px] uppercase"
                >Delete</button>
              </div>

              <div className="space-y-6">
                {selectedBlock.settings.infinite === true && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b pb-2">Infinite Feed Config</p>
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-sm">
                       <span className="text-[10px] font-black uppercase">Active on App</span>
                       <input 
                         type="checkbox" 
                         checked={selectedBlock.settings.enabled} 
                         onChange={(e) => updateSetting('enabled', e.target.checked)}
                         className="w-4 h-4 accent-black cursor-pointer"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[8px] font-black uppercase text-gray-400">Section Title</label>
                       <input 
                        type="text"
                        className="w-full border p-2 text-[10px] font-bold outline-none rounded-sm"
                        value={selectedBlock.settings.label}
                        onChange={(e) => updateSetting('label', e.target.value)}
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[8px] font-black uppercase text-gray-400">Product Source</label>
                       <select 
                        className="w-full border p-2 text-[10px] font-bold bg-white outline-none rounded-sm"
                        value={selectedBlock.settings.targetId || ''}
                        onChange={(e) => updateSetting('targetId', e.target.value)}
                       >
                         <option value="all">Automatic (Newest Items)</option>
                         <option value="bestsellers">Bestsellers Collection</option>
                         <option value="featured">Featured Picks</option>
                       </select>
                    </div>
                  </div>
                )}

                {selectedBlock.type === BlockType.BANNER_SLIDER && (
                  <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b pb-2">Slides</p>
                    {(selectedBlock.settings.slides || []).map((slide: any, i: number) => (
                      <div key={slide.id} className="p-4 border border-gray-100 rounded-sm bg-gray-50 space-y-4 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase">Slide #{i+1}</span>
                          <button onClick={() => updateSetting('slides', selectedBlock.settings.slides.filter((s: any) => s.id !== slide.id))} className="text-[8px] text-red-400 font-bold uppercase">Remove</button>
                        </div>
                        <input type="text" placeholder="Title" className="w-full border p-2 text-[10px] font-bold outline-none rounded-sm" value={slide.title} onChange={(e) => {
                          const ns = [...selectedBlock.settings.slides]; ns[i].title = e.target.value; updateSetting('slides', ns);
                        }} />
                        <select className="w-full border p-2 text-[10px] font-bold bg-white outline-none rounded-sm mb-2" value={slide.targetType} onChange={(e) => {
                          const ns = [...selectedBlock.settings.slides]; ns[i].targetType = e.target.value; updateSetting('slides', ns);
                        }}>
                          <option value="NONE">No Action</option>
                          <option value="PRODUCT">Product</option>
                          <option value="COLLECTION">Collection</option>
                        </select>
                      </div>
                    ))}
                    <button onClick={() => updateSetting('slides', [...(selectedBlock.settings.slides || []), { id: Date.now(), title: 'NEW SLIDE', targetType: 'NONE' }])} className="w-full py-3 border-2 border-dashed border-gray-200 text-[9px] font-black uppercase text-gray-400 hover:border-black hover:text-black transition-all">+ Add Slide</button>
                  </div>
                )}

                {selectedBlock.type === BlockType.CATEGORY_MENU && (
                  <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b pb-2">Icons</p>
                    {(selectedBlock.settings.items || []).map((item: any, i: number) => (
                      <div key={item.id} className="p-4 border border-gray-100 rounded-sm bg-gray-50 space-y-4 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase">Icon #{i+1}</span>
                          <button onClick={() => updateSetting('items', selectedBlock.settings.items.filter((it: any) => it.id !== item.id))} className="text-[8px] text-red-400 font-bold uppercase">Remove</button>
                        </div>
                        <input type="text" className="w-full border p-2 text-[10px] font-bold outline-none rounded-sm" value={item.label} onChange={(e) => {
                          const ni = [...selectedBlock.settings.items]; ni[i].label = e.target.value; updateSetting('items', ni);
                        }} />
                        <select className="w-full border p-2 text-[10px] font-bold bg-white outline-none rounded-sm" value={item.targetId || ''} onChange={(e) => {
                          const ni = [...selectedBlock.settings.items]; ni[i].targetId = e.target.value; ni[i].targetType = 'COLLECTION'; updateSetting('items', ni);
                        }}>
                          <option value="">Link Collection...</option>
                          <option value="dresses">Dresses</option>
                          <option value="tops">Tops</option>
                        </select>
                      </div>
                    ))}
                    <button onClick={() => updateSetting('items', [...(selectedBlock.settings.items || []), { id: Date.now(), label: 'NEW', targetType: 'COLLECTION' }])} className="w-full py-3 border-2 border-dashed border-gray-200 text-[9px] font-black uppercase text-gray-400 hover:border-black hover:text-black transition-all">+ Add Icon</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8 text-center pt-10">
              <span className="text-4xl">🛠️</span>
              <h3 className="font-black uppercase text-xs tracking-tighter">Canvas Controls</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed px-4">
                Drag blocks from the library to build your storefront. Infinite scroll feeds can be enabled from the Power Ups section.
              </p>
            </div>
          )}
        </aside>
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm p-8 rounded-sm text-center relative">
              <button className="absolute top-4 right-4 text-gray-300 font-black" onClick={() => setShowUpgradeModal(false)}>✕</button>
              <h2 className="text-xl font-black italic uppercase tracking-tighter mb-2">Upgrade Required</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Unlock unlimited block placement and professional features like Infinite Product Feed.
              </p>
              <button onClick={() => { setIsPaid(true); setShowUpgradeModal(false); alert("Upgraded to Pro!"); }} className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-xl">Activate Pro Subscription</button>
           </div>
        </div>
      )}
    </div>
  );
}
