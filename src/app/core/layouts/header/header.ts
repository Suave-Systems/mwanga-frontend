import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { Cookie } from '../../../shared/services/cookie';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  imports: [MatMenuModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  currentPageTitle = '';
  user: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cookie: Cookie
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.getDeepestChild(this.route)),
        map((route) => route.snapshot.data['title'])
      )
      .subscribe((title) => {
        this.currentPageTitle = title || '';
      });
    this.user = JSON.parse(this.cookie.get('user'));
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) route = route.firstChild;
    return route;
  }
}
