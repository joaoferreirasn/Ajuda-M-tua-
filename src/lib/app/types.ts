export type AccountStatus = "active" | "suspicious" | "suspended" | "blocked";

export type HelpStatus = "assigned" | "opened" | "completed" | "expired" | "cancelled";

export type ReportStatus = "pending" | "reviewing" | "confirmed" | "rejected";

export type ReputationKey = "excellent" | "good" | "ok" | "low" | "critical";

export type Profile = {
  userId: string;
  username: string;
  publicId: string;
  email: string | null;
  inviteCode: string;
  referredByUserId: string | null;
  reputation: number;
  reputationLevel: string;
  reputationKey: ReputationKey;
  creditsBalance: number;
  creditsEarned: number;
  creditsSpent: number;
  helpsGiven: number;
  helpsReceived: number;
  link: string | null;
  linkDescription: string | null;
  status: AccountStatus;
  isAdmin: boolean;
  isSeed: boolean;
  queueJoinedAt: string | null;
  lastHelpedAt: string | null;
  lastHelpGivenAt: string | null;
  blockedUntil: string | null;
  blockReason: string | null;
  createdAt: string;
  lastActiveAt: string;
};

export type QueueInfo = {
  position: number | null;
  eligibleCount: number;
  helpsNeeded: number;
  helpsRemaining: number;
  inQueue: boolean;
};

export type HelpTask = {
  id: number;
  helperUserId: string;
  helpedUserId: string;
  helpedUsername: string;
  helpedPublicId: string;
  helpedHelpsReceived: number;
  helpedStatus: AccountStatus;
  link: string;
  status: HelpStatus;
  assignedAt: string;
  openedAt: string | null;
};

export type CreditTx = {
  id: number;
  amount: number;
  balanceAfter: number;
  kind: string;
  reason: string;
  createdAt: string;
};

export type HistoryItem = {
  id: number;
  action: string;
  details: string | null;
  createdAt: string;
};

export type RankingRow = {
  position: number;
  username: string;
  publicId: string;
  helpsGiven: number;
  reputation: number;
  reputationLevel: string;
  isMe: boolean;
};

export type ReportRow = {
  id: number;
  reporterUserId: string;
  reporterUsername: string;
  reportedUserId: string;
  reportedUsername: string;
  reason: string;
  description: string | null;
  status: ReportStatus;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
};

export type AdminStats = {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  newUsers: number;
  links: number;
  helpsDone: number;
  helpsReceived: number;
  creditsMoved: number;
  pendingReports: number;
  suspiciousUsers: number;
  openTickets: number;
};

export type AppSettingsMap = Record<string, string>;
