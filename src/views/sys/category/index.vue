<template>
  <div>
    <Breadcrumb />
    <div class="query-wrap">
      <el-button type="primary" @click="handleCreate">新增用户</el-button>
    </div>
    <Table
      :options="options"
      ref="table"
      @handleEdit="handleEdit"
      @handleRemove="handleRemove"
    />
    <el-dialog
      :visible.sync="removeVisible"
      width="30%"
      :before-close="
        () => {
          removeVisible = false;
        }
      "
      :show-close="false"
    >
      <span>是否删除该条数据?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeVisible = false">取 消</el-button>
        <el-button type="primary" @click="remvoveCategory">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="visible"
      width="30%"
      :before-close="handleColose"
      :show-close="false"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-width="4vw"
        :rules="rules"
      >
        <el-form-item label="分类名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button
          v-if="type === 'create'"
          type="primary"
          @click="createCategory"
          >新增</el-button
        >
        <el-button
          v-if="type === 'update'"
          type="primary"
          @click="createCategory"
          >修改</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import Table from "@/components/Table";
import { category_delete, category_create, category_put } from "@/api/category";
export default {
  components: { Breadcrumb, Table },
  data() {
    const options = {
      columns: [
        { prop: "actions", label: "操作", scope: "actions" },
        { prop: "id", label: "ID" },
        { prop: "name", label: "分类" },
        { prop: "createdAt", label: "创建时间", formatter: "time" },
        { prop: "updatedAt", label: "更新时间", formatter: "time" },
      ],
      api: "category_list",
      btns: ["delete", "update"],
    };
    const rules = {
      name: [
        {
          required: true,
          message: "请输入分类名",
          trigger: "blur",
        },
      ],
    };
    return {
      options,
      removeVisible: false,
      visible: false,
      chooseId: 0,
      rules,
      ruleForm: {
        name: "",
      },
      type: "",
    };
  },
  methods: {
    handleEdit(item) {
      this.chooseId = item.id;
      this.ruleForm.name = item.name;
      this.visible = true;
      this.type = "update";
    },
    handleRemove(item) {
      this.chooseId = item.id;
      this.removeVisible = true;
    },
    remvoveCategory() {
      category_delete(this.chooseId).then(() => {
        this.removeVisible = false;
        this.chooseId = 0;
        this.$refs["table"].init();
      });
    },
    handleColose() {
      this.visible = false;
    },
    handleCreate() {
      this.visible = true;
      this.type = "create";
    },
    createCategory() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.type === "create") {
            category_create(this.ruleForm).then(() => {
              this.ruleForm.name = "";
              this.visible = false;
              this.$refs["table"].init();
            });
          } else if (this.type === "update") {
            category_put(this.chooseId, this.ruleForm).then(() => {
              this.ruleForm.name = "";
              this.visible = false;
              this.$refs["table"].init();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.query-wrap {
  margin-top: 20px;
}

.btns {
  display: flex;
  justify-content: center;
}
</style>
