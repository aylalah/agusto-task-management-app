import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
declare let appjs: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent  implements OnInit {

  user: any = {
    id: '',
    role: '',
    first_name: '',
    last_name: '',
    image: '',
  };

  constructor(
    public auth: AuthService,
     private router: Router
    ) { }
   async ngOnInit() {
    
    let appJs = new appjs('');

    await this.auth.authUser().subscribe(
      async (res) => {
        this.user = res.data;
        console.log('user profile', this.user);
      }, error => {
        // this.error = error.error.status;
    });

   }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login'], { queryParams: { loggedOut: 'success' } });
  }

}