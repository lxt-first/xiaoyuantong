import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { ToastContainer, showToast } from "../components/BottomSheet";

export default function Login() {
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError("请输入有效手机号");
      return;
    }
    try {
      const user = await api.login(phone);
      const { token, ...userData } = user as any;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      showToast("登录成功");
      setTimeout(() => nav("/"), 500);
    } catch (e: any) {
      setError(e.message || "登录失败");
    }
  };

  return (
    <div className="app-shell">
      <ToastContainer />
      <div className="nav-bar">
        <span className="nav-back" onClick={() => nav("/")}>← 返回</span>
        <span className="nav-title">登录</span>
        <span />
      </div>

      <div className="login-body">
        <div className="login-logo">🏫</div>
        <div className="login-title">欢迎使用校园通</div>
        <div className="login-subtitle">手机号快捷登录，校友身份背书</div>

        <div className="login-form">
          <div className="form-group">
            <label className="form-label">手机号 <span className="form-required">*</span></label>
            <input
              className="login-input"
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError(""); }}
              maxLength={11}
            />
          </div>

          {error && <div style={{ color: "#DC2626", fontSize: 13, marginTop: -12, marginBottom: 12 }}>{error}</div>}

          <button className="btn btn-primary btn-block" onClick={handleLogin}>
            登录 / 注册
          </button>

          <div className="login-agreement">
            登录即表示同意 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a>
          </div>
        </div>
      </div>
    </div>
  );
}
