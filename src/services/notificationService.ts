import type { Opportunity, AppNotification } from '../types';

const STORAGE_KEY = 'opportunitylens_read_notifications_v1';

export function getReadNotificationIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch (err) {
    console.error('Failed to read notification state from storage', err);
  }
  return new Set();
}

export function saveReadNotificationIds(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch (err) {
    console.error('Failed to save notification state to storage', err);
  }
}

export function markNotificationAsRead(id: string): void {
  const ids = getReadNotificationIds();
  ids.add(id);
  saveReadNotificationIds(ids);
}

export function markAllNotificationsAsRead(notifications: AppNotification[] = []): void {
  const ids = getReadNotificationIds();
  if (Array.isArray(notifications)) {
    notifications.forEach((n) => ids.add(n.id));
  }
  saveReadNotificationIds(ids);
}

export function generateNotifications(opportunities: Opportunity[] = []): AppNotification[] {
  if (!Array.isArray(opportunities) || opportunities.length === 0) {
    return [];
  }
  const readIds = getReadNotificationIds();
  const notifications: AppNotification[] = [];

  opportunities.forEach((opp) => {
    // 1. High-Risk Scam Alert
    if (opp.riskAssessment.riskLevel === 'high') {
      const id = `notif-scam-${opp.id}`;
      const quoteSnippet = opp.riskAssessment.evidenceFromText[0]?.quote
        ? `"${opp.riskAssessment.evidenceFromText[0].quote.slice(0, 70)}..."`
        : 'Suspicious advance-fee or contact patterns detected';

      notifications.push({
        id,
        type: 'scam_alert',
        title: `High-Risk Scam Flag Detected`,
        message: `${opp.title} at ${opp.company}: ${quoteSnippet}. Exercise extreme caution before responding.`,
        timestamp: opp.createdAt,
        opportunityId: opp.id,
        severity: 'high',
        read: readIds.has(id),
      });
    }

    // 2. Pending Due-Diligence Checks
    const checkedCount = opp.verificationChecklist
      ? Object.values(opp.verificationChecklist).filter(Boolean).length
      : 0;
    const totalChecks = 5;
    if (checkedCount < totalChecks && opp.status !== 'archived' && opp.status !== 'rejected') {
      const id = `notif-diligence-${opp.id}`;
      notifications.push({
        id,
        type: 'due_diligence',
        title: `Due Diligence Pending (${totalChecks - checkedCount} checks remaining)`,
        message: `Verify official career portal and recruiter domain for ${opp.title} at ${opp.company} before sharing sensitive documents.`,
        timestamp: opp.createdAt,
        opportunityId: opp.id,
        severity: 'medium',
        read: readIds.has(id),
      });
    }

    // 3. Interview Stage Preparation
    if (opp.status === 'interviewing') {
      const id = `notif-interview-${opp.id}`;
      notifications.push({
        id,
        type: 'pipeline_update',
        title: `Interview in Progress: ${opp.company}`,
        message: `Active interview stage for ${opp.title}. Review your Learn-Build-Practice roadmap to practice high-yield topics.`,
        timestamp: opp.createdAt,
        opportunityId: opp.id,
        severity: 'low',
        read: readIds.has(id),
      });
    }

    // 4. Critical Core Skill Gap
    if (opp.skillMatch.criticalMissingCount > 0 && opp.status !== 'archived') {
      const id = `notif-skill-${opp.id}`;
      const missingNames = opp.skillMatch.missingSkills
        .filter((s) => s.requiredLevel === 'required')
        .slice(0, 2)
        .map((s) => s.name)
        .join(', ');

      notifications.push({
        id,
        type: 'skill_gap',
        title: `Core Skill Gaps (${opp.skillMatch.criticalMissingCount} missing)`,
        message: `${opp.title} explicitly requires ${missingNames}. Check recommended project deliverables.`,
        timestamp: opp.createdAt,
        opportunityId: opp.id,
        severity: 'medium',
        read: readIds.has(id),
      });
    }
  });

  // Sort: Unread first, then high severity, then newest
  return notifications.sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    const severityOrder = { high: 0, medium: 1, low: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
