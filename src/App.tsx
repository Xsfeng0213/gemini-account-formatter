/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from "react";
import {
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Shirt,
  ShieldCheck,
  Key,
  Mail,
  Lock,
  Info,
  ShieldAlert,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MUST_READ_CONTENT } from "./constants/mustRead";
import catMascot from "./images/cat.png";
import {
  BACKGROUND_THEMES,
  DEFAULT_BACKGROUND_THEME,
  getBackgroundTheme,
  type BackgroundThemeId,
} from "./backgroundThemes";
import {
  buildFormattedText,
  isParseError,
  parseAccountInput,
  type FormatterMode,
  type ParsedAccountData,
} from "./formatters";

type FormatterUiConfig = {
  tabLabel: string;
  inputLabel: string;
  placeholder: string;
  tip: string;
};

type PreviewField = {
  label: string;
  icon: LucideIcon;
  cardClass: string;
  labelClass: string;
  getValue: (data: ParsedAccountData) => string;
};

const FORMATTER_UI: Record<FormatterMode, FormatterUiConfig> = {
  gemini: {
    tabLabel: "Gemini 转换",
    inputLabel: "粘贴格式：邮箱----密码----辅助邮箱----2fa密钥",
    placeholder:
      "xxxxxxx@gmail.com----xxxxxxx----xxxxxx@hotmail.com----xxxxxxxxxxxxxxxxxxx",
    tip: '系统会自动识别 "----" 分隔符并提取关键字段。请确保粘贴的信息完整。',
  },
  chatgpt: {
    tabLabel: "ChatGPT 转换",
    inputLabel: "粘贴格式：邮箱|密码|辅助邮箱|2FA|国家",
    placeholder:
      "xxxxxxxxx@gmail.com|xxxxxxxxxx|xxxxxxxxxxx@hotmail.com|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|xxxxxxxxx",
    tip: '系统会自动识别 "|" 分隔符并提取关键字段。请确保粘贴的信息完整。',
  },
};

const PREVIEW_FIELDS: Record<FormatterMode, PreviewField[]> = {
  gemini: [
    {
      label: "账号",
      icon: Mail,
      cardClass: "bg-blue-50",
      labelClass: "text-blue-500",
      getValue: (data) => data.account,
    },
    {
      label: "密码",
      icon: Lock,
      cardClass: "bg-purple-50",
      labelClass: "text-purple-500",
      getValue: (data) => data.password,
    },
    {
      label: "辅助邮箱",
      icon: Mail,
      cardClass: "bg-amber-50",
      labelClass: "text-amber-500",
      getValue: (data) => data.recovery,
    },
    {
      label: "2FA密钥",
      icon: Key,
      cardClass: "bg-emerald-50",
      labelClass: "text-emerald-500",
      getValue: (data) => data.twoFA,
    },
  ],
  chatgpt: [
    {
      label: "账号",
      icon: Mail,
      cardClass: "bg-blue-50",
      labelClass: "text-blue-500",
      getValue: (data) => data.account,
    },
    {
      label: "密码",
      icon: Lock,
      cardClass: "bg-purple-50",
      labelClass: "text-purple-500",
      getValue: (data) => data.password,
    },
    {
      label: "辅助邮箱",
      icon: Mail,
      cardClass: "bg-amber-50",
      labelClass: "text-amber-500",
      getValue: (data) => data.recovery,
    },
    {
      label: "2FA密钥",
      icon: Key,
      cardClass: "bg-emerald-50",
      labelClass: "text-emerald-500",
      getValue: (data) => data.twoFA,
    },
    {
      label: "国家",
      icon: Globe,
      cardClass: "bg-cyan-50",
      labelClass: "text-cyan-500",
      getValue: (data) => ("country" in data ? data.country : ""),
    },
  ],
};

const FORMATTER_MODES: FormatterMode[] = ["gemini", "chatgpt"];

export default function App() {
  const [activeMode, setActiveMode] = useState<FormatterMode>("gemini");
  const [backgroundTheme, setBackgroundTheme] =
    useState<BackgroundThemeId>(DEFAULT_BACKGROUND_THEME);
  const [themePanelOpen, setThemePanelOpen] = useState(false);
  const [inputs, setInputs] = useState<Record<FormatterMode, string>>({
    gemini: "",
    chatgpt: "",
  });
  const [copied, setCopied] = useState(false);
  const [mustReadCopied, setMustReadCopied] = useState(false);

  const currentInput = inputs[activeMode];
  const activeConfig = FORMATTER_UI[activeMode];
  const activeBackgroundTheme = getBackgroundTheme(backgroundTheme);

  const parsedData = useMemo(() => {
    if (!currentInput.trim()) return null;
    return parseAccountInput(activeMode, currentInput);
  }, [activeMode, currentInput]);

  const validParsedData =
    parsedData && !isParseError(parsedData) ? parsedData : null;

  const formattedText = validParsedData
    ? buildFormattedText(activeMode, validParsedData)
    : "";

  const copyButtonClassName = (isCopied: boolean) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg ${
      isCopied
        ? "bg-emerald-500 text-white shadow-emerald-200"
        : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
    }`;

  const copyText = async (
    text: string,
    setCopiedState: (value: boolean) => void,
  ) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState(true);
      window.setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleCopy = async () => {
    await copyText(formattedText, setCopied);
  };

  const handleMustReadCopy = async () => {
    await copyText(MUST_READ_CONTENT, setMustReadCopied);
  };

  const handleModeChange = (mode: FormatterMode) => {
    setActiveMode(mode);
    setCopied(false);
  };

  const handleInputChange = (value: string) => {
    setCopied(false);
    setInputs((previous) => ({
      ...previous,
      [activeMode]: value,
    }));
  };

  const handleThemeChange = (themeId: BackgroundThemeId) => {
    setBackgroundTheme(themeId);
    setThemePanelOpen(false);
  };

  return (
    <div
      className={`page-shell ${activeBackgroundTheme.shellClassName}`}
      data-theme={backgroundTheme}
    >
      <div className="background-orb-stack" aria-hidden="true">
        <span className="background-orb orb-1" />
        <span className="background-orb orb-2" />
        <span className="background-orb orb-3" />
        <span className="background-orb orb-4" />
        <span className="background-orb orb-5" />
        <span className="background-orb orb-6" />
      </div>
      <div className="background-ribbon-stack" aria-hidden="true">
        <span className="background-ribbon ribbon-1" />
        <span className="background-ribbon ribbon-2" />
      </div>
      <div className="background-veil" aria-hidden="true" />

      <div className="fixed left-4 top-4 z-30 md:left-6 md:top-6">
        <div className="relative">
          <motion.button
            type="button"
            aria-label="切换背景主题"
            aria-expanded={themePanelOpen}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setThemePanelOpen((open) => !open)}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/58 text-slate-700 shadow-[0_18px_40px_rgba(89,102,166,0.28)] backdrop-blur-2xl transition-all hover:bg-white/80"
          >
            <Shirt size={22} strokeWidth={2.1} />
          </motion.button>

          <AnimatePresence>
            {themePanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute left-0 top-[calc(100%+0.8rem)] w-64 rounded-[1.6rem] border border-white/70 bg-white/64 p-3 shadow-[0_28px_60px_rgba(82,99,165,0.2)] backdrop-blur-2xl"
              >
                <div className="px-2 pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-slate-400">
                    Themes
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    点一下换背景氛围
                  </p>
                </div>

                <div className="space-y-2">
                  {BACKGROUND_THEMES.map((theme) => {
                    const isActive = theme.id === backgroundTheme;

                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleThemeChange(theme.id)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                          isActive
                            ? "bg-white/90 text-slate-900 shadow-[0_10px_24px_rgba(100,116,190,0.16)]"
                            : "bg-white/12 text-slate-600 hover:bg-white/55 hover:text-slate-800"
                        }`}
                      >
                        <span
                          className={`h-10 w-10 shrink-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] ${theme.previewClassName}`}
                        />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="text-sm font-semibold">
                            {theme.label}
                          </span>
                          <span className="text-xs text-slate-500">
                            {theme.id === "cool-tech"
                              ? "冷静蓝青，科技感更强"
                              : theme.id === "rainbow-jelly"
                                ? "多彩果冻光感，活泼一点"
                                : "暖调霓虹，氛围更浓"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 min-h-screen p-4 md:p-8 flex items-center justify-center font-sans text-slate-800">
        <div className="max-w-6xl w-full">
          <header className="mb-8 pt-16 text-center md:pt-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2"
            >
              AI Account Formatter
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500"
            >
              一键转换账号信息为标准客户文案
            </motion.p>
          </header>

          <div className="relative">
            <motion.img
              src={catMascot}
              alt="猫咪吉祥物"
              initial={{ opacity: 0, y: 12, rotate: -8 }}
              animate={{ opacity: 1, y: [0, -4, 0], rotate: [-8, -5, -8] }}
              transition={{
                opacity: { duration: 0.35, ease: "easeOut" },
                y: {
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="mascot-cat pointer-events-none absolute left-3 -top-[2.5rem] z-20 w-20 select-none drop-shadow-[0_18px_30px_rgba(82,96,165,0.28)] md:left-8 md:-top-[4rem] md:w-28"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/78 backdrop-blur-[28px] rounded-3xl shadow-[0_28px_80px_rgba(102,118,185,0.22)] border border-white/75 overflow-hidden"
            >
            <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 border-b border-slate-100/80 bg-white/50">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">
                    Account Mode
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    默认使用 Gemini 转换，可随时切换到 ChatGPT 转换。
                  </p>
                </div>

                <div className="inline-flex p-1 rounded-2xl bg-slate-100/85 border border-white shadow-sm">
                  {FORMATTER_MODES.map((mode) => {
                    const isActive = activeMode === mode;

                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleModeChange(mode)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {FORMATTER_UI[mode].tabLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <ExternalLink size={18} />
                  </div>
                  <h2 className="text-xl font-semibold">原始数据输入</h2>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-500">
                    {activeConfig.inputLabel}
                  </label>
                  <textarea
                    value={currentInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={activeConfig.placeholder}
                    className="w-full h-64 p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none font-mono text-sm shadow-inner"
                  />

                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <ShieldCheck size={14} /> 提示
                    </h3>
                    <p className="text-xs text-indigo-700 leading-relaxed">
                      {activeConfig.tip}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-slate-50/30 flex flex-col">
                <div className="flex items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                      <Check size={18} />
                    </div>
                    <h2 className="text-xl font-semibold">生成结果预览</h2>
                  </div>

                  {validParsedData && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopy}
                      className={copyButtonClassName(copied)}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      {copied ? "复制成功" : "一键复制"}
                    </motion.button>
                  )}
                </div>

                <div className="flex-1 relative">
                  <AnimatePresence mode="wait">
                    {!currentInput.trim() ? (
                      <motion.div
                        key={`${activeMode}-empty`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-12"
                      >
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                          <ExternalLink size={32} />
                        </div>
                        <p>等待输入数据...</p>
                      </motion.div>
                    ) : parsedData && isParseError(parsedData) ? (
                      <motion.div
                        key={`${activeMode}-error`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center text-rose-500 space-y-3 py-12"
                      >
                        <AlertCircle size={48} />
                        <p className="font-medium">{parsedData.error}</p>
                      </motion.div>
                    ) : validParsedData ? (
                      <motion.div
                        key={`${activeMode}-content`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full overflow-auto whitespace-pre-wrap text-sm leading-relaxed"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 pb-6 border-bottom border-slate-100 border-dashed border-b">
                          {PREVIEW_FIELDS[activeMode].map((field) => {
                            const Icon = field.icon;

                            return (
                              <div
                                key={field.label}
                                className={`p-3 rounded-lg ${field.cardClass}`}
                              >
                                <div
                                  className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${field.labelClass}`}
                                >
                                  <Icon size={10} /> {field.label}
                                </div>
                                <div className="text-xs font-mono break-all">
                                  {field.getValue(validParsedData)}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="text-slate-700 font-medium">
                          {formattedText}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-amber-50/56 backdrop-blur-[24px] rounded-3xl p-6 md:p-8 border border-amber-100/85 shadow-[0_24px_70px_rgba(214,177,103,0.16)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-900">
                  🛑 必读事项 (重要警告)
                </h2>
                <p className="text-sm text-amber-700/70">
                  请务必仔细阅读以下内容，以免造成账号损失
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-2xl border border-amber-200/50">
                  <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <Lock size={16} /> 禁止立刻修改密码
                  </h3>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    登录后请勿立即更改密码，否则极易触发风控导致封号。因登录后立刻改密导致的封号，不提供任何售后！
                  </p>
                </div>

                <div className="bg-white/60 p-4 rounded-2xl border border-amber-200/50">
                  <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <ExternalLink size={16} /> 请勿频繁切换登录
                  </h3>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    不要频繁登入登出，建议在固定设备上保持登录。
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-2xl border border-amber-200/50">
                  <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} /> 养号期 (7-30天)
                  </h3>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    建议始终使用固定且纯净的IP（推荐美国IP）登录使用，稳定使用
                    7-30 天后再进行修改密码、绑定手机等敏感操作。
                  </p>
                </div>

                <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-200">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Info size={16} /> 安全设置指南
                  </h3>
                  <ul className="text-xs space-y-2 opacity-90">
                    <li className="flex justify-between">
                      <span>1. 登出陌生设备</span>{" "}
                      <span className="font-mono bg-white/20 px-1 rounded">
                        管理设备
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>2. 添加辅助邮箱</span>{" "}
                      <span className="font-mono bg-white/20 px-1 rounded">
                        设置恢复邮箱
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>3. 修改 2FA 设置</span>{" "}
                      <span className="font-mono bg-white/20 px-1 rounded">
                        管理验证器
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>4. 绑定手机号</span>{" "}
                      <span className="font-mono bg-white/20 px-1 rounded">
                        建议长期绑定
                      </span>
                    </li>
                    <li className="flex justify-between font-bold text-amber-300">
                      <span>5. 修改密码</span> <span>⚠️ 最后一步再改</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-amber-200/30 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMustReadCopy}
                className={copyButtonClassName(mustReadCopied)}
              >
                {mustReadCopied ? <Check size={18} /> : <Copy size={18} />}
                {mustReadCopied ? "复制成功" : "复制纯文本必读事项"}
              </motion.button>
            </div>
          </motion.div>

          <footer className="mt-8 text-center text-slate-400 text-xs">
            <p>© 2026 AI Account Formatter • 极简、高效、安全</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
