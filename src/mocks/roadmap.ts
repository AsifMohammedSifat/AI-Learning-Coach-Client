import type { RoadmapData } from "../pages/student/GeneratedRoadmap";

export const dummyRoadmap: RoadmapData = {
  goal: "Codeforces 1400+ রোডম্যাপ",
  language: "C++",
  hoursPerDay: 3,
  currentLevel: "basic",
  weeks: [
    {
      id: "w1",
      order: 1,
      title: "Array & Time Complexity",
      status: "done",
      topics: [
        { id: "t1", text: "Big-O notation বেসিক", done: true },
        { id: "t2", text: "Array traversal প্যাটার্ন", done: true },
      ],
    },
    {
      id: "w2",
      order: 2,
      title: "Sorting & Two Pointer",
      status: "done",
      topics: [
        { id: "t3", text: "Merge sort, Quick sort", done: true },
        { id: "t4", text: "Two pointer technique", done: true },
      ],
    },
    {
      id: "w3",
      order: 3,
      title: "Binary Search & STL",
      status: "current",
      estimatedHoursLeft: 4,
      resource: "তোমার নিজের STL প্লেলিস্ট",
      topics: [
        { id: "t5", text: "Binary Search on Answer", done: false },
        { id: "t6", text: "lower_bound / upper_bound", done: false },
        { id: "t7", text: "set, map, pair — STL practice", done: false },
        { id: "t8", text: "৫টা Codeforces Div3 প্রবলেম সলভ", done: false },
      ],
    },
    {
      id: "w4",
      order: 4,
      title: "Recursion & Backtracking",
      status: "upcoming",
      topics: [
        { id: "t9", text: "Recursion tree বোঝা", done: false },
        { id: "t10", text: "Subsets / Permutations", done: false },
        { id: "t11", text: "N-Queens ধরনের প্রবলেম", done: false },
      ],
    },
    {
      id: "w5",
      order: 5,
      title: "Graph Basics (BFS/DFS)",
      status: "upcoming",
      topics: [
        { id: "t12", text: "Adjacency list representation", done: false },
        { id: "t13", text: "BFS — shortest path (unweighted)", done: false },
        { id: "t14", text: "DFS — connected components", done: false },
      ],
    },
  ],
};
