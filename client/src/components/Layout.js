import React, { useState } from 'react';
import toast from 'react-hot-toast';
import '../layout.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Popover } from 'antd';
import { resetUser } from '../redux/userSlice';
import { useEffect } from 'react';

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(localStorage.getItem('collapsed') === 'true' ? true : false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userMenu = [
    {
      name: 'Strona główna',
      path: '/app',
      icon: 'ri-home-line',
    },
    {
      name: 'Rezerwacje',
      path: '/app/bookings',
      icon: 'ri-file-list-line',
    },
    {
      name: 'Zostań DJem',
      path: '/app/apply-dj',
      icon: 'ri-headphone-line',
    },
    {
      name: 'Profil',
      path: `/app/profile/${user?._id}`,
      icon: 'ri-user-line',
    },
  ];

  const djMenu = [
    {
      name: 'Strona główna',
      path: '/app',
      icon: 'ri-home-line',
    },
    {
      name: 'Rezerwacje',
      path: '/app/dj/bookings',
      icon: 'ri-file-list-line',
    },
    {
      name: 'Mój Profil',
      path: `/app/dj/profile/${user?._id}`,
      icon: 'ri-user-line',
    },
  ];

  const adminMenu = [
    {
      name: 'Panel administracji',
      path: '/app/admin/home',
      icon: 'ri-home-line',
    },
    {
      name: 'Użytkownicy',
      path: '/app/admin/userslist',
      icon: 'ri-user-line',
    },
    {
      name: 'DJe',
      path: '/app/admin/djslist',
      icon: 'ri-user-star-line',
    },
    // {
    // 	name: 'Profil',
    // 	path: `/app/profile`,
    // 	icon: 'ri-user-settings-line',
    // },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDj ? djMenu : userMenu;
  const role = user?.isAdmin ? 'Administrator' : user?.isDj ? 'DJ' : 'Użytkownik';

  useEffect(() => {
    localStorage.setItem('collapsed', collapsed);
  }, [collapsed]);

  return (
    <div className="main">
      <div className="d-flex layout">
        <div className={`sidebar ${collapsed && 'collapsed'}`}>
          <div className="sidebar-header">
            <h1 className={`logo ${collapsed && 'collapsed-logo'}`}>FMD</h1>
            <p className={`text-white ${collapsed && 'collapsed-text'}`}>{role}</p>
          </div>

          <div className={`menu ${collapsed && 'fit-content'}`}>
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;

              return (
                <div className={`d-flex menu-item ${isActive && 'active-menu-item'}`} key={menu.name}>
                  <Popover content={collapsed ? menu.name : null} trigger="hover">
                    <Link to={menu.path}>
                      <i className={`${menu.icon} ${isActive && 'active-menu-icon '}`}></i>
                      {!collapsed && menu.name}
                    </Link>
                  </Popover>
                </div>
              );
            })}

            <div
              className={'d-flex menu-item logout-button'}
              onClick={() => {
                localStorage.clear();
                dispatch(resetUser());
                toast.success('Pomyślnie wylogowano!');
                navigate('/login');
              }}
            >
              <Popover content={collapsed ? 'Wyloguj' : null} trigger="hover">
                <Link to="/login">
                  <i className="ri-logout-circle-line"></i>
                  {!collapsed && 'Wyloguj'}
                </Link>
              </Popover>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            {collapsed ? (
              <i className="ri-menu-line header-action-icon" onClick={() => setCollapsed(false)}></i>
            ) : (
              <i className="ri-close-line header-action-icon" onClick={() => setCollapsed(true)}></i>
            )}

            <div className="d-flex align-items-center px-4 ">
              <Badge count={user?.unseenNotifications.length} onClick={() => navigate('/app/notifications')}>
                <i className="ri-notification-line header-action-icon px-3"></i>
              </Badge>
              <Link className="anchor mx-2" to={`/app/profile/${user?._id}`}>
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
