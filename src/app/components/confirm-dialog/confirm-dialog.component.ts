import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @ViewChild('delConfirm') delConfirm: TemplateRef<any>;
  @Output() actionConfirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  modalRef: BsModalRef;

  @Input() message: string;
  @Input() title: string;

  @Input() confirmTitle = 'Yes';
  @Input() dismissTitle = 'No';
  @Input() showDismissButton = true;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  confirmDeletetion(): void {
    this.actionConfirm.emit(true);
  }

  closeConfirmDialog(): void {
    this.actionConfirm.emit(false);
  }

  hide(): void {
    this.modalRef.hide();
  }

  show(): void {
    this.modalRef = this.modalService.show(this.delConfirm, {animated: true});
  }
}
