<template>
  <div class="table-wrap">
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%"
    >
      <template v-for="column in options.columns">
        <el-table-column
          v-if="!column.scope"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :align="column.align ? column.align : 'center'"
          :formatter="column.formatter === 'time' ? formatterTime : null"
        ></el-table-column>
        <el-table-column
          v-else
          :key="column.prop"
          :label="column.label"
          :width="column.width"
          :align="column.align ? column.align : 'center'"
        >
          <template slot-scope="scope">
            <template v-if="column.scope === 'status'">
              <el-tag v-if="scope.row.status == 1" size="medium">启用</el-tag>
              <el-tag v-else type="danger" size="medium">禁用</el-tag>
            </template>
            <template v-if="column.scope === 'article-status'">
              <el-tag
                size="medium"
                effect="dark"
                :type="articleStatus[scope.row.status].type"
                >{{ articleStatus[scope.row.status].text }}</el-tag
              >
            </template>
            <template v-if="column.scope === 'actions'">
              <el-button
                v-if="options.btns.includes('show')"
                type="success"
                icon="el-icon-search"
                circle
                @click="handleInfo(scope.row)"
              ></el-button>

              <el-button
                v-if="options.btns.includes('update')"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="handleEdit(scope.row)"
              ></el-button>

              <el-button
                v-if="options.btns.includes('delete')"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="handleRemove(scope.row)"
              ></el-button>
            </template>
            <!-- 其他自定义形式的数据展示 通过插槽的形式在外部实现 -->
            <template v-else slot-scope="scope">
              <slot :name="column.scope" :data="scope.row"></slot>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { user_list } from "@/api/user";
import { category_list } from "@/api/category";
import { article_list, article_list_all } from "@/api/article";
import { parseTime } from "@/utils";

const apiList = {
  user_list,
  category_list,
  article_list,
  article_list_all,
};
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    const articleStatus = {
      0: {
        text: "草稿",
        type: "info",
      },
      1: {
        text: "审核中",
        type: "primary",
      },
      2: {
        text: "审核通过",
        type: "success",
      },
      3: {
        text: "审核拒绝",
        type: "danger",
      },
      4: {
        text: "已发布",
        type: "warning",
      },
    };

    return {
      page: {
        pageSize: 10,
        pageNum: 1,
      },
      tableData: [],
      total: 0,
      articleStatus,
      loading: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init(queryObj) {
      // 初始化数据
      this.page = {
        pageSize: 10,
        pageNum: 1,
      };
      this.getList(queryObj);
    },
    getList(queryObj) {
      this.loading = true;
      let data = { ...this.page };
      if (queryObj) {
        // 合并参数
        data = Object.assign(data, queryObj);
      }
      apiList[this.options.api](data)
        .then((res) => {
          this.tableData = res.data.rows;
          this.total = res.data.count;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    formatterTime(row, column, cellValue) {
      return parseTime(new Date(cellValue));
    },
    handleInfo(item) {
      this.$emit("handleInfo", item);
    },
    handleEdit(item) {
      this.$emit("handleEdit", item);
    },
    handleRemove(item) {
      this.$emit("handleRemove", item);
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.table-wrap {
  padding: 20px 0;
  .pagination {
    margin-top: 20px;
  }
}
</style>
