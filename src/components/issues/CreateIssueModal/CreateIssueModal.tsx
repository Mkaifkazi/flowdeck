import { Modal, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { addIssue } from '@features/issues/issuesSlice';
import { IssueType, IssuePriority, IssueStatus } from '@types/index';
import { FiX } from 'react-icons/fi';
import './CreateIssueModal.css';

interface CreateIssueModalProps {
  show: boolean;
  onHide: () => void;
  projectId: string;
  defaultStatus?: IssueStatus;
}

const CreateIssueModal = ({
  show,
  onHide,
  projectId,
  defaultStatus = IssueStatus.TODO,
}: CreateIssueModalProps) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const issues = useAppSelector((state) => state.issues.issues);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: IssueType.TASK,
    priority: IssuePriority.MEDIUM,
    status: defaultStatus,
    assigneeId: '',
    storyPoints: '',
    dueDate: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateIssueKey = () => {
    // Generate key based on project: PROJ-123
    const projectIssues = issues.filter((i) => i.projectId === projectId);
    const nextNumber = projectIssues.length + 1;
    return `PROJ-${nextNumber}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const newIssue = {
      id: `issue-${Date.now()}`,
      key: generateIssueKey(),
      projectId,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type,
      priority: formData.priority,
      status: formData.status,
      assigneeId: formData.assigneeId || null,
      reporterId: users[0]?.id || '', // Default to first user
      storyPoints: formData.storyPoints ? Number(formData.storyPoints) : null,
      dueDate: formData.dueDate || null,
      labels: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addIssue(newIssue));
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: IssueType.TASK,
      priority: IssuePriority.MEDIUM,
      status: defaultStatus,
      assigneeId: '',
      storyPoints: '',
      dueDate: '',
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="create-issue-modal">
      <Modal.Header>
        <Modal.Title>Create Issue</Modal.Title>
        <Button variant="link" className="close-btn" onClick={handleClose}>
          <FiX size={24} />
        </Button>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter issue title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              autoFocus
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Describe the issue..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option value={IssueType.STORY}>Story</option>
                  <option value={IssueType.TASK}>Task</option>
                  <option value={IssueType.BUG}>Bug</option>
                  <option value={IssueType.EPIC}>Epic</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                >
                  <option value={IssuePriority.HIGHEST}>Highest</option>
                  <option value={IssuePriority.HIGH}>High</option>
                  <option value={IssuePriority.MEDIUM}>Medium</option>
                  <option value={IssuePriority.LOW}>Low</option>
                  <option value={IssuePriority.LOWEST}>Lowest</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value={IssueStatus.TODO}>To Do</option>
                  <option value={IssueStatus.IN_PROGRESS}>In Progress</option>
                  <option value={IssueStatus.IN_REVIEW}>In Review</option>
                  <option value={IssueStatus.DONE}>Done</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Assignee</Form.Label>
                <Form.Select
                  value={formData.assigneeId}
                  onChange={(e) => handleChange('assigneeId', e.target.value)}
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
                  placeholder="Enter story points"
                  value={formData.storyPoints}
                  onChange={(e) => handleChange('storyPoints', e.target.value)}
                  min="0"
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                />
              </Form.Group>
            </div>
          </div>

          <div className="form-actions">
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Issue
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateIssueModal;
