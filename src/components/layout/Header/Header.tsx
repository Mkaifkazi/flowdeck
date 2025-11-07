import { Navbar, Container, Dropdown, Form } from 'react-bootstrap';
import { FiMenu, FiSearch, FiBell, FiPlus } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { toggleSidebar } from '@features/ui/uiSlice';
import { setShowIssueModal, setShowProjectModal } from '@features/ui/uiSlice';
import './Header.css';

const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const currentProject = useAppSelector((state) => state.projects.currentProject);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleCreateIssue = () => {
    dispatch(setShowIssueModal(true));
  };

  const handleCreateProject = () => {
    dispatch(setShowProjectModal(true));
  };

  return (
    <Navbar bg="white" className="header border-bottom shadow-sm">
      <Container fluid>
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-link text-dark p-0"
            onClick={handleToggleSidebar}
          >
            <FiMenu size={20} />
          </button>
          <Navbar.Brand className="fw-bold mb-0">
            Flowdeck
          </Navbar.Brand>
          {currentProject && (
            <>
              <span className="text-muted">/</span>
              <span className="fw-semibold">{currentProject.name}</span>
            </>
          )}
        </div>

        <div className="d-flex align-items-center gap-3">
          <Form className="search-form">
            <div className="position-relative">
              <FiSearch className="search-icon" />
              <Form.Control
                type="search"
                placeholder="Search issues..."
                className="ps-5"
                size="sm"
              />
            </div>
          </Form>

          <Dropdown>
            <Dropdown.Toggle variant="primary" size="sm" className="d-flex align-items-center gap-2">
              <FiPlus size={16} />
              Create
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleCreateIssue}>
                Create Issue
              </Dropdown.Item>
              <Dropdown.Item onClick={handleCreateProject}>
                Create Project
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Create Sprint</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <button className="btn btn-link text-dark p-0 position-relative">
            <FiBell size={20} />
            <span className="notification-badge">3</span>
          </button>

          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="text-dark p-0 text-decoration-none">
              <div className="user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
