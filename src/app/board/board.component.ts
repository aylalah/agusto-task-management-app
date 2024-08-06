import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/tasks/task.service';
import { UsersService } from '../services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

declare let $: any;
declare let Swal: any;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  collaps = 11;
  btnLoading = false;
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
    status: '',
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

  public taskPayload:any = {
    id: '',
    project: '',
    task: '',
    category: '',
    description: '',
    assigned_to: [],
    priority: '',
    start_date: '',
    due_date: '',
    attachment: '',
  }

  public updateTaskPayload:any = {
    id: '',
    project: '',
    task: '',
    category: '',
    description: '',
    comment: '',
    assigned_to: [],
    priority: '',
    progress: '',
    attachment: '',
    is_done: '',
    status: '',
    created_by: '',
    created_at: '',
    start_date: '',
    due_date: '',
    updated_by: '',
    updated_at: ''
  }

  public assignee:any = {
    id: '',
    name: '',
    image: '',
    role: '',
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
  tasks: any;
  open_tasks: any;
  inprogress_tasks: any;
  completed_tasks: any;
  completed_meta: any;
  inprogress_meta: any;
  open_meta: any;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    public auth: AuthService,
    private taskService: TaskService,
    private usersService: UsersService
    ) { }

  async ngOnInit() {

    await this.onGetAllTask();
    await this.usersService.getActiveUsers().subscribe(
      async (res) => {
        this.users = res.data;
        console.log('users', this.users);
      }, error => {
        this.error = error.error;
    });

  }

  async onGetAllTask(){

    await this.taskService.getAllBoardTasks({
      page: 1,
      per_page: 10,
      status: 'open',
      search: this.params.search,
    }).subscribe(
      async (res) => {
        this.open_tasks = res.data;
        this.open_meta = res.meta;
        console.log('open_tasks', this.open_tasks);
      }, error => {
        this.error = error.error;
    });

    await this.taskService.getAllBoardTasks({
      page: 1,
      per_page: 10,
      status: 'inprogress',
      search: this.params.search,
    }).subscribe(
      async (res) => {
        this.inprogress_tasks = res.data;
        this.inprogress_meta = res.meta;
        console.log('inprogress_tasks', this.inprogress_tasks);
      }, error => {
        this.error = error.error;
    });

    await this.taskService.getAllBoardTasks({
      page: 1,
      per_page: 10,
      status: 'completed',
      search: this.params.search,
    }).subscribe(
      async (res) => {
        this.completed_tasks = res.data;
        this.completed_meta = res.meta;
        console.log('completed_tasks', this.completed_tasks);
      }, error => {
        this.error = error.error;
    });
  }

  async onGeTask(id: any) {

    this.response = {
      code: 0,
      status: '',
      title: '',
      message: '',
    }
  
    let tasks = await this.tasks.filter(function (data: any) {
      return (data.id == id);
    });
    
    this.updateTaskPayload.id =  tasks[0].id;
    this.updateTaskPayload.project =  tasks[0].project;
    this.updateTaskPayload.task =  tasks[0].task;
    this.updateTaskPayload.category =  tasks[0].category;
    this.updateTaskPayload.description =  tasks[0].description;
    this.updateTaskPayload.comment =  tasks[0].comment;
    this.updateTaskPayload.assigned_to =  tasks[0].assigned_to;
    this.updateTaskPayload.priority =  tasks[0].priority;
    this.updateTaskPayload.progress =  tasks[0].progress;
    this.updateTaskPayload.attachment =  tasks[0].attachment;
    this.updateTaskPayload.status =  tasks[0].status;
    this.updateTaskPayload.created_by =  tasks[0].created_by;
    this.updateTaskPayload.created_at =  tasks[0].created_at;
    this.updateTaskPayload.start_date =  tasks[0].start_date;
    this.updateTaskPayload.due_date =  tasks[0].due_date;
    this.updateTaskPayload.updated_by =  tasks[0].updated_by;
    this.updateTaskPayload.updated_at =  tasks[0].updated_at;

    console.log('updateTaskPayload', this.updateTaskPayload);
  }

  onRefreshPayload() {
    this.taskPayload.id = '';
    this.taskPayload.project = '';
    this.taskPayload.task = '';
    this.taskPayload.category = '';
    this.taskPayload.description = '';
    this.taskPayload.assigned_to = [];
    this.taskPayload.priority = '';
    this.taskPayload.start_date = '';
    this.taskPayload.due_date = '';
    this.taskPayload.attachment = '';
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
        this.taskPayload.attachment = '' + this.imagefile;
        // console.log('imagefile', this.imagefile)
      };
      reader.readAsDataURL(files);
    }
  }

  async onCreatTask() {
    console.log('updating Detartment ...');
    
    this.btnLoading = true;
    await this.taskService.createTask(this.taskPayload).subscribe(
      response => {
        this.btnLoading = false;
        // this.taskPayload = response.data;
        this.response = response;
        this.onRefreshPayload();
        this.onGetAllTask();
        // this.alertService.toaster(this.response);
        console.log('taskPayload', this.taskPayload, 'Updated user');
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

  async onUpdateTask() {
    console.log('updating Task ...');
    this.btnLoading = true;
    await this.taskService.updateTask(this.updateTaskPayload).subscribe(
      response => {
        this.btnLoading = false;
        this.updateTaskPayload = response.data;
        this.response = response;
        this.onGetAllTask();
        console.log('updateTaskPayload', this.updateTaskPayload, 'Updated Task');
      },
      error => {
        this.btnLoading = false;
        this.error = error.error;
        // this.alertService.toaster(this.error);
        console.log('errorResponse', error);
      }
    )
  }

  async onAddUser(user_id: any) {

    let users = await this.users.filter(function (data: any) {
      return (data.id == user_id);
    });

    this.assignee.id =  users[0].id;
    this.assignee.name = `${users[0].first_name} ${users[0].last_name}`;
    this.assignee.image =  users[0].image;
    this.assignee.role =  users[0].role;

    console.log('assignee', this.assignee);

    this.taskPayload.assigned_to.push(this.assignee);
  
    this.assignee = {
      id: '',
      name: '',
      image: '',
      role: '',
    };

    console.log('rolePayload.components', this.taskPayload); 
    

  }

  // async onUpdateAddRemove(append) {

  //   console.log('permission value', append);
  //   console.log('requestItems', this.requestItems);

  //   if (this.requestItems.category_id && this.requestItems.quantity) {

  //     if (append == 'add') {
  //       this.update_payload.items.push(this.requestItems);
  //     } else {
  //       const index = await this.update_payload.items.indexOf(this.requestItems.category_id);
  //       if (index > -1) {
  //         this.update_payload.items.splice(index, 1);
  //       }
  //     }
  
  //     this.requestItems = {
  //       category_id: '',
  //       quantity: '',
  //       is_advance: false,
  //       advance: []
  //     };
  
  //     console.log('rolePayload.components', this.update_payload); 
      
  //   }

  // }

}