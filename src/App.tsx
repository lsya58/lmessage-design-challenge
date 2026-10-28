import React, { useState, useEffect } from 'react';
import { AlertTriangle, Smartphone, Layers, Sparkles, X, Upload, RotateCcw, Eye, EyeOff, Image as ImageIcon, Edit2 } from 'lucide-react';

interface MenuArea { id: number; label: string; actionType: 'text' | 'url' | 'template'; payload: string; showUserBubble: boolean; replyMessage: string; }
interface ChatLog { sender: 'user' | 'bot'; text: string; type?: 'text' | 'template' | 'url'; }

export default function App() {
  const [currentView, setCurrentView] = useState<'empty' | 'editor'>('empty');
  const [selectedAreaId, setSelectedAreaId] = useState<number>(1);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState<boolean>(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  
  // 選択肢をよく使われる実用的なレイアウトに絞る
  const [layoutType, setLayoutType] = useState<'6' | '4' | '3' | '2'>('6');

  const [areas, setAreas] = useState<MenuArea[]>([
    { id: 1, label: 'WEB予約', actionType: 'url', payload: 'https://example.com/reserve', showUserBubble: false, replyMessage: '' },
    { id: 2, label: 'メニュー・料金', actionType: 'template', payload: 'カット：4,500円〜\nカラー：6,000円〜', showUserBubble: true, replyMessage: 'サロンのメニューと料金一覧です✨' },
    { id: 3, label: 'アクセス・店舗情報', actionType: 'text', payload: '営業時間：10:00〜20:00\n定休日：毎週火曜日', showUserBubble: false, replyMessage: '店舗情報をお送りします！' },
    { id: 4, label: 'スタイリスト紹介', actionType: 'text', payload: '自己紹介を見る', showUserBubble: true, replyMessage: '当店自慢のスタイリストをご紹介します✂️' },
    { id: 5, label: 'クーポン', actionType: 'url', payload: 'https://example.com/coupon', showUserBubble: false, replyMessage: '' },
    { id: 6, label: '未設定エリア', actionType: 'text', payload: '', showUserBubble: false, replyMessage: '' },
  ]);

  const [chatLogs, setChatLogs] = useState<ChatLog[]>([{ sender: 'bot', text: '友だち追加ありがとうございます！ヘアサロンALICEです✂️', type: 'text' }]);

  const activeAreas = areas.slice(0, parseInt(layoutType));
  const selectedArea = activeAreas.find(a => a.id === selectedAreaId) || activeAreas[0];

  useEffect(() => {
    if (selectedAreaId > parseInt(layoutType)) setSelectedAreaId(1);
  }, [layoutType, selectedAreaId]);

  const updateSelectedArea = (fields: Partial<MenuArea>) => {
    setAreas(prev => prev.map(area => area.id === selectedAreaId ? { ...area, ...fields } : area));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setBgImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateClick = (area: MenuArea) => {
    const newLogs: ChatLog[] = [];
    if (area.showUserBubble && area.payload) newLogs.push({ sender: 'user', text: `【${area.label}】`, type: 'text' });
    if (area.actionType === 'url') newLogs.push({ sender: 'bot', text: `🔗 リンクを開きます: ${area.payload}`, type: 'url' });
    else if (area.replyMessage) {
      newLogs.push({ sender: 'bot', text: area.replyMessage, type: 'text' });
      if (area.payload) newLogs.push({ sender: 'bot', text: area.payload, type: area.actionType });
    } else if (area.payload) newLogs.push({ sender: 'bot', text: area.payload, type: area.actionType });
    if (newLogs.length > 0) setChatLogs(prev => [...prev, ...newLogs]);
  };

  const actionLabels = { text: 'テキスト', template: 'テンプレート', url: 'URL遷移' };

  // ★修正：レイアウトに応じたCSS Gridのクラス生成（自然な配置にする）
  const renderGridArea = (area: MenuArea, index: number, isSimulator: boolean = false) => {
    const isSelected = area.id === selectedAreaId;
    const isError = area.payload === '';
    
    // 3分割の場合はエリア1を横幅いっぱいにする
    let spanClass = '';
    if (layoutType === '3' && index === 0) spanClass = 'col-span-2';
    // 2分割の場合はハーフサイズにするため高さを減らす（外枠で制御）

    if (isSimulator) {
      return (
        <button
          key={area.id}
          onClick={() => handleSimulateClick(area)}
          className={`w-full h-full border border-black/5 transition-colors ${spanClass} ${bgImage ? 'hover:bg-black/10' : 'bg-white hover:bg-[#f4fbf2]'}`}
        >
          {!bgImage && <p className="text-[11px] font-medium text-[#222222] truncate px-1">{area.label}</p>}
        </button>
      );
    }

    const bgStyle = bgImage 
      ? (isSelected ? 'bg-white/60 border-[#08bf5a]' : 'bg-white/10 hover:bg-white/30 border-white/30') 
      : (isSelected ? 'bg-white border-[#08bf5a]' : 'bg-white/80 hover:bg-white border-transparent');

    return (
      <div
        key={area.id}
        onClick={() => setSelectedAreaId(area.id)}
        className={`p-3 flex flex-col justify-between cursor-pointer transition-all border-2 backdrop-blur-[1px] m-0.5 rounded-lg ${spanClass} ${bgStyle}`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded shadow-sm ${isSelected ? 'bg-[#08bf5a] text-white' : 'bg-[#222222] text-white'}`}>
            エリア {area.id}
          </span>
          {isError && <span className="text-[11px] text-[#f44336] flex items-center gap-1 font-bold bg-white px-1.5 py-0.5 rounded shadow-sm"><AlertTriangle size={12} /> 未設定</span>}
        </div>
        <div className={`text-center py-2 ${bgImage && !isSelected ? 'opacity-0 hover:opacity-100' : 'opacity-100'} transition-opacity`}>
          <p className={`text-[13px] font-bold ${bgImage ? 'text-black drop-shadow-md bg-white/70 inline-block px-2 rounded' : 'text-[#222222]'}`}>{area.label}</p>
        </div>
        <div className={`flex items-center justify-between text-[10px] font-medium mt-auto ${bgImage && !isSelected ? 'opacity-0 hover:opacity-100' : 'opacity-100'} transition-opacity`}>
          <span className="bg-white/90 text-[#555] px-1.5 py-0.5 rounded shadow-sm border border-[#e0e0e0]">{actionLabels[area.actionType]}</span>
          {area.showUserBubble ? <span className="text-[#fea600] flex items-center gap-0.5 bg-white/90 px-1.5 py-0.5 rounded shadow-sm border border-[#e0e0e0]"><Eye size={10} />有</span> : <span className="text-[#888888] flex items-center gap-0.5 bg-white/90 px-1.5 py-0.5 rounded shadow-sm border border-[#e0e0e0]"><EyeOff size={10} />無</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#222222] flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-[#e0e0e0] px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#08bf5a] flex items-center justify-center text-white font-bold text-lg">L</div>
          <span className="text-[16px] font-medium tracking-wide">L Message エディタ</span>
          <span className="text-[12px] bg-[#f4fbf2] text-[#23814d] px-2 py-0.5 rounded border border-[#08bf5a]/30 font-medium">新仕様：インタラクティブエディタ</span>
        </div>
        <div className="flex items-center gap-3">
          {currentView === 'editor' && (
            <>
              <button onClick={() => setCurrentView('empty')} className="text-[14px] text-[#888888] hover:text-[#222222] px-3 py-1.5 transition-colors">初期化（空状態を見る）</button>
              <button onClick={() => setShowDiagnosticModal(true)} className="text-[14px] font-medium bg-[#fea600]/10 text-[#fea600] border border-[#fea600]/40 px-4 py-2 rounded-lg hover:bg-[#fea600]/20 flex items-center gap-2 transition-all"><AlertTriangle size={16} /> 公開前チェック</button>
              <button onClick={() => setShowDiagnosticModal(true)} className="text-[14px] font-medium bg-[#08bf5a] text-white px-5 py-2 rounded-lg hover:bg-[#23814d] shadow-sm flex items-center gap-1.5 transition-all"><Sparkles size={16} /> 公開する</button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-6">
        {currentView === 'empty' && (
          <div className="bg-white rounded-2xl border border-[#e0e0e0] p-12 text-center max-w-2xl mx-auto mt-12 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#f4fbf2] text-[#08bf5a] flex items-center justify-center mx-auto mb-6"><Layers size={40} /></div>
            <h1 className="text-[24px] font-medium mb-3">リッチメニューが未作成です</h1>
            <p className="text-[14px] text-[#888888] leading-[22px] mb-8">画像を作成・アップロードして、友だちのアクションを設定しましょう。<br />美容室用のプリセットテンプレートからすぐに開始することも可能です。</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setCurrentView('editor')} className="text-[14px] font-medium bg-[#08bf5a] text-white px-6 py-3 rounded-lg hover:bg-[#23814d] transition-all shadow-sm flex items-center gap-2"><Sparkles size={18} /> エディタを起動して作成</button>
            </div>
          </div>
        )}

        {currentView === 'editor' && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7 space-y-6">
              <div className="bg-white rounded-xl border border-[#e0e0e0] p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-[16px] font-medium leading-[24px]">メニュー領域の分割・画像設定</h2>
                    <p className="text-[12px] text-[#888888] mt-0.5">Canva等で作った画像を配置してズレを確認できます</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[12px] font-medium bg-white text-[#222222] border border-[#e0e0e0] px-3 py-1.5 rounded cursor-pointer hover:bg-[#f8f8f8] flex items-center gap-1.5 transition-colors">
                      <Upload size={14} /> 画像をアップロード
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <select
                      value={layoutType}
                      onChange={(e) => setLayoutType(e.target.value as any)}
                      className="text-[12px] font-medium bg-[#f8f8f8] text-[#222222] border border-[#e0e0e0] px-2.5 py-1.5 rounded cursor-pointer focus:outline-none focus:border-[#08bf5a]"
                    >
                      <option value="6">6分割テンプレート（大）</option>
                      <option value="4">4分割テンプレート（大）</option>
                      <option value="3">3分割テンプレート（上1下2）</option>
                      <option value="2">2分割テンプレート（ハーフ）</option>
                    </select>
                  </div>
                </div>

                <div 
                  className={`grid ${layoutType === '6' ? 'grid-cols-3' : 'grid-cols-2'} bg-[#f0f0f0] rounded-xl border border-[#e0e0e0] overflow-hidden relative ${layoutType === '2' ? 'aspect-[24/8]' : 'aspect-[12/8]'}`}
                  style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {activeAreas.map((area, idx) => renderGridArea(area, idx, false))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#e0e0e0] p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0] mb-5">
                  <h3 className="text-[16px] font-medium text-[#222222] flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#08bf5a] text-white text-[12px] flex items-center justify-center font-bold">{selectedArea.id}</span>
                    エリア {selectedArea.id} の設定
                  </h3>
                  <button onClick={() => handleSimulateClick(selectedArea)} className="text-[12px] text-[#5799DB] hover:underline flex items-center gap-1 font-medium">このエリアの動作をテスト</button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[14px] font-medium text-[#222222] mb-2 flex items-center gap-1.5">
                      <Edit2 size={14} className="text-[#888888]"/> エリア管理名（ユーザーには見えません）
                    </label>
                    <input type="text" value={selectedArea.label} onChange={(e) => updateSelectedArea({ label: e.target.value })} className="w-full text-[14px] p-2.5 rounded-lg border border-[#e0e0e0] focus:border-[#08bf5a] focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-[#222222] mb-2">アクション種別</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['text', 'template', 'url'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => updateSelectedArea({ actionType: type })}
                          className={`py-2 text-[14px] rounded-lg border font-medium transition-all ${selectedArea.actionType === type ? 'border-[#08bf5a] bg-[#f4fbf2] text-[#23814d]' : 'border-[#e0e0e0] bg-white text-[#222222] hover:bg-[#f8f8f8]'}`}
                        >
                          {type === 'text' && 'テキスト送信'}
                          {type === 'template' && 'テンプレート'}
                          {type === 'url' && 'リンクURL'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-[#222222] mb-1">{selectedArea.actionType === 'url' ? '遷移先URL' : '送信内容・メッセージ本文'}</label>
                    {selectedArea.actionType === 'url' ? (
                      <input type="text" value={selectedArea.payload} onChange={(e) => updateSelectedArea({ payload: e.target.value })} className="w-full text-[14px] p-2.5 rounded-lg border border-[#e0e0e0] focus:border-[#08bf5a] focus:outline-none" />
                    ) : (
                      <textarea rows={3} value={selectedArea.payload} onChange={(e) => updateSelectedArea({ payload: e.target.value })} className="w-full text-[14px] p-2.5 rounded-lg border border-[#e0e0e0] focus:border-[#08bf5a] focus:outline-none" />
                    )}
                  </div>

                  <div className="bg-[#f8f8f8] p-4 rounded-xl border border-[#e0e0e0]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="text-[14px] font-medium text-[#222222]">タップ時にお客様の発言（吹き出し）を表示する</label>
                          <span className="text-[12px] bg-[#5799DB]/10 text-[#5799DB] px-1.5 py-0.5 rounded">Postback制御</span>
                        </div>
                        <p className="text-[12px] text-[#888888] mt-1">OFFにすると自然にボットが応答します。</p>
                      </div>
                      <button type="button" onClick={() => updateSelectedArea({ showUserBubble: !selectedArea.showUserBubble })} className={`w-12 h-6 rounded-full transition-colors relative ${selectedArea.showUserBubble ? 'bg-[#08bf5a]' : 'bg-[#dddddd]'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${selectedArea.showUserBubble ? 'translate-x-6.5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-5">
              <div className="bg-white rounded-xl border border-[#e0e0e0] p-5 shadow-sm sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0] mb-4">
                  <div className="flex items-center gap-2"><Smartphone size={18} className="text-[#08bf5a]" /><h2 className="text-[16px] font-medium leading-[24px]">リアルタイムLINE検証</h2></div>
                  <button onClick={() => setChatLogs([{ sender: 'bot', text: '友だち追加ありがとうございます！ヘアサロンALICEです✂️', type: 'text' }])} className="text-[12px] text-[#888888] hover:text-[#222222] flex items-center gap-1"><RotateCcw size={12} /> 履歴クリア</button>
                </div>

                <div className="w-[320px] mx-auto bg-[#849ebf] rounded-3xl overflow-hidden border-[6px] border-[#222222] shadow-xl flex flex-col h-[520px]">
                  <div className="bg-[#08bf5a] text-white px-4 py-2 text-[12px] flex justify-between items-center shadow-sm">
                    <span className="font-medium">ヘアサロン ALICE</span><span className="text-[10px] bg-white/20 px-1.5 rounded">テスト環境</span>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-3">
                    {chatLogs.map((log, index) => (
                      <div key={index} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {log.type === 'template' ? (
                          <div className="bg-white rounded-xl overflow-hidden shadow-sm max-w-[85%] border border-[#e0e0e0]">
                            <div className="h-24 bg-[#f4fbf2] flex items-center justify-center border-b border-[#e0e0e0]"><ImageIcon size={28} className="text-[#08bf5a]/40" /></div>
                            <div className="p-3">
                              <p className="text-[12px] text-[#222222] font-medium whitespace-pre-wrap leading-[18px]">{log.text}</p>
                              <button className="w-full mt-2 bg-[#08bf5a]/10 text-[#08bf5a] font-medium text-[11px] py-1.5 rounded">詳細を見る</button>
                            </div>
                          </div>
                        ) : (
                          <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-[12px] leading-[18px] whitespace-pre-wrap shadow-sm ${log.sender === 'user' ? 'bg-[#08bf5a] text-white rounded-tr-none' : 'bg-white text-[#222222] rounded-tl-none'}`}>{log.text}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border-t border-[#e0e0e0]">
                    <div 
                      className={`grid ${layoutType === '6' ? 'grid-cols-3' : 'grid-cols-2'} relative`}
                      style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', height: layoutType === '2' ? '70px' : '140px' }}
                    >
                      {activeAreas.map((area, idx) => renderGridArea(area, idx, true))}
                    </div>
                    <div className="text-center py-1 bg-white border-t border-[#f0f0f0]"><span className="text-[10px] text-[#888888]">▲ メニューを閉じる</span></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* モーダル表示部分は省略せずに前と同じ */}
        {showDiagnosticModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e0e0e0] animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2 text-[#f44336]"><AlertTriangle size={22} /><h3 className="text-[16px] font-medium leading-[24px] text-[#222222]">公開前チェック：不整合が検出されました</h3></div>
                <button onClick={() => setShowDiagnosticModal(false)} className="text-[#888888] hover:text-[#222222]"><X size={20} /></button>
              </div>
              <div className="py-5 space-y-4">
                <p className="text-[14px] text-[#888888] leading-[22px]">実機公開後にトラブルとなりやすい設定の重複や未設定項目があります。内容を確認してください。</p>
                <div className="bg-[#fef5e4] border border-[#fea600]/30 rounded-xl p-4">
                  <div className="flex items-start gap-3"><AlertTriangle size={18} className="text-[#fea600] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[14px] font-medium text-[#222222]">【警告】LINE公式側の応答メッセージと重複の恐れ</h4>
                      <p className="text-[12px] text-[#888888] mt-1 leading-[18px]">エリア2をタップした際、エルメの返信と同時にLINE側の自動応答が重なる可能性があります。</p>
                      <button onClick={() => { setShowDiagnosticModal(false); setSelectedAreaId(2); }} className="text-[12px] text-[#5799DB] hover:underline font-medium mt-2">エリア2の設定を見直す →</button>
                    </div>
                  </div>
                </div>
                <div className="bg-[#fdebe9] border border-[#f44336]/30 rounded-xl p-4">
                  <div className="flex items-start gap-3"><AlertTriangle size={18} className="text-[#f44336] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[14px] font-medium text-[#222222]">【エラー】未設定のアクションがあります</h4>
                      <p className="text-[12px] text-[#888888] mt-1 leading-[18px]">ユーザーがタップしても何も反応しない無効な領域が残っています。</p>
                      <button onClick={() => { setShowDiagnosticModal(false); setSelectedAreaId(activeAreas[activeAreas.length - 1].id); }} className="text-[12px] text-[#f44336] hover:underline font-medium mt-2">未設定のエリアを確認する →</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e0e0]">
                <button type="button" onClick={() => setShowDiagnosticModal(false)} className="px-4 py-2 text-[14px] text-[#888888] hover:text-[#222222]">エディタに戻る</button>
                <button type="button" onClick={() => { alert('設定を保存・公開しました！'); setShowDiagnosticModal(false); }} className="px-5 py-2 text-[14px] font-medium bg-[#08bf5a] text-white rounded-lg hover:bg-[#23814d] transition-colors">警告を無視して公開する</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}