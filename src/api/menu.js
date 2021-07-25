import request from "@/utils/request";

const url = "/menu";
// 用户列表
export function menu_list() {
  return request({
    url,
    method: "get",
  });
}
// 添加用户
export function menu_create(data) {
  return request({
    url,
    method: "post",
    data,
  });
}

// 修改
export function menu_put(id, data) {
  return request({
    url: `${url}/${id}`,
    method: "put",
    data,
  });
}
//
export function menu_delete(id) {
  return request({
    url: `${url}/${id}`,
    method: "delete",
  });
}
