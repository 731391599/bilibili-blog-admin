<template>
  <div>
    <Breadcrumb />
    <el-row class="query-wrap" :gutter="20">
      <el-col :span="6" class="select">
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
      <el-col :span="2" :offset="4">
        <el-button type="info" @click="handleSearch('all')">查看全部</el-button>
      </el-col>
    </el-row>
    <Table :options="options" ref="table" @handleInfo="handleInfo">
      <template v-slot:showHome="{ data }">
        <el-switch
          v-if="data.status === 4"
          v-model="data.showHome"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="展示"
          inactive-text="不展示"
          :active-value="1"
          :inactive-value="0"
          @change="showHome(data.id, data.showHome)"
        >
        </el-switch>
      </template>
      <template v-slot:audit="{ data }">
        <el-button
          v-if="data.status === 1"
          size="small"
          type="success"
          :loading="loading"
          @click="audit(data.id, true)"
          >审核通过</el-button
        ><el-button
          v-if="data.status === 1"
          size="small"
          type="danger"
          :loading="loading"
          @click="audit(data.id, false)"
          >审核拒绝</el-button
        >
      </template>
    </Table>
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
import { article_audit, article_showHome, article_show } from "@/api/article";

export default {
  components: { Breadcrumb, Table },
  data() {
    const options = {
      columns: [
        {
          prop: "actions",
          label: "操作",
          scope: "actions",
          width: "100",
        },
        { prop: "audit", label: "审核", scope: "audit" },
        { prop: "id", label: "ID", width: "100" },
        { prop: "title", label: "标题" },
        { prop: "status", label: "状态", scope: "article-status" },
        { prop: "showHome", label: "首页展示", scope: "showHome" },
        { prop: "createdAt", label: "创建时间", formatter: "time" },
        { prop: "updatedAt", label: "更新时间", formatter: "time" },
      ],
      api: "article_list_all",
      btns: ["show"],
    };
    const queryOptions = [
      {
        label: "标题",
        value: "title",
      },
      {
        label: "用户名",
        value: "name",
      },
    ];
    const statusOptions = [
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
    ];
    return {
      options,
      queryOptions,
      statusOptions,
      categoryOptions: [],
      keywords: "",
      key: "title",
      status: "",
      categoryId: "",
      visible: false,
      article: {
        title: "",
        user: "",
        category: "",
        content: "",
        cover: "",
      },
      loading: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
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
    handleSearch(type) {
      if (type === "all") {
        this.$refs["table"].init();
      } else {
        //  处理参数
        const queryObj = {};
        if (this.keywords) {
          queryObj.keywords = this.keywords;
          queryObj.key = this.key;
        }

        if (this.categoryId) {
          queryObj.queryCategoryId = this.categoryId;
        }

        if (this.status !== "") {
          queryObj.queryStatus = this.status;
        }
        this.$refs["table"].init(queryObj);
      }
    },
    audit(id, status) {
      this.loading = true;
      article_audit(id, { status })
        .then(() => {
          this.$refs["table"].init();
          this.$notify({
            title: "成功",
            type: "success",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showHome(id, value) {
      article_showHome(id, { status: Boolean(value) }).then(() => {
        this.$refs["table"].init();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.query-wrap {
  margin-top: 20px;
  .select /deep/ .el-select .el-input {
    width: 120px;
  }
  .select /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
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
