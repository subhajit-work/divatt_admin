//our root app component
import { Directive, Input, ViewContainerRef, TemplateRef, NgModule, VERSION } from '@angular/core';


@Directive({
  selector: '[ngInit]',
})
export class NgInitDirective {
  @Input()
  set ngInit(context: any) {
    this.context.$implicit = this.context.ngInit = context;
    this.vcRef.clear();
    this.vcRef.createEmbeddedView(this.templateRef, this.context);
  }

  context: { $implicit?: any, ngInit?: any } = {};

  constructor(private vcRef: ViewContainerRef, private templateRef: TemplateRef<any>) {}
}