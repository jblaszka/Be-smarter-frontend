import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, AfterViewInit {
  rowsVisible = false;
  activityToDo: any[];
  activityDone: any[];

  constructor(private authService: AuthService, private router: Router, private http: HttpClient){}
  
  ngOnInit() {
    this.loadDate();
  }

  loadDate(): void {
    this.authService.getUserActionToDo().subscribe(result => {
      this.activityToDo = result;
    });  

    this.authService.getUserActionDone().subscribe(result => {
      this.activityDone = result;
    }); 
  }

  ngAfterViewInit() {
  }

  showActivityToDo(): void {
    const rows = document.querySelectorAll('#actions-to-do-table');
    const text = document.querySelectorAll('#text-in-table-activity-to-do');
    rows.forEach(row => {
      row.classList.toggle('hidden');
    });

    text.forEach(text => {
      text.classList.toggle('hidden');
    });
  
    this.rowsVisible = !this.rowsVisible;
    console.log(this.activityToDo);
  }
  
  showActivityDone(): void {
    const rows = document.querySelectorAll('#actions-done-table');
    const text = document.querySelectorAll('#text-in-table-activity-done');
    rows.forEach(row => {
      row.classList.toggle('hidden');
    });
    
    text.forEach(text => {
      text.classList.toggle('hidden');
    });
  
    this.rowsVisible = !this.rowsVisible;
  }

  makeActivityDone(activityID: number): void{
    this.authService.addActionDone(activityID);
    this.loadDate();
  }

  logout(){
    this.authService.signOut();
    this.router.navigateByUrl('/');
  }

  mainPage(){
    this.router.navigateByUrl('/dashboard');
  }
}
