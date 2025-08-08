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
export class Deque<T> {
  private items: T[] = [];
  pushBack(item: T) { this.items.push(item); }
  pushFront(item: T) { this.items.unshift(item); }
  popBack(): T | undefined { return this.items.pop(); }
  popFront(): T | undefined { return this.items.shift(); }
  peekFront(): T | undefined { return this.items[0]; }
  peekBack(): T | undefined { return this.items[this.items.length - 1]; }
  size(): number { return this.items.length; }
  toArray(): T[] { return [...this.items]; }
  clear() { this.items = []; }
  has(predicate: (t: T) => boolean) { return this.items.some(predicate); }
}
