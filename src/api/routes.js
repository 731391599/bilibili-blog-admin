import request from "@/utils/request";

const url = "/route";
// 用户列表
export function route_list() {
  return request({
    url,
    method: "get",
  });
}
