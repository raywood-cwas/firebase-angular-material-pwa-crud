import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-record-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './record-view.component.html',
  styleUrls: ['./record-view.component.scss']
})
export class RecordViewComponent {
  @Input() record: any;
  @Input() node: string | null = null;
  @Input() mode: 'view' | 'edit' | 'create' | 'duplicate' = 'view';
  @Output() edit = new EventEmitter<any>();
  @Output() duplicate = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  onEdit() {
    this.edit.emit(this.record);
  }
  onDuplicate() {
    this.duplicate.emit(this.record);
  }
  onDelete() {
    this.delete.emit(this.record);
  }

  formChanged() {
    this.edit.emit(); // Optionally emit an event if you want to notify parent
  }

  getRecordKeys(record: any): string[] {
    return record ? Object.keys(record) : [];
  }

  isMultiline(value: any): boolean {
    return typeof value === 'string' && value.length > 60;
  }

  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  getTitleKey(): string {
    if (!this.record) return 'name';
    if ('name' in this.record) return 'name';
    if ('title' in this.record) return 'title';
    if ('firstName' in this.record) return 'firstName';
    if ('model' in this.record) return 'model';
    return Object.keys(this.record)[0] || 'name';
  }
}
