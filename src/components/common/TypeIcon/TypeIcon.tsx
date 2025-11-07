import { IssueType } from '@/types';
import { FiCheckSquare, FiAlertCircle, FiFileText, FiLayers, FiList } from 'react-icons/fi';

interface TypeIconProps {
  type: IssueType;
  size?: number;
}

const TypeIcon = ({ type, size = 16 }: TypeIconProps) => {
  const getIcon = () => {
    switch (type) {
      case IssueType.TASK:
        return <FiCheckSquare size={size} color="#0052cc" />;
      case IssueType.BUG:
        return <FiAlertCircle size={size} color="#de350b" />;
      case IssueType.STORY:
        return <FiFileText size={size} color="#00875a" />;
      case IssueType.EPIC:
        return <FiLayers size={size} color="#6554c0" />;
      case IssueType.SUBTASK:
        return <FiList size={size} color="#6c757d" />;
    }
  };

  return <span className="d-inline-flex align-items-center">{getIcon()}</span>;
};

export default TypeIcon;
