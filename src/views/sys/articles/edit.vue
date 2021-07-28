<template>
  <div>
    <Breadcrumb />
    <el-form
      ref="articleForm"
      :model="articleForm"
      :rules="rules"
      label-width="5vw"
      class="form"
    >
      <el-form-item label="标题" prop="title">
        <el-row>
          <el-col :span="6">
            <el-input v-model="articleForm.title"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-row>
          <el-col :span="6">
            <el-select
              v-model="articleForm.categoryId"
              placeholder="请选择"
              style="display: block"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-upload
          class="avatar-uploader"
          :action="action"
          name="blogImg"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="headers"
        >
          <img
            v-if="articleForm.cover"
            :src="articleForm.cover"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <mavon-editor v-model="articleForm.content" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save(0)">保存至草稿箱</el-button>
        <el-button type="danger" @click="save(1)">提交审核</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import { category_list } from "@/api/category";
import { mapGetters } from "vuex";
import { article_create, article_show, article_put } from "@/api/article";

export default {
  components: { Breadcrumb },
  data() {
    const rules = {
      title: [
        {
          required: true,
          message: "请输入分类名",
          trigger: "blur",
        },
      ],
      cover: [
        {
          required: true,
          message: "请输入分类名",
          trigger: "blur",
        },
      ],
      content: [
        {
          required: true,
          message: "请输入分类名",
          trigger: "blur",
        },
      ],
      categoryId: [
        {
          required: true,
          message: "请输入分类名",
          trigger: "blur",
        },
      ],
    };
    return {
      id: "", // 有id 则是修改 无id则是新增
      articleForm: {
        title: "",
        cover: "",
        content: "",
        categoryId: "",
      },
      rules,
      options: [],
      action: "/admin/upload/img",
      headers: {
        authorization: "",
      },
    };
  },
  computed: {
    ...mapGetters(["token"]),
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getCategory();
      this.headers.authorization = this.token;
      if (this.id) {
        article_show(this.id).then((res) => {
          const data = res.data;
          this.articleForm.title = data.title;
          this.articleForm.cover = process.env.VUE_APP_BASEURL + data.cover;
          this.articleForm.content = data.content;
          this.articleForm.categoryId = data.categoryId;
        });
      }
    },
    getCategory() {
      // 这个接口做了分页
      // 参数先传 pageSize：999
      category_list({
        pageNum: 1,
        pageSize: 999,
      }).then((res) => {
        this.options = res.data.rows;
      });
    },
    handleAvatarSuccess(res, file) {
      this.articleForm.cover =
        process.env.VUE_APP_BASEURL + file.response.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    save(type) {
      this.$refs["articleForm"].validate((valid) => {
        if (valid) {
          const data = { ...this.articleForm };
          data.cover = data.cover.replace(process.env.VUE_APP_BASEURL, "");
          if (type === 1) {
            data.status = true;
          }
          if (this.id) {
            article_put(this.id, data).then(() => {
              this.$router.push("/articles/list");
            });
          } else {
            article_create(data).then(() => {
              this.$router.push("/articles/list");
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
.form {
  margin-top: 20px;
}
.avatar-uploader {
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/.el-upload:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
