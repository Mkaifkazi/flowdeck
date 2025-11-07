import { Container, Card, Button, Badge, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { updateSprint } from '@features/sprints/sprintsSlice';
import { updateIssue } from '@features/issues/issuesSlice';
import { IssueStatus } from '@/types';
import {
  FiCalendar,
  FiTarget,
  FiPlay,
  FiCheck,
  FiArrowLeft,
  FiClock,
  FiTrendingUp,
} from 'react-icons/fi';
import IssueCard from '@components/issues/IssueCard/IssueCard';
import IssueDetailModal from '@components/issues/IssueDetailModal/IssueDetailModal';
import './Sprint.css';

import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Issue } from '@/types';

const Sprint = () => {
  const { projectId, sprintId } = useParams<{ projectId: string; sprintId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const sprint = useAppSelector((state) =>
    state.sprints.sprints.find((s) => s.id === sprintId)
  );
  const allIssues = useAppSelector((state) => state.issues.issues);
  const users = useAppSelector((state) => state.users.users);
  const backlogIssues = allIssues.filter(
    (issue) => issue.projectId === projectId && !issue.sprintId
  );
  const sprintIssues = allIssues.filter((issue) => issue.sprintId === sprintId);

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('board');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (!sprint) {
    return (
      <Container fluid className="sprint-page">
        <div className="empty-state">
          <h5>Sprint not found</h5>
          <Button variant="primary" onClick={() => navigate(`/projects/${projectId}/sprints`)}>
            Back to Sprints
          </Button>
        </div>
      </Container>
    );
  }

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

  const totalPoints = sprintIssues.reduce((sum, issue) => sum + (issue.estimatePoints || 0), 0);
  const completedPoints = sprintIssues
    .filter((issue) => issue.status === IssueStatus.DONE)
    .reduce((sum, issue) => sum + (issue.estimatePoints || 0), 0);
  const daysRemaining = getDaysRemaining(sprint.endDate);

  const handleStartSprint = () => {
    dispatch(updateSprint({ ...sprint, status: 'active' }));
  };

  const handleCompleteSprint = () => {
    dispatch(updateSprint({ ...sprint, status: 'completed' }));
    navigate(`/projects/${projectId}/sprints`);
  };

  const handleAddToSprint = (issueId: string) => {
    dispatch(updateIssue({ id: issueId, updates: { sprintId } }));
  };

  const handleRemoveFromSprint = (issueId: string) => {
    dispatch(updateIssue({ id: issueId, updates: { sprintId: undefined } }));
  };

  const getIssuesByStatus = (status: IssueStatus) => {
    return sprintIssues.filter((issue) => issue.status === status);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeIssue = sprintIssues.find((issue) => issue.id === active.id);
    if (!activeIssue) {
      setActiveId(null);
      return;
    }

    const newStatus = over.id as IssueStatus;
    if (activeIssue.status !== newStatus) {
      dispatch(updateIssue({ id: activeIssue.id, updates: { status: newStatus } }));
    }

    setActiveId(null);
  };

  const activeIssue = useMemo(
    () => sprintIssues.find((issue) => issue.id === activeId),
    [activeId, sprintIssues]
  );

  const renderSprintBoard = () => {
    const statuses = [IssueStatus.TODO, IssueStatus.IN_PROGRESS, IssueStatus.IN_REVIEW, IssueStatus.DONE];
    const statusLabels = {
      [IssueStatus.TODO]: 'To Do',
      [IssueStatus.IN_PROGRESS]: 'In Progress',
      [IssueStatus.IN_REVIEW]: 'In Review',
      [IssueStatus.DONE]: 'Done',
    };

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="sprint-board">
          {statuses.map((status) => {
            const issues = getIssuesByStatus(status);
            return (
              <SortableContext
                key={status}
                id={status}
                items={issues.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="board-column">
                  <div className="board-column-header">
                    <h6>
                      {statusLabels[status]}
                      <Badge bg="light" text="dark" className="ms-2">
                        {issues.length}
                      </Badge>
                    </h6>
                  </div>
                  <DroppableColumn id={status} isOver={false}>
                    {issues.length === 0 ? (
                      <div className="empty-column">No issues</div>
                    ) : (
                      issues.map((issue) => {
                        const assignee = users.find((u) => u.id === issue.assigneeId);
                        return (
                          <SortableIssueCard
                            key={issue.id}
                            issue={issue}
                            assignee={assignee}
                            onClick={() => setSelectedIssueId(issue.id)}
                          />
                        );
                      })
                    )}
                  </DroppableColumn>
                </div>
              </SortableContext>
            );
          })}
        </div>
        <DragOverlay>
          {activeId && activeIssue ? (
            <div style={{ cursor: 'grabbing' }}>
              <IssueCard
                issue={activeIssue}
                assignee={users.find((u) => u.id === activeIssue.assigneeId)}
                onClick={() => {}}
                isDragging={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  };

  const renderSprintPlanning = () => {
    return (
      <Row>
        <Col md={6}>
          <Card className="planning-card">
            <Card.Header>
              <h6>Sprint Backlog ({sprintIssues.length})</h6>
            </Card.Header>
            <Card.Body>
              {sprintIssues.length === 0 ? (
                <div className="empty-column">
                  No issues in sprint yet. Add issues from the backlog.
                </div>
              ) : (
                <div className="issues-list">
                  {sprintIssues.map((issue) => {
                    const assignee = users.find((u) => u.id === issue.assigneeId);
                    return (
                      <div key={issue.id} className="planning-issue-item">
                        <IssueCard
                          issue={issue}
                          assignee={assignee}
                          onClick={() => setSelectedIssueId(issue.id)}
                        />
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveFromSprint(issue.id)}
                          className="remove-btn"
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="planning-card">
            <Card.Header>
              <h6>Product Backlog ({backlogIssues.length})</h6>
            </Card.Header>
            <Card.Body>
              {backlogIssues.length === 0 ? (
                <div className="empty-column">No issues in backlog</div>
              ) : (
                <div className="issues-list">
                  {backlogIssues.map((issue) => {
                    const assignee = users.find((u) => u.id === issue.assigneeId);
                    return (
                      <div key={issue.id} className="planning-issue-item">
                        <IssueCard
                          issue={issue}
                          assignee={assignee}
                          onClick={() => setSelectedIssueId(issue.id)}
                        />
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleAddToSprint(issue.id)}
                          className="add-btn"
                        >
                          Add
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <Container fluid className="sprint-page">
      {/* Sprint Header */}
      <div className="sprint-header">
        <Button variant="link" className="back-btn" onClick={() => navigate(`/projects/${projectId}/sprints`)}>
          <FiArrowLeft size={18} />
          Back to Sprints
        </Button>

        <div className="sprint-header-content">
          <div className="sprint-header-main">
            <div>
              <div className="sprint-title-row">
                <h2>{sprint.name}</h2>
                <Badge bg={sprint.status === 'active' ? 'success' : sprint.status === 'completed' ? 'primary' : 'secondary'}>
                  {sprint.status === 'active' && <FiPlay size={12} />}
                  {sprint.status === 'completed' && <FiCheck size={12} />}
                  {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
                </Badge>
              </div>
              {sprint.goal && (
                <div className="sprint-goal">
                  <FiTarget size={16} />
                  <span>{sprint.goal}</span>
                </div>
              )}
            </div>

            <div className="sprint-actions">
              {sprint.status === 'planned' && (
                <Button variant="success" onClick={handleStartSprint}>
                  <FiPlay size={16} />
                  Start Sprint
                </Button>
              )}
              {sprint.status === 'active' && (
                <Button variant="primary" onClick={handleCompleteSprint}>
                  <FiCheck size={16} />
                  Complete Sprint
                </Button>
              )}
            </div>
          </div>

          {/* Sprint Stats */}
          <Row className="sprint-stats-row">
            <Col xs={12} md={3}>
              <div className="stat-card">
                <FiCalendar size={24} className="stat-icon" />
                <div>
                  <div className="stat-value">{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</div>
                  <div className="stat-label">Sprint Duration</div>
                </div>
              </div>
            </Col>
            {sprint.status === 'active' && (
              <Col xs={12} md={3}>
                <div className="stat-card">
                  <FiClock size={24} className="stat-icon" />
                  <div>
                    <div className="stat-value">
                      {daysRemaining > 0 ? `${daysRemaining} days` : `${Math.abs(daysRemaining)} days overdue`}
                    </div>
                    <div className="stat-label">Remaining</div>
                  </div>
                </div>
              </Col>
            )}
            <Col xs={12} md={3}>
              <div className="stat-card">
                <FiTrendingUp size={24} className="stat-icon" />
                <div>
                  <div className="stat-value">{sprintIssues.length} issues</div>
                  <div className="stat-label">Total Issues</div>
                </div>
              </div>
            </Col>
            <Col xs={12} md={3}>
              <div className="stat-card">
                <FiTarget size={24} className="stat-icon" />
                <div>
                  <div className="stat-value">
                    {completedPoints}/{totalPoints} points
                  </div>
                  <div className="stat-label">
                    {totalPoints > 0 ? `${Math.round((completedPoints / totalPoints) * 100)}%` : '0%'} Complete
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Sprint Content */}
      <div className="sprint-content">
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'board')} className="sprint-tabs">
          <Tab eventKey="board" title="Sprint Board">
            <div className="tab-content-wrapper">{renderSprintBoard()}</div>
          </Tab>
          <Tab eventKey="planning" title="Sprint Planning">
            <div className="tab-content-wrapper">{renderSprintPlanning()}</div>
          </Tab>
        </Tabs>
      </div>

      {selectedIssueId && (
        <IssueDetailModal
          show={!!selectedIssueId}
          onHide={() => setSelectedIssueId(null)}
          issueId={selectedIssueId}
        />
      )}
    </Container>
  );
};

// Sortable Issue Card Component
interface SortableIssueCardProps {
  issue: Issue;
  assignee: any;
  onClick: () => void;
}

const SortableIssueCard = ({ issue, assignee, onClick }: SortableIssueCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <IssueCard
        issue={issue}
        assignee={assignee}
        onClick={onClick}
        isDragging={isDragging}
      />
    </div>
  );
};

// Droppable Column Component
interface DroppableColumnProps {
  id: string;
  children: React.ReactNode;
  isOver: boolean;
}

const DroppableColumn = ({ children, isOver }: DroppableColumnProps) => {
  return (
    <div className={`board-column-content ${isOver ? 'drag-over' : ''}`}>
      {children}
    </div>
  );
};

export default Sprint;
