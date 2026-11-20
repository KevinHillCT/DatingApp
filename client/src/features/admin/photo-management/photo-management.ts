import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin-service';
import { PhotoForApproval } from '../../../types/photosForApproval';

@Component({
  imports: [],
  selector: 'app-photo-management',
  styleUrl: './photo-management.css',
  templateUrl: './photo-management.html',
})
export class PhotoManagement implements OnInit {
  private adminService = inject(AdminService);
  photos = signal<PhotoForApproval[]>([]);

  ngOnInit(): void {
    this.getUnapprovedPhotos();
  }

  getUnapprovedPhotos() {
    this.adminService.getUnapprovedPhotos().subscribe(photos => {
      this.photos.set(photos);
    });
  }

  approvePhoto(photoId: number) {
    this.adminService.approvePhoto(photoId).subscribe(() => {
      this.getUnapprovedPhotos();
    });
  }

  rejectPhoto(photoId: number) {
    this.adminService.rejectPhoto(photoId).subscribe(() => {
      this.getUnapprovedPhotos();
    });
  }
}
