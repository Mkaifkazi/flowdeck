import { Container, Row, Col, Card, Form, Button, Nav, Tab } from 'react-bootstrap';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { updateUser } from '@features/users/usersSlice';
import {
  FiUser,
  FiLock,
  FiBell,
  FiSettings,
  FiSave,
  FiCamera,
} from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const users = useAppSelector((state) => state.users.users);
  const user = users.find((u) => u.id === currentUser?.id);

  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    issueUpdates: true,
    sprintReminders: true,
    weeklyDigest: false,
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      dispatch(
        updateUser({
          ...user,
          name: formData.name,
          email: formData.email,
        })
      );
      alert('Profile updated successfully!');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (formData.newPassword.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }
    alert('Password changed successfully!');
    setFormData((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Preferences saved successfully!');
  };

  return (
    <Container fluid className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
        <p className="text-muted mb-0">Manage your account and preferences</p>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'profile')}>
        <Row>
          <Col md={3}>
            <Card className="settings-nav-card">
              <Card.Body>
                <Nav variant="pills" className="flex-column settings-nav">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">
                      <FiUser size={18} />
                      <span>Profile</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="security">
                      <FiLock size={18} />
                      <span>Security</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="notifications">
                      <FiBell size={18} />
                      <span>Notifications</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="preferences">
                      <FiSettings size={18} />
                      <span>Preferences</span>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Tab.Content>
              {/* Profile Tab */}
              <Tab.Pane eventKey="profile">
                <Card className="settings-content-card">
                  <Card.Body>
                    <div className="settings-section-header">
                      <h4>Profile Information</h4>
                      <p className="text-muted">Update your personal information and profile picture</p>
                    </div>

                    <Form onSubmit={handleProfileSubmit}>
                      <div className="profile-avatar-section">
                        <div className="avatar-wrapper">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="profile-avatar" />
                          ) : (
                            <div className="profile-avatar-placeholder">
                              <FiUser size={48} />
                            </div>
                          )}
                          <button type="button" className="avatar-upload-btn">
                            <FiCamera size={16} />
                          </button>
                        </div>
                        <div className="avatar-info">
                          <h6>{user?.name || 'User'}</h6>
                          <p className="text-muted">
                            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ') : 'Member'}
                          </p>
                        </div>
                      </div>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter your full name"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="Enter your email"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                          type="text"
                          value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ') : 'Member'}
                          disabled
                        />
                      </Form.Group>

                      <div className="form-actions">
                        <Button variant="primary" type="submit">
                          <FiSave size={18} />
                          Save Changes
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Security Tab */}
              <Tab.Pane eventKey="security">
                <Card className="settings-content-card">
                  <Card.Body>
                    <div className="settings-section-header">
                      <h4>Security Settings</h4>
                      <p className="text-muted">Manage your password and security preferences</p>
                    </div>

                    <Form onSubmit={handlePasswordSubmit}>
                      <Form.Group className="mb-4">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                          placeholder="Enter current password"
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                              type="password"
                              value={formData.newPassword}
                              onChange={(e) => handleInputChange('newPassword', e.target.value)}
                              placeholder="Enter new password"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              placeholder="Confirm new password"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="password-requirements">
                        <p className="mb-2 fw-semibold">Password Requirements:</p>
                        <ul>
                          <li>At least 8 characters long</li>
                          <li>Contains uppercase and lowercase letters</li>
                          <li>Contains at least one number</li>
                          <li>Contains at least one special character</li>
                        </ul>
                      </div>

                      <div className="form-actions">
                        <Button variant="primary" type="submit">
                          <FiLock size={18} />
                          Update Password
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Notifications Tab */}
              <Tab.Pane eventKey="notifications">
                <Card className="settings-content-card">
                  <Card.Body>
                    <div className="settings-section-header">
                      <h4>Notification Settings</h4>
                      <p className="text-muted">Choose what notifications you want to receive</p>
                    </div>

                    <Form onSubmit={handlePreferencesSubmit}>
                      <div className="notification-group">
                        <h6 className="notification-group-title">Email Notifications</h6>
                        <Form.Check
                          type="switch"
                          id="email-notifications"
                          label="Enable email notifications"
                          checked={preferences.emailNotifications}
                          onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                          className="mb-3"
                        />
                        <Form.Check
                          type="switch"
                          id="issue-updates"
                          label="Issue updates and comments"
                          checked={preferences.issueUpdates}
                          onChange={(e) => handlePreferenceChange('issueUpdates', e.target.checked)}
                          className="mb-3"
                        />
                        <Form.Check
                          type="switch"
                          id="sprint-reminders"
                          label="Sprint start and end reminders"
                          checked={preferences.sprintReminders}
                          onChange={(e) => handlePreferenceChange('sprintReminders', e.target.checked)}
                          className="mb-3"
                        />
                        <Form.Check
                          type="switch"
                          id="weekly-digest"
                          label="Weekly activity digest"
                          checked={preferences.weeklyDigest}
                          onChange={(e) => handlePreferenceChange('weeklyDigest', e.target.checked)}
                          className="mb-4"
                        />
                      </div>

                      <div className="notification-group">
                        <h6 className="notification-group-title">Push Notifications</h6>
                        <Form.Check
                          type="switch"
                          id="push-notifications"
                          label="Enable push notifications"
                          checked={preferences.pushNotifications}
                          onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                          className="mb-3"
                        />
                      </div>

                      <div className="form-actions">
                        <Button variant="primary" type="submit">
                          <FiSave size={18} />
                          Save Preferences
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Preferences Tab */}
              <Tab.Pane eventKey="preferences">
                <Card className="settings-content-card">
                  <Card.Body>
                    <div className="settings-section-header">
                      <h4>Application Preferences</h4>
                      <p className="text-muted">Customize your experience</p>
                    </div>

                    <Form onSubmit={handlePreferencesSubmit}>
                      <Form.Group className="mb-4">
                        <Form.Label>Theme</Form.Label>
                        <Form.Select
                          value={preferences.theme}
                          onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto (System)</option>
                        </Form.Select>
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label>Language</Form.Label>
                            <Form.Select
                              value={preferences.language}
                              onChange={(e) => handlePreferenceChange('language', e.target.value)}
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label>Timezone</Form.Label>
                            <Form.Select
                              value={preferences.timezone}
                              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                            >
                              <option value="UTC">UTC</option>
                              <option value="America/New_York">Eastern Time</option>
                              <option value="America/Chicago">Central Time</option>
                              <option value="America/Los_Angeles">Pacific Time</option>
                              <option value="Europe/London">London</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label>Date Format</Form.Label>
                        <Form.Select
                          value={preferences.dateFormat}
                          onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </Form.Select>
                      </Form.Group>

                      <div className="form-actions">
                        <Button variant="primary" type="submit">
                          <FiSave size={18} />
                          Save Preferences
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Settings;
