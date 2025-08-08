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

import { useContext } from "react";
import { LinkedListContext } from "../provider/HybridRenderProvider";

export const useLinkedList = () => {
  const ctx = useContext(LinkedListContext);
  if (!ctx) throw new Error("useLinkedList must be inside LinkedListProvider");
  return ctx;
};
