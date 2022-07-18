"use strict";

import { VNode, setAttrs } from "./vnode";

/**
 * 补丁包
 */
export class PatchPack {
  static ATTR    = "ATTR";
  static TEXT    = "TEXT";
  static REPLACE = "REPLACE";
  static REMOVE  = "REMOVE";

  constructor(type, value) {
    if (!PatchPack[type]) {
      throw new TypeError("[PatchPack] unknown PatchPack type");
    }
    this.type = type;
    this.value = value;
  }
}

let finalPatchMap = null;
let rNodeUid = 0;
/**
 * 给真实节点打补丁包
 * @param {HTMLElement} rDom 真实的DOM元素
 * @param {Map} patchMap 补丁包
 */
export function patch(rDom, patchMap) {
  finalPatchMap = patchMap;
  rNodeWalk(rDom);
}

/**
 * 递归遍历所有的真实节点(深度优先), 更新补丁包记录的内容
 * @param {HTMLElement} rNode 真实的DOM元素
 */
function rNodeWalk(rNode) {
  const rNodePatch = finalPatchMap.get(rNodeUid++); // Set
  const childNodes = Array.from(rNode.childNodes);

  // 如果有子节点: 递归的给子节点打补丁
  if (childNodes.length > 0) {
    childNodes.forEach((child) => {
      rNodeWalk(child);
    });
  }

  // 如果当前节点有补丁包 patch 需要更新
  rNodePatch && patchAction(rNode, rNodePatch);
}

/**
 * 更新补丁包记录的内容到真实的dom,让UI更新
 * @param {HTMLElement} rNode 真实的DOM元素
 * @param {PatchPack} patches 补丁包
 */
function patchAction(rNode, patches) {
  for (const { type, value } of patches) {
    switch (type) {
      case PatchPack.ATTR:
        Object.keys(value).forEach((key) => {
          setAttrs(rNode, key, value[key]);
        });
        break;
      case PatchPack.TEXT:
        rNode.textContent = value;
        break;
      case PatchPack.REPLACE:
        // 新的节点是文本节点还是元素节点
        const newRNode = rNode instanceof VNode
              ? document.createElement(value.type)
              : document.createTextNode(value);
        rNode.parentNode.replaceChild(newRNode, rNode);
        break;
      case PatchPack.REMOVE:
        rNode.remove();
        break;
      default:
        console.error("[patch] unknown PatchPack type");
        break;
    }
  }
}
