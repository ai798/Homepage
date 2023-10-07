<template>
  <el-dialog
    v-model="showDialog"
    title="Tips"
    width="30%"
    :before-close="handleClose"
  >
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handlePostImprove">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, watch, toRefs } from "vue";
import { ElMessageBox } from "element-plus";
const props = defineProps({
  isShowImprove: {
    type: Boolean,
    default: false,
  },
});
const showDialog = ref(false);
const handlePostImprove = () => {
  console.log();
};
const { isShowImprove } = toRefs(props);
watch(isShowImprove, (val) => {
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
  