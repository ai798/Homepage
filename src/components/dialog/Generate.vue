<template>
  <el-dialog
    v-model="showDialog"
    title="Generate Script"
    width="664px"
    :before-close="handleClose"
  >
    <div class="outer_box">
      <!-- <div class="opt-box">
        <span class="title">Scene</span>
        <div class="inner-box">
          <el-checkbox-group v-model="sceneOption" size="large">
            <el-checkbox-button
              v-for="scene in scenes"
              :key="scene"
              :label="scene"
            >
              {{ scene }}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div> -->
      <div class="opt-box">
        <span class="title">Video duration</span>
        <div class="inner-box">
          <el-radio-group v-model="durationOption" size="large">
            <el-radio-button
              v-for="duration in durations"
              :key="duration"
              :label="duration"
            />
          </el-radio-group>
          <!-- <el-checkbox-group v-model="durationOption" size="large">
            <el-checkbox-button
              v-for="duration in durations"
              :key="duration"
              :label="duration"
            >
              {{ duration }}
            </el-checkbox-button>
          </el-checkbox-group> -->
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handlePostGenerate"> Send </el-button>
      </span>
    </template>
  </el-dialog>
</template>
    
  <script lang="ts" setup>
import { ref, watch, toRefs } from "vue";
import { ElMessageBox } from "element-plus";
const props = defineProps({
  isShowGenerate: {
    type: Boolean,
    default: false,
  },
});
const sceneOption = ref([]);
const durationOption = ref("");
const scenes = ["Restaurant", "School", "Toilet", "Gym", "Hotel", "Other"];
const durations = ["60", "90", "120"];
const showDialog = ref(false);
const handlePostGenerate = () => {
  console.log();
  emits("handleSubmit", sceneOption.value, durationOption.value);
  emits("closeDialog");
};
const { isShowGenerate } = toRefs(props);
watch(isShowGenerate, (val) => {
  showDialog.value = val;
});
const emits = defineEmits(["closeDialog", "handleSubmit"]);
const dialogVisible = ref(false);

const handleClose = (done: () => void) => {
  done();
  emits("closeDialog");

  // ElMessageBox.confirm("Are you sure to close this dialog?")
  //   .then(() => {
  //   })
  //   .catch(() => {
  //     // catch error
  //   });
};
</script>
<style lang="scss">
.outer_box {
  padding: 32px 24px;
  height: 168px;
}
.opt-box {
  width: 600px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  span {
    display: inline-flex;
    justify-content: flex-start;
  }
  .inner-box {
    display: flex;
  }
}
.title {
  overflow: hidden;
  color: var(--text-icon-font-gy-190-primary, rgba(0, 0, 0, 0.9));
  text-overflow: ellipsis;
  font-family: Source Code Pro;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 171.429% */
}
.el-checkbox-group {
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}
:deep(.el-dialog__header) {
  display: flex;
  justify-content: space-between;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
    