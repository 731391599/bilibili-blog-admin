<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="4vw"
      class="rule-form"
    >
      <el-form-item label="昵称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="ruleForm.mobile" :maxlength="11"></el-input>
      </el-form-item>
      <!-- 头像 -->
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :action="action"
          name="blogImg"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="headers"
        >
          <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <!-- 省市区 -->
      <!-- 解决回显问题 -->
      <el-form-item label="省市区">
        <el-cascader
          v-model="region"
          :props="props"
          style="display: block"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button @click="updateForm">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { public_province, public_city, public_area } from "@/api/public";
import { app_update_userInfo } from "@/api/app";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        mobile: "",
        provinceId: "",
        cityId: "",
        areaId: "",
        avatar: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "昵称不能为空",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            min: 11,
            max: 11,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
      },
      props: {
        lazy: true,
        lazyLoad: this.getRegion,
      },
      action: "/admin/upload/img",
      headers: {
        authorization: "",
      },
      region: [],
    };
  },
  computed: {
    ...mapGetters(["user_info", "token"]),
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapActions(["SET_USER_INFO"]),
    initData() {
      // bug  定位
      // 这里直接改变的对象的指向 无法双向绑定 可以使用$set 或者赋值
      this.ruleForm.name = this.user_info.name;
      this.ruleForm.mobile = this.user_info.mobile;
      this.ruleForm.provinceId = this.user_info.provinceId;
      this.ruleForm.cityId = this.user_info.cityId;
      this.ruleForm.areaId = this.user_info.areaId;
      if (this.user_info.avatar) {
        this.ruleForm.avatar =
          process.env.VUE_APP_BASEURL + this.user_info.avatar;
      }
      this.region = [
        this.user_info.provinceId,
        this.user_info.cityId,
        this.user_info.areaId,
      ];
      this.headers.authorization = this.token;
    },
    getRegion(node, resolve) {
      const { data, level } = node;
      if (level === 0) {
        //   省
        public_province().then((res) => {
          const nodes = res.data.map((item) => {
            return {
              value: item.provinceCode,
              label: item.name,
              leaf: false,
            };
          });
          resolve(nodes);
        });
      } else if (level === 1) {
        //   市
        public_city(data.value).then((res) => {
          const nodes = res.data.map((item) => {
            return {
              value: item.cityCode,
              label: item.name,
              leaf: false,
            };
          });
          resolve(nodes);
        });
      } else if (level === 2) {
        public_area(data.value).then((res) => {
          const nodes = res.data.map((item) => {
            return {
              value: item.areaCode,
              label: item.name,
              leaf: true, // 最后一个节点 则为true
            };
          });
          resolve(nodes);
        });
      }
    },
    handleAvatarSuccess(res, file) {
      console.log(file);
      this.ruleForm.avatar =
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
    updateForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = { ...this.ruleForm };
          data.avatar = data.avatar.replace(process.env.VUE_APP_BASEURL, "");
          data.provinceId = this.region[0];
          data.cityId = this.region[1];
          data.areaId = this.region[2];
          app_update_userInfo(this.user_info.userId, data).then(() => {
            this.SET_USER_INFO(this.user_info.userId);
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
.rule-form {
  width: 600px;
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
