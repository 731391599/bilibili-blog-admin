import request from "@/utils/request";

const url = {
  article: "/article",
  all: "/article/all",
  audit: "/article/audit",
  publish: "/article/publish",
  toAudit: "/article/toAudit",
  showHome: "/article/showHome",
};

// 管理员 所有文章接口
export function article_list_all(params) {
  return request({
    url: url.all,
    method: "get",
    params,
  });
}

// 用户列表
export function article_list(params) {
  return request({
    url: url.article,
    method: "get",
    params,
  });
}

export function article_audit(id, data) {
  return request({
    url: `${url.audit}/${id}`,
    method: "post",
    data,
  });
}

export function article_to_audit(id, data) {
  return request({
    url: `${url.toAudit}/${id}`,
    method: "post",
    data,
  });
}

export function article_publish(id, data) {
  return request({
    url: `${url.publish}/${id}`,
    method: "post",
    data,
  });
}

export function article_showHome(id, data) {
  return request({
    url: `${url.showHome}/${id}`,
    method: "post",
    data,
  });
}

// 添加用户
export function article_create(data) {
  return request({
    url: url.article,
    method: "post",
    data,
  });
}
// 修改
export function article_put(id, data) {
  return request({
    url: `${url.article}/${id}`,
    method: "put",
    data,
  });
}
//
export function article_delete(id) {
  return request({
    url: `${url.article}/${id}`,
    method: "delete",
  });
}

export function article_show(id) {
  return request({
    url: `${url.article}/${id}`,
    method: "get",
  });
}
