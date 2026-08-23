import { compareISODate, daysBetween } from "./dates";
import type { ProjectHealth, ProjectStatus } from "./enums";
import type { ISODate } from "./types";

export type ProjectHealthInput = {
  status: ProjectStatus;
  progress: number;
  startDate: ISODate | null;
  targetDate: ISODate | null;
  today: ISODate;
  blockedMilestones?: number;
  overdueMilestones?: number;
  urgentBlockedTasks?: number;
  waitingClientSince?: ISODate | null;
};

export function calculateProjectHealth(input: ProjectHealthInput): ProjectHealth {
  if (input.status === "completed" || input.status === "cancelled") return "green";
  if (input.urgentBlockedTasks && input.urgentBlockedTasks > 0) return "red";
  if (input.overdueMilestones && input.overdueMilestones > 0) return "red";
  if (input.targetDate && compareISODate(input.targetDate, input.today) < 0) return "red";
  if (input.status === "paused") return "yellow";
  if (input.status === "waiting_client" && input.waitingClientSince && daysBetween(input.waitingClientSince, input.today) > 5) return "yellow";
  if (input.targetDate && daysBetween(input.today, input.targetDate) < 7) return "yellow";
  if (input.blockedMilestones && input.blockedMilestones > 0) return "yellow";
  if (!input.startDate || !input.targetDate) return "unknown";

  const totalDays = Math.max(1, daysBetween(input.startDate, input.targetDate));
  const elapsedDays = Math.min(totalDays, Math.max(0, daysBetween(input.startDate, input.today)));
  const expectedProgress = (elapsedDays / totalDays) * 100;
  const progressGap = expectedProgress - input.progress;

  if (progressGap >= 25) return "red";
  if (progressGap >= 10) return "yellow";
  return "green";
}
