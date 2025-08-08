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

import React, { useContext, useEffect, useRef } from "react";
import { LinkedListContext } from "../provider/HybridRenderProvider";

export const Node: React.FC<{ id: string; next?: string; component: React.ComponentType<any>; preload?: () => Promise<any> }> = ({ id, next, component: Component, preload }) => {
  const ctx = useContext(LinkedListContext);
  if (!ctx) throw new Error("Node must be used inside LinkedListProvider");
  const { register, visibleIds, showNode } = ctx;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    register({ id, component: Component, next, preload });
  }, [id, next, Component, preload, register]);

  useEffect(() => {
    const nodeEl = ref.current;
    if (!nodeEl) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          showNode(id);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(nodeEl);
    return () => observer.disconnect();
  }, [id, showNode]);

  const mounted = visibleIds.includes(id);
  if (!mounted) return <div style={{ minHeight: 1 }} ref={ref} data-node-id={id} />;

  return (
    <div ref={ref} data-node-id={id}>
      <Component />
    </div>
  );
};
