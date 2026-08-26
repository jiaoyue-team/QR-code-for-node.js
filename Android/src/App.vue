<template>
  <div class="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100 font-sans pb-24 box-border">
    <!-- Main Content Tabs -->
    <main class="flex-1 max-w-lg w-full mx-auto p-4 pt-6 box-border overflow-x-hidden">
      <!-- TAB 1: GENERATE -->
      <div v-show="activeTab === 'generate'" class="space-y-5 animate-fadeIn w-full box-border">
        
        <!-- Live Preview Card -->
        <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center relative overflow-hidden w-full box-border">
          <div class="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>

          <!-- QR Canvas Mount Point with Checkerboard support for Transparent BG -->
          <div 
            class="p-4 rounded-2xl shadow-inner flex items-center justify-center transition-all duration-300 relative max-w-full box-border"
            :class="isTransparentBg ? 'checkerboard-bg' : ''"
            :style="{ backgroundColor: isTransparentBg ? 'transparent' : qrOptions.backgroundOptions.color }"
          >
            <div ref="qrCodeRef" class="overflow-hidden flex items-center justify-center max-w-full"></div>
          </div>

          <!-- Transparent Badge indicator -->
          <div v-if="isTransparentBg" class="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            <Sparkles class="w-3 h-3" />
            <span>已開啟透明背景 (儲存為透明 PNG)</span>
          </div>

          <!-- Quick Action Buttons -->
          <div class="grid grid-cols-3 gap-2 w-full mt-4 box-border">
            <button 
              @click="downloadQR('png')"
              :disabled="isSaving"
              class="flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition min-w-0 disabled:opacity-50"
            >
              <Download class="w-4 h-4 shrink-0" :class="isSaving ? 'animate-bounce' : ''" />
              <span class="truncate">{{ isSaving ? '儲存中...' : '儲存圖片' }}</span>
            </button>
            <button 
              @click="shareQR"
              class="flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-100 text-xs font-semibold border border-slate-700/60 transition min-w-0"
            >
              <Share2 class="w-4 h-4 text-indigo-400 shrink-0" />
              <span class="truncate">快速分享</span>
            </button>
            <button 
              @click="copyContent"
              class="flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-100 text-xs font-semibold border border-slate-700/60 transition min-w-0"
            >
              <Check v-if="copied" class="w-4 h-4 text-emerald-400 shrink-0" />
              <Copy v-else class="w-4 h-4 text-slate-300 shrink-0" />
              <span class="truncate">{{ copied ? '已複製' : '複製內容' }}</span>
            </button>
          </div>
        </div>

        <!-- Content Type Selector -->
        <div class="space-y-2 w-full box-border">
          <label class="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">選擇內容類型</label>
          <div class="grid grid-cols-4 gap-2 w-full box-border">
            <button
              v-for="type in contentTypes"
              :key="type.id"
              @click="contentType = type.id"
              :class="[
                'flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition-all duration-200 min-w-0 box-border',
                contentType === type.id
                  ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
              ]"
            >
              <component :is="type.icon" class="w-4 h-4 sm:w-5 sm:h-5 mb-1 shrink-0" :class="contentType === type.id ? 'text-indigo-400' : 'text-slate-400'" />
              <span class="truncate text-[11px]">{{ type.name }}</span>
            </button>
          </div>
        </div>

        <!-- Input Form based on Content Type -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5 w-full box-border">
          <!-- 1. URL / Text -->
          <div v-if="contentType === 'url'" class="space-y-2">
            <label class="text-xs font-semibold text-slate-300">網址或純文字</label>
            <textarea
              v-model="formData.text"
              rows="3"
              placeholder="請輸入網址 (如 https://example.com) 或任意文字..."
              class="w-full box-border bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
            ></textarea>
          </div>

          <!-- 2. Wi-Fi -->
          <div v-else-if="contentType === 'wifi'" class="space-y-3">
            <div>
              <label class="text-xs font-semibold text-slate-300">Wi-Fi 名稱 (SSID)</label>
              <input
                type="text"
                v-model="formData.wifi.ssid"
                placeholder="例如：MyHome_5G"
                class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-300">Wi-Fi 密碼</label>
              <input
                type="text"
                v-model="formData.wifi.password"
                placeholder="請輸入 Wi-Fi 密碼"
                class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="min-w-0">
                <label class="text-xs font-semibold text-slate-300">加密類型</label>
                <select
                  v-model="formData.wifi.encryption"
                  class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">無密碼 (開放)</option>
                </select>
              </div>
              <div class="flex items-center pt-5 min-w-0">
                <label class="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" v-model="formData.wifi.hidden" class="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 shrink-0" />
                  <span class="truncate">隱藏 SSID</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 3. vCard Contact -->
          <div v-else-if="contentType === 'vcard'" class="space-y-3">
            <div class="grid grid-cols-2 gap-2.5">
              <div class="min-w-0">
                <label class="text-xs font-semibold text-slate-300">姓名 *</label>
                <input type="text" v-model="formData.vcard.name" placeholder="王小明" class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100" />
              </div>
              <div class="min-w-0">
                <label class="text-xs font-semibold text-slate-300">電話 *</label>
                <input type="tel" v-model="formData.vcard.phone" placeholder="0912345678" class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100" />
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-300">電子信箱</label>
              <input type="email" v-model="formData.vcard.email" placeholder="example@mail.com" class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100" />
            </div>
            <div class="grid grid-cols-2 gap-2.5">
              <div class="min-w-0">
                <label class="text-xs font-semibold text-slate-300">公司 / 組織</label>
                <input type="text" v-model="formData.vcard.company" placeholder="OO科技" class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100" />
              </div>
              <div class="min-w-0">
                <label class="text-xs font-semibold text-slate-300">職稱</label>
                <input type="text" v-model="formData.vcard.title" placeholder="工程師" class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100" />
              </div>
            </div>
          </div>

          <!-- 4. Phone -->
          <div v-else-if="contentType === 'phone'" class="space-y-2">
            <label class="text-xs font-semibold text-slate-300">電話號碼</label>
            <input
              type="tel"
              v-model="formData.phone"
              placeholder="例如：0912345678 或 +886912345678"
              class="w-full box-border bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100"
            />
          </div>

          <!-- 5. SMS -->
          <div v-else-if="contentType === 'sms'" class="space-y-3">
            <div>
              <label class="text-xs font-semibold text-slate-300">收件人電話</label>
              <input type="tel" v-model="formData.sms.phone" placeholder="0912345678" class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100" />
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-300">簡訊預設內容</label>
              <textarea v-model="formData.sms.message" rows="2" placeholder="請輸入預設發送內容..." class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 resize-none"></textarea>
            </div>
          </div>

          <!-- 6. Email -->
          <div v-else-if="contentType === 'email'" class="space-y-3">
            <div>
              <label class="text-xs font-semibold text-slate-300">收件 Email</label>
              <input type="email" v-model="formData.email.to" placeholder="service@example.com" class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100" />
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-300">主旨</label>
              <input type="text" v-model="formData.email.subject" placeholder="信件主旨" class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100" />
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-300">信件內容</label>
              <textarea v-model="formData.email.body" rows="2" placeholder="信件預設內文..." class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 resize-none"></textarea>
            </div>
          </div>

          <!-- 7. Map / Location -->
          <div v-else-if="contentType === 'location'" class="space-y-3">
            <div class="grid grid-cols-2 gap-2.5">
              <div class="min-w-0">
                <label class="text-xs font-semibold text-slate-300">緯度 (Latitude)</label>
                <input type="text" v-model="formData.location.lat" placeholder="25.033964" class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100" />
              </div>
              <div class="min-w-0">
                <label class="text-xs font-semibold text-slate-300">經度 (Longitude)</label>
                <input type="text" v-model="formData.location.lng" placeholder="121.564472" class="w-full box-border mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100" />
              </div>
            </div>
          </div>
        </div>

        <!-- Customization Studio Accordion / Section -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 w-full box-border">
          <div class="flex items-center justify-between cursor-pointer" @click="showStyleCustomizer = !showStyleCustomizer">
            <div class="flex items-center space-x-2 min-w-0">
              <Palette class="w-4 h-4 text-indigo-400 shrink-0" />
              <span class="text-sm font-bold text-slate-200 truncate">外觀與樣式自訂 (進階)</span>
            </div>
            <span class="text-xs text-indigo-400 font-medium shrink-0">{{ showStyleCustomizer ? '收起' : '展開設定' }}</span>
          </div>

          <div v-show="showStyleCustomizer" class="space-y-4 pt-2 border-t border-slate-800/80 animate-fadeIn w-full box-border">
            <!-- Colors & Transparent Toggle -->
            <div class="space-y-2.5 w-full box-border">
              <div class="flex items-center justify-between">
                <label class="text-xs font-semibold text-slate-400">主題色彩</label>
                <button
                  type="button"
                  @click="toggleTransparentBg"
                  :class="[
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition shrink-0',
                    isTransparentBg
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  ]"
                >
                  <span class="w-2 h-2 rounded-full shrink-0" :class="isTransparentBg ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'"></span>
                  <span>{{ isTransparentBg ? '透明背景 (已開啟)' : '開啟透明背景' }}</span>
                </button>
              </div>

              <div class="grid grid-cols-2 gap-3 w-full box-border">
                <!-- QR Dots Color -->
                <div class="space-y-1 min-w-0">
                  <span class="text-[11px] text-slate-400 truncate block">QR 碼圖案顏色</span>
                  <div class="flex items-center gap-1.5">
                    <input type="color" v-model="qrOptions.dotsOptions.color" class="w-7 h-7 shrink-0 rounded cursor-pointer bg-transparent border-0" />
                    <input type="text" v-model="qrOptions.dotsOptions.color" class="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 uppercase font-mono" />
                  </div>
                </div>

                <!-- Background Color (Disabled if transparent) -->
                <div class="space-y-1 min-w-0" :class="isTransparentBg ? 'opacity-40 pointer-events-none' : ''">
                  <span class="text-[11px] text-slate-400 truncate block">背景顏色</span>
                  <div class="flex items-center gap-1.5">
                    <input type="color" v-model="storedBgColor" @input="updateBgColor" :disabled="isTransparentBg" class="w-7 h-7 shrink-0 rounded cursor-pointer bg-transparent border-0" />
                    <input type="text" v-model="storedBgColor" @input="updateBgColor" :disabled="isTransparentBg" class="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 uppercase font-mono" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Color Presets (Including Transparent presets) -->
            <div class="w-full box-border">
              <span class="text-[11px] text-slate-400 mb-1.5 block">熱門配色方案</span>
              <div class="flex items-center gap-2 flex-wrap w-full box-border">
                <button
                  v-for="(preset, idx) in colorPresets"
                  :key="idx"
                  @click="applyColorPreset(preset)"
                  class="px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition"
                  :style="{ backgroundColor: preset.bg === 'transparent' ? 'rgba(30,41,59,0.5)' : preset.bg, color: preset.fg, borderColor: preset.border }"
                >
                  <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: preset.fg }"></span>
                  <span>{{ preset.name }}</span>
                </button>
              </div>
            </div>

            <!-- Dot Style -->
            <div class="space-y-2 w-full box-border">
              <label class="text-xs font-semibold text-slate-400">碼點樣式 (Dots Style)</label>
              <div class="grid grid-cols-3 gap-2 w-full box-border">
                <button
                  v-for="style in dotStyles"
                  :key="style.value"
                  @click="qrOptions.dotsOptions.type = style.value"
                  :class="[
                    'py-2 px-1.5 rounded-xl border text-xs font-medium transition min-w-0 text-center truncate',
                    qrOptions.dotsOptions.type === style.value
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  ]"
                >
                  {{ style.label }}
                </button>
              </div>
            </div>

            <!-- Corner Square Style -->
            <div class="space-y-2 w-full box-border">
              <label class="text-xs font-semibold text-slate-400">外定位角樣式 (Corners)</label>
              <div class="grid grid-cols-3 gap-2 w-full box-border">
                <button
                  v-for="corner in cornerStyles"
                  :key="corner.value"
                  @click="qrOptions.cornersSquareOptions.type = corner.value"
                  :class="[
                    'py-2 px-1.5 rounded-xl border text-xs font-medium transition min-w-0 text-center truncate',
                    qrOptions.cornersSquareOptions.type === corner.value
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  ]"
                >
                  {{ corner.label }}
                </button>
              </div>
            </div>

            <!-- Logo Upload -->
            <div class="space-y-2 w-full box-border">
              <label class="text-xs font-semibold text-slate-400">中心 Logo 圖示</label>
              <div class="flex items-center gap-2 w-full box-border">
                <label class="flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl cursor-pointer text-xs text-slate-300 transition truncate">
                  <UploadCloud class="w-4 h-4 text-indigo-400 shrink-0" />
                  <span class="truncate">{{ qrOptions.image ? '更換圖片' : '上傳自訂 Logo' }}</span>
                  <input type="file" accept="image/*" @change="handleLogoUpload" class="hidden" />
                </label>
                <button
                  v-if="qrOptions.image"
                  @click="qrOptions.image = ''"
                  class="py-2 px-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium shrink-0"
                >
                  移除
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- TAB 2: HISTORY -->
      <div v-show="activeTab === 'history'" class="space-y-4 animate-fadeIn w-full box-border">
        <div class="flex items-center justify-between px-1">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
            歷史生成紀錄 ({{ historyList.length }})
          </h2>
          <button 
            v-if="historyList.length > 0"
            @click="clearHistory" 
            class="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium shrink-0"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>清空全部</span>
          </button>
        </div>

        <div v-if="historyList.length === 0" class="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-2 w-full box-border">
          <History class="w-10 h-10 text-slate-600 mx-auto" />
          <p class="text-sm text-slate-400 font-medium">尚無歷史紀錄</p>
          <p class="text-xs text-slate-500">您生成的每一張 QR Code 都會自動保存在這裡</p>
        </div>

        <div v-else class="space-y-2.5 w-full box-border">
          <div 
            v-for="(item, idx) in historyList" 
            :key="item.id || idx"
            class="bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 flex items-center justify-between gap-3 transition w-full box-border"
          >
            <div class="flex items-center gap-3 overflow-hidden flex-1 min-w-0 cursor-pointer" @click="loadHistoryItem(item)">
              <div class="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <QrCode class="w-4 h-4 text-indigo-400" />
              </div>
              <div class="overflow-hidden flex-1 min-w-0">
                <p class="text-xs font-semibold text-slate-200 truncate">{{ item.title || item.content }}</p>
                <p class="text-[10px] text-slate-500 mt-0.5 truncate">{{ formatDate(item.timestamp) }} · {{ item.type }}</p>
              </div>
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <button 
                @click="loadHistoryItem(item)" 
                title="重現此 QR Code"
                class="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
              >
                <RefreshCw class="w-4 h-4" />
              </button>
              <button 
                @click="deleteHistoryItem(idx)" 
                title="刪除"
                class="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: ABOUT -->
      <div v-show="activeTab === 'about'" class="space-y-4 animate-fadeIn w-full box-border">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-center w-full box-border">
          <img src="/icon.png" class="w-16 h-16 mx-auto rounded-2xl shadow-lg shadow-indigo-600/30 object-cover" alt="QR狗 Logo" />
          <div>
            <h2 class="text-lg font-bold text-white">QR 狗 (QR Dog)</h2>
            <p class="text-xs text-indigo-400 font-medium mt-0.5">版本 1.0.0 · Android 專用版</p>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            專為行動裝置打造的純淨 QR Code 生成工具，支援 Wi-Fi、名片、多色漸層、透明背景、自訂 Logo 與原生儲存分享。
          </p>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 w-full box-border">
          <h3 class="text-xs font-semibold text-slate-300 uppercase tracking-wider">📦 特色說明</h3>
          <ul class="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>原生儲存：支援直接儲存到手機檔案與相簿。</li>
            <li>透明背景支援：可生成透明背景的 PNG 圖片，方便去背排版。</li>
            <li>完全離線：無須網路連線，資料本機安全處理。</li>
            <li>無多餘權限：保護隱私，無須相機或不必要的系統權限。</li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 z-40 w-full bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 box-border">
      <div class="max-w-lg mx-auto flex items-center justify-around w-full">
        <button
          v-for="tab in navTabs"
          :key="tab.id"
          @click="switchTab(tab.id)"
          :class="[
            'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200',
            activeTab === tab.id
              ? 'text-indigo-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          ]"
        >
          <component :is="tab.icon" class="w-5 h-5 mb-0.5 shrink-0" />
          <span class="text-[11px] truncate">{{ tab.label }}</span>
        </button>
      </div>
    </nav>

    <!-- Toast Notification -->
    <div 
      v-if="toastMessage" 
      class="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-800/95 text-white px-4 py-2 rounded-full text-xs font-medium border border-slate-700 shadow-xl backdrop-blur flex items-center gap-2 max-w-[90vw] box-border animate-bounce"
    >
      <span class="truncate">{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import QRCodeStyling from 'qr-code-styling'
import { Share } from '@capacitor/share'
import { Toast } from '@capacitor/toast'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'
import {
  QrCode,
  History,
  Info,
  Download,
  Share2,
  Copy,
  Check,
  Globe,
  Wifi,
  User,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Palette,
  UploadCloud,
  RefreshCw,
  Trash2,
  Sparkles
} from 'lucide-vue-next'

// State
const activeTab = ref('generate')
const contentType = ref('url')
const showStyleCustomizer = ref(false)
const copied = ref(false)
const isSaving = ref(false)
const toastMessage = ref('')
const historyList = ref([])

// Background transparency state
const isTransparentBg = ref(false)
const storedBgColor = ref('#ffffff')

const qrCodeRef = ref(null)
let qrCodeInstance = null

// Form data for different types
const formData = reactive({
  text: 'https://google.com',
  wifi: {
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false
  },
  vcard: {
    name: '',
    phone: '',
    email: '',
    company: '',
    title: ''
  },
  phone: '',
  sms: {
    phone: '',
    message: ''
  },
  email: {
    to: '',
    subject: '',
    body: ''
  },
  location: {
    lat: '25.033964',
    lng: '121.564472'
  }
})

// QR styling options
const qrOptions = reactive({
  width: 240,
  height: 240,
  type: 'canvas',
  data: 'https://google.com',
  image: '',
  margin: 8,
  dotsOptions: {
    color: '#0f172a',
    type: 'rounded'
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 4,
    imageSize: 0.35,
    hideBackgroundDots: true
  },
  cornersSquareOptions: {
    color: '#0f172a',
    type: 'extra-rounded'
  },
  cornersDotOptions: {
    color: '#0f172a',
    type: 'dot'
  },
  qrOptions: {
    errorCorrectionLevel: 'Q'
  }
})

// Tabs configuration
const navTabs = [
  { id: 'generate', label: '生成', icon: QrCode },
  { id: 'history', label: '紀錄', icon: History },
  { id: 'about', label: '關於', icon: Info }
]

// Content Types
const contentTypes = [
  { id: 'url', name: '網址/文字', icon: Globe },
  { id: 'wifi', name: 'Wi-Fi', icon: Wifi },
  { id: 'vcard', name: '名片', icon: User },
  { id: 'phone', name: '通話', icon: Phone },
  { id: 'sms', name: '簡訊', icon: MessageSquare },
  { id: 'email', name: '郵件', icon: Mail },
  { id: 'location', name: '地圖', icon: MapPin }
]

// Styles options
const dotStyles = [
  { label: '圓潤 (Rounded)', value: 'rounded' },
  { label: '圓點 (Dots)', value: 'dots' },
  { label: '經典方形', value: 'square' },
  { label: '特圓 (Extra)', value: 'extra-rounded' },
  { label: '優雅 (Classy)', value: 'classy' },
  { label: '優雅圓角', value: 'classy-rounded' }
]

const cornerStyles = [
  { label: '圓潤 (Extra)', value: 'extra-rounded' },
  { label: '圓點 (Dot)', value: 'dot' },
  { label: '方形 (Square)', value: 'square' }
]

const colorPresets = [
  { name: '經典黑白', fg: '#000000', bg: '#ffffff', border: '#e2e8f0', transparent: false },
  { name: '透明背景 (黑碼)', fg: '#000000', bg: 'transparent', border: '#94a3b8', transparent: true },
  { name: '透明背景 (白碼)', fg: '#ffffff', bg: 'transparent', border: '#94a3b8', transparent: true },
  { name: '科技靛藍', fg: '#4338ca', bg: '#ffffff', border: '#c7d2fe', transparent: false },
  { name: '極客暗黑', fg: '#38bdf8', bg: '#090d16', border: '#0284c7', transparent: false },
  { name: '活力翡翠', fg: '#047857', bg: '#ffffff', border: '#a7f3d0', transparent: false },
  { name: '暮光紫', fg: '#7e22ce', bg: '#ffffff', border: '#e9d5ff', transparent: false }
]

// Computed: Raw String generated from form
const qrRawData = computed(() => {
  switch (contentType.value) {
    case 'url':
      return formData.text || 'https://google.com'
    case 'wifi':
      const { ssid, password, encryption, hidden } = formData.wifi
      return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden ? 'true' : 'false'};;`
    case 'vcard':
      const { name, phone, email, company, title } = formData.vcard
      return `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nORG:${company}\nTITLE:${title}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`
    case 'phone':
      return `tel:${formData.phone}`
    case 'sms':
      return `SMSTO:${formData.sms.phone}:${formData.sms.message}`
    case 'email':
      return `mailto:${formData.email.to}?subject=${encodeURIComponent(formData.email.subject)}&body=${encodeURIComponent(formData.email.body)}`
    case 'location':
      return `https://www.google.com/maps?q=${formData.location.lat},${formData.location.lng}`
    default:
      return 'https://google.com'
  }
})

// Convert Blob to Base64 String
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Initialize QR Code Instance
const initQRCode = () => {
  if (!qrCodeRef.value) return
  qrOptions.data = qrRawData.value
  qrCodeRef.value.innerHTML = ''
  qrCodeInstance = new QRCodeStyling(qrOptions)
  qrCodeInstance.append(qrCodeRef.value)
}

// Update QR Code
const updateQR = () => {
  if (!qrCodeInstance) {
    initQRCode()
    return
  }
  qrOptions.data = qrRawData.value
  // Sync corners color with dot color
  qrOptions.cornersSquareOptions.color = qrOptions.dotsOptions.color
  qrOptions.cornersDotOptions.color = qrOptions.dotsOptions.color

  qrCodeInstance.update(qrOptions)
  saveHistoryDebounced()
}

// Transparent Background Toggle
const toggleTransparentBg = () => {
  isTransparentBg.value = !isTransparentBg.value
  if (isTransparentBg.value) {
    qrOptions.backgroundOptions.color = 'transparent'
    showToast('已開啟透明背景')
  } else {
    qrOptions.backgroundOptions.color = storedBgColor.value || '#ffffff'
    showToast('已關閉透明背景')
  }
  updateQR()
}

const updateBgColor = () => {
  if (!isTransparentBg.value) {
    qrOptions.backgroundOptions.color = storedBgColor.value
    updateQR()
  }
}

// Color preset apply
const applyColorPreset = (preset) => {
  qrOptions.dotsOptions.color = preset.fg
  qrOptions.cornersSquareOptions.color = preset.fg
  qrOptions.cornersDotOptions.color = preset.fg

  if (preset.transparent || preset.bg === 'transparent') {
    isTransparentBg.value = true
    qrOptions.backgroundOptions.color = 'transparent'
    showToast(`套用：${preset.name}`)
  } else {
    isTransparentBg.value = false
    storedBgColor.value = preset.bg
    qrOptions.backgroundOptions.color = preset.bg
    showToast(`套用：${preset.name}`)
  }
  updateQR()
}

// Watch data changes
watch([qrRawData, () => ({ ...qrOptions })], () => {
  updateQR()
}, { deep: true })

// Logo upload handler
const handleLogoUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (event) => {
    qrOptions.image = event.target.result
    showToast('已載入自訂 Logo')
  }
  reader.readAsDataURL(file)
}

// Download / Save QR Code (Android Native + Web Support)
const downloadQR = async (ext = 'png') => {
  if (!qrCodeInstance || isSaving.value) return
  isSaving.value = true
  try {
    const rawBlob = await qrCodeInstance.getRawData(ext)
    if (!rawBlob) {
      showToast('正在產生圖片，請稍候...')
      isSaving.value = false
      return
    }

    const base64Data = await blobToBase64(rawBlob)
    const fileName = `QR_Dog_${Date.now()}.${ext}`

    if (Capacitor.isNativePlatform()) {
      // 1. Write file to Documents directory
      const writeResult = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true
      })

      // 2. Also open native Share/Save dialog so user can save directly to Photos / Gallery / Files
      try {
        await Share.share({
          title: '儲存 QR Code 圖片',
          url: writeResult.uri,
          dialogTitle: '儲存圖片至相簿或分享'
        })
      } catch (shareErr) {
        // If user cancelled share sheet, file is still saved
      }

      showToast('✅ 圖片已成功儲存至手機！')
    } else {
      // Browser fallback
      const link = document.createElement('a')
      link.href = base64Data
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showToast('✅ 已開始下載圖片！')
    }
  } catch (err) {
    console.error('Save error:', err)
    // Fallback using direct download
    try {
      await qrCodeInstance.download({ name: `QR_Dog_${Date.now()}`, extension: ext })
      showToast('已觸發瀏覽器下載')
    } catch (e) {
      showToast('儲存失敗，請重試')
    }
  } finally {
    isSaving.value = false
  }
}

// Share QR Code
const shareQR = async () => {
  if (!qrCodeInstance) return
  try {
    const rawBlob = await qrCodeInstance.getRawData('png')
    if (rawBlob) {
      const base64Data = await blobToBase64(rawBlob)
      if (Capacitor.isNativePlatform()) {
        const fileName = `QR_Share_${Date.now()}.png`
        const writeResult = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache,
          recursive: true
        })

        await Share.share({
          title: 'QR Code',
          text: qrRawData.value,
          url: writeResult.uri,
          dialogTitle: '分享 QR Code'
        })
        return
      }
    }
    // Fallback to text share
    await Share.share({
      title: 'QR Code 內容',
      text: qrRawData.value,
      url: isUrl(qrRawData.value) ? qrRawData.value : undefined,
      dialogTitle: '分享 QR Code'
    })
  } catch (e) {
    if (navigator.share) {
      navigator.share({
        title: 'QR Code',
        text: qrRawData.value
      }).catch(() => {})
    } else {
      copyContent()
    }
  }
}

// Copy content
const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(qrRawData.value)
    copied.value = true
    showToast('已複製內容到剪貼簿')
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    showToast('複製失敗')
  }
}

// History Management
let historyTimeout = null
const saveHistoryDebounced = () => {
  clearTimeout(historyTimeout)
  historyTimeout = setTimeout(() => {
    if (!qrRawData.value || qrRawData.value.trim() === '') return
    saveToHistory({
      type: getContentTypeName(contentType.value),
      content: qrRawData.value,
      title: qrRawData.value.slice(0, 35)
    })
  }, 1500)
}

const saveToHistory = (item) => {
  const existing = historyList.value.find(h => h.content === item.content)
  if (existing) {
    existing.timestamp = Date.now()
  } else {
    historyList.value.unshift({
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      ...item
    })
  }
  if (historyList.value.length > 50) historyList.value.pop()
  try {
    localStorage.setItem('qrdog_history', JSON.stringify(historyList.value))
  } catch (e) {}
}

const loadHistory = () => {
  try {
    const saved = localStorage.getItem('qrdog_history')
    if (saved) {
      historyList.value = JSON.parse(saved)
    }
  } catch (e) {}
}

const loadHistoryItem = (item) => {
  contentType.value = 'url'
  formData.text = item.content
  activeTab.value = 'generate'
  showToast('已載入該歷史紀錄')
}

const deleteHistoryItem = (idx) => {
  historyList.value.splice(idx, 1)
  localStorage.setItem('qrdog_history', JSON.stringify(historyList.value))
  showToast('已刪除紀錄')
}

const clearHistory = () => {
  historyList.value = []
  localStorage.removeItem('qrdog_history')
  showToast('歷史紀錄已清空')
}

// Helpers
const switchTab = (tabId) => {
  activeTab.value = tabId
  if (tabId === 'generate') {
    nextTick(() => initQRCode())
  }
}

const isUrl = (str) => {
  return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://'))
}

const getContentTypeName = (type) => {
  const map = {
    url: '網址/文字',
    wifi: 'Wi-Fi 連線',
    vcard: '名片',
    phone: '電話號碼',
    sms: '簡訊',
    email: '電子郵件',
    location: '地圖位置'
  }
  return map[type] || 'QR Code'
}

const formatDate = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const showToast = (msg) => {
  toastMessage.value = msg
  try {
    Toast.show({ text: msg, duration: 'short' })
  } catch (e) {}
  setTimeout(() => {
    if (toastMessage.value === msg) toastMessage.value = ''
  }, 2500)
}

onMounted(() => {
  loadHistory()
  nextTick(() => {
    initQRCode()
  })
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Checkerboard pattern to show transparent background clearly */
.checkerboard-bg {
  background-color: #334155;
  background-image: 
    linear-gradient(45deg, #1e293b 25%, transparent 25%), 
    linear-gradient(-45deg, #1e293b 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #1e293b 75%), 
    linear-gradient(-45deg, transparent 75%, #1e293b 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}
</style>
