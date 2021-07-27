<template>
  <div>
    <Breadcrumb />
    <Table :options="options" ref="table" />
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import Table from "@/components/Table";
export default {
  components: { Breadcrumb, Table },
  data() {
    const options = {
      columns: [
        { prop: "actions", label: "操作", scope: "actions" },
        { prop: "id", label: "ID" },
        { prop: "title", label: "标题" },
        { prop: "createdAt", label: "创建时间", formatter: "time" },
        { prop: "updatedAt", label: "更新时间", formatter: "time" },
      ],
      api: "article_list_all",
      btns: ["show", "delete", "update"],
    };
    return {
      options,
    };
  },
};
</script>

<style></style>
