import { useState, useCallback } from 'react';
import type { SetStateAction, Dispatch } from 'react';

import { applyNodeChanges, applyEdgeChanges } from '../utils/changes';

import { NodeChange, EdgeChange } from '../types';
import { Edge } from 'components/Edges/type';
import { Node } from 'components/Node/type';

type ApplyChanges<ItemType, ChangesType> = (
   changes: ChangesType[],
   items: ItemType[],
) => ItemType[];
type OnChange<ChangesType> = (changes: ChangesType[]) => void;

function createUseItemsState(
   applyChanges: ApplyChanges<Node, NodeChange>,
): <NodeData = any>(
   initialItems: Node<NodeData>[],
) => [
   Node<NodeData>[],
   Dispatch<SetStateAction<Node<NodeData>[]>>,
   OnChange<NodeChange>,
];

function createUseItemsState(
   applyChanges: ApplyChanges<Edge, EdgeChange>,
): <EdgeData = any>(
   initialItems: Edge<EdgeData>[],
) => [
   Edge<EdgeData>[],
   Dispatch<SetStateAction<Edge<EdgeData>[]>>,
   OnChange<EdgeChange>,
];

function createUseItemsState(
   applyChanges: ApplyChanges<any, any>,
): (
   initialItems: any[],
) => [any[], Dispatch<SetStateAction<any[]>>, OnChange<any>] {
   return (initialItems: any[]) => {
      const [items, setItems] = useState(initialItems);

      const onItemsChange = useCallback(
         (changes: any[]) =>
            setItems((items: any) => applyChanges(changes, items)),
         [],
      );

      return [items, setItems, onItemsChange];
   };
}

export const useNodesState = createUseItemsState(applyNodeChanges);
export const useEdgesState = createUseItemsState(applyEdgeChanges);
