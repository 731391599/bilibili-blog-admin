<template>
  <div class="table-wrap">
    <el-table :data="tableData" border stripe style="width: 100%">
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
    return {
      page: {
        pageSize: 10,
        pageNum: 1,
      },
      tableData: [],
      total: 0,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init(key, keywords) {
      // 初始化数据
      this.page = {
        pageSize: 10,
        pageNum: 1,
      };
      this.getList(key, keywords);
    },
    getList(key, keywords) {
      const data = { ...this.page };
      if (key) {
        data.key = key;
        data.keywords = keywords;
      }
      apiList[this.options.api](data).then((res) => {
        this.tableData = res.data.rows;
        this.total = res.data.count;
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
