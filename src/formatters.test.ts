import test from "node:test";
import assert from "node:assert/strict";
import {
  buildFormattedText,
  parseAccountInput,
  type FormatterMode,
} from "./formatters";

test("parses valid Gemini account input", () => {
  const result = parseAccountInput(
    "gemini",
    "demo@gmail.com----pass123----recovery@hotmail.com----ABCDEF123456",
  );

  assert.deepEqual(result, {
    account: "demo@gmail.com",
    password: "pass123",
    recovery: "recovery@hotmail.com",
    twoFA: "ABCDEF123456",
  });
});

test("returns a helpful error for incomplete Gemini input", () => {
  const result = parseAccountInput("gemini", "demo@gmail.com----pass123");

  assert.deepEqual(result, {
    error: '输入格式不正确，请检查是否包含 3 个 "----"',
  });
});

test("parses valid ChatGPT account input", () => {
  const result = parseAccountInput(
    "chatgpt",
    "MoralesNishat623@gmail.com|cwbfj2ryi|higazibasanb@hotmail.com|pod7jgy6x4x3govknmablcilyx45c3t3|United States",
  );

  assert.deepEqual(result, {
    account: "MoralesNishat623@gmail.com",
    password: "cwbfj2ryi",
    recovery: "higazibasanb@hotmail.com",
    twoFA: "pod7jgy6x4x3govknmablcilyx45c3t3",
    country: "United States",
  });
});

test("returns a helpful error for incomplete ChatGPT input", () => {
  const result = parseAccountInput(
    "chatgpt",
    "MoralesNishat623@gmail.com|cwbfj2ryi|pod7jgy6x4x3govknmablcilyx45c3t3",
  );

  assert.deepEqual(result, {
    error: '输入格式不正确，请检查是否包含 4 个 "|"',
  });
});

test("builds Gemini formatted text", () => {
  const formatted = buildFormattedText("gemini", {
    account: "demo@gmail.com",
    password: "pass123",
    recovery: "recovery@hotmail.com",
    twoFA: "ABCDEF123456",
  });

  assert.equal(
    formatted,
    `账号信息：
账号：demo@gmail.com
密码：pass123
辅助邮箱：recovery@hotmail.com
2fa：ABCDEF123456

如何使用2fa，如何登录？
1：首先打开 https://2fa.fun/index.html 网站
2：输入密钥：ABCDEF123456
3：获取验证码（30秒会刷新一次）
4: 打开魔法上网工具（选择美区节点），打开Google浏览器
5：输入账号密码登录，然后如果让验证就点其他验证方法，
6：点身份验证器，输入刚才让你准备的验证码
7：登陆之后截图给我

最后一步：
进入 https://gemini.google.com ，开始享用`,
  );
});

test("builds ChatGPT formatted text", () => {
  const formatted = buildFormattedText("chatgpt", {
    account: "MoralesNishat623@gmail.com",
    password: "cwbfj2ryi",
    recovery: "higazibasanb@hotmail.com",
    twoFA: "pod7jgy6x4x3govknmablcilyx45c3t3",
    country: "United States",
  });

  assert.equal(
    formatted,
    `GPT Plus账号信息：
账号：MoralesNishat623@gmail.com
密码：cwbfj2ryi
2FA：pod7jgy6x4x3govknmablcilyx45c3t3

如何登录？教程如下：
打开https://2faclock.com/这个网站
在这个网站里输入上面的2FA
这个是获取登录验证码的 这个密钥保存好
然后打开全局的美国节点代理
（代理-》全局-》美国节点-》打开系统代理），
打开https://chatgpt.com，登录gpt，选择Google登录，
输入你的账号密码，然后选择身份验证器登录 输入刚刚获取的验证码
就可以正常使用了！`,
  );
});

test("keeps formatter modes typed", () => {
  const modes: FormatterMode[] = ["gemini", "chatgpt"];
  assert.deepEqual(modes, ["gemini", "chatgpt"]);
});
