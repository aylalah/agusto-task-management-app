import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

declare let $: any;
declare let Swal: any;

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {
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

  public userPayload: any = {
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

  public activationPayload: any = {
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
  user_id: any | null;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private usersService: UsersService
    ) { }

  async ngOnInit() {

    this.actRoute.paramMap.subscribe((params => {
      const userId = params.get('user_id');
      this.userPayload.id = userId;
      this.activationPayload.id = userId;
      this.getUserDetitals(userId);
    }));

  }

  async getUserDetitals(user_id: any){

    await this.usersService.getUserDetails(user_id).subscribe(
      async (res) => {
        this.userPayload = res.data;
        console.log('userPayload', this.userPayload);
      }, error => {
        this.error = error.error;
    });

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

  async onUpdateUser() {
    console.log('updating Detartment ...');
    
    this.btnLoading = true;
    await this.usersService.updateUser(this.userPayload).subscribe(
      response => {
        this.btnLoading = false;
        this.userPayload = response.data;
        this.response = response;
        // this.onRefreshPayload();
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

  async onUserActivation(val: any) {

    console.log('Updating User ...');
    this.btnLoading = true;
    this.activationPayload.status = val;

    await this.usersService.changeUserStatus(this.activationPayload).subscribe(
      response => {
        this.btnLoading = false;
        this.userPayload = response.data;
        this.response = response;

        console.log('onUserActivation', this.activationPayload);
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

}

