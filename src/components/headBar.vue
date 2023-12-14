<template>
  <div class="head">
    <div class="logo">
      <img src="@/assets/logo.png" alt="" />
    </div>
    <div class="base-info">
      <!-- <img src="@/assets/Twitter.png" alt="" />
      <img class="dis" src="@/assets/Discord.png" alt="" />
      <div class="line-box">
        <img class="com" src="@/assets/Communication.png" alt="" />
      </div> -->
      <div class="right-box">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ lang }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="jp">日本語</el-dropdown-item>
              <el-dropdown-item command="en"> English </el-dropdown-item>
              <el-dropdown-item command="cn">简体中文</el-dropdown-item>
              <el-dropdown-item command="fn">繁體中文</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <div class="head-box"></div> -->
      </div>
    </div>
  </div>
</template>
    
<script setup lang='ts'>
import {
  ArrowDown,
  Check,
  CircleCheck,
  CirclePlus,
  CirclePlusFilled,
  Plus,
} from "@element-plus/icons-vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
const langSet: any = {
  jp: "日本語",
  en: "English",
  cn: "简体中文",
  fn: "繁體中文",
};
const lang: any = ref("");
lang.value = langSet[window.localStorage.getItem("lang") ?? "en"];
const handleCommand = (command: string) => {
  console.log(locale);
  lang.value = langSet[command];
  locale.value = command;
  window.localStorage.setItem("lang", locale.value);
};
</script>
    
<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: space-between;
  background: #fff;
  width: 100%;
  height: 64px;
  flex-shrink: 0;
  padding: 0 12px;
  .logo {
    margin: auto 0;
    margin-left: 12px;
    img {
      width: 191px;
      height: 28px;
    }
  }
  .base-info {
    display: flex;
    align-items: center;
    margin: auto 0;
    img {
      cursor: pointer;
      width: 100px;
      height: 32px;
    }
    .dis {
      margin: 0 16px;
    }
    .com {
      width: 127px;
    }
  }
  .line-box {
    position: relative;
    height: 32px;
  }
  .line-box::after {
    content: "";
    width: 1px;
    height: 25px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    right: 0;
    background: rgba(0, 0, 0, 0.05);
  }
  .right-box {
    cursor: pointer;
    .el-dropdown {
      line-height: 64px;
      margin: 0 10px;
    }
    display: flex;
    align-items: center;
    .head-box {
      width: 28px;
      height: 28px;
      border-radius: 28px;
      border: 1px solid #fff;
      background: url(<path-to-image>), lightgray 50% / cover no-repeat;
    }
  }
}
</style>