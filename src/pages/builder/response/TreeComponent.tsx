import React, { useState, useEffect } from "react";
import { Tree } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { DataNode, TreeProps } from "antd/es/tree";
import { Item } from "../../../types";

interface TreeComponentProps {
  items: Item[];
  setUpdatedItems: (updatedItems: Item[]) => void;
}

type TreeDataNode = DataNode & {
  key: string;
  title: string;
  children?: TreeDataNode[];
};

const TreeComponent: React.FC<TreeComponentProps> = ({
  items,
  setUpdatedItems,
}) => {
  const [treeData, setTreeData] = useState<Item[]>(items);

  useEffect(() => {
    setTreeData(items);
  }, [items]);

  const transformToTreeData = (items: Item[]): TreeDataNode[] =>
    items.map((item) => ({
      key: item.id.toString(),
      title: item.name,
      children:
        item.children.length > 0 ? transformToTreeData(item.children) : [],
    }));

  const findAndRemoveNode = (
    nodes: Item[],
    id: number
  ): { updatedTree: Item[]; draggedNode?: Item } => {
    let draggedNode: Item | undefined;

    const updatedTree = nodes.filter((node) => {
      if (node.id === id) {
        draggedNode = node;
        return false;
      }
      if (node.children) {
        const result = findAndRemoveNode(node.children, id);
        node.children = result.updatedTree;
        if (result.draggedNode) draggedNode = result.draggedNode;
      }
      return true;
    });

    return { updatedTree, draggedNode };
  };

  const insertNode = (
    nodes: Item[],
    dropId: number,
    dropPosition: number,
    draggedNode: Item,
    dropToGap: boolean
  ): Item[] => {
    return nodes.map((node) => {
      if (node.id === dropId) {
        if (dropToGap) {
          return {
            ...node,
            children: node.children
              ? [...node.children, draggedNode]
              : [draggedNode],
          };
        } else {
          return {
            ...node,
            children: [...(node.children || []), draggedNode],
          };
        }
      }
      if (node.children) {
        node.children = insertNode(
          node.children,
          dropId,
          dropPosition,
          draggedNode,
          dropToGap
        );
      }
      return node;
    });
  };

  const updateParentState = (updatedTree: Item[], movedNode: Item) => {
    return updatedTree.map((parentNode) => {
      if (parentNode.id === movedNode.parentId) {
        parentNode.children = parentNode.children?.map((childNode) => {
          if (childNode.id === movedNode.id) {
            return movedNode;
          }
          return childNode;
        });
      }
      if (parentNode.children) {
        updateParentState(parentNode.children, movedNode);
      }
      return parentNode;
    });
  };

  const handleDrop: TreeProps["onDrop"] = (info) => {
    const { dragNode, node, dropPosition, dropToGap } = info;

    const { updatedTree, draggedNode } = findAndRemoveNode(
      treeData,
      Number(dragNode.key)
    );

    if (draggedNode) {
      const newTree = insertNode(
        updatedTree,
        Number(node.key),
        dropPosition,
        draggedNode,
        dropToGap
      );

      const updatedTreeWithParents = updateParentState(newTree, draggedNode);
      setTreeData(updatedTreeWithParents);

      setUpdatedItems(updatedTreeWithParents);
    }
  };

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      <Tree
        className="bg-white rounded-md shadow-md p-2"
        treeData={transformToTreeData(treeData)}
        showLine={{ showLeafIcon: false }}
        draggable
        blockNode
        switcherIcon={<DownOutlined />}
        onDrop={handleDrop}
      />
    </div>
  );
};

export default TreeComponent;
