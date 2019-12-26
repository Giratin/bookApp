import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, AfterViewInit {
  
  strSearch : string ="";
  books : Book[];
  count : number = 0;
  page : number = 1;
  pages : Array<number>;
  nbre : number = 1;
  detail : Book = {
    title: "",
    author:"",
    date: "",
    pageCount: 0,
    image: "",
    language: "",
    preview: "",
    description: ""
  };
  constructor(private route : ActivatedRoute, private router : Router, private service: BookService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.strSearch = this.route.snapshot.queryParams.q;
    document.querySelector('#modal').classList.add("is-active")
    if(this.strSearch == ""){
      this.router.navigateByUrl('');
    }
    else{
      this.books = [];
      this.pages = [];
      this.service.searchFor(this.strSearch).subscribe((res)=>{
        document.querySelector('#modal').classList.remove("is-active")
        this.count= res["totalItems"]
        this.nbre = Math.round(this.count/20);
        if(this.nbre > 5){
          for(var i =0; i < 5; i++){
            this.pages[i] = i+1;
          }
        }else{
          for(var i =0; i < this.nbre; i++){
            this.pages[i] = i+1;
          }
        }
       
        console.log(this.pages)
        var list = res["items"]
        this.collectData(list);

        var i = 0;
        var c = this.books.map((el)=>{
          if(el.language == "en"){
            return el
          }else{
            console.warn("lang",el.language)
          }
        })
        console.log("books", c)

      });     
    }
  }

  setPage(p : number){
    
    this.books = [];
    this.pages = [];
    console.log("page is", p)
    this.page = p;
    this.router.navigate(['/list'],{queryParams : {'q' : this.strSearch, 'page' : this.page}})
    console.log("nbre max", this.nbre)
    document.querySelector('#modal').classList.add("is-active")
    this.service.paginate(this.strSearch, p).subscribe((res)=>{
      document.querySelector('#modal').classList.remove("is-active")
      var list = res["items"]
      this.collectData(list);
      this.count= res["totalItems"]
      this.nbre = Math.round(this.count/20);

      if( p-3 >= 0 && p+3 < this.nbre){
        for(var i= p-3; i < p+3; i++){
          this.pages[i] = i+1;
        }
      }else if( p <= 2) {
        for(var i= 0; i < 5; i++){
          this.pages[i] = i+1;
        }
      }
    })
  }


  collectData(list){
    list.forEach((el) => {
      var desc = ""
      var img ="https://flowers.next.co.uk/assets/images/md/no-image.png"
      if(el["searchInfo"] != undefined){
        if(el["searchInfo"]["textSnippet"] != undefined){
          desc = el["searchInfo"]["textSnippet"]
        }
      }
      if(el["volumeInfo"]["imageLinks"] != undefined){
        if(el["volumeInfo"]["imageLinks"]["thumbnail"] != undefined){
          img = el["volumeInfo"]["imageLinks"]["thumbnail"]
        }
      }
      var book :  Book = {
        title: el["volumeInfo"]["title"],
        author: el["volumeInfo"]["authors"],
        date: el["volumeInfo"]["publishedDate"],
        pageCount: el["volumeInfo"]["pageCount"],
        image: img,
        language: el["volumeInfo"]["language"],
        preview: el["volumeInfo"]["previewLink"],
        description: desc
      };
      this.books.push(book);
    });
  }

  openPopup(data: Book){
    this.detail = data;
    document.querySelector('#detail').classList.add("is-active")
  }
  close(){
    document.querySelector('#detail').classList.remove("is-active")
  }

}
