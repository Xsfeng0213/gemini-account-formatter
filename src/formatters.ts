export type FormatterMode = "gemini" | "chatgpt";

export type GeminiAccountData = {
  account: string;
  password: string;
  recovery: string;
  twoFA: string;
};

export type ChatGptAccountData = {
  account: string;
  password: string;
  recovery: string;
  twoFA: string;
  country: string;
};

export type ParsedAccountData = GeminiAccountData | ChatGptAccountData;

export type ParseError = {
  error: string;
};

const GEMINI_ERROR =
  '输入格式不正确，请检查是否包含 3 个 "----"';
const CHATGPT_ERROR =
  '输入格式不正确，请检查是否包含 4 个 "|"';

export function parseAccountInput(
  mode: "gemini",
  input: string,
): GeminiAccountData | ParseError;
export function parseAccountInput(
  mode: "chatgpt",
  input: string,
): ChatGptAccountData | ParseError;
export function parseAccountInput(
  mode: FormatterMode,
  input: string,
): ParsedAccountData | ParseError {
  const parts =
    mode === "gemini" ? input.split("----") : input.split("|");

  if (mode === "gemini") {
    if (parts.length < 4) {
      return { error: GEMINI_ERROR };
    }

    return {
      account: parts[0].trim(),
      password: parts[1].trim(),
      recovery: parts[2].trim(),
      twoFA: parts[3].trim(),
    };
  }

  if (parts.length < 5) {
    return { error: CHATGPT_ERROR };
  }

  return {
    account: parts[0].trim(),
    password: parts[1].trim(),
    recovery: parts[2].trim(),
    twoFA: parts[3].trim(),
    country: parts[4].trim(),
  };
}

export function buildFormattedText(
  mode: "gemini",
  data: GeminiAccountData,
): string;
export function buildFormattedText(
  mode: "chatgpt",
  data: ChatGptAccountData,
): string;
export function buildFormattedText(
  mode: FormatterMode,
  data: ParsedAccountData,
): string {
  if (mode === "gemini") {
    return `账号信息：
账号：${data.account}
密码：${data.password}
辅助邮箱：${data.recovery}
2fa：${data.twoFA}

如何使用2fa，如何登录？
1：首先打开 https://2fa.fun/index.html 网站
2：输入密钥：${data.twoFA}
3：获取验证码（30秒会刷新一次）
4: 打开魔法上网工具（选择美区节点），打开Google浏览器
5：输入账号密码登录，然后如果让验证就点其他验证方法，
6：点身份验证器，输入刚才让你准备的验证码
7：登陆之后截图给我

最后一步：
进入 https://gemini.google.com ，开始享用`;
  }

  return `GPT Plus账号信息：
账号：${data.account}
密码：${data.password}
2FA：${data.twoFA}

如何登录？教程如下：
打开https://2faclock.com/这个网站
在这个网站里输入上面的2FA
这个是获取登录验证码的 这个密钥保存好
然后打开全局的美国节点代理
（代理-》全局-》美国节点-》打开系统代理），
打开https://chatgpt.com，登录gpt，选择Google登录，
输入你的账号密码，然后选择身份验证器登录 输入刚刚获取的验证码
就可以正常使用了！`;
}

export function isParseError(
  value: ParsedAccountData | ParseError,
): value is ParseError {
  return "error" in value;
}
