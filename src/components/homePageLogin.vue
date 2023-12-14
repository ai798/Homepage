<template>
  <div class="seo-text">
    <i>AI Script Pro</i>
    <i>AI Script </i>
    <i>Video AI</i>
    <i>TikTok Script</i>
    <i>TikTok Script Generator</i>
    <i>How to generate TikTok script</i>
    <i>Script AI</i>
    <i>How to use AI Script Pro </i>
    <i>Generate Script </i>
    <i>Video Script AI</i>
    <i>Youtube AI </i>
    <i>Video Summary </i>
    <i>Video to Tweet</i>
    <i>Twitter AI </i>
    <i>Video to script</i>
  </div>
  <img
    class="hint-box"
    v-if="hasSuccess"
    src="@/assets/Notification.png"
    alt=""
  />
  <div class="outer-box">
    <div class="input-box" v-if="showLogin">
      <img class="login_logo" src="@/assets/login-logo.png" alt="" />
      <h2>Log In</h2>
      <p>Don't have an account? <a @click="handleShwSignUp">Sign Up</a></p>
      <p class="align">Account</p>
      <el-input
        v-model="name"
        placeholder="Enter your email address"
        clearable
      />
      <p class="align">Password</p>
      <el-input
        v-model="password"
        minlength="8"
        maxlength="32"
        placeholder="Enter your password"
        show-password
      />
      <el-button
        color="#1454FF"
        class="btn"
        :onClick="handleLogin"
        type="primary"
        >Log In</el-button
      >
      <a @click="handleResetPassword">Forgot your password</a>
    </div>
    <div class="input-box sign-in" v-if="!showLogin">
      <img class="login_logo" src="@/assets/login-logo.png" alt="" />
      <h2>Sign Up</h2>
      <p style="margin: 0 0">
        Already have an account? <a @click="handleGoToLogin">Log in</a>
      </p>
      <p class="align">Account</p>
      <el-input
        v-model="name"
        placeholder="Enter your email address"
        clearable
      />
      <p class="align">Verification Code</p>
      <div class="ver-code">
        <el-input v-model="verifyCode" maxlength="16" />
        <el-button
          v-if="!sms.disabled"
          color="#1454FF"
          class="btn"
          type="default"
          @click="handleSendCode"
          >{{ sendCodeText }}</el-button
        >
        <el-button v-else color="#C5C6CA" class="btn" type="default" disabled
          >{{ sms.count }}
        </el-button>
        <!-- <el-button
          color="#1454FF"
          class="btn"
          :onClick="handleSendCode"
          type="primary"
          >{{ sendCodeText }}</el-button
        > -->
      </div>
      <p class="align">Password</p>
      <el-input
        v-model="password"
        minlength="8"
        maxlength="32"
        placeholder="8-16 digits or letters"
        show-password
      />

      <el-button
        color="#1454FF"
        class="btn"
        :onClick="handleRegist"
        type="primary"
        >Register</el-button
      >
    </div>
    <!-- reset password-->
    <div class="input-box sign-in" v-if="resetPassword">
      <img class="login_logo" src="@/assets/login-logo.png" alt="" />
      <h2>Reset Password</h2>
      <p style="margin: 0 0">Back to <a @click="handleGoToLogin">Log in</a></p>
      <p class="align">Account</p>
      <el-input
        v-model="name"
        placeholder="Enter your email address"
        clearable
      />
      <p class="align">Verification Code</p>
      <div class="ver-code">
        <el-input v-model="verifyCode" maxlength="16" />
        <el-button
          v-if="!sms.disabled"
          color="#1454FF"
          class="btn"
          type="default"
          @click="handleSendCode"
          >{{ sendCodeText }}</el-button
        >
        <el-button v-else color="#C5C6CA" class="btn" type="default" disabled
          >{{ sms.count }}
        </el-button>
        <!-- <el-button
          color="#1454FF"
          class="btn"
          :onClick="handleSendCode"
          type="primary"
          >{{ sendCodeText }}</el-button
        > -->
      </div>
      <p class="align">Password</p>
      <el-input
        v-model="password"
        minlength="8"
        maxlength="32"
        placeholder="8-16 digits or letters"
        show-password
      />

      <el-button
        color="#1454FF"
        class="btn"
        :onClick="handleReset"
        type="primary"
        >Reset</el-button
      >
    </div>
    <img src="@/assets/headerMenu.jpg" alt="" />
  </div>
  <img src="@/assets/page-one.jpg" alt="" />
  <img src="@/assets/page-two.jpg" alt="" />
  <img src="@/assets/page-three.jpg" alt="" />
  <img src="@/assets/page-four.jpg" alt="" />
</template>

<script lang="ts" setup>
useI18n();
import { ref, reactive, computed, onMounted } from "vue";
import { register, sendCode, reset, getProfile } from "../api/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from "vuex";

import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const { dispatch, state } = useStore();
const name = ref("");
const password = ref("");
const verifyCode = ref("");
const resetPassword = ref(false);
const sendCodeText = ref("Send");
const verifyType = computed(() => {
  return resetPassword.value ? "02" : "01";
});
const hasSended = ref(false);
const hasSuccess = ref(false);
const isSending = ref(false);
const showLogin = ref(true);
const timeout = ref(null as any);
const router = useRouter();

onMounted(() => {
  let token = window.localStorage.getItem("script_pro_token");
  // console.log(token);
  if (token) {
    getProfile()
      .then((res) => {
        console.log("res", res);
        if (res && res.errCode === 0) {
          router.push("/chat");
        }
      })
      .catch((err) => {
        window.localStorage.removeItem("script_pro_token");
        console.log("err", err);
      });
  } else {
    window.localStorage.removeItem("script_pro_token");
    return;
  }
});
const resetForm = () => {
  name.value = "";
  password.value = "";
  verifyCode.value = "";
};
const sms = reactive({
  disabled: false,
  total: 60,
  count: 0,
});
const handleResetPassword = () => {
  resetPassword.value = !resetPassword.value;
  showLogin.value = false;
  resetForm();
};
const handleShwSignUp = () => {
  showLogin.value = !showLogin.value;
  resetForm();
};
const handleGoToLogin = () => {
  showLogin.value = true;
  resetPassword.value = false;
  resetForm();
};
const timerHandler = () => {
  sms.count = sms.total;
  sms.disabled = true;

  let timer = setInterval(() => {
    if (sms.count > 1 && sms.count <= sms.total) {
      sms.count--;
    } else {
      sms.disabled = false;
      isSending.value = false;
      clearInterval(timer);
    }
  }, 1000);
  sendCodeText.value = "Resend";
};
const handleSendCode = async () => {
  if (isSending.value) return;

  if (!name.value) {
    console.log(123123);
    return;
  }
  let resObj = {
    email: name.value,
    verify_type: verifyType.value,
  };
  await sendCode(resObj).then((res) => {
    if (res.errCode === 0) {
      ElMessage({
        customClass: "success",
        message: "Message Sended",
      });
      isSending.value = true;
      timerHandler();
      hasSended.value = true;
    }
  });
};
const handleRegist = async () => {
  let resObj = {
    email: name.value,
    password: password.value,
    verify_code: verifyCode.value,
  };
  await register(resObj).then((res) => {
    console.log(res);
    if (res.errCode === 0) {
      ElMessage({
        customClass: "success",
        message: "Register successed",
      });
      window.localStorage.setItem("script_pro_token", res.payload.token.access);
      router.push("/chat");
    } else {
      ElMessage.error({
        customClass: "error",
        message: res.errMsg,
      });
    }
  });
};
const handleLogin = () => {
  if (!name.value) {
    ElMessage.error({
      customClass: "error",
      message: "Please Input Your Email",
    });
    return;
  }
  if (!password.value) {
    ElMessage.error({
      customClass: "error",
      message: "Please Input Your Password",
    });
    return;
  }
  let loginObj = {
    email: name.value,
    password: password.value,
  };
  dispatch("index/login", loginObj);
};
const handleReset = async () => {
  if (!password.value) {
    ElMessage.error({
      customClass: "error",
      message: "Please Input Your Password",
    });
    return;
  }
  if (!name.value) {
    ElMessage.error({
      customClass: "error",
      message: "Please Input Your Email",
    });
    return;
  }
  let resetObj = {
    email: name.value,
    password: password.value,
    verify_code: verifyCode.value,
  };
  await reset(resetObj).then((res) => {
    console.log(res);
    if (res.errCode === 0) {
      ElMessage({
        customClass: "success",
        message: "Reset password successed",
      });
      handleGoToLogin();
    } else {
      ElMessage.error({
        customClass: "error",
        message: res.errMsg,
      });
    }
  });
};
</script>
<style scoped>

img {
  width: 100%;
}
.outer-box {
  position: relative;
}

.ver-code {
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-self: flex-start;
  width: 100%;
}
.ver-code > .el-input {
  display: flex;
  width: 210px;
  height: 56px;
  padding-right: 8px;
  align-items: center;
  flex-shrink: 0;
}
.ver-code > .el-button {
  display: flex;
  width: 93px;
  height: 56px;
  padding: 7px 24px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin: 0;
}
.align {
  align-self: flex-start;
}

@media screen and (max-width: 550px) {
  .input-box {
    border-radius: 24px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: #fff;
    box-shadow: 0px 12px 24px 0px rgba(0, 0, 0, 0.05);
    display: inline-flex;
    padding: 24px;
    flex-direction: column;
    align-items: center;
    position: absolute;
    border-radius: 24px;
    right: 60px;
    top: 65px;
    width: 110px;
    height: 120px;
  }
  .el-input {
    display: flex;
    width: 130px;
    height: 26px;
    align-items: center;
    gap: 16px;
    border-radius: 8px;
  }
  /deep/ .el-input__wrapper {
    border-radius: 8px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: #fff;
    font-size: 4px;
    width: 82px;
    height: 26px;
  }
  /deep/ .el-input__wrapper .is-focus {
    width: 82px;
    height: 26px;
    background: rgba(255, 255, 255, 0.3);
  }
  .btn {
    border-radius: 8px;
    background: var(--, #1454ff);
    display: flex;
    width: 130px;
    height: 36px;
    padding: 7px 24px;
    justify-content: center;
    align-items: center;
    margin-top: 4px;
  }
}
@media screen and (min-width: 550px) and (max-width: 900px) {
  .input-box {
    border-radius: 24px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: #fff;
    box-shadow: 0px 12px 24px 0px rgba(0, 0, 0, 0.05);
    display: inline-flex;
    padding: 24px;
    flex-direction: column;
    align-items: center;
    position: absolute;
    border-radius: 24px;
    right: 100px;
    top: 165px;
    width: 210px;
    height: 200px;
  }
  .el-input {
    display: flex;
    height: 46px;
    align-items: center;
    border-radius: 8px;
  }
  /deep/ .el-input__wrapper:hover {
  }
  /deep/ .el-input__wrapper {
    border-radius: 8px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: #fff;
    font-size: 4px;
    width: 242px;
    height: 46px;
  }
  /deep/ .el-input__wrapper .is-focus {
    border-radius: 8px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: #fff;
    width: 302px;
    height: 56px;
  }
  .btn {
    border-radius: 8px;
    background: var(--, #1454ff);
    display: flex;
    width: 222px;
    height: 56px;
    padding: 7px 24px;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
  }
}
@media screen and (min-width: 900px) {
  .sign-in {
    height: 562px !important;
  }
  .input-box {
    border-radius: 24px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: #fff;
    box-shadow: 0px 12px 24px 0px rgba(0, 0, 0, 0.05);
    height: 486px;
    flex-shrink: 0;
    display: inline-flex;
    padding: 24px;
    flex-direction: column;
    align-items: center;
    width: 302px;
    position: absolute;
    border-radius: 24px;
    right: 100px;
    top: 150px;
  }
  .el-input {
    display: flex;
    width: 302px;
    height: 56px;
    align-items: center;
    gap: 16px;
    border-radius: 8px;
  }
  h2 {
    text-align: center;
    font-size: 30px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
  }
  .login_logo {
    position: absolute;
    width: 76px;
    height: 56px;
    flex-shrink: 0;
    z-index: 1;
    top: -25px;
  }
  /deep/ .el-input__wrapper:hover {
  }
  /deep/ .el-input__wrapper {
    border-radius: 8px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: #fff;
    width: 302px;
    height: 56px;
  }
  /deep/ .el-input__wrapper .is-focus {
    width: 302px;
    height: 56px;
    background: rgba(255, 255, 255, 0.3);
  }
  .btn {
    border-radius: 8px;
    background: var(--, #1454ff);
    display: flex;
    width: 302px;
    height: 56px;
    padding: 7px 24px;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
  }
}

.hint {
  width: 384px;
  height: 108px;
  position: absolute;

  border-radius: 6px;
  border: 0.5px solid var(--gray-gray-4, #dcdcdc);
  background: var(--gray-white, #fff);

  /* Shadow/Shadow-3 上层投影 */
  box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.08),
    0px 16px 24px 2px rgba(0, 0, 0, 0.04), 0px 6px 30px 5px rgba(0, 0, 0, 0.05);
}
.hint-box {
  position: absolute;
  top: 5%;
  left: 50%;
  z-index: 2;
  width: 500px;
  height: 190px;
  transform: translate(-50%);
}
/deep/.err_type {
  position: absolute;
}
.el-message--error {
  border: 1px dashed balck;
  position: absolute;
}
.seo-text {
  display: none;
}
a {
  text-decoration-line: underline;
  cursor: pointer;
}
</style>