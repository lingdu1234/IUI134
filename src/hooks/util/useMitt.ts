/**
 * Listening to routes alone would waste rendering performance.
 * Use the publish-subscribe model for distribution management
 * 单独监听路由会浪费渲染性能。使用发布订阅模式去进行分发管理。
 */
import mitt, { type Handler } from 'mitt'
import type { RouteLocationNormalized } from 'vue-router'

export const emitter = mitt()

const routerChangeKey = Symbol('ROUTE_CHANGE')
const deptTreeKey = Symbol('DEPT_TREE_KEY')

let latestRoute: RouteLocationNormalized

export function setRouteEmitter(to: RouteLocationNormalized) {
  emitter.emit(routerChangeKey, to)
  latestRoute = to
}

export function listenerRouteChange(

  handler: (route: RouteLocationNormalized) => void,
  immediate = true,
) {
  emitter.on(routerChangeKey, handler as Handler)
  if (immediate && latestRoute)
    handler(latestRoute)
}

export function removeRouteListener() {
  emitter.off(routerChangeKey)
}
