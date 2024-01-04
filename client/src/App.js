import 'antd/dist/antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplyDj from './pages/ApplyDj';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Notifications from './pages/Notifications';
import LandingPage from './pages/LandingPage';
import DjsList from './pages/Admin/DjsList';
import UsersList from './pages/Admin/UsersList';
import Profile from './pages/Dj/Profile';
import UserProfile from './pages/Profile';
import BookDj from './pages/BookDj';
import Bookings from './pages/Bookings';
import DjBookings from './pages/Dj/DjBookings';
import AdminPanel from './pages/Admin/AdminPanel';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordForm from './pages/ResetPasswordForm';
import VerifyEmail from './pages/VerifyEmail';

function App() {
	const { loading } = useSelector((state) => state.alerts);
	return (
		<div>
			<BrowserRouter>
				{loading && (
					<div className='spinner-parent'>
						<div className='spinner-border' role='status'></div>
					</div>
				)}

				<Toaster position='top-center' reverseOrder={false} />
				<Routes>
					<Route
						path='/login'
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>
					<Route
						path='/register'
						element={
							<PublicRoute>
								<Register />
							</PublicRoute>
						}
					/>
					<Route
						path='/verify-email/:token'
						element={
							<PublicRoute>
								<VerifyEmail />
							</PublicRoute>
						}
					/>
					<Route
						path='/'
						element={
							<PublicRoute>
								<LandingPage />
							</PublicRoute>
						}
					/>
					<Route
						path='/reset-password'
						element={
							<PublicRoute>
								<ResetPassword />
							</PublicRoute>
						}
					/>
					<Route
						path='/reset-password/:token'
						element={
							<PublicRoute>
								<ResetPasswordForm />
							</PublicRoute>
						}
					/>
					<Route
						path='/app'
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/app/apply-dj'
						element={
							<ProtectedRoute>
								<ApplyDj />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/app/notifications'
						element={
							<ProtectedRoute>
								<Notifications />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/app/profile/:djId'
						element={
							<ProtectedRoute>
								<UserProfile />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/app/book-dj/:djId'
						element={
							<ProtectedRoute>
								<BookDj />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/app/dj/profile/:userId'
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>

					<Route
						path='/app/admin/home'
						element={
							<ProtectedRoute>
								<AdminPanel />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/app/admin/userslist'
						element={
							<ProtectedRoute>
								<UsersList />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/app/admin/djslist'
						element={
							<ProtectedRoute>
								<DjsList />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/app/bookings'
						element={
							<ProtectedRoute>
								<Bookings />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/app/dj/bookings'
						element={
							<ProtectedRoute>
								<DjBookings />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
