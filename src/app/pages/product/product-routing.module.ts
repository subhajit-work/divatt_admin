import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth/auth.guard';

import { ProductPage } from './product.page';

const routes: Routes = [
  {
    path: '',
    component: ProductPage,
    canLoad:[AuthGuard]
  },


  


 



 





  // {
  //   path: 'category',
  //   loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule),
  //   canLoad:[AuthGuard]
  // },
  // {
  //   path: 'subcategory',
  //   loadChildren: () => import('./subcategory/subcategory.module').then( m => m.SubcategoryPageModule)
  // },
  // {
  //   path: 'add-category/:action/:id',
  //   loadChildren: () => import('./add-category/add-category.module').then( m => m.AddCategoryPageModule)
  // },
  // {
  //   path: 'add-subcategory/:action/:id',
  //   loadChildren: () => import('./add-subcategory/add-subcategory.module').then( m => m.AddSubcategoryPageModule)
  // },
  // {
  //   path: 'add-product/:action/:id',
  //   loadChildren: () => import('./add-product/add-product.module').then( m => m.AddProductPageModule)
  // },
  // {
  //   path: 'add-color/:action/:id',
  //   loadChildren: () => import('./add-color/add-color.module').then( m => m.AddColorPageModule)
  // },
  // {
  //   path: 'color',
  //   loadChildren: () => import('./color/color.module').then( m => m.ColorPageModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPageRoutingModule {}
