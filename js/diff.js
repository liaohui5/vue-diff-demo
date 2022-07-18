"use strict";
/*
const patchPackMap = {
  0: [
    {
      type: PatchPack.ATTR, // 代表一个更新属性的补丁包
      value: { style: 'xxx', class: 'xxx', id: 'xxx' }
    }
  ],
  1: [
    {
      type: PatchPack.TEXT, // 代表一个标签内部文本的补丁包
      value: '这是更新后要显示的文本'
    }
  ],
  2: [
    {
      type: PatchPack.REPLACE, // 代表一个替换节点的补丁包
      value: rNode
    }
  ],
  2: [
    {
      type: PatchPack.REMOVE, // 代表一个移除节点的补丁包
      value: index
    }
  ],
};
*/

import { PatchPack } from "./patch";
const { ATTR, TEXT, REPLACE, REMOVE } = PatchPack;

// 新老节点对比后的差异补丁包
const patchPackMap = new Map();
let vNodeUid = 0;

// 对比新老虚拟节点
export function diff(oldVNode, newVNode) {
  let index = 0;
  vNodeWalk(oldVNode, newVNode, index);
  return patchPackMap;
}

// 深度遍历对比
function vNodeWalk(oldVNode, newVNode, index) {
  const patchSet = new Set();
  if (!newVNode) {
    // 1. 如果新节点不存在, 就添加一个移除节点的补丁包
    patchSet.add(new PatchPack(REMOVE, index));
  } else if (typeof newVNode === "string" && typeof oldVNode === "string") {
    // 2. 如果新节点和老节点都是文本,
    // 并且文本内容不相等, 就直接修改老的节点的文本内容
    if (newVNode !== oldVNode) {
      patchSet.add(new PatchPack(TEXT, newVNode));
    }
  } else if (oldVNode.type === newVNode.type) {
    // 3. 如果新老节点标签名相等, 对比新老节点所有的属性差异
    // 获取新老节点所有的属性补丁包
    const attrPatches = attrsWalk(oldVNode.props, newVNode.props);
    if (Object.keys(attrPatches).length > 0) {
      patchSet.add(new PatchPack(ATTR, attrPatches));
    }

    // 对比元素节点的所有子节点
    childrenWalk(oldVNode.children, newVNode.children);
  } else {
    // 4. 如果上面的3种情况,那么节点一定发生了变化,
    // 那么就需要替换原来的节点, 添加一个替换补丁包
    patchSet.add(new PatchPack(REPLACE, newVNode));
  }

  patchSet.size > 0 && patchPackMap.set(index, patchSet);
}

// 对比新老节点的所有属性, 获取属性补丁包
function attrsWalk(oldProps, newProps) {
  const attrPatch = {};

  // 节点属性修改的处理: 新老节点的属性不一致
  Object.keys(oldProps).forEach((key) => {
    if (oldProps[key] !== newProps[key]) {
      attrPatch[key] = newProps[key];
    }
  });

  // 节点属性添加的处理: 新老节点属性个数不一致
  Object.keys(newProps).forEach((key) => {
    if (!oldProps.hasOwnProperty(key)) {
      attrPatch[key] = newProps[key];
    }
  });

  return attrPatch;
}

// 对比元素节点的所有子节点
// TODO: 如果新节点比老节点length要长,
// 那么如果有新增加的节点就遍历不到
function childrenWalk(oldChildren, newChildren) {
  oldChildren.forEach((child, i) => {
    vNodeWalk(child, newChildren[i], ++vNodeUid);
  });
}
