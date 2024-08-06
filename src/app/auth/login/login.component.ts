import { Component, Inject, OnInit, VERSION } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../auth.service';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  params ={
    url: ''
  }

  public app = {
    id: '',
    app_name: '',
    app_no: '',
    organization_name: '',
    short_name: '',
    app_logo: '',
    status: '',
    login_image: '',
    web_url: ''
  }
  loginForm:any = FormGroup;
  errors: any = [];
  notify: string | undefined;
  btnLoading = false;

  constructor(private auth: AuthService, 
              private router: Router, 
              private fb: FormBuilder, 
              private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: any
              ) { 
              }

  async ngOnInit() {

    await this.initForm();
    this.route.queryParams.subscribe((params) => {
      const key1 = 'registered';
      const key2 = 'loggedOut';
      if (params[key1] === 'success') {
        this.notify = 'You have been successfully registered. Please Log in';
      }
      if (params[key2] === 'success') {
        this.notify = 'You have been loggedout successfully';
      }
    });


    this.params.url = this.document.location.host;
    console.log(this.params.url);

  }

  async initForm() {

    this.loginForm = await this.fb.group({
      email: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password: ['', Validators.required],
    });
  }

  isValidInput(fieldName: any): boolean {
    return this.loginForm.controls[fieldName].invalid &&
      (this.loginForm.controls[fieldName].dirty || this.loginForm.controls[fieldName].touched);
  }

  // showPassword(): void {
  //   const x = document.getElementById("login-password");
  //   if (x['type'] === "password") {
  //     x['type'] = "text";
  //   } else {
  //     x['type'] = "password";
  //   }
  // }
  
  login(): void {
    this.errors = [];
    this.btnLoading = true;
    this.auth.login(this.loginForm.value)
      .subscribe((token) => {
        this.btnLoading = false;
        // this.alertService.toaster(errorResponse.error);
        // this.router.navigate(['/'], { queryParams: { loggedin: 'success' } }).then(() => {window.location.reload()});
        this.router.navigate(['/'], { queryParams: { loggedin: 'success' } });
       },
        (errorResponse) => {
          this.btnLoading = false;
          this.errors.push(errorResponse.error.message);
          this.notify = '';
        });
  }
}
