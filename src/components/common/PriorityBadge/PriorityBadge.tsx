import { Badge } from 'react-bootstrap';
import { IssuePriority } from '@types/index';
import { FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';

interface PriorityBadgeProps {
  priority: IssuePriority;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const getConfig = () => {
    switch (priority) {
      case IssuePriority.HIGHEST:
        return { bg: 'danger', icon: <FiArrowUp />, text: 'Highest' };
      case IssuePriority.HIGH:
        return { bg: 'warning', icon: <FiArrowUp />, text: 'High' };
      case IssuePriority.MEDIUM:
        return { bg: 'info', icon: <FiMinus />, text: 'Medium' };
      case IssuePriority.LOW:
        return { bg: 'secondary', icon: <FiArrowDown />, text: 'Low' };
      case IssuePriority.LOWEST:
        return { bg: 'secondary', icon: <FiArrowDown />, text: 'Lowest' };
    }
  };

  const config = getConfig();

  return (
    <Badge bg={config.bg} className="d-inline-flex align-items-center gap-1">
      {config.icon}
      {config.text}
    </Badge>
  );
};

export default PriorityBadge;
