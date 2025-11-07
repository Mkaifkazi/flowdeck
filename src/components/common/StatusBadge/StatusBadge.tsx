import { Badge } from 'react-bootstrap';
import { IssueStatus } from '@/types';

interface StatusBadgeProps {
  status: IssueStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getConfig = () => {
    switch (status) {
      case IssueStatus.TODO:
        return { bg: 'secondary', text: 'To Do' };
      case IssueStatus.IN_PROGRESS:
        return { bg: 'primary', text: 'In Progress' };
      case IssueStatus.IN_REVIEW:
        return { bg: 'warning', text: 'In Review' };
      case IssueStatus.DONE:
        return { bg: 'success', text: 'Done' };
    }
  };

  const config = getConfig();

  return <Badge bg={config.bg}>{config.text}</Badge>;
};

export default StatusBadge;
