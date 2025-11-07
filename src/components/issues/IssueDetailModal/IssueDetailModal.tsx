import { Modal, Form, Button, Badge } from 'react-bootstrap';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { updateIssue, deleteIssue } from '@features/issues/issuesSlice';
import type { Issue, IssueType } from '@/types';
import {
  FiX,
  FiTrash2,
  FiUser,
  FiCalendar,
  FiClock,
  FiTag,
  FiAlignLeft,
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

  const handleTitleEdit = () => {
    setEditedTitle(issue.title);
    setIsEditing(true);
  };

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
        <div className="issue-detail-container">
          {/* Main Content */}
          <div className="main-content">
            {/* Title */}
            <div className="issue-title-section">
              {isEditing ? (
                <div className="title-edit-form">
                  <Form.Control
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave();
                      if (e.key === 'Escape') handleTitleCancel();
                    }}
                  />
                  <div className="title-edit-actions">
                    <Button size="sm" variant="primary" onClick={handleTitleSave}>
                      Save
                    </Button>
                    <Button size="sm" variant="light" onClick={handleTitleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <h2 className="issue-title" onClick={handleTitleEdit}>
                  {issue.title}
                </h2>
              )}
            </div>

            {/* Description */}
            <div className="issue-section">
              <div className="section-header">
                <FiAlignLeft size={18} />
                <h6>Description</h6>
              </div>
              <div className="description-content">
                {issue.description || (
                  <span className="text-muted">No description provided</span>
                )}
              </div>
            </div>

            {/* Labels */}
            {issue.labels && issue.labels.length > 0 && (
              <div className="issue-section">
                <div className="section-header">
                  <FiTag size={18} />
                  <h6>Labels</h6>
                </div>
                <div className="labels-list">
                  {issue.labels.map((label) => (
                    <Badge key={label} bg="light" text="dark" className="label-badge">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="sidebar-content">
            {/* Status */}
            <div className="detail-field">
              <label>
                <FiCheckSquare size={16} />
                Status
              </label>
              <Form.Select
                size="sm"
                value={issue.status}
                onChange={(e) => handleFieldUpdate('status', e.target.value)}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </Form.Select>
            </div>

            {/* Priority */}
            <div className="detail-field">
              <label>
                <FiAlertCircle size={16} />
                Priority
              </label>
              <Form.Select
                size="sm"
                value={issue.priority}
                onChange={(e) => handleFieldUpdate('priority', e.target.value)}
              >
                <option value="HIGHEST">Highest</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="LOWEST">Lowest</option>
              </Form.Select>
            </div>

            {/* Assignee */}
            <div className="detail-field">
              <label>
                <FiUser size={16} />
                Assignee
              </label>
              <Form.Select
                size="sm"
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
            </div>

            {/* Story Points */}
            <div className="detail-field">
              <label>
                <FiZap size={16} />
                Story Points
              </label>
              <Form.Control
                type="number"
                size="sm"
                value={issue.storyPoints || ''}
                onChange={(e) =>
                  handleFieldUpdate('storyPoints', Number(e.target.value) || null)
                }
                min="0"
              />
            </div>

            {/* Due Date */}
            <div className="detail-field">
              <label>
                <FiCalendar size={16} />
                Due Date
              </label>
              <Form.Control
                type="date"
                size="sm"
                value={issue.dueDate ? issue.dueDate.split('T')[0] : ''}
                onChange={(e) => handleFieldUpdate('dueDate', e.target.value || null)}
              />
            </div>

            {/* Created/Updated */}
            <div className="detail-field">
              <label>
                <FiClock size={16} />
                Created
              </label>
              <div className="text-muted small">
                {new Date(issue.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="detail-field">
              <label>
                <FiClock size={16} />
                Updated
              </label>
              <div className="text-muted small">
                {new Date(issue.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default IssueDetailModal;
