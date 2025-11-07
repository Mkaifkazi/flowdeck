import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { IssueStatus, IssuePriority, IssueType } from '@/types';
import {
  FiCheckSquare,
  FiTrendingUp,
  FiClock,
  FiZap,
  FiUsers,
} from 'react-icons/fi';
import './Reports.css';

const Reports = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const issues = useAppSelector((state) => state.issues.issues);
  const users = useAppSelector((state) => state.users.users);
  const currentProject = useAppSelector((state) => state.projects.currentProject);

  // Filter issues by current project
  const projectIssues = issues.filter((issue) => issue.projectId === projectId);

  // Calculate statistics
  const totalIssues = projectIssues.length;
  const completedIssues = projectIssues.filter((issue) => issue.status === IssueStatus.DONE).length;
  const inProgressIssues = projectIssues.filter((issue) => issue.status === IssueStatus.IN_PROGRESS).length;
  const todoIssues = projectIssues.filter((issue) => issue.status === IssueStatus.TODO).length;

  const completionRate = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

  // Issues by type
  const issuesByType = {
    story: projectIssues.filter((i) => i.type === IssueType.STORY).length,
    task: projectIssues.filter((i) => i.type === IssueType.TASK).length,
    bug: projectIssues.filter((i) => i.type === IssueType.BUG).length,
    epic: projectIssues.filter((i) => i.type === IssueType.EPIC).length,
  };

  // Issues by priority
  const issuesByPriority = {
    highest: projectIssues.filter((i) => i.priority === IssuePriority.HIGHEST).length,
    high: projectIssues.filter((i) => i.priority === IssuePriority.HIGH).length,
    medium: projectIssues.filter((i) => i.priority === IssuePriority.MEDIUM).length,
    low: projectIssues.filter((i) => i.priority === IssuePriority.LOW).length,
    lowest: projectIssues.filter((i) => i.priority === IssuePriority.LOWEST).length,
  };

  // Story points
  const totalStoryPoints = projectIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
  const completedStoryPoints = projectIssues
    .filter((i) => i.status === IssueStatus.DONE)
    .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

  // Assignee statistics
  const assigneeStats = users.map((user) => {
    const userIssues = projectIssues.filter((i) => i.assigneeId === user.id);
    const userCompleted = userIssues.filter((i) => i.status === IssueStatus.DONE).length;
    return {
      user,
      total: userIssues.length,
      completed: userCompleted,
      inProgress: userIssues.filter((i) => i.status === IssueStatus.IN_PROGRESS).length,
    };
  }).filter((stat) => stat.total > 0);

  const unassignedCount = projectIssues.filter((i) => !i.assigneeId).length;

  return (
    <Container fluid className="reports-page">
      <div className="reports-header">
        <div>
          <h2>{currentProject?.name} Reports</h2>
          <p className="text-muted mb-0">Project insights and analytics</p>
        </div>
      </div>

      <Row className="metrics-row">
        <Col lg={3} md={6} className="mb-4">
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon primary">
                <FiCheckSquare size={24} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{totalIssues}</div>
                <div className="metric-label">Total Issues</div>
                <div className="metric-detail">All project items</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-4">
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon success">
                <FiTrendingUp size={24} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{completionRate}%</div>
                <div className="metric-label">Completion Rate</div>
                <div className="metric-detail">{completedIssues} of {totalIssues}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-4">
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon warning">
                <FiClock size={24} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{inProgressIssues}</div>
                <div className="metric-label">In Progress</div>
                <div className="metric-detail">{todoIssues} in backlog</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-4">
          <Card className="metric-card">
            <Card.Body>
              <div className="metric-icon purple">
                <FiZap size={24} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{completedStoryPoints}</div>
                <div className="metric-label">Story Points</div>
                <div className="metric-detail">of {totalStoryPoints} total</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="chart-card">
            <Card.Body>
              <h5 className="chart-title">Issues by Type</h5>
              <div className="chart-content">
                <div className="bar-chart">
                  {[
                    { label: 'Story', value: issuesByType.story, color: 'story' },
                    { label: 'Task', value: issuesByType.task, color: 'task' },
                    { label: 'Bug', value: issuesByType.bug, color: 'bug' },
                    { label: 'Epic', value: issuesByType.epic, color: 'epic' },
                  ].map((item) => (
                    <div key={item.label} className="bar-item">
                      <div className="bar-label">
                        <span className={`bar-icon ${item.color}`}>●</span>
                        {item.label}
                      </div>
                      <div className="bar-container">
                        <div
                          className={`bar-fill ${item.color}`}
                          style={{
                            width: `${totalIssues > 0 ? (item.value / totalIssues) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <div className="bar-value">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="chart-card">
            <Card.Body>
              <h5 className="chart-title">Issues by Priority</h5>
              <div className="chart-content">
                <div className="bar-chart">
                  {[
                    { label: 'Highest', value: issuesByPriority.highest, color: 'danger' },
                    { label: 'High', value: issuesByPriority.high, color: 'warning' },
                    { label: 'Medium', value: issuesByPriority.medium, color: 'primary' },
                    { label: 'Low', value: issuesByPriority.low, color: 'secondary' },
                    { label: 'Lowest', value: issuesByPriority.lowest, color: 'light' },
                  ].map((item) => (
                    <div key={item.label} className="bar-item">
                      <div className="bar-label">
                        <span className={`bar-icon ${item.color}`}>●</span>
                        {item.label}
                      </div>
                      <div className="bar-container">
                        <div
                          className={`bar-fill ${item.color}`}
                          style={{
                            width: `${totalIssues > 0 ? (item.value / totalIssues) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <div className="bar-value">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="chart-card">
            <Card.Body>
              <h5 className="chart-title">
                <FiUsers className="me-2" />
                Team Performance
              </h5>
              <div className="chart-content">
                <div className="team-stats">
                  {assigneeStats.map((stat) => (
                    <div key={stat.user.id} className="team-member-stat">
                      <div className="member-info">
                        {stat.user.avatar ? (
                          <img src={stat.user.avatar} alt={stat.user.name} className="member-avatar" />
                        ) : (
                          <div className="member-avatar-placeholder">{stat.user.name.charAt(0)}</div>
                        )}
                        <span className="member-name">{stat.user.name}</span>
                      </div>
                      <div className="member-metrics">
                        <div className="member-metric">
                          <span className="metric-label-sm">Total</span>
                          <span className="metric-value-sm">{stat.total}</span>
                        </div>
                        <div className="member-metric">
                          <span className="metric-label-sm">In Progress</span>
                          <span className="metric-value-sm warning-text">{stat.inProgress}</span>
                        </div>
                        <div className="member-metric">
                          <span className="metric-label-sm">Completed</span>
                          <span className="metric-value-sm success-text">{stat.completed}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {unassignedCount > 0 && (
                    <div className="team-member-stat">
                      <div className="member-info">
                        <div className="member-avatar-placeholder unassigned">?</div>
                        <span className="member-name">Unassigned</span>
                      </div>
                      <div className="member-metrics">
                        <div className="member-metric">
                          <span className="metric-label-sm">Total</span>
                          <span className="metric-value-sm">{unassignedCount}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
