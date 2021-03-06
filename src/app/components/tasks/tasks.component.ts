import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks : Task[] = [];
  resultTasks: Task[] = [];

  myTask: Task = {
    'label': '',
    'completed': false
  }

  showForm = false;
  editForm = false;
  searchText: string = '';

  constructor(private taskServices : TaskService) { }

  ngOnInit(): void {
    this.getTasks();
  }


  confirmBox(task: Task) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
        this.deleteTask(task.id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'error'
        )
      }
    })
  }

  getTasks()
  {
    this.taskServices.getTasks().subscribe(tasks =>  this.tasks = tasks)
  }

  deleteTask(id: any) {
    this.taskServices.delete(id).subscribe(() => {
      this.resultTasks = this.tasks = this.tasks.filter(task => task.id != id);
    })
  }
  persistTask() {
    this.taskServices.persist(this.myTask).subscribe((task) => {
      this.tasks = [task, ...this.tasks];
      this.resteTask();
      this.showForm = false;
    })
  }

  resteTask() {
    this.myTask = {
      'label': '',
      'completed': false
    }
  }
  
  toggleCompleted(task: Task) {
    this.taskServices.completed(task).subscribe(
      () => {
        task.completed = !task.completed;
      }
    )
  }
  editeTask(task: Task) {
    this.myTask = task;
    this.editForm = true;
    this.show();
  }
  
  show() {
    this.showForm = true;
  }

  updateTask() {
    this.taskServices.update(this.myTask)
      .subscribe(
        task => {
          this.resteTask();
          this.editForm = false;
        }
      );
  }
  //serch 
  searchTasks() {
    this.tasks = this.tasks.filter((task) => task.label.toLowerCase().includes(this.searchText.toLowerCase()));
  }

}

