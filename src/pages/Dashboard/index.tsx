import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setCurrentProject } from '@features/projects/projectsSlice';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiFolder } from 'react-icons/fi';
import ActivityTimeline from '@components/activity/ActivityTimeline/ActivityTimeline';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const projects = useAppSelector((state) => state.projects.projects);
  const user = useAppSelector((state) => state.auth.user);

  const handleProjectClick = (project: typeof projects[0]) => {
    dispatch(setCurrentProject(project));
    navigate(`/project/${project.id}/board`);
  };

  const getGradientColor = (index: number) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <Container fluid className="fade-in">
      <div className="mb-5">
        <h2 className="mb-2">Welcome back, {user?.name}! 👋</h2>
        <p className="text-muted fs-6">Here's what's happening with your projects today.</p>
      </div>

      <Row className="mb-4">
        <Col lg={8} md={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              <FiFolder className="me-2" style={{ marginBottom: '2px' }} />
              Your Projects
            </h4>
            <Badge bg="light" text="dark" className="px-3 py-2">
              {projects.length} Total
            </Badge>
          </div>
          <Row>
            {projects.map((project, index) => (
              <Col lg={6} md={6} key={project.id} className="mb-4">
                <Card
                  className="h-100 cursor-pointer border-0 shadow-sm position-relative overflow-hidden"
                  onClick={() => handleProjectClick(project)}
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div
                    style={{
                      height: '6px',
                      background: getGradientColor(index),
                    }}
                  />
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="mb-1 fw-bold">{project.name}</h5>
                        <Badge
                          className="px-2 py-1"
                          style={{
                            background: getGradientColor(index),
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        >
                          {project.key}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted mb-3 text-truncate-2" style={{ minHeight: '40px' }}>
                      {project.description}
                    </p>
                    <div className="d-flex align-items-center text-muted">
                      <FiUsers size={16} className="me-2" />
                      <small className="fw-medium">{project.members.length} members</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col lg={4} md={12}>
          <ActivityTimeline limit={15} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
