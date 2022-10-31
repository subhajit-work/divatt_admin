import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'role/:action/:id',
    loadChildren: () => import('./pages/role_management/add-role/add-role.module').then( m => m.AddRolePageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'role-list',
    loadChildren: () => import('./pages/role_management/role-list/role-list.module').then( m => m.RoleListPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'role-permission',
    loadChildren: () => import('./pages/role_management/role-permission/role-permission.module').then( m => m.RolePermissionPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'modal',
    loadChildren: () => import('./pages/modal/modal.module').then( m => m.ModalPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'product-list',
    loadChildren: () => import('./pages/product/product.module').then( m => m.ProductPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'add-designer-product/:action/:id',
    loadChildren: () => import('./pages/designer/add-designer-product/add-designer-product.module').then( m => m.AddDesignerProductPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'designer-list',
    loadChildren: () => import('./pages/designer/designer-list/designer-list.module').then( m => m.DesignerListPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'category-list',
    loadChildren: () => import('./pages/product/category/category.module').then( m => m.CategoryPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'subcategory-list',
    loadChildren: () => import('./pages/product/subcategory/subcategory.module').then( m => m.SubcategoryPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'category/:action/:id',
    loadChildren: () => import('./pages/product/add-category/add-category.module').then( m => m.AddCategoryPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'subcategory/:action/:id',
    loadChildren: () => import('./pages/product/add-subcategory/add-subcategory.module').then( m => m.AddSubcategoryPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'color/:action/:name',
    loadChildren: () => import('./pages/product/add-color/add-color.module').then( m => m.AddColorPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'color-list',
    loadChildren: () => import('./pages/product/color/color.module').then( m => m.ColorPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'employee/:action/:id',
    loadChildren: () => import('./pages/employee_management/add-employee/add-employee.module').then( m => m.AddEmployeePageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'employee-list',
    loadChildren: () => import('./pages/employee_management/employee-list/employee-list.module').then( m => m.EmployeeListPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'error',
    loadChildren: () => import('./pages/error/error.module').then( m => m.ErrorPageModule)
  },
  {
    path: 'order-list',
    loadChildren: () => import('./pages/product/order-list/order-list.module').then( m => m.OrderListPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'order-products-list/:orderId',
    loadChildren: () => import('./pages/product/order-list/order-products-list/order-products-list.module').then( m => m.OrderProductsListPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'order-list-designer',
    loadChildren: () => import('./pages/designer/order-list-designer/order-list-designer.module').then( m => m.OrderListDesignerPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'product-view/:id',
    loadChildren: () => import('./pages/product/product-view/product-view.module').then( m => m.ProductViewPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'specification/:action/:id',
    loadChildren: () => import('./pages/product/specification-add/product-specification.module').then( m => m.ProductSpecificationPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'specification-list',
    loadChildren: () => import('./pages/product/specifiction-list/specifiction-list.module').then( m => m.SpecifictionListPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'measurement/:action/:categoryName/:subcategoryName',
    loadChildren: () => import('./pages/product/add-measurement/add-measurement.module').then( m => m.AddMeasurementPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'measurement-list',
    loadChildren: () => import('./pages/product/measurement-list/measurement-list.module').then( m => m.MeasurementListPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'user-list',
    loadChildren: () => import('./pages/user-list/user-list.module').then( m => m.UserListPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'level-designer',
    loadChildren: () => import('./pages/designer/designer-label/designer-label.module').then( m => m.DesignerLabelPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'level/:action/:name',
    loadChildren: () => import('./pages/designer/add-label/add-label.module').then( m => m.AddLabelPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'order-products-designer/:orderId',
    loadChildren: () => import('./pages/designer/order-list-designer/order-products-designer/order-products-designer.module').then( m => m.OrderProductsDesignerPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'designer-view/:id',
    loadChildren: () => import('./pages/designer/designer-view/designer-view.module').then( m => m.DesignerViewPageModule),
    canLoad:[AuthGuard]
  },

  {
    path: 'hsn-list',
    loadChildren: () => import('./pages/product/hsn-list/hsn-list.module').then( m => m.HsnListPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'hsn/:action/:id',
    loadChildren: () => import('./pages/product/add-hsn/add-hsn.module').then( m => m.AddHsnPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'banner/:action/:id',
    loadChildren: () => import('./pages/banner/banner/banner.module').then( m => m.BannerPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'banner-list',
    loadChildren: () => import('./pages/banner/banner-list/banner-list.module').then( m => m.BannerListPageModule),
    canLoad:[AuthGuard]
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled', preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
