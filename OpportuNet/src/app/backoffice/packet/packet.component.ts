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
  editingPacketId: number | null = null;
  editedPacket: any = {};

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

  // Ajout avec contrôle
  addPacket() {
    if (!this.newPacket.name || this.newPacket.name.length < 3) {
      alert('Nom du packet requis (minimum 3 caractères)');
      return;
    }
    if (!this.newPacket.price || this.newPacket.price <= 0) {
      alert('Prix du packet requis et supérieur à 0');
      return;
    }
    if (!this.newPacket.currency) {
      alert('Devise du packet requise');
      return;
    }

    this.packetService.createPacket(this.newPacket).subscribe({
      next: packet => {
        this.packets.push(packet);
        this.newPacket = { name: '', description: '', price: null, currency: '' };
      },
      error: err => console.error('Erreur ajout packet', err)
    });
  }

  // Démarrer l'édition
  startEdit(packet: any) {
    this.editingPacketId = packet.id;
    this.editedPacket = { ...packet };
  }

  // Sauvegarder l'édition avec contrôle
  saveEdit() {
    if (!this.editedPacket.name || this.editedPacket.name.length < 3) {
      alert('Nom du packet requis (minimum 3 caractères)');
      return;
    }
    if (!this.editedPacket.price || this.editedPacket.price <= 0) {
      alert('Prix du packet requis et supérieur à 0');
      return;
    }
    if (!this.editedPacket.currency) {
      alert('Devise du packet requise');
      return;
    }

    this.packetService.updatePacket(this.editingPacketId!, this.editedPacket).subscribe({
      next: updated => {
        const index = this.packets.findIndex(p => p.id === updated.id);
        this.packets[index] = updated;
        this.editingPacketId = null;
      },
      error: err => console.error('Erreur modification packet', err)
    });
  }

  // Annuler l'édition
  cancelEdit() {
    this.editingPacketId = null;
  }

  // Supprimer un packet
  removePacket(id: number) {
    this.packetService.deletePacket(id).subscribe({
      next: () => this.packets = this.packets.filter(p => p.id !== id),
      error: err => console.error('Erreur suppression packet', err)
    });
  }
}
