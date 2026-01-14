
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
 * ADVANCED SHOPIFY APP BUILDER - CONFIGURATION & BUILDER MODULES
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
    .active-block {
      outline: 2px solid black;
      outline-offset: -2px;
      z-index: 10;
    }
    .config-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #eee;
      padding: 24px;
      margin-bottom: 24px;
    }
    .upload-box {
      border: 2px dashed #ccc;
      border-radius: 8px;
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafafa;
      cursor: pointer;
      transition: all 0.2s;
    }
    .upload-box:hover { border-color: #f27a44; background: #fffcfb; }
    .color-input-group {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
    }
    .color-preview {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.1);
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
      return (
        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
          <img src={slides[0].img || getImg(0, 'fashion')} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex flex-col justify-end items-center pb-12 p-6">
            <h2 className="text-white text-3xl font-black italic uppercase text-center mb-4 tracking-tighter">
              {slides[0].title || 'COLLECTION'}
            </h2>
            <button className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest">
              {slides[0].cta || 'SHOP NOW'}
            </button>
          </div>
        </div>
      );
    case BlockType.PRODUCT_GRID:
      return (
        <div className="p-3 bg-white">
          <h3 className="font-black text-xs uppercase tracking-tighter mb-4">{s.label || 'MORE FOR YOU'}</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map(i => (
              <div key={i} className="space-y-2">
                <div className="aspect-[3/4] bg-gray-50"><img src={getImg(i+50, 'prod')} className="w-full h-full object-cover" /></div>
                <div className="px-1">
                  <p className="text-[10px] font-bold uppercase truncate">Nova Essentials</p>
                  <p className="text-[11px] font-black">$29.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return <div className="p-4 text-[9px] border border-dashed border-gray-200 text-center uppercase">{block.type}</div>;
  }
};

export default function App() {
  const [view, setView] = useState<'BUILDER' | 'CONFIG'>('BUILDER');
  const [configTab, setConfigTab] = useState('Logo & Colors');
  const [activeScreen, setActiveScreen] = useState<ScreenType>('HOME');
  const [isPaid, setIsPaid] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // App Config States
  const [logoType, setLogoType] = useState('Square');
  const [theme, setTheme] = useState<ThemeSettings>({
    primaryColor: '#FF1F46',
    secondaryColor: '#FF4F68',
    fontFamily: 'RUBIK',
    logoUrl: '',
    borderRadius: 8,
    accentColor: '#00233D'
  });

  const [screens, setScreens] = useState<Record<ScreenType, BlockConfig[]>>({
    HOME: [
      { id: 'mq-0', type: BlockType.PROMO_MARQUEE, title: 'Announcement', settings: {}, visibility: 'ALL' },
      { id: 'sl-1', type: BlockType.BANNER_SLIDER, title: 'Hero Slider', settings: { slides: [{ id: 1, title: 'NEW DROPS', img: '', cta: 'SHOP NOW', targetType: 'COLLECTION' }] }, visibility: 'ALL' },
      { id: 'inf-1', type: BlockType.PRODUCT_GRID, title: 'Infinite Scroll', settings: { infinite: true, enabled: true, label: 'BOTTOM FEED' }, visibility: 'ALL' }
    ],
    COLLECTION: [], PDP: [], CART: [], PROFILE: [], LOGIN: [], CMS: []
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const activeLayout = screens[activeScreen];
  const selectedBlock = activeLayout.find(b => b.id === selectedBlockId);

  const addBlock = (type: BlockType, customSettings?: Record<string, any>) => {
    const newBlock: BlockConfig = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: COMPONENT_METADATA[type].label,
      settings: customSettings || {},
      visibility: 'ALL'
    };
    setScreens({ ...screens, [activeScreen]: [...activeLayout, newBlock] });
    setSelectedBlockId(newBlock.id);
  };

  return (
    <div className="h-screen flex flex-col bg-[#fbfbfb] text-slate-900 font-['Inter']">
      <GlobalStyles />
      
      {/* Top Main Navigation */}
      <header className="h-[60px] bg-white border-b px-6 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-8">
          <div className="font-bold text-lg text-slate-800 tracking-tight">OneMobile Builder</div>
          <nav className="flex items-center gap-6">
            <button onClick={() => setView('BUILDER')} className={`text-[13px] font-medium transition-colors ${view === 'BUILDER' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-800'}`}>Application Builder</button>
            <div className="relative group">
              <button onClick={() => setView('CONFIG')} className={`text-[13px] font-medium flex items-center gap-1 transition-colors ${view === 'CONFIG' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-800'}`}>
                Configuration <span className="text-[10px]">▼</span>
              </button>
              {/* Dropdown simulation */}
              <div className="absolute top-full left-0 bg-white border shadow-xl rounded-md w-56 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                {['Logo & Colors', 'Navigation Menu', 'Product Listing Layout', 'General Settings', 'Cart Discounts', 'Support', 'CMS Pages'].map(item => (
                  <button key={item} onClick={() => { setView('CONFIG'); setConfigTab(item); }} className="w-full text-left px-4 py-2 text-[12px] hover:bg-orange-50 hover:text-orange-600 font-medium">{item}</button>
                ))}
              </div>
            </div>
            {['Collection', 'Store Management', 'Notification', 'Language Translator', 'Multi Currency', 'SMTP'].map(item => (
              <button key={item} className="text-[13px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1">{item} <span className="text-[10px]">▼</span></button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-5 py-2 bg-orange-500 text-white rounded-md text-sm font-semibold hover:bg-orange-600 shadow-sm transition-all">Save</button>
        </div>
      </header>

      {view === 'CONFIG' ? (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{configTab}</h1>
            
            {configTab === 'Logo & Colors' && (
              <div className="config-card">
                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div>
                    <label className="text-sm font-semibold mb-3 block">Logo Type<span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-6 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={logoType === 'Square'} onChange={() => setLogoType('Square')} className="w-4 h-4 accent-orange-500" />
                        <span className="text-sm">Square</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={logoType === 'Rectangle'} onChange={() => setLogoType('Rectangle')} className="w-4 h-4 accent-orange-500" />
                        <span className="text-sm">Rectangle</span>
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Recommended Square Logo Dimension: 500px X 500px<br/>
                      Recommended Rectangle Logo Dimension: 1200px X 500px
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div>
                    <label className="text-sm font-semibold mb-3 block">Choose Logo<span className="text-red-500">*</span></label>
                    <div className="upload-box">
                      <div className="text-center">
                        <div className="text-3xl mb-2">📸</div>
                        <p className="text-xs font-semibold text-slate-500">Tap to upload Logo</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-3 block">Splash Screen<span className="text-red-500">*</span></label>
                    <div className="upload-box">
                      <div className="text-center">
                        <div className="text-3xl mb-2">📸</div>
                        <p className="text-xs font-semibold text-slate-500">Tap to upload Splash Image</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-8">
                  <h2 className="text-lg font-bold mb-6">Color Settings</h2>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    {[
                      { label: 'Slider', val: '#FF1F46' },
                      { label: 'Product Title', val: '#00233D' },
                      { label: 'Price', val: '#FF4F68' },
                      { label: 'Compare Price', val: '#666666' },
                      { label: 'Button BG', val: '#FF4F68' },
                      { label: 'Button Text', val: '#FFFFFF' }
                    ].map(col => (
                      <div key={col.label}>
                        <label className="text-sm font-medium text-slate-600 mb-2 block">{col.label}<span className="text-red-500">*</span></label>
                        <div className="color-input-group">
                          {col.val.startsWith('#') && col.val !== '#FFFFFF' && <div className="color-preview" style={{ background: col.val }}></div>}
                          <input type="text" defaultValue={col.val} className="flex-1 text-sm outline-none bg-transparent font-mono" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {configTab === 'General Settings' && (
              <div className="config-card">
                <div className="space-y-8">
                  <div className="grid grid-cols-4 items-center gap-6">
                    <label className="text-sm font-medium text-slate-600">Primary Language</label>
                    <div className="col-span-3">
                      <select className="w-full border rounded-md p-3 text-sm bg-white outline-none focus:border-orange-500">
                        <option>🇬🇧 ENGLISH</option>
                        <option>🇫🇷 FRENCH</option>
                        <option>🇪🇸 SPANISH</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-6">
                    <label className="text-sm font-medium text-slate-600">Font</label>
                    <div className="col-span-3">
                      <select className="w-full border rounded-md p-3 text-sm bg-white outline-none focus:border-orange-500">
                        <option>RUBIK</option>
                        <option>INTER</option>
                        <option>POPPINS</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-6">
                    <label className="text-sm font-medium text-slate-600">User Accounts</label>
                    <div className="col-span-3 flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="acc" className="w-4 h-4 accent-orange-500" /> <span className="text-sm">Optional</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="acc" defaultChecked className="w-4 h-4 accent-orange-500" /> <span className="text-sm">Required</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-6">
                    <label className="text-sm font-medium text-slate-600">Direction</label>
                    <div className="col-span-3 flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="dir" defaultChecked className="w-4 h-4 accent-orange-500" /> <span className="text-sm">LTR (Left to Right)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="dir" className="w-4 h-4 accent-orange-500" /> <span className="text-sm">RTL (Right to Left)</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-6">
                    <label className="text-sm font-medium text-slate-600">Product Title Length</label>
                    <div className="col-span-3 flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="len" className="w-4 h-4 accent-orange-500" /> <span className="text-sm">Single Line</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="len" defaultChecked className="w-4 h-4 accent-orange-500" /> <span className="text-sm">Double Line</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-6">
                    <label className="text-sm font-medium text-slate-600">Show Search</label>
                    <div className="col-span-3">
                      <button className="w-12 h-6 rounded-full bg-orange-500 relative transition-all">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-8">
              <button className="px-10 py-3 bg-orange-500 text-white rounded-md font-bold shadow-lg hover:bg-orange-600">Save</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Builder Sidebar */}
          <aside className="w-[300px] bg-white border-r flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Component Library</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {['Marketing', 'Commerce', 'PDP'].map(cat => (
                <div key={cat}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 border-b pb-1">{cat}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {(Object.entries(COMPONENT_METADATA) as [BlockType, any][])
                      .filter(([_, meta]) => meta.category === cat)
                      .map(([type, meta]) => (
                        <button key={type} onClick={() => addBlock(type)} className="flex items-center gap-3 p-3 rounded-lg border hover:border-orange-500 hover:bg-orange-50 transition-all text-left">
                          <span className="text-xl">{meta.icon}</span>
                          <div>
                            <p className="text-[12px] font-bold text-slate-700">{meta.label}</p>
                            <p className="text-[10px] text-slate-400 truncate w-40">{meta.description}</p>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Builder Canvas */}
          <main className="flex-1 bg-slate-50 flex items-center justify-center p-8 relative">
            <div className="iphone-frame">
              <div className="iphone-notch"></div>
              <div className="h-[70px] pt-6 px-5 flex items-center justify-between bg-white border-b">
                 <span className="text-xl">☰</span>
                 <span className="font-black italic text-lg tracking-tighter uppercase">Fashion Nova</span>
                 <div className="flex gap-4"><span>🔍</span><span>🛒</span></div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
                {activeLayout.map((block) => (
                  <div key={block.id} onClick={() => setSelectedBlockId(block.id)} className={`relative group ${selectedBlockId === block.id ? 'active-block' : 'hover:ring-1 hover:ring-gray-300'}`}>
                    <BlockRenderer block={block} theme={theme} active={selectedBlockId === block.id} />
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Builder Inspector */}
          <aside className="w-[340px] bg-white border-l p-6">
            {selectedBlock ? (
              <div className="space-y-6">
                <h3 className="text-lg font-bold border-b pb-4">Edit {selectedBlock.title}</h3>
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">Configure your block settings below to update the mobile app in real-time.</p>
                  {/* ... specific block settings ... */}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <span className="text-5xl mb-4">✨</span>
                <p className="text-sm font-medium">Select a block to edit</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
