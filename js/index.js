"use strict";

/*
===== 步骤 =====
1. createVNode(h) 函数类似 Vue 的 h 函数, 传入3个参数(标签名, 属性集合, 子节点)
2. createVNode(h) 函数执行后返回一个 VirtualDOM
3. createRNode 函数可以把 VirtualDOM 转化为真实的 DOM 元素
4. mount 函数可以把 创建出来的 DOM 元素挂载页面指定的元素中
---> 内容更新后 ---> 比较新老VirtualDOM差异
5. diff: 比较新老VirtualDOM差异获得 patches
6. patch: 根据获得的 patches 去更新 realDOM


将以下html转化成VNode
<ul class="list" style="width: 300px; height: 300px; border: 1px solid #f00; color: #555;">
  <li class="item" data-index="1"><p class="title">第1个列表项</p></li>
  <li class="item" data-index="2"><p class="text"><span class="title">第2个列表项</span></p></li>
  <li class="item" data-index="3">第3个列表项</li>
</ul>

模拟内容修改: 直接修改VNode, 然后去对比
<ul class="list-wrapper" style="width: 300px; height: 300px; border: 1px solid #555; color:#f00;">
  <li class="item active" data-index="1"><p class="text">第1个列表项</p></li>
  <li class="item" data-index="2"><p class="text"></p></li>
  <li class="item" data-index="3">这是第3个被修改后的列表项内容</li>
</ul>

1. ul class 被修改了, style 被修改了
2. 第一个li的class被修改了
3. 第二个li的p中的span被移除了
4. 第三个li的textContent被修改了

vDOM         : virtual DOM          - 虚拟DOM(描述真实DOM的一个对象)
vNode        : virtual Node         - 虚拟节点(描述真实节点的一个对象)
vNodeUid     : virtual Node index   - 虚拟节点遍历时标记 VNode 的标记
rDOM         : real DOM             - 真实的 HTMLElement 元素
rNode        : real Node            - 真实的 HTMLElement 节点
rNodeUid     : real Node index      - 遍历真实的 HTMLElement节点 的标记
patchPackMap : virtual Node patch   - 虚拟节点补丁Map
*/

import { h, render, mount } from "./vnode";
import { diff } from "./diff";
import { patch } from "./patch";

// 修改前的 virtualDOM
const oldVDom = h(
  "ul",
  {
    class: "list",
    style: "width: 300px; height: 300px; border: 1px solid #f00; color: #555;",
  },
  [
    h("li", { "data-index": 0, class: "item " }, [
      h("p", { class: "text" }, ["第一个列表项"]),
    ]),
    h("li", { "data-index": 1, class: "item" }, [
      h("p", { class: "text" }, [
        h("span", { class: "title" }, ["第二个列表项"]),
      ]),
    ]),
    h("li", { "data-index": 2, class: "item" }, ["第三个列表项"]),
  ]
);

const newVDom = h(
  "ul",
  {
    class: "list-wrapper",
    style: "width: 300px; height: 300px; border: 1px solid #555; color:#f00;",
  },
  [
    h("li", { "data-index": 0, class: "item active" }, [
      h("p", { class: "text" }, ["第一个列表项"]),
    ]),
    h("li", { "data-index": 1, class: "item" }, [
      h("p", { class: "text" }, ["这是第二个li, 内容被替换了"]),
    ]),
    h("li", { "data-index": 2, class: "item" }, [
      "这是第3个被修改后的列表项内容",
    ]),
  ]
);

// 根据老节点渲染出真实的DOM
const realDOM = render(oldVDom);

// 将真实dom挂载到页面元素中
mount(realDOM, document.getElementById("app"));

// newVDom模拟数据更新的过程 -> 对比新老VDom -> 获得补丁包
const patchMap = diff(oldVDom, newVDom);
console.log('🥧[patchMap]:', patchMap);

// 给真实节点打补丁
patch(realDOM, patchMap);
