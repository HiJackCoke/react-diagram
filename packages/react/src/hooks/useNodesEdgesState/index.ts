import { useState, useCallback } from 'react';
import type { SetStateAction, Dispatch } from 'react';

import { applyNodeChanges, applyEdgeChanges } from '../../utils/changes';

import { Node, Edge } from '../../types';
import { NodeChange, EdgeChange } from './type';

export type ApplyChanges<ItemType, ChangesType> = (
   changes: ChangesType[],
   items: ItemType[],
) => ItemType[];
export type OnChange<ChangesType> = (changes: ChangesType[]) => void;

function createUseItemsState(
   applyChanges: ApplyChanges<Node, NodeChange>,
): <NodeData extends Record<string, unknown> = Record<string, unknown>>(
   initialItems: Node<NodeData>[],
) => [
   Node<NodeData>[],
   Dispatch<SetStateAction<Node<NodeData>[]>>,
   OnChange<NodeChange>,
];

function createUseItemsState(
   applyChanges: ApplyChanges<Edge, EdgeChange>,
): <EdgeData extends Record<string, unknown> = any>(
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
