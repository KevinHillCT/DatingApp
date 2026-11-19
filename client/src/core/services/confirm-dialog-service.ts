import { Service } from '@angular/core';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Service()
export class ConfirmDialogService {
    private dialogComponent?: ConfirmDialog;

    register(component: ConfirmDialog) {
        this.dialogComponent = component;
    }

    confirm(message = 'Are you sure?'): Promise<boolean> {
        if (!this.dialogComponent) throw new Error('ConfirmDialog component not registered');

        return this.dialogComponent.open(message);
    }
}