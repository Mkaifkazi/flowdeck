import { Container, Badge, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks';
import IssueCard from '@components/issues/IssueCard/IssueCard';
import IssueDetailModal from '@components/issues/IssueDetailModal/IssueDetailModal';
import CreateIssueModal from '@components/issues/CreateIssueModal/CreateIssueModal';
import { IssueStatus } from '@types/index';
import { FiPlus } from 'react-icons/fi';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { updateIssue } from '@features/issues/issuesSlice';
import './ProjectBoard.css';

// Droppable Column Component
interface DroppableColumnProps {
  id: string;
  children: React.ReactNode;
  isOver: boolean;
}

const DroppableColumn = ({ id, children, isOver }: DroppableColumnProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`board-column-content ${isOver ? 'drag-over' : ''}`}
    >
      {children}
    </div>
  );
};

// Sortable Issue Card Component
interface SortableIssueCardProps {
  issue: any;
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

const ProjectBoard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const issues = useAppSelector((state) => state.issues.issues);
  const users = useAppSelector((state) => state.users.users);
  const currentProject = useAppSelector((state) => state.projects.currentProject);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalStatus, setCreateModalStatus] = useState<IssueStatus>(IssueStatus.TODO);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter issues by current project
  const projectIssues = issues.filter((issue) => issue.projectId === projectId);

  // Group issues by status
  const getIssuesByStatus = (status: IssueStatus) => {
    return projectIssues.filter((issue) => issue.status === status);
  };

  const columns = [
    { status: IssueStatus.TODO, title: 'To Do' },
    { status: IssueStatus.IN_PROGRESS, title: 'In Progress' },
    { status: IssueStatus.IN_REVIEW, title: 'In Review' },
    { status: IssueStatus.DONE, title: 'Done' },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? (over.id as string) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setOverId(null);
      return;
    }

    const activeIssue = issues.find((issue) => issue.id === active.id);

    // Check if dropped on a column (over.id is a status) or on another issue
    let newStatus: IssueStatus | undefined;

    // If dropped on a column container
    if (Object.values(IssueStatus).includes(over.id as IssueStatus)) {
      newStatus = over.id as IssueStatus;
    } else {
      // If dropped on another issue, get that issue's status
      const overIssue = issues.find((issue) => issue.id === over.id);
      newStatus = overIssue?.status;
    }

    if (activeIssue && newStatus && activeIssue.status !== newStatus) {
      dispatch(updateIssue({
        id: activeIssue.id,
        updates: { status: newStatus },
      }));
    }

    setActiveId(null);
    setOverId(null);
  };

  const handleIssueClick = (issueId: string) => {
    setSelectedIssueId(issueId);
  };

  const handleCloseModal = () => {
    setSelectedIssueId(null);
  };

  const handleAddIssue = (status: IssueStatus) => {
    setCreateModalStatus(status);
    setShowCreateModal(true);
  };

  const activeIssue = activeId ? issues.find((issue) => issue.id === activeId) : null;
  const activeAssignee = activeIssue ? users.find((user) => user.id === activeIssue.assigneeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Container fluid>
        <div className="board-header mb-4">
          <div>
            <h2 className="mb-2">{currentProject?.name} Board</h2>
            <p className="text-muted mb-0">
              {projectIssues.length} {projectIssues.length === 1 ? 'issue' : 'issues'}
            </p>
          </div>
        </div>

        <div className="board-container">
          {columns.map((column) => {
            const columnIssues = getIssuesByStatus(column.status);

            return (
              <div key={column.status} className="board-column">
                <div className="board-column-header">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="mb-0">{column.title}</h6>
                    <Badge bg="light" text="dark" className="count-badge">
                      {columnIssues.length}
                    </Badge>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="add-issue-btn p-0"
                    onClick={() => handleAddIssue(column.status)}
                  >
                    <FiPlus size={18} />
                  </Button>
                </div>

                <SortableContext
                  id={column.status}
                  items={columnIssues.map((issue) => issue.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <DroppableColumn
                    id={column.status}
                    isOver={overId === column.status}
                  >
                    {columnIssues.length === 0 ? (
                      <div className="empty-state">
                        <p className="text-muted mb-0">No issues</p>
                      </div>
                    ) : (
                      columnIssues.map((issue) => {
                        const assignee = users.find((user) => user.id === issue.assigneeId);
                        return (
                          <SortableIssueCard
                            key={issue.id}
                            issue={issue}
                            assignee={assignee}
                            onClick={() => handleIssueClick(issue.id)}
                          />
                        );
                      })
                    )}
                  </DroppableColumn>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </Container>

      <DragOverlay>
        {activeIssue ? (
          <IssueCard
            issue={activeIssue}
            assignee={activeAssignee}
            onClick={() => {}}
          />
        ) : null}
      </DragOverlay>

      {selectedIssueId && (
        <IssueDetailModal
          show={!!selectedIssueId}
          onHide={handleCloseModal}
          issueId={selectedIssueId}
        />
      )}

      {showCreateModal && projectId && (
        <CreateIssueModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          projectId={projectId}
          defaultStatus={createModalStatus}
        />
      )}
    </DndContext>
  );
};

export default ProjectBoard;
