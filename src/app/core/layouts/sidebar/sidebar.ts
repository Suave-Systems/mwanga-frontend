import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../shared/services/auth';
import { UserRole } from '../../roles';
import { Notification } from '../../../shared/services/notification';
import { HasPermissionDirective } from '../../directives/has-permission';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, HasPermissionDirective],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private sanitizer = inject(DomSanitizer);
  private authService = inject(Auth);
  private notificationService = inject(Notification);
  constructor() {}
  allMenu: any[] = [
    {
      title: 'Overview',
      link: '/main/dashboard',
      icon: this.sanitizer
        .bypassSecurityTrustHtml(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 21C13.7348 21 13.4804 20.8946 13.2929 20.7071C13.1054 20.5196 13 20.2652 13 20V12C13 11.7348 13.1054 11.4804 13.2929 11.2929C13.4804 11.1054 13.7348 11 14 11H20C20.2652 11 20.5196 11.1054 20.7071 11.2929C20.8946 11.4804 21 11.7348 21 12V20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21H14ZM4 13C3.73478 13 3.48043 12.8946 3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12V4C3 3.73478 3.10536 3.48043 3.29289 3.29289C3.48043 3.10536 3.73478 3 4 3H10C10.2652 3 10.5196 3.10536 10.7071 3.29289C10.8946 3.48043 11 3.73478 11 4V12C11 12.2652 10.8946 12.5196 10.7071 12.7071C10.5196 12.8946 10.2652 13 10 13H4ZM9 11V5H5V11H9ZM4 21C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V16C3 15.7348 3.10536 15.4804 3.29289 15.2929C3.48043 15.1054 3.73478 15 4 15H10C10.2652 15 10.5196 15.1054 10.7071 15.2929C10.8946 15.4804 11 15.7348 11 16V20C11 20.2652 10.8946 20.5196 10.7071 20.7071C10.5196 20.8946 10.2652 21 10 21H4ZM5 19H9V17H5V19ZM15 19H19V13H15V19ZM13 4C13 3.73478 13.1054 3.48043 13.2929 3.29289C13.4804 3.10536 13.7348 3 14 3H20C20.2652 3 20.5196 3.10536 20.7071 3.29289C20.8946 3.48043 21 3.73478 21 4V8C21 8.26522 20.8946 8.51957 20.7071 8.70711C20.5196 8.89464 20.2652 9 20 9H14C13.7348 9 13.4804 8.89464 13.2929 8.70711C13.1054 8.51957 13 8.26522 13 8V4ZM15 5V7H19V5H15Z"
            fill="currentColor" />
        </svg>`),
      permissions: [
        'app.can_view_upload_logs',
        'app.can_create_category_data',
        'app.can_download_template',
      ],
    },
    {
      title: 'Category Managements',
      link: '/main/category-list',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5 3.375H4.5C4.00272 3.375 3.52581 3.57254 3.17417 3.92417C2.82254 4.27581 2.625 4.75272 2.625 5.25V10.5C2.625 15.5897 5.0925 18.6769 7.1625 20.3709C9.38531 22.1887 11.61 22.8084 11.7037 22.8356C11.8978 22.8881 12.1022 22.8881 12.2963 22.8356C12.39 22.8094 14.6147 22.1887 16.8375 20.3709C18.9075 18.6769 21.375 15.5897 21.375 10.5V5.25C21.375 4.75272 21.1775 4.27581 20.8258 3.92417C20.4742 3.57254 19.9973 3.375 19.5 3.375ZM19.125 10.5C19.125 13.8478 17.8978 16.5647 15.4772 18.5766C14.4396 19.4327 13.2637 20.1058 12 20.5669C10.7362 20.106 9.56023 19.4329 8.52281 18.5766C6.10219 16.5647 4.875 13.8478 4.875 10.5V5.625H19.125V10.5ZM7.45406 13.5459C7.34942 13.4413 7.2664 13.3171 7.20977 13.1803C7.15314 13.0436 7.12399 12.8971 7.12399 12.7491C7.12399 12.6011 7.15314 12.4545 7.20977 12.3178C7.2664 12.1811 7.34942 12.0568 7.45406 11.9522C7.55871 11.8475 7.68294 11.7645 7.81967 11.7079C7.9564 11.6513 8.10294 11.6221 8.25094 11.6221C8.39893 11.6221 8.54548 11.6513 8.6822 11.7079C8.81893 11.7645 8.94317 11.8475 9.04781 11.9522L10.5 13.4062L14.9541 8.95125C15.1654 8.73991 15.4521 8.62117 15.7509 8.62117C16.0498 8.62117 16.3365 8.73991 16.5478 8.95125C16.7592 9.16259 16.8779 9.44924 16.8779 9.74813C16.8779 10.047 16.7592 10.3337 16.5478 10.545L11.2978 15.795C11.1933 15.8999 11.0691 15.9831 10.9324 16.0399C10.7956 16.0967 10.649 16.1259 10.5009 16.1259C10.3529 16.1259 10.2063 16.0967 10.0695 16.0399C9.93277 15.9831 9.80858 15.8999 9.70406 15.795L7.45406 13.5459Z"
fill="currentColor" />
</svg>
`),
      permissions: [
        'app.can_create_category',
        'app.can_view_category',
        'app.can_delete_category',
        'app.can_update_category',
        'app.can_download_template',
      ],
    },
    {
      title: 'User Management',
      link: '/main/user-list',
      icon: this.sanitizer.bypassSecurityTrustHtml(`

<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 4C13.9391 4 12.9217 4.42143 12.1716 5.17157C11.4214 5.92172 11 6.93913 11 8C11 9.06087 11.4214 10.0783 12.1716 10.8284C12.9217 11.5786 13.9391 12 15 12C16.0609 12 17.0783 11.5786 17.8284 10.8284C18.5786 10.0783 19 9.06087 19 8C19 6.93913 18.5786 5.92172 17.8284 5.17157C17.0783 4.42143 16.0609 4 15 4ZM15 5.9C15.2758 5.9 15.5489 5.95432 15.8036 6.05985C16.0584 6.16539 16.2899 6.32007 16.4849 6.51508C16.6799 6.71008 16.8346 6.94158 16.9401 7.19636C17.0457 7.45115 17.1 7.72422 17.1 8C17.1 8.27578 17.0457 8.54885 16.9401 8.80364C16.8346 9.05842 16.6799 9.28992 16.4849 9.48492C16.2899 9.67993 16.0584 9.83461 15.8036 9.94015C15.5489 10.0457 15.2758 10.1 15 10.1C14.7242 10.1 14.4511 10.0457 14.1964 9.94015C13.9416 9.83461 13.7101 9.67993 13.5151 9.48492C13.3201 9.28992 13.1654 9.05842 13.0599 8.80364C12.9543 8.54885 12.9 8.27578 12.9 8C12.9 7.44305 13.1212 6.9089 13.5151 6.51508C13.9089 6.12125 14.443 5.9 15 5.9ZM4 7V10H1V12H4V15H6V12H9V10H6V7H4ZM15 13C12.33 13 7 14.33 7 17V20H23V17C23 14.33 17.67 13 15 13ZM15 14.9C17.97 14.9 21.1 16.36 21.1 17V18.1H8.9V17C8.9 16.36 12 14.9 15 14.9Z" fill="currentColor"/>
</svg>
`),
      permissions: [
        'users.can_create_users',
        'users.can_delete_users',
        'users.can_view_users',
        'users.can_create_admin',
        'users.can_create_mwanga_super_admin',
        'users.can_update_users',
        'users.can_reset_password',
      ],
    },
  ];

  routes: any[] = [];
  user: any;

  ngOnInit() {
    this.routes = this.allMenu;
  }

  caughtUs() {
    this.notificationService.toast(
      'Ooooops! you caught us, we are working on this page.',
      'info'
    );
  }

  onLogout() {
    this.authService.logout();
  }
}
