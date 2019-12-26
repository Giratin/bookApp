import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route : Router) { }
  search : string = "";

  ngOnInit() {
  }


  load(){
    document.querySelector('#modal').classList.add("is-active")
    this.route.navigate(['/list'],{queryParams : {'q' : this.search}})
   //this.route.navigateByUrl('/list')
  }

}
