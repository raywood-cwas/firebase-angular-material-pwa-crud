import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CrudService } from './crud.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecordViewComponent } from './record-view/record-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    RecordViewComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'firebase-angular-material-crud';
  drawerOpened = true;
  isMobile = false;
  mode: 'view' | 'edit' | 'create' | 'duplicate' = 'view';
  navItems = [
    { label: 'Vehicles', icon: 'directions_car', node: 'vehicles' },
    { label: 'Volunteers', icon: 'volunteer_activism', node: 'volunteers' },
    { label: 'Programs', icon: 'event', node: 'programs' }
  ];
  records: any[] = [];
  selectedRecord: any = null;
  selectedNode: any = null;
  private listSub?: Subscription;
  private hasUnsavedChanges = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private crud: CrudService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
      this.drawerOpened = !this.isMobile;
    });
  }

  toggleDrawer() {
    this.drawerOpened = !this.drawerOpened;
  }

  selectNav(nav: any) {
    this.selectedNode = nav;
    this.selectedRecord = null;
    if (this.listSub) this.listSub.unsubscribe();
    this.listSub = this.crud.getList(nav.node).subscribe(records => {
      this.records = records;
    });
  }

  selectRecord(record: any) {
    this.selectedRecord = record;
    this.mode = 'view';
    if (this.isMobile) {
      // this.openRecordDialog('view', record); // Not using dialog for now
    }
  }

  createNewRecord() {
    this.selectedRecord = this.getDefaultRecordForNode();
    this.mode = 'create';
    this.hasUnsavedChanges = false;
  }

  editRecord(record: any) {
    this.selectedRecord = record;
    this.mode = 'edit';
    this.hasUnsavedChanges = false;
  }

  duplicateRecord(record: any) {
    if (!record) return;
    const { id, ...copy } = record;
    this.selectedRecord = { ...copy };
    this.mode = 'duplicate';
    this.hasUnsavedChanges = false;
  }

  saveRecord(record: any) {
    if (this.mode === 'edit' && record?.id) {
      this.crud.updateRecord(this.getCurrentNode(), record.id, record);
      this.snackBar.open('Record updated', 'Close', { duration: 2000 });
    } else if (this.mode === 'create' || this.mode === 'duplicate') {
      this.crud.createRecord(this.getCurrentNode(), record);
      this.snackBar.open('Record created', 'Close', { duration: 2000 });
    }
    this.mode = 'view';
    this.hasUnsavedChanges = false;
  }

  cancelEdit() {
    this.mode = 'view';
    this.hasUnsavedChanges = false;
  }

  onFormChange() {
    if (this.mode === 'edit' || this.mode === 'create' || this.mode === 'duplicate') {
      this.hasUnsavedChanges = true;
    }
  }

  deleteRecord(record: any) {
    if (!record) return;
    this.crud.deleteRecord(this.getCurrentNode(), record.id);
    this.selectedRecord = null;
    this.mode = 'view';
    this.hasUnsavedChanges = false;
  }

  getCurrentNode(): string {
    return this.selectedNode ? this.selectedNode.node : '';
  }

  getDefaultRecordForNode() {
    switch (this.getCurrentNode()) {
      case 'vehicles':
        return { make: '', model: '', year: '' };
      case 'volunteers':
        return { firstName: '', lastName: '', email: '' };
      case 'programs':
        return { name: '', description: '' };
      default:
        return {};
    }
  }

  closeDetailsPane() {
    if (this.hasUnsavedChanges) {
      const confirmClose = window.confirm('You have unsaved changes. Discard them?');
      if (!confirmClose) return;
    }
    if (this.isMobile) {
      // On mobile, trigger slide out by clearing selectedRecord after transition
      this.mode = 'view';
      setTimeout(() => {
        this.selectedRecord = null;
        this.hasUnsavedChanges = false;
      }, 300); // match the CSS transition duration
    } else {
      // On desktop, immediately clear
      this.selectedRecord = null;
      this.mode = 'view';
      this.hasUnsavedChanges = false;
    }
  }

  openRecordDialog(mode: 'view' | 'edit' | 'create' | 'duplicate', record: any = null) {
    // this.dialog.open(RecordDialogComponent, {
    //   width: '400px',
    //   data: {
    //     mode,
    //     node: this.getCurrentNode(),
    //     record
    //   }
    // }).afterClosed().subscribe(result => {
    //   if (result && result.action === 'save') {
    //     if (mode === 'create' || mode === 'duplicate') {
    //       this.crud.createRecord(this.getCurrentNode(), result.data);
    //     } else if (mode === 'edit' && record) {
    //       this.crud.updateRecord(this.getCurrentNode(), record.id, result.data);
    //     }
    //   }
    // });
  }
}
