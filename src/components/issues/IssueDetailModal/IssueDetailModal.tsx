import { Modal, Form, Button, Badge } from 'react-bootstrap';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { updateIssue, deleteIssue } from '@features/issues/issuesSlice';
import type { Issue, IssueType } from '@/types';
import {
  FiX,
  FiTrash2,
  FiTag,
  FiCheckSquare,
  FiAlertCircle,
  FiZap,
} from 'react-icons/fi';
import './IssueDetailModal.css';

interface IssueDetailModalProps {
  show: boolean;
  onHide: () => void;
  issueId: string;
}

const IssueDetailModal = ({ show, onHide, issueId }: IssueDetailModalProps) => {
  const dispatch = useAppDispatch();
  const issue = useAppSelector((state) =>
    state.issues.issues.find((i) => i.id === issueId)
  );
  const users = useAppSelector((state) => state.users.users);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  if (!issue) return null;

  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      dispatch(updateIssue({ id: issue.id, updates: { title: editedTitle } }));
      setIsEditing(false);
    }
  };

  const handleTitleCancel = () => {
    setEditedTitle('');
    setIsEditing(false);
  };

  const handleFieldUpdate = (field: keyof Issue, value: any) => {
    dispatch(updateIssue({ id: issue.id, updates: { [field]: value } }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      dispatch(deleteIssue(issue.id));
      onHide();
    }
  };

  const getTypeIcon = (type: IssueType) => {
    switch (type) {
      case 'story':
        return <FiCheckSquare className="type-icon story" />;
      case 'bug':
        return <FiAlertCircle className="type-icon bug" />;
      case 'task':
        return <FiTag className="type-icon task" />;
      case 'epic':
        return <FiZap className="type-icon epic" />;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="issue-detail-modal">
      <Modal.Header>
        <div className="modal-header-content">
          <div className="issue-type-key">
            {getTypeIcon(issue.type)}
            <span className="issue-key">{issue.key}</span>
          </div>
          <div className="header-actions">
            <Button variant="link" className="delete-btn" onClick={handleDelete}>
              <FiTrash2 size={18} />
            </Button>
            <Button variant="link" className="close-btn" onClick={onHide}>
              <FiX size={24} />
            </Button>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={isEditing ? editedTitle : issue.title}
              onChange={(e) => {
                if (!isEditing) {
                  setEditedTitle(e.target.value);
                  setIsEditing(true);
                } else {
                  setEditedTitle(e.target.value);
                }
              }}
              onBlur={() => {
                if (isEditing && editedTitle.trim()) {
                  handleTitleSave();
                } else {
                  handleTitleCancel();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave();
                if (e.key === 'Escape') handleTitleCancel();
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={issue.description || ''}
              onChange={(e) => handleFieldUpdate('description', e.target.value)}
              placeholder="No description provided"
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={issue.type}
                  onChange={(e) => handleFieldUpdate('type', e.target.value)}
                >
                  <option value="story">Story</option>
                  <option value="task">Task</option>
                  <option value="bug">Bug</option>
                  <option value="epic">Epic</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={issue.priority}
                  onChange={(e) => handleFieldUpdate('priority', e.target.value)}
                >
                  <option value="HIGHEST">Highest</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                  <option value="LOWEST">Lowest</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={issue.status}
                  onChange={(e) => handleFieldUpdate('status', e.target.value)}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="DONE">Done</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Assignee</Form.Label>
                <Form.Select
                  value={issue.assigneeId || ''}
                  onChange={(e) => handleFieldUpdate('assigneeId', e.target.value || null)}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Story Points</Form.Label>
                <Form.Control
                  type="number"
                  value={issue.storyPoints || ''}
                  onChange={(e) =>
                    handleFieldUpdate('storyPoints', Number(e.target.value) || null)
                  }
                  min="0"
                  placeholder="Enter story points"
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={issue.dueDate ? issue.dueDate.split('T')[0] : ''}
                  onChange={(e) => handleFieldUpdate('dueDate', e.target.value || null)}
                />
              </Form.Group>
            </div>
          </div>

          {issue.labels && issue.labels.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Labels</Form.Label>
              <div className="labels-list">
                {issue.labels.map((label) => (
                  <Badge key={label} bg="light" text="dark" className="label-badge">
                    {label}
                  </Badge>
                ))}
              </div>
            </Form.Group>
          )}

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Created</Form.Label>
                <Form.Control
                  type="text"
                  value={new Date(issue.createdAt).toLocaleDateString()}
                  disabled
                  readOnly
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">Updated</Form.Label>
                <Form.Control
                  type="text"
                  value={new Date(issue.updatedAt).toLocaleDateString()}
                  disabled
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default IssueDetailModal;
