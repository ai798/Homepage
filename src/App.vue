<template>
  <img
    class="hint-box"
    v-if="hasSuccess"
    src="./assets/Notification.png"
    alt=""
  />
  <div class="outer">
    <div class="input-box">
      <el-input v-model="name" maxlength="16" placeholder="Name" />
      <el-input v-model="email" maxlength="32" placeholder="Email address" />
      <el-button color="#1454FF" class="btn" :onClick="handlePost" type="primary"
        >Reserve</el-button
      >
    </div>
    <img src="./assets/headerMenu.jpg" alt="" />
  </div>
  <img src="./assets/page-one.jpg" alt="" />
  <img src="./assets/page-two.jpg" alt="" />
  <img src="./assets/page-three.jpg" alt="" />
  <img src="./assets/page-four.jpg" alt="" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { postEmail } from "./api/index";
import { ElMessage, ElMessageBox } from "element-plus";
import type { Action } from "element-plus";

import axios from "axios";
const name = ref("");
const email = ref("");
const hasSuccess = ref(false);
const pageOne = ref("");
const hintText = ref("");
const timeout = ref(null as any);
// const handlePost = () => {
//   axios
//     .post("http://localhost:8081/post_email", {
//       user_name: name.value,
//       email: email.value,
//     })
//     .then((res: any) => {
//       timeout.value = null;
//       if (res.data.errCode === -1) {
//         ElMessage.error({
//           customClass: "err_type",
//           message: res.data.errMsg,
//         });
//         // hintText.value = res.data.errMsg;
//       } else {
//         hasSuccess.value = true;
//       }
//       timeout.value = window.setTimeout(() => {
//         hasSuccess.value = false;
//       }, 1500);
//       console.log("res", res.data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
const handlePost = async () => {
  postEmail({ user_name: name.value, email: email.value })
    .then((res) => {
      timeout.value = null;
      if (res.data.errCode === -1) {
        ElMessage.error({
          message: res.data.errMsg,
        });
        console.log(res.data.errMsg);
      } else {
        hasSuccess.value = true;
      }
      timeout.value = window.setTimeout(() => {
        hasSuccess.value = false;
      }, 1500);
      console.log("res", res.data);
    })
    .catch((err) => {
      ElMessage.error({
        message: err,
      });
    });
  console.log(name.value, email.value);
};
</script>
<style scoped >
img {
  width: 100%;
  height: 100%;
}
.outer {
  position: relative;
}
@media screen and (max-width: 550px) {
  .input-box {
    display: inline-flex;
    padding: 24px;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    position: absolute;
    border-radius: 24px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: rgba(255, 255, 255, 0.3);
    right: 60px;
    top: 65px;
    width: 110px;
    height: 120px;
  }
  .el-input {
    display: flex;
    width: 130px;
    height: 26px;
    padding: 8px 12px;
    align-items: center;
    gap: 16px;
    border-radius: 8px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: none;
    border: none;
  }
  /deep/ .el-input__wrapper:hover {
    box-shadow: none;
    border: none;
  }
  /deep/ .el-input__wrapper {
    font-size: 4px;
    width: 82px;
    height: 26px;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    box-shadow: none;
  }
  /deep/ .el-input__wrapper .is-focus {
    width: 82px;
    height: 26px;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    box-shadow: none;
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
    display: inline-flex;
    padding: 24px;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    position: absolute;
    border-radius: 24px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: rgba(255, 255, 255, 0.3);
    right: 100px;
    top: 165px;
    width: 210px;
    height: 200px;
  }
  .el-input {
    display: flex;
    width: 242px;
    height: 46px;
    padding: 8px 12px;
    align-items: center;
    gap: 16px;
    border-radius: 8px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: none;
    border: none;
  }
  /deep/ .el-input__wrapper:hover {
    box-shadow: none;
    border: none;
  }
  /deep/ .el-input__wrapper {
    font-size: 4px;
    width: 242px;
    height: 46px;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    box-shadow: none;
  }
  /deep/ .el-input__wrapper .is-focus {
    width: 302px;
    height: 56px;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    box-shadow: none;
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
  .input-box {
    display: inline-flex;
    padding: 24px;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    width: 302px;
    position: absolute;
    border-radius: 24px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: rgba(255, 255, 255, 0.3);
    right: 100px;
    top: 265px;
  }
  .el-input {
    display: flex;
    width: 302px;
    height: 56px;
    padding: 8px 12px;
    align-items: center;
    gap: 16px;
    border-radius: 8px;
    border: 1px solid rgba(17, 24, 39, 0.1);
    background: none;
    border: none;
  }
  /deep/ .el-input__wrapper:hover {
    box-shadow: none;
    border: none;
  }
  /deep/ .el-input__wrapper {
    width: 302px;
    height: 56px;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    box-shadow: none;
  }
  /deep/ .el-input__wrapper .is-focus {
    width: 302px;
    height: 56px;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    box-shadow: none;
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
</style>