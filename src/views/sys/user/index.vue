<template>
  <div>
    <Breadcrumb />
    <!-- 封装Table -->
    <el-row class="query-wrap" :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="keywords"
          class="input-with-select"
          clearable
        >
          <el-select v-model="key" slot="prepend" placeholder="请选择">
            <el-option
              v-for="select in queryOptions"
              :key="select.value"
              :label="select.label"
              :value="select.value"
            ></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearch('query')"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-button type="info" @click="handleSearch('all')">查看全部</el-button>
        <el-button type="danger" @click="handleSearch(0)">查看禁用</el-button>
        <el-button type="success" @click="handleSearch(1)">查看启用</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="createVisible = true"
          >新增用户</el-button
        >
      </el-col>
    </el-row>
    <Table
      :options="options"
      @handleInfo="handleInfo"
      @handleEdit="handleEdit"
      @handleRemove="handleRemove"
      ref="table"
    />
    <el-dialog
      :visible.sync="visible"
      width="30%"
      :before-close="handleUserShowColose"
      :show-close="false"
    >
      <el-form :model="userInfo" label-width="8vw">
        <el-form-item label="ID" prop="id">
          <div>{{ userInfo.id }}</div>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <div>{{ userInfo.username }}</div>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!disabled">
          <el-input v-model="userInfo.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邀请码" prop="code">
          <div>{{ userInfo.code }}</div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="userInfo.status" :label="1" :disabled="disabled"
            >启用</el-radio
          >
          <el-radio v-model="userInfo.status" :label="0" :disabled="disabled"
            >禁用</el-radio
          >
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <div>{{ userInfo.createdAt | formatTime }}</div>
        </el-form-item>
        <el-form-item label="更新时间" prop="updatedAt">
          <div>{{ userInfo.updatedAt | formatTime }}</div>
        </el-form-item>
      </el-form>
      <div class="btns" v-if="!disabled">
        <el-button type="primary" @click="handleUseredit">修改</el-button>
      </div>
    </el-dialog>
    <!-- 封装删除的dialog -->
    <!-- 使用.sync -->
    <RemoveDialog :visible.sync="removeVisible" @handleRemove="removeUser" />
    <el-dialog
      :visible.sync="createVisible"
      width="30%"
      :before-close="
        () => {
          createVisible = false;
        }
      "
      :show-close="false"
    >
      <el-form :model="user" ref="ruleForm" :rules="rules" label-width="8vw">
        <el-form-item label="账号" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="handleCreate">新增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import Table from "@/components/Table";
import RemoveDialog from "@/components/RemoveDialog";
import { user_show, user_put, user_delete, user_create } from "@/api/user";
import { parseTime } from "@/utils";

export default {
  components: { Breadcrumb, Table, RemoveDialog },
  data() {
    const options = {
      columns: [
        { prop: "actions", label: "操作", scope: "actions" },
        { prop: "id", label: "ID" },
        { prop: "username", label: "账号" },
        { prop: "status", label: "状态", scope: "status" },
        { prop: "code", label: "邀请码" },
        { prop: "createdAt", label: "创建时间", formatter: "time" },
        { prop: "updatedAt", label: "更新时间", formatter: "time" },
      ],
      api: "user_list",
      btns: ["show", "delete", "update"],
    };
    const queryOptions = [
      {
        label: "用户名",
        value: "username",
      },
      {
        label: "邀请码",
        value: "code",
      },
    ];
    const rules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
        { min: 4, max: 10, message: "用户名为4-10位", trigger: "blur" },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        { min: 6, max: 10, message: "密码为6-10位", trigger: "blur" },
      ],
    };
    return {
      options,
      visible: false,
      removeVisible: false,
      createVisible: false,
      userInfo: {},
      user: {
        username: "",
        password: "",
      },
      disabled: true,
      removeId: "",
      queryOptions,
      key: "username",
      keywords: "",
      rules,
    };
  },
  filters: {
    formatTime(val) {
      return parseTime(new Date(val));
    },
  },
  methods: {
    handleInfo(item) {
      this.disabled = true;
      user_show(item.id).then((res) => {
        this.userInfo = res.data;
        this.visible = true;
      });
    },
    handleEdit(item) {
      this.disabled = false;
      user_show(item.id).then((res) => {
        this.userInfo = res.data;
        this.$set(this.userInfo, "password", "");
        this.visible = true;
      });
    },
    handleRemove(item) {
      this.removeId = item.id;
      this.removeVisible = true;
    },
    removeUser() {
      user_delete(this.removeId).then(() => {
        this.removeVisible = false;
        this.removeId = "";
        this.$refs["table"].init();
      });
    },
    handleUserShowColose() {
      this.visible = false;
    },
    handleUseredit() {
      const data = {
        username: this.userInfo.username,
        password: this.userInfo.password,
        status: this.userInfo.status,
      };
      user_put(this.userInfo.id, data).then(() => {
        this.handleUserShowColose();
        this.$refs["table"].init();
      });
    },
    handleSearch(type) {
      if (type === "query") {
        this.$refs["table"].init({
          key: this.key,
          keywords: this.keywords,
        });
      } else if (type === "all") {
        this.$refs["table"].init();
        this.keywords = "";
      } else if (type === 1) {
        this.$refs["table"].init({
          key: "status",
          keywords: 1,
        });
        this.keywords = "";
      } else if (type === 0) {
        this.$refs["table"].init({
          key: "status",
          keywords: 0,
        });
        this.keywords = "";
      }
    },
    handleCreate() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          user_create(this.user).then(() => {
            this.user = {
              username: "",
              password: "",
            };
            this.createVisible = false;
            this.$refs["table"].init();
          });
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
.btns {
  display: flex;
  justify-content: center;
}
.query-wrap {
  margin-top: 20px;
  /deep/ .el-select .el-input {
    width: 120px;
  }
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
