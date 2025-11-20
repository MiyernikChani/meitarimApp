import { Routes } from '@angular/router';
import { EnterStudentComponent } from './components/enterStudent/enterStudentComponent';
import { EnterComponent } from './components/enter/enterComponent';
import { ManagerComponent } from './components/manager/managerComponent';
import { ManagStudent } from './components/manag-student/manag-student';

export const routes: Routes = [
    { path: '', component: EnterComponent, pathMatch: 'full' },
    { path: 'enter-student', component: EnterStudentComponent, pathMatch: 'full' },
    { path: 'manager', component: ManagerComponent, pathMatch: 'full' },
    { path: 'manage-student', component: ManagStudent, pathMatch: 'full' },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
