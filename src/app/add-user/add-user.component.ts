import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

declare let $: any;
declare let Swal: any;

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  btnLoading = false;
  user: any = {
    id: '',
    access: [],
  };
  
  public error = {
    code: 0,
    status: '',
    title: '',
    message: '',
  };

  public response = {
    code: 0,
    status: '',
    title: '',
    message: '',
  }

  public params = {
    page: 1,
    per_page: 10,
    search: '',
    from: '',
    to : '',
  };

  public meta = {
    current_page: 0,
    next_page: 0,
    per_page: 10,
    prev_page: 1,
    total : 0,
  };

  public userPayload = {
    id: '',
    role: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    image: '',
    gender: '',
    two_factor: true,
  }

  public activationPayload = {
    id: '',
    status: '',
  }

  users: any;
  imgname: any;
  imagefile: any | ArrayBuffer;
  matrix!: {
    total_users: 0;
    pending_users: 0;
    active_users: 0;
    inactive_users: 0;
  };
  action: any;
  userTitle: any;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    public auth: AuthService,
    private usersService: UsersService
    ) { }

  async ngOnInit() {

    await this.auth.authUser().subscribe(
      async (data) => {
        const getProfile = data;
        const user = getProfile;

        console.log('user', user);
        this.user.access = user.access;

      }, error => {
        this.error = error.error.status;
    });

  }

  onRefreshPayload() {
    this.userPayload.role = '';
    this.userPayload.first_name = '';
    this.userPayload.last_name = '';
    this.userPayload.two_factor= true;
    this.userPayload.email = '';
    this.userPayload.password = '';
    this.userPayload.phone_number = '';
    this.userPayload.gender = '';
    this.userPayload.image = '';
  }

  loadImage(event:any): void {
    if (event.target.files.length > 0) {
      const files = event.target.files[0];
      this.imgname = files.name;
      const reader = new FileReader();
      console.log(event.target.files)

      const vm = this;
      reader.onloadend = () => {
        this.imagefile = reader.result;
        this.userPayload.image = '' + this.imagefile;
        // console.log('imagefile', this.imagefile)
      };
      reader.readAsDataURL(files);
    }
  }

  async onCreatUser() {
    console.log('updating Detartment ...');
    
    this.btnLoading = true;
    await this.usersService.createUser(this.userPayload).subscribe(
      response => {
        this.btnLoading = false;
        this.userPayload = response.data;
        this.response = response;
        this.onRefreshPayload();
        // this.alertService.toaster(this.response);
        console.log('userPayload', this.userPayload, 'Updated user');
      },
      error => {
        this.btnLoading = false;
        this.error = error.error;
        this.response = this.error;
        // this.alertService.toaster(this.error);
        console.log('errorResponse', error);
      }
    )
  }

  async onUpdateUser() {
    console.log('updating User ...');
    this.btnLoading = true;
    await this.usersService.updateUser(this.userPayload).subscribe(
      response => {
        this.btnLoading = false;
        this.userPayload = response.data.user;
        this.users = response.data.users;
        this.response = response;
        // this.alertService.toaster(this.response);
        console.log('userPayload', this.userPayload, 'Updated user');
      },
      error => {
        this.btnLoading = false;
        this.error = error.error;
        // this.alertService.toaster(this.error);
        console.log('errorResponse', error);
      }
    )
  }

}

