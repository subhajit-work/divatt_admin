import { Directive, ElementRef, HostListener, Input, HostBinding, OnInit, Renderer2 } from '@angular/core';

/* tslint:disable */ 
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit {
  
  constructor(private el: ElementRef, private renderer: Renderer2) {
   }

  ngOnInit(){
    // this.el.nativeElement.innerText += '-sudin';
    // this.el.nativeElement.style.backgroundColor = 'yellow';
    
  }

  @Input('hoverColor') highlightColor1: string;
  @Input('appHighlight') highlightColor: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || 'red');
    // this.highlight('red');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    // console.log('elllllll');
    this.el.nativeElement.style.backgroundColor = color;
  }

 /*  @HostBinding('class.col-12') isActive=false;
  // click-----
  @HostListener('click', ['$event'])
  clickEvent(event:any){
    event.preventDefault();
    event.stopPropagation();
    this.isActive=!this.isActive;
    console.log('Click from Host Element!');
  } */

  /* toggleClass(event: any, class: string) {
    const hasClass = event.target.classList.contains(class);
  
    if(hasClass) {
      this.renderer.removeClass(event.target, class);
    } else {
      this.renderer.addClass(event.target, class);
    }
  } */

  /* @HostListener('click', ['$event'])
  clickEvent(event:any){
    event.preventDefault();
    event.stopPropagation();
    const hasClass = event.target.classList.contains('myactive');

    console.log('Click from Host Element! >>', hasClass);


    if(hasClass) {
      this.renderer.removeClass(event.target, 'myactive');
    } else {
      this.renderer.addClass(event.target, 'myactive');
    }
  }  */





 /*  <label #myLabel> SOME TEXT BLABLA </label>

  @ViewChild("myLabel") lab;
  
  showOrHideManually() {
    this.shouldShow = !this.shouldShow;
    if(this.shouldShow) {
      this.lab.nativeElement.classList.add("show");
      this.lab.nativeElement.classList.remove("hide");
    } else {
      this.lab.nativeElement.classList.add("hide");
      this.lab.nativeElement.classList.remove("show");
    }
  } */
  

}