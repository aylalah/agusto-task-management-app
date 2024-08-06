import { Component, Inject, OnInit, VERSION } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../auth.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  name = "CheckHMS " + VERSION.major;
  deviceInfo = null;

  params ={
    url: ''
  }

  public response = {
    code: 0,
    status: '',
    title: '',
    message: '',
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
  loginForm: any = FormGroup;
  errors: any = [];
  notify: any;
  btnLoading = false;
  email: any;

  constructor(private auth: AuthService, 
              private router: Router, 
              private fb: FormBuilder, 
              private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: any
              ) { 
              }

  async ngOnInit() {

    await this.route.queryParams.subscribe(async (params) => {
      const key1 = 'type';
      const key2 = 'value';

      console.log('confirmation', params);
      if (params[key2]) {

        if (params[key1] === 'email_token') {
          
          await this.auth.confirmEmail(params[key2]).subscribe(
            async (res) => {
              this.response = res;
              this.email = res.data;
              console.log('confirmation', this.email);
      
            }, error => {

              this.response.status = error.error.status;
              this.response.title = error.error.title;
              this.response.message = error.error.message;
              this.errors = error.error.status;
              console.log('confirmation', false);
          }) ;

          this.notify = 'You have been successfully registered. Please Log in';
        }

      }else{

        this.notify = 'No value';

      }

    });


    this.params.url = this.document.location.host;
    console.log(this.params.url);

  }

}
