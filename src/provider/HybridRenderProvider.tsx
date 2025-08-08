/*
 * Copyright © 2025 Shiju S
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to use,
 * modify, and run the Software for personal or commercial purposes, provided that:
 *
 * 1. The original author, Shiju S, is credited in all copies or substantial portions of the Software.
 * 2. The Software, or substantial portions of it, may not be redistributed, sublicensed, or sold
 *    without prior written permission from the author.
 * 3. This notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 */
import React, { createContext, useCallback, useRef, useState } from "react";
import { Deque } from "../utils/deque";

export type NodeDef = {
  id: string;
  component: React.ComponentType<any>;
  next?: string;
  preload?: () => Promise<any>;
};

type InternalNode = NodeDef & { mounted?: boolean };

type LinkedCtx = {
  register: (node: NodeDef) => void;
  showNode: (id: string) => void;
  visibleIds: string[];
  getNode: (id: string) => InternalNode | undefined;
  windowSize: number;
};

export const LinkedListContext = createContext<LinkedCtx | null>(null);

export const HybridRenderProvider: React.FC<{
  children?: React.ReactNode;
  windowSize?: number;
}> = ({ children, windowSize = 3 }) => {
  const mapRef = useRef<Record<string, InternalNode>>({});
  const orderRef = useRef<Deque<string>>(new Deque<string>());
  const [visibleIds, setVisibleIds] = useState<string[]>([]);

  const register = useCallback((node: NodeDef) => {
    if (!mapRef.current[node.id]) {
      mapRef.current[node.id] = { ...node, mounted: false };
    }
    if (!orderRef.current.has(id => id === node.id)) {
      orderRef.current.pushBack(node.id);
    }
    if (visibleIds.length === 0) {
      setVisibleIds([node.id]);
      mapRef.current[node.id].mounted = true;
    }
  }, [visibleIds.length]);

  const getNode = useCallback((id: string) => mapRef.current[id], []);

  const pruneWindow = useCallback((centerId: string) => {
    const ids: string[] = [centerId];
    let cur = mapRef.current[centerId];
    while (ids.length < windowSize && cur?.next) {
      const nxt = mapRef.current[cur.next];
      if (!nxt) break;
      ids.push(nxt.id);
      cur = nxt;
    }
    if (ids.length < windowSize) {
      const all = orderRef.current.toArray();
      const idx = all.indexOf(centerId);
      for (let i = idx - 1; i >= 0 && ids.length < windowSize; --i) {
        const id = all[i];
        if (!ids.includes(id)) ids.unshift(id);
      }
    }
    Object.keys(mapRef.current).forEach(id => {
      mapRef.current[id].mounted = ids.includes(id);
    });
    setVisibleIds(ids);
  }, [windowSize]);

  const showNode = useCallback(async (id: string) => {
    const node = mapRef.current[id];
    if (!node) return;
    const toMount = new Set<string>();
    toMount.add(id);
    if (node.next) toMount.add(node.next);
    if (node.next) {
      const nextNode = mapRef.current[node.next];
      if (nextNode?.preload) {
        try { await nextNode.preload(); } catch (e) { /* ignore */ }
      }
    }
    pruneWindow(id);
  }, [pruneWindow]);

  return (
    <LinkedListContext.Provider value={{
      register,
      showNode,
      visibleIds,
      getNode,
      windowSize
    }}>
      {children}
    </LinkedListContext.Provider>
  );
};
