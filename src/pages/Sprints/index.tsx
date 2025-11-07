import { Container, Card, Button, Badge, Row, Col, Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { FiPlus, FiCalendar, FiTarget, FiMoreVertical, FiPlay, FiCheck } from 'react-icons/fi';
import CreateSprintModal from '@components/sprints/CreateSprintModal/CreateSprintModal';
import './Sprints.css';

const Sprints = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const sprints = useAppSelector((state) => state.sprints.sprints);
  const issues = useAppSelector((state) => state.issues.issues);
  const currentProject = useAppSelector((state) => state.projects.currentProject);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const projectSprints = sprints.filter((sprint) => sprint.projectId === projectId);
  const activeSprint = projectSprints.find((s) => s.status === 'active');
  const plannedSprints = projectSprints.filter((s) => s.status === 'planned');
  const completedSprints = projectSprints.filter((s) => s.status === 'completed');

  const getSprintIssues = (sprintId: string) => {
    return issues.filter((issue) => issue.sprintId === sprintId);
  };

  const getSprintPoints = (sprintId: string) => {
    const sprintIssues = getSprintIssues(sprintId);
    return sprintIssues.reduce((sum, issue) => sum + (issue.estimatePoints || 0), 0);
  };

  const getCompletedPoints = (sprintId: string) => {
    const sprintIssues = getSprintIssues(sprintId);
    return sprintIssues
      .filter((issue) => issue.status === 'done')
      .reduce((sum, issue) => sum + (issue.estimatePoints || 0), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'planned':
        return 'secondary';
      case 'completed':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSprintClick = (sprintId: string) => {
    navigate(`/projects/${projectId}/sprints/${sprintId}`);
  };

  const renderSprintCard = (sprint: any, isActive = false) => {
    const sprintIssues = getSprintIssues(sprint.id);
    const totalPoints = getSprintPoints(sprint.id);
    const completedPoints = getCompletedPoints(sprint.id);
    const daysRemaining = getDaysRemaining(sprint.endDate);

    return (
      <Card key={sprint.id} className={`sprint-card ${isActive ? 'active-sprint' : ''}`}>
        <Card.Body>
          <div className="sprint-card-header">
            <div className="sprint-info">
              <div className="sprint-title-row">
                <h5 className="sprint-name">{sprint.name}</h5>
                <Badge bg={getStatusColor(sprint.status)} className="sprint-status-badge">
                  {sprint.status === 'active' && <FiPlay size={12} />}
                  {sprint.status === 'completed' && <FiCheck size={12} />}
                  {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
                </Badge>
              </div>
              {sprint.goal && (
                <div className="sprint-goal">
                  <FiTarget size={14} />
                  <span>{sprint.goal}</span>
                </div>
              )}
            </div>
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="sprint-menu-btn">
                <FiMoreVertical size={18} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSprintClick(sprint.id)}>
                  View Sprint
                </Dropdown.Item>
                {sprint.status === 'planned' && (
                  <Dropdown.Item>Start Sprint</Dropdown.Item>
                )}
                {sprint.status === 'active' && (
                  <Dropdown.Item>Complete Sprint</Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Item className="text-danger">Delete Sprint</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="sprint-dates">
            <div className="date-item">
              <FiCalendar size={14} />
              <span>
                {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
              </span>
            </div>
            {sprint.status === 'active' && (
              <div className="days-remaining">
                {daysRemaining > 0 ? (
                  <span className="text-success">{daysRemaining} days remaining</span>
                ) : (
                  <span className="text-danger">Overdue by {Math.abs(daysRemaining)} days</span>
                )}
              </div>
            )}
          </div>

          <Row className="sprint-stats">
            <Col xs={4}>
              <div className="stat-item">
                <div className="stat-value">{sprintIssues.length}</div>
                <div className="stat-label">Issues</div>
              </div>
            </Col>
            <Col xs={4}>
              <div className="stat-item">
                <div className="stat-value">
                  {completedPoints}/{totalPoints}
                </div>
                <div className="stat-label">Points</div>
              </div>
            </Col>
            <Col xs={4}>
              <div className="stat-item">
                <div className="stat-value">
                  {totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0}%
                </div>
                <div className="stat-label">Complete</div>
              </div>
            </Col>
          </Row>

          {totalPoints > 0 && (
            <div className="sprint-progress">
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${(completedPoints / totalPoints) * 100}%` }}
                />
              </div>
            </div>
          )}

          <Button
            variant="outline-primary"
            size="sm"
            className="view-sprint-btn"
            onClick={() => handleSprintClick(sprint.id)}
          >
            View Sprint Details
          </Button>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid className="sprints-page">
      <div className="sprints-header">
        <div>
          <h2>{currentProject?.name} Sprints</h2>
          <p className="text-muted mb-0">
            Manage and track your project sprints
          </p>
        </div>
        <Button
          variant="primary"
          className="create-sprint-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus size={18} />
          Create Sprint
        </Button>
      </div>

      {/* Active Sprint */}
      {activeSprint && (
        <div className="active-sprint-section">
          <h4 className="section-title">Active Sprint</h4>
          {renderSprintCard(activeSprint, true)}
        </div>
      )}

      {/* Planned Sprints */}
      {plannedSprints.length > 0 && (
        <div className="planned-sprints-section">
          <h4 className="section-title">Planned Sprints</h4>
          <div className="sprints-grid">
            {plannedSprints.map((sprint) => renderSprintCard(sprint))}
          </div>
        </div>
      )}

      {/* Completed Sprints */}
      {completedSprints.length > 0 && (
        <div className="completed-sprints-section">
          <h4 className="section-title">Completed Sprints</h4>
          <div className="sprints-grid">
            {completedSprints.map((sprint) => renderSprintCard(sprint))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projectSprints.length === 0 && (
        <div className="empty-state">
          <FiCalendar size={64} className="empty-icon" />
          <h5>No sprints yet</h5>
          <p className="text-muted">Create your first sprint to start planning your work</p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <FiPlus size={18} />
            Create Sprint
          </Button>
        </div>
      )}

      <CreateSprintModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        projectId={projectId || ''}
      />
    </Container>
  );
};

export default Sprints;
