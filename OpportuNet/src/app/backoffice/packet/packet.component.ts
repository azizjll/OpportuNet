import { Component, OnInit } from '@angular/core';
import { PacketService } from 'src/app/service/packet.service';

@Component({
  selector: 'app-packet',
  templateUrl: './packet.component.html',
  styleUrls: ['./packet.component.css']
})
export class PacketComponent implements OnInit {
  packets: any[] = [];
  newPacket: any = { 
    name: '', 
    description: '', 
    price: null, 
    currency: '' 
  };
  loading = false;
  editingPacketId: number | null = null; // id du packet en cours de modification
  editedPacket: any = {}; // copie du packet en cours de modification

  constructor(private packetService: PacketService) {}

  ngOnInit() {
    this.loadPackets();
  }

  loadPackets() {
    this.loading = true;
    this.packetService.getAllPackets().subscribe({
      next: data => {
        this.packets = data;
        this.loading = false;
      },
      error: err => {
        console.error('Erreur chargement packets', err);
        this.loading = false;
      }
    });
  }

  addPacket() {
    if (!this.newPacket.name || !this.newPacket.price || !this.newPacket.currency) return;

    this.packetService.createPacket(this.newPacket).subscribe({
      next: packet => {
        this.packets.push(packet);
        this.newPacket = { name: '', description: '', price: null, currency: '' };
      },
      error: err => console.error('Erreur ajout packet', err)
    });
  }

  startEdit(packet: any) {
    this.editingPacketId = packet.id;
    this.editedPacket = { ...packet }; // copie pour modification
  }

  saveEdit() {
    if (!this.editedPacket.name || !this.editedPacket.price || !this.editedPacket.currency) return;

    this.packetService.updatePacket(this.editingPacketId!, this.editedPacket).subscribe({
      next: updated => {
        const index = this.packets.findIndex(p => p.id === updated.id);
        this.packets[index] = updated;
        this.editingPacketId = null;
      },
      error: err => console.error('Erreur modification packet', err)
    });
  }

  cancelEdit() {
    this.editingPacketId = null;
  }

  removePacket(id: number) {
    this.packetService.deletePacket(id).subscribe({
      next: () => this.packets = this.packets.filter(p => p.id !== id),
      error: err => console.error('Erreur suppression packet', err)
    });
  }
}
