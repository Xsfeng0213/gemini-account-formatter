/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import {
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Key,
  Mail,
  Lock,
  Info,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MUST_READ_CONTENT } from "./constants/mustRead";

export default function App() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [mustReadCopied, setMustReadCopied] = useState(false);

  const parsedData = useMemo(() => {
    if (!input.trim()) return null;
    const parts = input.split("----");
    if (parts.length < 4)
      return { error: '输入格式不正确，请检查是否包含 3 个 "----"' };

    return {
      account: parts[0].trim(),
      password: parts[1].trim(),
      recovery: parts[2].trim(),
      twoFA: parts[3].trim(),
    };
  }, [input]);

  const formattedText = useMemo(() => {
    if (!parsedData || "error" in parsedData) return "";

    return `账号信息：
账号：${parsedData.account}
密码：${parsedData.password}
辅助邮箱：${parsedData.recovery}
2fa：${parsedData.twoFA}

如何使用2fa，如何登录？
1：首先打开 https://2fa.fun/index.html 网站
2：输入密钥：${parsedData.twoFA}
3：获取验证码（30秒会刷新一次）
4: 打开魔法上网工具（选择美区节点），打开Google浏览器
5：输入账号密码登录，然后如果让验证就点其他验证方法，
6：点身份验证器，输入刚才让你准备的验证码
7：登陆之后截图给我

最后一步：
进入 https://gemini.google.com ，开始享用`;
  }, [parsedData]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8 flex items-center justify-center font-sans text-slate-800">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <header className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2"
          >
            Gemini Account Formatter
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

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-100/50 border border-white overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* Left Column: Input */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <ExternalLink size={18} />
                </div>
                <h2 className="text-xl font-semibold">原始数据输入</h2>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-500">
                  粘贴格式：邮箱----密码----辅助邮箱----2fa密钥
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="xxxxxxx@gmail.com----xxxxxxx----xxxxxx@hotmail.com----xxxxxxxxxxxxxxxxxxx"
                  className="w-full h-64 p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none font-mono text-sm shadow-inner"
                />

                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <ShieldCheck size={14} /> 提示
                  </h3>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    系统会自动识别 "----"
                    分隔符并提取关键字段。请确保粘贴的信息完整。
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Output */}
            <div className="p-6 md:p-8 bg-slate-50/30 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                    <Check size={18} />
                  </div>
                  <h2 className="text-xl font-semibold">生成结果预览</h2>
                </div>

                {parsedData && !("error" in parsedData) && (
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
                  {!input.trim() ? (
                    <motion.div
                      key="empty"
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
                  ) : parsedData && "error" in parsedData ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-rose-500 space-y-3 py-12"
                    >
                      <AlertCircle size={48} />
                      <p className="font-medium">{parsedData.error}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full overflow-auto whitespace-pre-wrap text-sm leading-relaxed"
                    >
                      {/* Visual breakdown for user feedback */}
                      <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-bottom border-slate-100 border-dashed border-b">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-[10px] text-blue-500 font-bold uppercase mb-1 flex items-center gap-1">
                            <Mail size={10} /> 账号
                          </div>
                          <div className="text-xs font-mono truncate">
                            {parsedData?.account}
                          </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="text-[10px] text-purple-500 font-bold uppercase mb-1 flex items-center gap-1">
                            <Lock size={10} /> 密码
                          </div>
                          <div className="text-xs font-mono truncate">
                            {parsedData?.password}
                          </div>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg">
                          <div className="text-[10px] text-amber-500 font-bold uppercase mb-1 flex items-center gap-1">
                            <Mail size={10} /> 辅助邮箱
                          </div>
                          <div className="text-xs font-mono truncate">
                            {parsedData?.recovery}
                          </div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg">
                          <div className="text-[10px] text-emerald-500 font-bold uppercase mb-1 flex items-center gap-1">
                            <Key size={10} /> 2FA密钥
                          </div>
                          <div className="text-xs font-mono truncate">
                            {parsedData?.twoFA}
                          </div>
                        </div>
                      </div>

                      {/* The actual text to be copied */}
                      <div className="text-slate-700 font-medium">
                        {formattedText}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-amber-50/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-amber-100 shadow-xl shadow-amber-100/20"
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

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-400 text-xs">
          <p>© 2026 Gemini Account Formatter • 极简、高效、安全</p>
        </footer>
      </div>
    </div>
  );
}
