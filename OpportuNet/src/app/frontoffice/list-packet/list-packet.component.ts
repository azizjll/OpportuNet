import { Component, OnInit } from '@angular/core';
import { PacketService } from '../../service/packet.service';

@Component({
  selector: 'app-list-packet',
  templateUrl: './list-packet.component.html',
  styleUrls: ['./list-packet.component.css']
})
export class ListPacketComponent implements OnInit {

  packets: any[] = [];

  selectedPacket: any = null; // le pack sélectionné pour paiement
showPaymentForm: boolean = false; // afficher/masquer le formulaire


  constructor(private packetService: PacketService) {}

  ngOnInit(): void {
    this.loadPackets();
  }

  loadPackets(): void {
    this.packetService.getAllPackets().subscribe({
      next: (data) => {
        this.packets = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des packets', err);
      }
    });
  }

  buyPacket(packet: any) {
  this.selectedPacket = packet;
  this.showPaymentForm = true; // afficher le formulaire
}

onPaymentDone(payment: any) {
  alert(`Paiement effectué avec succès ! ID: ${payment.id}`);
  this.showPaymentForm = false;
  this.selectedPacket = null;
}


}
