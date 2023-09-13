<template>
  <div class="outer">
    <div class="input-box">
      <el-input v-model="name" maxlength="16" placeholder="Name" />
      <el-input v-model="email" maxlength="32" placeholder="Email address" />
      <el-button class="btn" :onClick="handlePost" type="primary"
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
import { ElMessage } from "element-plus";

const name = ref("");
const email = ref("");
const pageOne = ref("");
const handlePost = async () => {
  await postEmail({ user_name: name.value, email: email.value })
    .then((res) => {
      if (res.errCode === -1) {
        ElMessage.error({
          message: res.errMsg,
        });
        console.log(res.errMsg);
      } else {
        ElMessage({
          message: res.payload,
          type: "success",
        });
      }
      console.log(res);
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

.input-box {
  display: inline-flex;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 302px;
  height: 272px;
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
</style>