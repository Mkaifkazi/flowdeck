import { Modal, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useAppDispatch } from '@/hooks';
import { addSprint } from '@features/sprints/sprintsSlice';
import type { Sprint } from '@types/index';
import './CreateSprintModal.css';

interface CreateSprintModalProps {
  show: boolean;
  onHide: () => void;
  projectId: string;
}

const CreateSprintModal = ({ show, onHide, projectId }: CreateSprintModalProps) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
  });

  const handleClose = () => {
    setFormData({
      name: '',
      goal: '',
      startDate: '',
      endDate: '',
    });
    onHide();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate <= startDate) {
      alert('End date must be after start date');
      return;
    }

    const newSprint: Sprint = {
      id: `sprint-${Date.now()}`,
      projectId,
      name: formData.name.trim(),
      goal: formData.goal.trim() || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'planned',
      createdAt: new Date().toISOString(),
    };

    dispatch(addSprint(newSprint));
    handleClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getTwoWeeksFromNow = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  };

  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="create-sprint-modal">
      <Modal.Header closeButton>
        <Modal.Title>Create Sprint</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Sprint Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Sprint 1, November Sprint"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sprint Goal</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What is the goal for this sprint?"
              value={formData.goal}
              onChange={(e) => handleChange('goal', e.target.value)}
            />
            <Form.Text className="text-muted">
              A brief description of what the team aims to achieve
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Start Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              min={getToday()}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              End Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              min={formData.startDate || getToday()}
              required
            />
            <Form.Text className="text-muted">
              Typical sprints are 1-4 weeks long
            </Form.Text>
          </Form.Group>

          <div className="modal-actions">
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Sprint
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateSprintModal;
