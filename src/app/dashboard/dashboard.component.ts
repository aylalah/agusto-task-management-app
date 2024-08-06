import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TaskService } from '../services/tasks/task.service';
import { UsersService } from '../services/users/users.service';
declare let appjs: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

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

  public task_metrix = {
    total: {
      count: 0,
      analytics: 0
    },
    opened: {
      count: 0,
      analytics: 0,
    },
    inprgress: {
      count: 0,
      analytics: 0,
    },
    completed: {
      count: 0,
      analytics: 0,
    },
    pending: {
      count: 0,
      analytics: 0,
    },
    backlog: {
      count: 0,
      analytics: 0,
    },
    canceled: {
      count: 0,
      analytics: 0,
    },

    design: {
      count: 0,
      analytics: 0,
    },

    development: {
      count: 0,
      analytics: 0,
    },

    qa: {
      count: 0,
      analytics: 0,
    },

    product: {
      count: 0,
      analytics: 0,
    },
  };
  tasks: any;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    public auth: AuthService,
    private taskService: TaskService,
    private usersService: UsersService
    ) { }

  ngOnInit() {

    let appJs = new appjs('');
    this.onGetDashboardMatrix();
    this.onGetAllTask();

  }
  
  async onGetDashboardMatrix(){
    await this.taskService.getDashboardMatrix().subscribe(
      async (res) => {
        const task_metrix = res.data;

        this.task_metrix = task_metrix;

        console.log('tasks', this.task_metrix);
      }, error => {
        // this.error = error.error;
    });
  }

  async onGetAllTask(){
    await this.taskService.getAllTasks(this.params).subscribe(
      async (res) => {
        this.tasks = res.data;
        this.meta = res.meta;
        console.log('tasks', this.tasks);
      }, error => {
        // this.error = error.error;
    });
  }

}
