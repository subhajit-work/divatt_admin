import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
})
export class ErrorPage implements OnInit {

  constructor(public menuCtrl: MenuController) { }
  ionViewWillEnter() {

    this.menuCtrl.enable(false);
  }
  ngOnInit() {

  }

}
