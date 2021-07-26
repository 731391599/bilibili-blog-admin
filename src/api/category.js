import request from "@/utils/request";

const url = "/category";
// 用户列表
export function category_list(data) {
  return request({
    url,
    method: "get",
    params: data,
  });
}
// 添加用户
export function category_create(data) {
  return request({
    url,
    method: "post",
    data,
  });
}

// 修改
export function category_put(id, data) {
  return request({
    url: `${url}/${id}`,
    method: "put",
    data,
  });
}
//
export function category_delete(id) {
  return request({
    url: `${url}/${id}`,
    method: "delete",
  });
}
