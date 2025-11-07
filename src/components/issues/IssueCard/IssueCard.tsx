import { Card, Badge } from 'react-bootstrap';
import type { Issue, User } from '@/types';
import TypeIcon from '@components/common/TypeIcon/TypeIcon';
import PriorityBadge from '@components/common/PriorityBadge/PriorityBadge';
import Avatar from '@components/common/Avatar/Avatar';
import { FiClock, FiMessageSquare } from 'react-icons/fi';
import './IssueCard.css';

interface IssueCardProps {
  issue: Issue;
  assignee?: User;
  onClick?: () => void;
  isDragging?: boolean;
}

const IssueCard = ({ issue, assignee, onClick, isDragging }: IssueCardProps) => {
  return (
    <Card
      className={`issue-card ${isDragging ? 'dragging' : ''}`}
      onClick={onClick}
    >
      <Card.Body>
        {/* Header */}
        <div className="issue-card-header">
          <div className="d-flex align-items-center gap-2">
            <TypeIcon type={issue.type} size={16} />
            <span className="issue-key">{issue.key}</span>
          </div>
          <PriorityBadge priority={issue.priority} />
        </div>

        {/* Title */}
        <h6 className="issue-title">{issue.title}</h6>

        {/* Labels */}
        {issue.labels && issue.labels.length > 0 && (
          <div className="issue-labels">
            {issue.labels.map((label) => (
              <Badge key={label} bg="light" text="dark" className="issue-label">
                {label}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="issue-card-footer">
          <div className="issue-meta">
            {issue.estimatePoints && (
              <span className="estimate-badge">
                {issue.estimatePoints} pts
              </span>
            )}
            {issue.dueDate && (
              <span className="due-date">
                <FiClock size={12} />
                {new Date(issue.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
            <span className="comment-count">
              <FiMessageSquare size={12} />
              0
            </span>
          </div>
          {assignee && (
            <Avatar
              src={assignee.avatar}
              name={assignee.name}
              size="sm"
            />
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default IssueCard;
