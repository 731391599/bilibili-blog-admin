<template>
  <div>
    <Breadcrumb />
    <div class="btns">
      <el-button size="mini" type="primary" @click="handleCreate">
        添加一级菜单
      </el-button>
    </div>
    <el-tree
      class="tree"
      :data="list"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <span class="custom-tree-node" slot-scope="{ data }">
        <span>{{ data.menuName }}</span>
        <span v-if="data.children">
          <el-button type="success" size="mini" @click="() => handleEdit(data)">
            修改一级菜单
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="() => handleCreate(data)"
          >
            添加二级菜单
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="() => handleRemove(data)"
          >
            删除一级菜单
          </el-button>
        </span>
        <span v-else>
          <el-button type="success" size="mini" @click="() => handleEdit(data)">
            修改二级菜单
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="() => handleRemove(data)"
          >
            删除二级菜单
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      :visible.sync="visible"
      width="30%"
      :before-close="hideVisible"
      :show-close="false"
    >
      <el-form
        :model="menuForm"
        ref="menuForm"
        :rules="rules"
        label-width="8vw"
      >
        <el-form-item label="路径" prop="path">
          <el-input v-model="menuForm.path"></el-input>
        </el-form-item>
        <el-form-item label="菜单名" prop="menuName">
          <el-input v-model="menuForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="menuForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="menuForm.component"></el-input>
        </el-form-item>
        <el-form-item label="重定向路径" prop="redirect">
          <el-input v-model="menuForm.redirect"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hide">
          <el-radio v-model="menuForm.hide" :label="1">隐藏</el-radio>
          <el-radio v-model="menuForm.hide" :label="0">显示</el-radio>
        </el-form-item>
        <el-form-item label="是否可以接收参数" prop="props">
          <el-radio v-model="menuForm.props" :label="1">接收</el-radio>
          <el-radio v-model="menuForm.props" :label="0">不接收</el-radio>
        </el-form-item>
        <el-form-item label="权限" prop="roleLevel">
          <el-checkbox-group v-model="menuForm.roleLevel">
            <el-checkbox :label="3">admin</el-checkbox>
            <el-checkbox :label="2">author</el-checkbox>
            <el-checkbox :label="1">user</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button v-if="type === 'create'" type="primary" @click="createMenu"
          >新增</el-button
        >
        <el-button v-else-if="type === 'edit'" type="primary" @click="editMenu"
          >修改</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="removeVisible"
      width="30%"
      :before-close="hideRemoveVisible"
      :show-close="false"
    >
      <span>是否删除该条数据?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideRemoveVisible">取 消</el-button>
        <el-button type="primary" @click="removeMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import { menu_list, menu_create, menu_delete, menu_put } from "@/api/menu";
export default {
  components: { Breadcrumb },
  data() {
    const rules = {
      path: [
        {
          required: true,
          message: "请输入路径",
          trigger: "blur",
        },
      ],
      menuName: [
        {
          required: true,
          message: "请输入菜单名",
          trigger: "blur",
        },
      ],
    };
    return {
      list: [],
      visible: false,
      rules,
      menuForm: {
        path: "",
        menuName: "",
        icon: "",
        component: "",
        pid: 0,
        roleLevel: [1, 2, 3],
        redirect: "",
        hide: 0,
        props: 0,
      },
      removeVisible: false,
      chooseId: 0,
      type: "",
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      menu_list().then((res) => {
        this.list = res.data;
      });
    },
    handleCreate(data) {
      if (data) {
        this.menuForm.pid = data.id;
      }
      this.type = "create";
      this.visible = true;
    },
    createMenu() {
      this.$refs["menuForm"].validate((valid) => {
        if (valid) {
          const data = { ...this.menuForm };
          if (!data.pid) {
            delete data.pid;
          }
          menu_create(data).then(() => {
            this.hideVisible();
            this.getList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleRemove(data) {
      if (data?.children?.length) {
        this.$message({
          type: "error",
          message: "请先删除子菜单",
        });
        return;
      }
      this.removeVisible = true;
      this.chooseId = data.id;
    },
    removeMenu() {
      menu_delete(this.chooseId).then(() => {
        this.hideRemoveVisible();
        this.getList();
      });
    },
    handleEdit(data) {
      this.type = "edit";
      this.visible = true;
      this.chooseId = data.id;
      this.menuForm.path = data.path;
      this.menuForm.menuName = data.menuName;
      this.menuForm.icon = data.icon;
      this.menuForm.component = data.component;
      this.menuForm.pid = data.pid;
      this.menuForm.roleLevel = JSON.parse(data.roleLevel);
      this.menuForm.redirect = data.redirect;
      this.menuForm.hide = data.hide;
      this.menuForm.props = data.props;
    },
    editMenu() {
      this.$refs["menuForm"].validate((valid) => {
        if (valid) {
          menu_put(this.chooseId, this.menuForm).then(() => {
            this.hideVisible();
            this.getList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    initData() {
      this.menuForm = {
        path: "",
        menuName: "",
        icon: "",
        component: "",
        pid: 0,
        roleLevel: [1, 2, 3],
        redirect: "",
        hide: 0,
        props: 0,
      };
    },
    hideRemoveVisible() {
      this.removeVisible = false;
      this.chooseId = 0;
    },
    hideVisible() {
      this.visible = false;
      this.initData();
    },
  },
};
</script>

<style lang="scss" scoped>
.btns {
  width: 50%;
  margin-top: 20px;
  text-align: right;
}
.tree {
  margin-top: 20px;
  width: 50%;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
.tree {
  /deep/ .el-tree-node__content {
    margin: 10px 0;
  }
}
</style>
