<template>
  <div>
    <Breadcrumb />
    <el-row class="query-wrap" :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="keywords"
          class="input-with-select"
          clearable
        >
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="status"
          placeholder="请选择状态"
          style="display: block"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="categoryId"
          placeholder="请选择分类"
          style="display: block"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" @click="handleSearch">搜索</el-button>
      </el-col>

      <el-col :span="4" :offset="2">
        <el-button type="info" @click="handleSearch('all')">查看全部</el-button>
        <el-button type="primary">新增文章</el-button>
      </el-col>
    </el-row>
    <Table
      :options="options"
      ref="table"
      @handleInfo="handleInfo"
      @handleEdit="handleEdit"
      @handleRemove="handleRemove"
    />
    <!-- 删除 -->
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
        <el-button type="primary" @click="removeArticle">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      :visible.sync="visible"
      width="80%"
      :before-close="
        () => {
          visible = false;
        }
      "
      :show-close="false"
    >
      <!-- 这里用form组件的布局 -->
      <el-form label-width="8vw">
        <el-form-item label="标题">
          <span>{{ article.title }}</span>
        </el-form-item>
        <el-form-item label="作者">
          <span>{{ article.user }}</span>
        </el-form-item>
        <el-form-item label="分类">
          <span>{{ article.category }}</span>
        </el-form-item>
        <el-form-item label="封面">
          <img class="img" :src="article.cover" alt="" srcset="" />
        </el-form-item>
        <el-form-item label="内容">
          <!-- 无法通过配置关闭编辑页 通过样式修改 -->
          <mavon-editor
            class="editor"
            :toolbarsFlag="false"
            :editable="false"
            v-model="article.content"
          />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import Table from "@/components/Table";
import { category_list } from "@/api/category";
import { article_delete, article_show } from "@/api/article";
export default {
  components: { Breadcrumb, Table },
  data() {
    const options = {
      columns: [
        { prop: "actions", label: "操作", scope: "actions" },
        { prop: "id", label: "ID" },
        { prop: "title", label: "标题" },
        { prop: "status", label: "状态", scope: "article-status" },
        { prop: "createdAt", label: "创建时间", formatter: "time" },
        { prop: "updatedAt", label: "更新时间", formatter: "time" },
      ],
      api: "article_list",
      btns: ["show", "delete", "update"],
    };
    return {
      options,
      removeVisible: false,
      chooseId: 0,
      keywords: "",
      status: "",
      categoryId: "",
      statusOptions: [
        {
          label: "草稿",
          value: 0,
        },
        {
          label: "审核中",
          value: 1,
        },
        {
          label: "审核通过",
          value: 2,
        },
        {
          label: "审核拒绝",
          value: 3,
        },
        {
          label: "已发布",
          value: 4,
        },
      ],
      categoryOptions: [],
      visible: false,
      article: {
        title: "",
        user: "",
        category: "",
        content: "",
        cover: "",
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    handleInfo(item) {
      article_show(item.id).then((res) => {
        const data = res.data;
        this.article.title = data.title;
        this.article.category = data?.category?.name;
        this.article.user = data?.user?.user_info?.name;
        this.article.content = data.content;
        this.article.cover = process.env.VUE_APP_BASEURL + data.cover;
        this.visible = true;
      });
    },
    handleEdit() {},
    handleRemove(item) {
      this.removeVisible = true;
      this.chooseId = item.id;
    },
    removeArticle() {
      // ... 接口
      article_delete(this.chooseId).then(() => {
        this.removeVisible = false;
        this.chooseId = "";
        this.$refs["table"].init();
      });
    },
    init() {
      this.getCategory();
    },
    getCategory() {
      // 这个接口做了分页
      // 参数先传 pageSize：999
      category_list({
        pageNum: 1,
        pageSize: 999,
      }).then((res) => {
        this.categoryOptions = res.data.rows;
      });
    },
    handleSearch(type) {
      if (type === "all") {
        this.$refs["table"].init();
      } else {
        //  处理参数
        const queryObj = {};
        if (this.keywords) {
          queryObj.keywords = this.keywords;
        }

        if (this.categoryId) {
          queryObj.queryCategoryId = this.categoryId;
        }

        // 这里有个bug
        //  status为0时 不走判断
        // 这里改为不全等  不等的话会发生隐式转换
        if (this.status !== "") {
          queryObj.queryStatus = this.status;
        }
        this.$refs["table"].init(queryObj);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// .btns {
// 	display: flex;
// 	justify-content: center;
// }
.query-wrap {
  margin-top: 20px;
}

.img {
  height: 200px;
  width: 200px;
}

.editor {
  /deep/ .v-note-edit {
    display: none;
  }
  /deep/ .v-note-panel .v-note-show {
    flex: 1;
    -webkit-box-flex: 1;
  }
}
</style>
