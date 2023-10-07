<template>
  <el-dialog
    v-model="showDialog"
    title="Generate Script"
    width="30%"
    :before-close="handleClose"
  >
    <div>Scene</div>
    <div>
      <el-checkbox-group v-model="sceneOption" size="large">
        <el-checkbox-button v-for="scene in scenes" :key="scene" :label="scene">
          {{ scene }}
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div>Video duration</div>
    <div>
      <el-checkbox-group v-model="durationOption" size="large">
        <el-checkbox-button v-for="duration in durations" :key="duration" :label="duration">
          {{ duration }}
        </el-checkbox-button>
      </el-checkbox-group>
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
const sceneOption = ref([""]);
const durationOption = ref([""]);
const scenes = ["Restaurant", "School", "Toilet", "Gym", "Hotel", "Other"];
const durations = ["60s", "90s", "120s"];
const showDialog = ref(false);
const handlePostGenerate = () => {
  console.log();
};
const { isShowGenerate } = toRefs(props);
watch(isShowGenerate, (val) => {
  showDialog.value = val;
});
const emits = defineEmits(["closeDialog"]);
const dialogVisible = ref(false);

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      emits("closeDialog");
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>
    <style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
    