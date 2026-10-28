import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Layers, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  ChevronRight, 
  X, 
  Info, 
  Upload, 
  RotateCcw,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';

// エリアの型定義
interface MenuArea {
  id: number;
  label: string;
  actionType: 'text' | 'url' | 'template';
  payload: string;
  showUserBubble: boolean; // 新機能：友だち側の吹き出しを出すかどうか
  replyMessage: string;    // 自動応答メッセージ
}

export default function App() {
  // 画面状態の管理
  const [currentView, setCurrentView] = useState<'empty' | 'editor'>('empty');
  const [selectedAreaId, setSelectedAreaId] = useState<number>(1);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState<boolean>(false);

  // エリア設定データ
  const [areas, setAreas] = useState<MenuArea[]>([
    {
      id: 1,
      label: 'WEB予約',
      actionType: 'url',
      payload: 'https://example.com/reserve',
      showUserBubble: false,
      replyMessage: '',
    },
    {
      id: 2,
      label: 'メニュー・料金',
      actionType: 'template',
      payload: 'カット：4,500円〜\nカラー：6,000円〜',
      showUserBubble: true, // 課題の体験に基づき、初期状態は「吹き出しが出る（要改善）」に
      replyMessage: 'サロンのメニューと料金一覧です✨',
    },
    {
      id: 3,
      label: 'アクセス・店舗情報',
      actionType: 'text',
      payload: '営業時間：10:00〜20:00\n定休日：毎週火曜日',
      showUserBubble: false,
      replyMessage: '店舗情報をお送りします！',
    },
    {
      id: 4,
      label: 'スタイリスト紹介',
      actionType: 'text',
      payload: '自己紹介を見る',
      showUserBubble: true,
      replyMessage: '当店自慢のスタイリストをご紹介します✂️',
    },
    {
      id: 5,
      label: 'クーポン',
      actionType: 'url',
      payload: 'https://example.com/coupon',
      showUserBubble: false,
      replyMessage: '',
    },
    {
      id: 6,
      label: '未設定エリア',
      actionType: 'text',
      payload: '', // エラー状態再現用
      showUserBubble: false,
      replyMessage: '',
    },
  ]);

  // シミュレーター用のチャットログ
  const [chatLogs, setChatLogs] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: '友だち追加ありがとうございます！ヘアサロンALICEです✂️' }
  ]);

  const selectedArea = areas.find(a => a.id === selectedAreaId) || areas[0];

  // 選択中エリアの設定更新
  const updateSelectedArea = (fields: Partial<MenuArea>) => {
    setAreas(prev => prev.map(area => area.id === selectedAreaId ? { ...area, ...fields } : area));
  };

  // シミュレーターでエリアをタップした時のシミュレーション
  const handleSimulateClick = (area: MenuArea) => {
    const newLogs: Array<{ sender: 'user' | 'bot'; text: string }> = [];

    // 吹き出し設定がONの場合のみ、ユーザー発言を表示
    if (area.showUserBubble && area.payload) {
      newLogs.push({ sender: 'user', text: `【${area.label}】` });
    }

    // ボットの応答
    if (area.actionType === 'url') {
      newLogs.push({ sender: 'bot', text: `🔗 リンクを開きます: ${area.payload}` });
    } else if (area.replyMessage) {
      newLogs.push({ sender: 'bot', text: area.replyMessage });
      if (area.payload) {
        newLogs.push({ sender: 'bot', text: area.payload });
      }
    } else if (area.payload) {
      newLogs.push({ sender: 'bot', text: area.payload });
    }

    if (newLogs.length > 0) {
      setChatLogs(prev => [...prev, ...newLogs]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#222222] flex flex-col font-sans">
      {/* グローバルヘッダー */}
      <header className="h-16 bg-white border-b border-[#e0e0e0] px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#08bf5a] flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <span className="text-[16px] font-medium tracking-wide">L Message エディタ</span>
          <span className="text-[12px] bg-[#f4fbf2] text-[#23814d] px-2 py-0.5 rounded border border-[#08bf5a]/30 font-medium">
            新仕様：インタラクティブエディタ
          </span>
        </div>

        <div className="flex items-center gap-3">
          {currentView === 'editor' && (
            <>
              <button 
                onClick={() => setCurrentView('empty')} 
                className="text-[14px] text-[#888888] hover:text-[#222222] px-3 py-1.5 transition-colors"
              >
                初期化（空状態を見る）
              </button>
              <button 
                onClick={() => setShowDiagnosticModal(true)}
                className="text-[14px] font-medium bg-[#fea600]/10 text-[#fea600] border border-[#fea600]/40 px-4 py-2 rounded-lg hover:bg-[#fea600]/20 flex items-center gap-2 transition-all"
              >
                <AlertTriangle size={16} />
                公開前チェック（2件の警告）
              </button>
              <button 
                onClick={() => setShowDiagnosticModal(true)}
                className="text-[14px] font-medium bg-[#08bf5a] text-white px-5 py-2 rounded-lg hover:bg-[#23814d] shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Sparkles size={16} />
                公開する
              </button>
            </>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto p-6">
        {/* ================= 画面1: 空状態 ================= */}
        {currentView === 'empty' && (
          <div className="bg-white rounded-2xl border border-[#e0e0e0] p-12 text-center max-w-2xl mx-auto mt-12 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#f4fbf2] text-[#08bf5a] flex items-center justify-center mx-auto mb-6">
              <Layers size={40} />
            </div>
            <h1 className="text-[24px] font-medium mb-3">リッチメニューが未作成です</h1>
            <p className="text-[14px] text-[#888888] leading-[22px] mb-8">
              画像を作成・アップロードして、友だちのアクションを設定しましょう。<br />
              美容室用のプリセットテンプレートからすぐに開始することも可能です。
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setCurrentView('editor')}
                className="text-[14px] font-medium bg-[#08bf5a] text-white px-6 py-3 rounded-lg hover:bg-[#23814d] transition-all shadow-sm flex items-center gap-2"
              >
                <Sparkles size={18} />
                美容室テンプレート（6分割）で作成
              </button>
              <button 
                onClick={() => setCurrentView('editor')}
                className="text-[14px] font-medium bg-white text-[#222222] border border-[#e0e0e0] px-6 py-3 rounded-lg hover:bg-[#f8f8f8] transition-all flex items-center gap-2"
              >
                <Upload size={18} />
                画像をアップロード
              </button>
            </div>
          </div>
        )}

        {/* ================= 画面2: エディタ ＋ シミュレーター ================= */}
        {currentView === 'editor' && (
          <div className="grid grid-cols-12 gap-6">
            
            {/* 左側：リッチメニュー画像 ＆ アクション設定 */}
            <div className="col-span-7 space-y-6">
              {/* リッチメニュー画像グリッド（WYSIWYG） */}
              <div className="bg-white rounded-xl border border-[#e0e0e0] p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-[16px] font-medium leading-[24px]">メニュー領域の分割・選択</h2>
                    <p className="text-[14px] text-[#888888] leading-[22px]">設定したいエリアをクリックしてください</p>
                  </div>
                  <span className="text-[12px] bg-[#f8f8f8] text-[#888888] px-2.5 py-1 rounded border border-[#e0e0e0]">
                    大枠テンプレート（6分割）
                  </span>
                </div>

                {/* 6分割メニューのプレビュー */}
                <div className="grid grid-cols-3 gap-2 bg-[#f0f0f0] p-2 rounded-xl border border-[#e0e0e0] aspect-[12/8]">
                  {areas.map((area) => {
                    const isSelected = area.id === selectedAreaId;
                    const isError = area.payload === '';

                    return (
                      <div
                        key={area.id}
                        onClick={() => setSelectedAreaId(area.id)}
                        className={`relative rounded-lg p-3 flex flex-col justify-between cursor-pointer transition-all border-2 ${
                          isSelected
                            ? 'border-[#08bf5a] bg-white shadow-md'
                            : 'border-transparent bg-white/80 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[12px] font-medium px-2 py-0.5 rounded ${
                            isSelected ? 'bg-[#08bf5a] text-white' : 'bg-[#f0f0f0] text-[#888888]'
                          }`}>
                            エリア {area.id}
                          </span>
                          {isError && (
                            <span className="text-[12px] text-[#f44336] flex items-center gap-1 font-medium bg-[#fdebe9] px-1.5 py-0.5 rounded">
                              <AlertTriangle size={12} /> 未設定
                            </span>
                          )}
                        </div>

                        <div className="text-center py-4">
                          <p className="text-[14px] font-medium text-[#222222]">{area.label}</p>
                          <p className="text-[12px] text-[#888888] mt-1 line-clamp-1">
                            {area.payload || 'アクション未指定'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[12px] text-[#888888] pt-2 border-t border-[#f0f0f0]">
                          <span>{area.actionType === 'url' ? 'URL遷移' : '自動応答'}</span>
                          {area.showUserBubble ? (
                            <span className="text-[#fea600] flex items-center gap-0.5 text-[11px]">
                              <Eye size={11} /> 吹き出し有
                            </span>
                          ) : (
                            <span className="text-[#888888] flex items-center gap-0.5 text-[11px]">
                              <EyeOff size={11} /> 吹き出し無
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* エリア詳細設定フォーム */}
              <div className="bg-white rounded-xl border border-[#e0e0e0] p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0] mb-5">
                  <h3 className="text-[16px] font-medium text-[#222222] flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#08bf5a] text-white text-[12px] flex items-center justify-center font-bold">
                      {selectedArea.id}
                    </span>
                    エリア {selectedArea.id}（{selectedArea.label}）の設定
                  </h3>
                  <button 
                    onClick={() => handleSimulateClick(selectedArea)}
                    className="text-[12px] text-[#5799DB] hover:underline flex items-center gap-1 font-medium"
                  >
                    このエリアの動作をテスト
                  </button>
                </div>

                <div className="space-y-5">
                  {/* アクション種別 */}
                  <div>
                    <label className="block text-[14px] font-medium text-[#222222] mb-2">アクション種別</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['text', 'template', 'url'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => updateSelectedArea({ actionType: type })}
                          className={`py-2 text-[14px] rounded-lg border font-medium transition-all ${
                            selectedArea.actionType === type
                              ? 'border-[#08bf5a] bg-[#f4fbf2] text-[#23814d]'
                              : 'border-[#e0e0e0] bg-white text-[#222222] hover:bg-[#f8f8f8]'
                          }`}
                        >
                          {type === 'text' && 'テキスト送信'}
                          {type === 'template' && 'テンプレート'}
                          {type === 'url' && 'リンクURL'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 送信内容 / URL */}
                  <div>
                    <label className="block text-[14px] font-medium text-[#222222] mb-1">
                      {selectedArea.actionType === 'url' ? '遷移先URL' : '送信内容・メッセージ本文'}
                    </label>
                    {selectedArea.actionType === 'url' ? (
                      <input
                        type="text"
                        value={selectedArea.payload}
                        onChange={(e) => updateSelectedArea({ payload: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full text-[14px] p-2.5 rounded-lg border border-[#e0e0e0] focus:border-[#08bf5a] focus:outline-none"
                      />
                    ) : (
                      <textarea
                        rows={3}
                        value={selectedArea.payload}
                        onChange={(e) => updateSelectedArea({ payload: e.target.value })}
                        placeholder="送信するテキストを入力してください"
                        className="w-full text-[14px] p-2.5 rounded-lg border border-[#e0e0e0] focus:border-[#08bf5a] focus:outline-none"
                      />
                    )}
                  </div>

                  {/* ★新機能：友だち側の吹き出し表示トグル */}
                  <div className="bg-[#f8f8f8] p-4 rounded-xl border border-[#e0e0e0]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="text-[14px] font-medium text-[#222222]">
                            タップ時にお客様の発言（吹き出し）を表示する
                          </label>
                          <span className="text-[12px] bg-[#5799DB]/10 text-[#5799DB] px-1.5 py-0.5 rounded">
                            Postback制御
                          </span>
                        </div>
                        <p className="text-[12px] text-[#888888] mt-1">
                          OFFにすると、トーク画面に「【{selectedArea.label}】」と友だち側の文字が出ず、自然にボットが応答します。
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSelectedArea({ showUserBubble: !selectedArea.showUserBubble })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          selectedArea.showUserBubble ? 'bg-[#08bf5a]' : 'bg-[#dddddd]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          selectedArea.showUserBubble ? 'translate-x-6.5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：LINEトーク画面風 リアルタイムシミュレーター */}
            <div className="col-span-5">
              <div className="bg-white rounded-xl border border-[#e0e0e0] p-5 shadow-sm sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0] mb-4">
                  <div className="flex items-center gap-2">
                    <Smartphone size={18} className="text-[#08bf5a]" />
                    <h2 className="text-[16px] font-medium leading-[24px]">リアルタイムLINE検証</h2>
                  </div>
                  <button 
                    onClick={() => setChatLogs([{ sender: 'bot', text: '友だち追加ありがとうございます！ヘアサロンALICEです✂️' }])}
                    className="text-[12px] text-[#888888] hover:text-[#222222] flex items-center gap-1"
                  >
                    <RotateCcw size={12} /> 履歴クリア
                  </button>
                </div>

                {/* スマホ外枠 */}
                <div className="w-[320px] mx-auto bg-[#849ebf] rounded-3xl overflow-hidden border-[6px] border-[#222222] shadow-xl flex flex-col h-[520px]">
                  {/* LINEヘッダー */}
                  <div className="bg-[#222222]/20 text-white px-4 py-2 text-[12px] flex justify-between items-center backdrop-blur-sm">
                    <span className="font-medium">ヘアサロン ALICE</span>
                    <span className="text-[10px] text-white/80">テスト環境</span>
                  </div>

                  {/* トークログエリア */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-3">
                    {chatLogs.map((log, index) => (
                      <div
                        key={index}
                        className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-[12px] leading-[18px] whitespace-pre-wrap shadow-sm ${
                            log.sender === 'user'
                              ? 'bg-[#08bf5a] text-white rounded-tr-none'
                              : 'bg-white text-[#222222] rounded-tl-none'
                          }`}
                        >
                          {log.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* リッチメニュー（固定表示部） */}
                  <div className="bg-white border-t border-[#e0e0e0]">
                    <div className="grid grid-cols-3 gap-1 p-1 bg-[#f0f0f0]">
                      {areas.map(area => (
                        <button
                          key={area.id}
                          onClick={() => handleSimulateClick(area)}
                          className="bg-white p-2 rounded text-center hover:bg-[#f4fbf2] transition-colors border border-transparent hover:border-[#08bf5a]"
                        >
                          <p className="text-[11px] font-medium text-[#222222] truncate">{area.label}</p>
                        </button>
                      ))}
                    </div>
                    <div className="text-center py-1 bg-white border-t border-[#f0f0f0]">
                      <span className="text-[10px] text-[#888888]">▲ メニューを閉じる</span>
                    </div>
                  </div>
                </div>

                <p className="text-[12px] text-[#888888] text-center mt-3">
                  実機を使わずに、ボタンタップ時の吹き出しや応答メッセージを即座にテストできます。
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ================= 画面3: 公開前診断モーダル（エラー/警告） ================= */}
        {showDiagnosticModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e0e0e0] animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2 text-[#f44336]">
                  <AlertTriangle size={22} />
                  <h3 className="text-[16px] font-medium leading-[24px] text-[#222222]">
                    公開前チェック：不整合が検出されました
                  </h3>
                </div>
                <button 
                  onClick={() => setShowDiagnosticModal(false)}
                  className="text-[#888888] hover:text-[#222222]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="py-5 space-y-4">
                <p className="text-[14px] text-[#888888] leading-[22px]">
                  実機公開後にトラブルとなりやすい設定の重複や未設定項目があります。内容を確認してください。
                </p>

                {/* エラー項目1：LINE公式側との重複 */}
                <div className="bg-[#fef5e4] border border-[#fea600]/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-[#fea600] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[14px] font-medium text-[#222222]">
                        【警告】LINE公式側の応答メッセージと重複の恐れ
                      </h4>
                      <p className="text-[12px] text-[#888888] mt-1 leading-[18px]">
                        エリア2をタップした際、エルメの返信と同時に「個別のお問い合わせを受け付けておりません」というLINE側の自動応答が重なる可能性があります。
                      </p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setShowDiagnosticModal(false);
                            setSelectedAreaId(2);
                          }}
                          className="text-[12px] text-[#5799DB] hover:underline font-medium"
                        >
                          エリア2の設定を見直す →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* エラー項目2：未設定エリア */}
                <div className="bg-[#fdebe9] border border-[#f44336]/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-[#f44336] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[14px] font-medium text-[#222222]">
                        【エラー】エリア6のアクションが未設定です
                      </h4>
                      <p className="text-[12px] text-[#888888] mt-1 leading-[18px]">
                        ユーザーがタップしても何も反応しない無効な領域が残っています。
                      </p>
                      <button 
                        onClick={() => {
                          setShowDiagnosticModal(false);
                          setSelectedAreaId(6);
                        }}
                        className="text-[12px] text-[#f44336] hover:underline font-medium mt-2 inline-block"
                      >
                        エリア6にアクションを設定する →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e0e0]">
                <button
                  type="button"
                  onClick={() => setShowDiagnosticModal(false)}
                  className="px-4 py-2 text-[14px] text-[#888888] hover:text-[#222222]"
                >
                  エディタに戻る
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('設定を保存・公開しました！');
                    setShowDiagnosticModal(false);
                  }}
                  className="px-5 py-2 text-[14px] font-medium bg-[#08bf5a] text-white rounded-lg hover:bg-[#23814d] transition-colors"
                >
                  警告を無視して公開する
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}