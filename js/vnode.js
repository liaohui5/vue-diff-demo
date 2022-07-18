"use strict";

/**
 * 虚拟节点
 */
export class VNode {
  constructor(type, props, children = []) {
    this.type     = type;
    this.props    = props;
    this.children = children;
  }
}

/**
 * 处理html标签元素的属性 id="xxx" style="xxx" class="xxx"
 * @param {HTMLElement} element 真实DOM元素
 * @param {Object} attr 标签上的属性
 * @param {String} val 标签属性的值
 */
export function setAttrs(element, attr, val) {
  switch (attr) {
    case "value":
      if (["INPUT", "TEXTAREA"].includes(element.tagName)) {
        element.value = val;
      } else {
        element.setAttribute(attr, val);
      }
      break;
    case "style":
      element.style.cssText = val;
      break;
    default:
      element.setAttribute(attr, val);
      break;
  }
}

/**
 * 把虚拟dom变成真实的dom元素
 * @param {VNode} vDom      虚拟DOM
 * @return {HTMLElement} el 真实的DOM元素
 */
export const render = createRNode;
export function createRNode(vDom) {
  const { type, props, children } = vDom;
  const el = document.createElement(type);

  // 处理属性
  Object.keys(props).forEach((key) => {
    setAttrs(el, key, props[key]);
  });

  // 处理子节点(元素节点/文本节点)
  if (!Array.isArray(children)) {
    return el;
  }
  for (const child of children) {
    let childElement;
    if (child instanceof VNode) {
      childElement = createRNode(child);
    } else {
      childElement = document.createTextNode(child);
    }
    el.append(childElement);
  }

  return el;
}

/**
 * 创建虚拟节点
 * @param {String} type     标签名
 * @param {Object} props    属性集合
 * @param {Array}  children 子节点
 */
export const h = createVNode;
export function createVNode(type, props, children) {
  return new VNode(type, props, children);
}

/**
 * 将真实节点挂载到页面中
 */
export function mount(el, container) {
  container.append(el);
}
