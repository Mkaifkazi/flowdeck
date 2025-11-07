import { Card } from 'react-bootstrap';
import { useAppSelector } from '@/hooks';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiGitCommit,
  FiMessageSquare,
  FiUser,
  FiClock,
} from 'react-icons/fi';
import './ActivityTimeline.css';

interface ActivityTimelineProps {
  projectId?: string;
  limit?: number;
}

interface Activity {
  id: string;
  type: 'issue_created' | 'issue_updated' | 'comment_added' | 'status_changed' | 'assignee_changed';
  userId: string;
  issueId?: string;
  issueKey?: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const ActivityTimeline = ({ projectId, limit = 20 }: ActivityTimelineProps) => {
  const issues = useAppSelector((state) => state.issues.issues);
  const users = useAppSelector((state) => state.users.users);

  // Generate mock activities from issues (in a real app, this would come from an activity log)
  const activities: Activity[] = [];

  const filteredIssues = projectId
    ? issues.filter((issue) => issue.projectId === projectId)
    : issues;

  filteredIssues.slice(0, limit).forEach((issue) => {
    activities.push({
      id: `activity-${issue.id}-created`,
      type: 'issue_created',
      userId: issue.reporterId,
      issueId: issue.id,
      issueKey: issue.key,
      description: `created ${issue.title}`,
      timestamp: issue.createdAt,
    });

    if (issue.createdAt !== issue.updatedAt) {
      activities.push({
        id: `activity-${issue.id}-updated`,
        type: 'issue_updated',
        userId: issue.reporterId,
        issueId: issue.id,
        issueKey: issue.key,
        description: `updated ${issue.title}`,
        timestamp: issue.updatedAt,
      });
    }
  });

  const sortedActivities = activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'issue_created':
        return <FiCheckCircle className="activity-icon created" />;
      case 'issue_updated':
        return <FiGitCommit className="activity-icon updated" />;
      case 'comment_added':
        return <FiMessageSquare className="activity-icon comment" />;
      case 'status_changed':
        return <FiAlertCircle className="activity-icon status" />;
      case 'assignee_changed':
        return <FiUser className="activity-icon assignee" />;
      default:
        return <FiClock className="activity-icon default" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const getUserAvatar = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return null;

    if (user.avatar) {
      return <img src={user.avatar} alt={user.name} className="activity-avatar" />;
    }

    const initials = user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="activity-avatar-placeholder">
        <span>{initials}</span>
      </div>
    );
  };

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name || 'Unknown User';
  };

  return (
    <Card className="activity-timeline-card">
      <Card.Header>
        <h6 className="mb-0">Recent Activity</h6>
      </Card.Header>
      <Card.Body>
        {sortedActivities.length === 0 ? (
          <div className="no-activity">
            <FiClock size={48} />
            <p className="text-muted mb-0 mt-3">No recent activity</p>
          </div>
        ) : (
          <div className="activity-timeline">
            {sortedActivities.map((activity, index) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-indicator">
                  {getActivityIcon(activity.type)}
                  {index < sortedActivities.length - 1 && <div className="activity-line" />}
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    {getUserAvatar(activity.userId)}
                    <div className="activity-details">
                      <div className="activity-text">
                        <strong>{getUserName(activity.userId)}</strong>{' '}
                        {activity.description}
                        {activity.issueKey && (
                          <span className="issue-key-badge">{activity.issueKey}</span>
                        )}
                      </div>
                      <div className="activity-time">{formatTimeAgo(activity.timestamp)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ActivityTimeline;
