import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
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
        component: LogList,
        title: 'Overview',
        data: {
          title: 'Overview',
        },
      },
      {
        path: 'data-upload',
        component: DataList,
        title: 'Upload Data',
        data: {
          title: 'Upload Data',
        },
      },
      {
        path: 'category-list',
        component: CategoryList,
        title: 'Category Management',
        data: {
          title: 'Category Management',
        },
      },
      {
        path: 'category-create',
        component: CategoryCreate,
        title: 'New Category',
        data: {
          title: 'New Category',
        },
      },
      {
        path: 'category-edit/:id',
        component: CategoryCreate,
        title: 'Update Category',
        data: {
          title: 'Update Category',
        },
      },
      {
        path: 'user-list',
        component: UserList,
        title: 'User Management',
        data: {
          title: 'User Management',
        },
      },
      {
        path: 'user-create',
        component: UserCreate,
        title: 'New User',
        data: {
          title: 'New User',
        },
      },
      {
        path: 'user-edit/:id',
        component: UserCreate,
        title: 'Update User',
        data: {
          title: 'Update User',
        },
      },
      // {
      //   path: 'log-list',
      //   component: LogList,
      //   title: 'Logs',
      //   data: {
      //     title: 'Logs',
      //   },
      // },
      {
        path: 'log/:id',
        component: LogView,
        title: 'Logs',
        data: {
          title: 'Logs',
        },
      },
    ],
  },
];
