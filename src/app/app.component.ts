import { Component } from '@angular/core';
import { AuthService } from '../app/auth/auth.service';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { filter } from 'rxjs';

declare let appjs: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hms';
  currentUrl: string = ''
  showAdminHeader: boolean = true;

  constructor(
    private router: Router, 
    public auth: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit() {

    let appJs = new appjs('');

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
        console.log(this.currentUrl);
        this.currentUrl.includes('/admin') ? this.showAdminHeader = true : this.showAdminHeader = false;
        console.log('admin', this.showAdminHeader);
      });
      
  }
}
