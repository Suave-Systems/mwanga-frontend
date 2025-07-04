import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { Dashboard } from './pages/dashboard/dashboard';
import { DashboardLayout } from './core/layouts/dashboard-layout/dashboard-layout';
import { CategoryList } from './pages/category/category-list/category-list';
import { CategoryCreate } from './pages/category/category-create/category-create';
import { LogList } from './pages/log/log-list/log-list';
import { LogView } from './pages/log/log-view/log-view';
import { UserList } from './pages/user/user-list/user-list';
import { UserCreate } from './pages/user/user-create/user-create';
import { DataList } from './pages/data/data-list/data-list';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'forgot-password',
        component: ForgotPassword,
      },
    ],
  },
  {
    path: 'main',
    component: DashboardLayout,
    children: [
      {
        path: 'dashboard',
        redirectTo: 'main/data-list',
        pathMatch: 'full',
        // component: Dashboard,
      },
      {
        path: 'category-list',
        component: CategoryList,
      },
      {
        path: 'category-create',
        component: CategoryCreate,
      },
      {
        path: 'category-edit/:id',
        component: CategoryCreate,
      },
      {
        path: 'data-list',
        component: DataList,
      },
      {
        path: 'data-create',
        component: CategoryCreate,
      },
      {
        path: 'data-edit/:id',
        component: CategoryCreate,
      },
      {
        path: 'user-list',
        component: UserList,
      },
      {
        path: 'user-create',
        component: UserCreate,
      },
      {
        path: 'user-edit/:id',
        component: UserCreate,
      },
      {
        path: 'log-list',
        component: LogList,
      },
      {
        path: 'log/:id',
        component: LogView,
      },
    ],
  },
];
