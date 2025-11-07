import { Container, Table, Badge, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import IssueDetailModal from '@components/issues/IssueDetailModal/IssueDetailModal';
import CreateIssueModal from '@components/issues/CreateIssueModal/CreateIssueModal';
import { IssueType, IssuePriority, IssueStatus } from '@/types';
import {
  FiCheckSquare,
  FiAlertCircle,
  FiTag,
  FiZap,
  FiPlus,
  FiSearch,
} from 'react-icons/fi';
import './Backlog.css';

const Backlog = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const issues = useAppSelector((state) => state.issues.issues);
  const users = useAppSelector((state) => state.users.users);
  const currentProject = useAppSelector((state) => state.projects.currentProject);

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<IssueType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<IssuePriority | 'ALL'>('ALL');

  // Filter issues by current project
  let projectIssues = issues.filter((issue) => issue.projectId === projectId);

  // Apply filters
  if (searchQuery) {
    projectIssues = projectIssues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.key.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterType !== 'ALL') {
    projectIssues = projectIssues.filter((issue) => issue.type === filterType);
  }

  if (filterStatus !== 'ALL') {
    projectIssues = projectIssues.filter((issue) => issue.status === filterStatus);
  }

  if (filterPriority !== 'ALL') {
    projectIssues = projectIssues.filter((issue) => issue.priority === filterPriority);
  }

  const getTypeIcon = (type: IssueType) => {
    switch (type) {
      case IssueType.STORY:
        return <FiCheckSquare className="type-icon story" />;
      case IssueType.BUG:
        return <FiAlertCircle className="type-icon bug" />;
      case IssueType.TASK:
        return <FiTag className="type-icon task" />;
      case IssueType.EPIC:
        return <FiZap className="type-icon epic" />;
    }
  };

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case IssuePriority.HIGHEST:
        return 'danger';
      case IssuePriority.HIGH:
        return 'warning';
      case IssuePriority.MEDIUM:
        return 'primary';
      case IssuePriority.LOW:
        return 'secondary';
      case IssuePriority.LOWEST:
        return 'light';
    }
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.TODO:
        return 'secondary';
      case IssueStatus.IN_PROGRESS:
        return 'primary';
      case IssueStatus.IN_REVIEW:
        return 'warning';
      case IssueStatus.DONE:
        return 'success';
    }
  };

  const getStatusLabel = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.TODO:
        return 'To Do';
      case IssueStatus.IN_PROGRESS:
        return 'In Progress';
      case IssueStatus.IN_REVIEW:
        return 'In Review';
      case IssueStatus.DONE:
        return 'Done';
    }
  };

  return (
    <Container fluid className="backlog-page">
      {/* Header */}
      <div className="backlog-header">
        <div>
          <h2>{currentProject?.name} Backlog</h2>
          <p className="text-muted mb-0">
            {projectIssues.length} {projectIssues.length === 1 ? 'issue' : 'issues'}
          </p>
        </div>
        <Button
          variant="primary"
          className="create-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus size={18} />
          Create Issue
        </Button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <Form.Control
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns">
          <Form.Select
            size="sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as IssueType | 'ALL')}
          >
            <option value="ALL">All Types</option>
            <option value={IssueType.STORY}>Story</option>
            <option value={IssueType.TASK}>Task</option>
            <option value={IssueType.BUG}>Bug</option>
            <option value={IssueType.EPIC}>Epic</option>
          </Form.Select>

          <Form.Select
            size="sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as IssueStatus | 'ALL')}
          >
            <option value="ALL">All Status</option>
            <option value={IssueStatus.TODO}>To Do</option>
            <option value={IssueStatus.IN_PROGRESS}>In Progress</option>
            <option value={IssueStatus.IN_REVIEW}>In Review</option>
            <option value={IssueStatus.DONE}>Done</option>
          </Form.Select>

          <Form.Select
            size="sm"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as IssuePriority | 'ALL')}
          >
            <option value="ALL">All Priorities</option>
            <option value={IssuePriority.HIGHEST}>Highest</option>
            <option value={IssuePriority.HIGH}>High</option>
            <option value={IssuePriority.MEDIUM}>Medium</option>
            <option value={IssuePriority.LOW}>Low</option>
            <option value={IssuePriority.LOWEST}>Lowest</option>
          </Form.Select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="issues-table-container">
        <Table hover className="issues-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>Type</th>
              <th style={{ width: '120px' }}>Key</th>
              <th>Summary</th>
              <th style={{ width: '120px' }}>Status</th>
              <th style={{ width: '120px' }}>Priority</th>
              <th style={{ width: '150px' }}>Assignee</th>
              <th style={{ width: '100px' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {projectIssues.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-5">
                  <div className="empty-state">
                    <FiCheckSquare size={48} className="empty-icon" />
                    <h5>No issues found</h5>
                    <p className="text-muted">
                      {searchQuery || filterType !== 'ALL' || filterStatus !== 'ALL' || filterPriority !== 'ALL'
                        ? 'Try adjusting your filters'
                        : 'Create your first issue to get started'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              projectIssues.map((issue) => {
                const assignee = users.find((u) => u.id === issue.assigneeId);
                return (
                  <tr
                    key={issue.id}
                    onClick={() => setSelectedIssueId(issue.id)}
                    className="issue-row"
                  >
                    <td>{getTypeIcon(issue.type)}</td>
                    <td>
                      <span className="issue-key">{issue.key}</span>
                    </td>
                    <td>
                      <div className="issue-title-cell">
                        {issue.title}
                        {issue.labels && issue.labels.length > 0 && (
                          <div className="labels-inline">
                            {issue.labels.slice(0, 2).map((label) => (
                              <Badge key={label} bg="light" text="dark" className="label-badge">
                                {label}
                              </Badge>
                            ))}
                            {issue.labels.length > 2 && (
                              <Badge bg="light" text="dark" className="label-badge">
                                +{issue.labels.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge bg={getStatusColor(issue.status)}>
                        {getStatusLabel(issue.status)}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                    </td>
                    <td>
                      {assignee ? (
                        <div className="assignee-cell">
                          {assignee.avatar ? (
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="assignee-avatar"
                            />
                          ) : (
                            <div className="assignee-avatar-placeholder">
                              {assignee.name.charAt(0)}
                            </div>
                          )}
                          <span>{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted">Unassigned</span>
                      )}
                    </td>
                    <td>
                      {issue.storyPoints ? (
                        <Badge bg="light" text="dark" className="points-badge">
                          {issue.storyPoints}
                        </Badge>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>

      {/* Modals */}
      {selectedIssueId && (
        <IssueDetailModal
          show={!!selectedIssueId}
          onHide={() => setSelectedIssueId(null)}
          issueId={selectedIssueId}
        />
      )}

      {showCreateModal && projectId && (
        <CreateIssueModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          projectId={projectId}
        />
      )}
    </Container>
  );
};

export default Backlog;
