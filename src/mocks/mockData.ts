// ---------------------------------------------------------------------------
// Static fixtures used by the API layer while VITE_USE_MOCKS=true, so the
// frontend is fully demoable before the Express + Mongo backend is live
// (see build plan: backend endpoints land Day 3-5).
// ---------------------------------------------------------------------------
import type {
  ChatMessage,
  GenerateRoadmapRequest,
  ProgressStats,
  Roadmap,
} from '@/types';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let idCounter = 0;
export const nextId = (prefix: string) => `${prefix}-${Date.now()}-${idCounter++}`;

export function buildMockRoadmap(req: GenerateRoadmapRequest): Roadmap {
  return {
    id: 'roadmap-cf-1400',
    goalTitle: req.goal || 'Codeforces 1400+ রোডম্যাপ',
    language: req.language,
    hoursPerDay: req.hoursPerDay,
    estimatedWeeks: 12,
    createdAt: new Date().toISOString(),
    weeks: [
      {
        id: 'wk-1',
        weekLabel: 'WK 1',
        title: 'Array & Time Complexity',
        status: 'done',
        topics: [
          { id: 'wk1-t1', title: 'Array basics ও traversal' },
          { id: 'wk1-t2', title: 'Big-O notation' },
        ],
      },
      {
        id: 'wk-2',
        weekLabel: 'WK 2',
        title: 'Sorting & Two Pointer',
        status: 'done',
        topics: [
          { id: 'wk2-t1', title: 'Sorting algorithms' },
          { id: 'wk2-t2', title: 'Two pointer technique' },
        ],
      },
      {
        id: 'wk-3',
        weekLabel: 'WK 3',
        title: 'Binary Search & STL',
        status: 'current',
        estimatedTimeLeft: '৪ঘ বাকি',
        resourceNote: '📺 সাজেস্টেড: তোমার নিজের STL প্লেলিস্ট',
        topics: [
          { id: 'wk3-t1', title: 'Binary Search on Answer' },
          { id: 'wk3-t2', title: 'lower_bound / upper_bound' },
          { id: 'wk3-t3', title: 'set, map, pair — STL practice' },
          { id: 'wk3-t4', title: '৫টা Codeforces Div3 প্রবলেম সলভ' },
        ],
      },
      {
        id: 'wk-4',
        weekLabel: 'WK 4',
        title: 'Recursion & Backtracking',
        status: 'locked',
        topics: [
          { id: 'wk4-t1', title: 'Recursion tree বোঝা' },
          { id: 'wk4-t2', title: 'Subsets / Permutations' },
          { id: 'wk4-t3', title: 'N-Queens ধরনের প্রবলেম' },
        ],
      },
      {
        id: 'wk-5',
        weekLabel: 'WK 5',
        title: 'Graph Basics (BFS/DFS)',
        status: 'locked',
        topics: [
          { id: 'wk5-t1', title: 'Adjacency list representation' },
          { id: 'wk5-t2', title: 'BFS — shortest path (unweighted)' },
          { id: 'wk5-t3', title: 'DFS — connected components' },
        ],
      },
      {
        id: 'wk-6',
        weekLabel: 'WK 6-7',
        title: 'Dynamic Programming (Intro)',
        status: 'locked',
        topics: [{ id: 'wk6-t1', title: 'DP পরিচিতি ও memoization' }],
      },
    ],
  };
}

const BOT_REPLIES: Record<string, string> = {
  'binary search': 'Linear search প্রতিটা element একে একে চেক করে — O(n)। Binary search sorted array-তে মাঝখান থেকে ভাগ করে খোঁজে — O(log n)। ডেটা বড় হলে binary search অনেক দ্রুত, কিন্তু array sorted থাকতেই হবে।',
  'set আর map': 'set শুধু unique value store করে, নিজে থেকেই sorted থাকে। map key-value pair store করে — প্রতিটা key ইউনিক। দুটোই ভিতরে balanced BST দিয়ে implement করা, তাই insert/find সবই O(log n)।',
  'practice problem': 'WK3 এর জন্য এই ৩টা ট্রাই করো:\n১. CF 1360C — Similar Pairs\n২. CF 702C — Cellular Network\n৩. CF 4C — Registration System',
  'lower_bound': 'lower_bound(x) প্রথম এমন element খুঁজে দেয় যেটা x এর চেয়ে ছোট না (≥ x), আর upper_bound(x) প্রথম এমন element খুঁজে দেয় যেটা x এর চেয়ে বড় (> x)। দুটোই sorted array-তে O(log n) সময়ে কাজ করে।',
};

export function buildMockChatReply(message: string): ChatMessage {
  const lower = message.toLowerCase();
  const matched = Object.entries(BOT_REPLIES).find(([key]) => lower.includes(key.toLowerCase()));
  const text =
    matched?.[1] ??
    'ভালো প্রশ্ন! এটা তোমার চলতি টপিকের সাথে রিলেটেড — একটা ছোট উদাহরণ নিজে লিখে দেখো, আটকে গেলে কোডটা পাঠাও, একসাথে ডিবাগ করি।';
  return {
    id: nextId('msg'),
    sender: 'bot',
    text,
    timestamp: new Date().toISOString(),
  };
}

export const mockProgressStats: ProgressStats = {
  overallProgressPercent: 22,
  streakDays: 6,
  hoursThisWeek: 14.5,
  goalHoursThisWeek: 21,
  problemsSolved: 37,
  problemsSolvedDeltaThisWeek: 9,
  dailyHours: [
    { dayLabel: 'শনি', hours: 2.9 },
    { dayLabel: 'রবি', hours: 3.7 },
    { dayLabel: 'সোম', hours: 2.0 },
    { dayLabel: 'মঙ্গল', hours: 4.5 },
    { dayLabel: 'বুধ', hours: 3.2 },
    { dayLabel: 'বৃহঃ', hours: 1.5 },
    { dayLabel: 'শুক্র', hours: 2.4, isToday: true },
  ],
  activity14Day: [1, 2, 0, 1, 3, 2, 1, 0, 2, 3, 2, 1, 3, 2],
  topicMastery: [
    { topic: 'Array & Complexity', percent: 95 },
    { topic: 'Sorting', percent: 88 },
    { topic: 'Binary Search', percent: 52 },
    { topic: 'STL', percent: 40 },
    { topic: 'Recursion', percent: 12 },
    { topic: 'Graph (BFS/DFS)', percent: 0 },
  ],
  weakAreas: ['Recursion base case', 'STL priority_queue'],
  checklist: [
    { id: 'ci-1', label: 'lower_bound / upper_bound প্র্যাকটিস', minutes: 15, completed: true },
    { id: 'ci-2', label: 'set, map, pair — ৩টা mini exercise', minutes: 25, completed: true },
    { id: 'ci-3', label: 'Codeforces Div3 — ৫টা প্রবলেম সলভ', minutes: 90, completed: false },
    { id: 'ci-4', label: 'আজকের ভুলগুলো রিভিউ করো', minutes: 10, completed: false },
  ],
};
