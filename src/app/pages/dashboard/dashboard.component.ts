import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private activity: string = "";
  private points: number = 0;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient){};

  logout(){
    this.authService.signOut();
    this.router.navigateByUrl('/');
  }

  goToAccountPage(){
    this.router.navigateByUrl('/account')
  }

  getActionForDay() {
    this.points = 1;
    this.authService.getActionForDay().subscribe(
      (action: string) => {
        this.activity = action;
        const modal = document.querySelector('.modal') as HTMLDivElement;
        const modalText = document.querySelector('#modal-text') as HTMLParagraphElement;
        modalText.innerHTML = "Your action for one day is: <br>" + action;
        modal.style.display = "block";
      },
      (error: any) => {
        console.log('API call failed', error);
      }
    );
  }

  getActionForWeek(){
    this.points = 3;
    this.authService.getActionForWeek().subscribe(
      (action: string) => {
        this.activity = action;
        const modal = document.querySelector('.modal') as HTMLDivElement;
        const modalText = document.querySelector('#modal-text') as HTMLParagraphElement;
        modalText.innerHTML = "Your action for one week is: <br>" + action;
        modal.style.display = "block";
      },
      (error: any) => {
        console.log('API call failed', error);
      }
    );
  }

  getActionForMonth(){
    this.points = 5;
    this.authService.getActionForMonth().subscribe(
      (action: string) => {
        this.activity = action;
        const modal = document.querySelector('.modal') as HTMLDivElement;
        const modalText = document.querySelector('#modal-text') as HTMLParagraphElement;
        modalText.innerHTML = "Your action for one month is: <br>" + action;
        modal.style.display = "block";
      },
      (error: any) => {
        console.log('API call failed', error);
      }
    );
  }

  acceptAction(){
    this.authService.addActionToDo(this.activity, this.points);
    this.authService.getUserActionToDo().subscribe(
      data => console.log(data),
      error => console.error(error)
    );
    const modal = document.querySelector('.modal') as HTMLDivElement;
    modal.style.display = "none";
  }

  rejectAction(){
    const modal = document.querySelector('.modal') as HTMLDivElement;
    modal.style.display = "none";
  }
}
