
import React, { useState, useEffect,useRef, useContext } from 'react';
import { Container, Row, Button } from 'reactstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import UserModal from '../../shared/userModal.jsx'; 
import { AuthContext } from '../../context/AuthContext';
import './header.css';
// import axios from 'axios';

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const [isModalOpen, setModalOpen] = useState(false);

  const logout = () => { 
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const toggleModal = () => setModalOpen(!isModalOpen);
  const nav__links = [
   {
      path: '/home',
      display: 'Home'
   },
   {
      path: '/about',
      display: 'About'
   },
   {
      path: '/tours',
      display: 'Tours'
   },
]

  const stickyHeaderFunc = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky__header');
      } else {
        headerRef.current.classList.remove('sticky__header');
      }
    });
  };

  useEffect(() => {
    stickyHeaderFunc();
    return window.removeEventListener('scroll', stickyHeaderFunc);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle('show__menu');

  return (
    <header className='header' ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div className="logo">
              <h1 className="h1home">Travelia</h1>
            </div>

            {/* Menu */}
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <ul className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink to={item.path} className={(navClass) => navClass.isActive ? 'active__link' : ''}>
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right section */}
            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-2">
                {user ? (
                  <>
                    <h5 className='mb-0' onClick={toggleModal} style={{ cursor: 'pointer' }}>👤 {user.username}</h5>
                    <Button className='btn btn-dark' onClick={logout}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button className='btn secondary__btn'><Link to='/login'>Login</Link></Button>
                    <Button className='btn primary__btn'><Link to='/register'>Register</Link></Button>
                  </>
                )}
              </div>

              <span className="mobile__menu" onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>

      {/* Modal Component */}
      {user && <UserModal user={user} isOpen={isModalOpen} toggle={toggleModal} />}
    </header>
  );
};

export default Header;
