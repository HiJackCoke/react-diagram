import { useState, useCallback } from 'react';
import type { SetStateAction, Dispatch } from 'react';

import { applyNodeChanges, applyEdgeChanges } from '../../utils/changes';

import { Node, Edge } from '../../types';
import { OnEdgesChange, OnNodesChange } from './type';

// export type ApplyChanges<ItemType, ChangesType> = (
//    changes: ChangesType[],
//    items: ItemType[],
// ) => ItemType[];
// export type OnChange<ChangesType> = (changes: ChangesType[]) => void;

// function createUseItemsState(
//    applyChanges: ApplyChanges<Node, NodeChange>,
// ): <
//    NodeData extends Record<string, unknown> = Record<string, unknown>,
//    NodeType extends string = string,
// >(
//    initialItems: Node<NodeData, NodeType>[],
// ) => [
//    Node<NodeData, NodeType>[],
//    Dispatch<SetStateAction<Node<NodeData, NodeType>[]>>,
//    OnChange<NodeChange>,
// ];

// function createUseItemsState(
//    applyChanges: ApplyChanges<Edge, EdgeChange>,
// ): <EdgeData extends Record<string, unknown> = any>(
//    initialItems: Edge<EdgeData>[],
// ) => [
//    Edge<EdgeData>[],
//    Dispatch<SetStateAction<Edge<EdgeData>[]>>,
//    OnChange<EdgeChange>,
// ];

// function createUseItemsState(
//    applyChanges: ApplyChanges<any, any>,
// ): (
//    initialItems: any[],
// ) => [any[], Dispatch<SetStateAction<any[]>>, OnChange<any>] {
//    return (initialItems: any[]) => {
//       const [items, setItems] = useState(initialItems);

//       const onItemsChange = useCallback(
//          (changes: any[]) =>
//             setItems((items: any) => applyChanges(changes, items)),
//          [],
//       );

//       return [items, setItems, onItemsChange];
//    };
// }

// export const useNodesState = createUseItemsState(applyNodeChanges);
// export const useEdgesState = createUseItemsState(applyEdgeChanges);

export function useNodesState<NodeType extends Node = Node>(
   initialNodes: NodeType[],
): [NodeType[], Dispatch<SetStateAction<NodeType[]>>, OnNodesChange<NodeType>] {
   const [nodes, setNodes] = useState(initialNodes);
   const onNodesChange: OnNodesChange<NodeType> = useCallback(
      (changes) => setNodes((nodes) => applyNodeChanges(changes, nodes)),
      [],
   );

   return [nodes, setNodes, onNodesChange];
}

export function useEdgesState<EdgeType extends Edge = Edge>(
   initialEdges: EdgeType[],
): [EdgeType[], Dispatch<SetStateAction<EdgeType[]>>, OnEdgesChange<EdgeType>] {
   const [edges, setEdges] = useState(initialEdges);
   const onEdgesChange: OnEdgesChange<EdgeType> = useCallback(
      (changes) => setEdges((edges) => applyEdgeChanges(changes, edges)),
      [],
   );

   return [edges, setEdges, onEdgesChange];
}
