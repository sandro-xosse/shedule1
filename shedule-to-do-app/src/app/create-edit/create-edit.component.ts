import {  Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponsiblePerson, ITodo, TodoStatus } from '../models/models';
import { RespPersonService } from '../services/resp-person.service';
import { Observable } from 'rxjs';
import { ToDoService } from '../services/todo.service';


@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss']
})
export class CreateEditComponent implements OnInit {

  public id?: number;
  private curentToDo?: ITodo = {} as ITodo;
  public invalidForm: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    private respPersonService: RespPersonService,
    private toDoService: ToDoService
  ) { }

  public persons: Observable<IResponsiblePerson[]> = this.respPersonService.getRespPersons();

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params?.['id'] ?? null;
    if (this.id) {
      this.curentToDo = this.toDoService.getTodo(this.id);
      this.form.patchValue(this.curentToDo as ITodo);
    }
  }


  public form = this.fb.group({
    title: this.fb.control('', [Validators.required]),
    deadline: this.fb.control('', [Validators.required]),
    responsiblePersonName: this.fb.control('', [Validators.required])
  });

  public onsubmit() {
    if (this.form.valid) {
      const todo: ITodo = {
        id: this.curentToDo?.id ?? Math.ceil(Math.random() * 1000000),
        status: this.curentToDo?.status ?? TodoStatus.pending,
        createDate: this.curentToDo?.createDate ?? (new Date()).toISOString().split('T')[0],
        deadline: this.form.value.deadline,
        title: this.form.value.title,
        responsiblePersonName: this.form.value.responsiblePersonName
      } as ITodo;

      this.id ? this.toDoService.updateTodo(todo) : this.toDoService.addTodo(todo);
      this.close();
    }

    this.invalidForm = true;
  }

  public close() {
    this.form.reset();
    this.router.navigate([''])
  }

}
