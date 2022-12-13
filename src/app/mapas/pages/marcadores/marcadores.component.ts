import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as  mapboxgl  from 'mapbox-gl';

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
     .mapa-container{
        width:100%;
        height:100%;
      }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [ number ,number ] = [ -3.773220478688819 , 40.665502525145214  ];


  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    // const markerHtml: HTMLElement = document.createElement( 'div' );
    // markerHtml.innerHTML = 'hola Mundo';

    const marker = new mapboxgl.Marker(
      //{element:markerHtml}
      )
      .setLngLat( this.center )
      .addTo( this.mapa );




  }

  ngOnInit(): void {
  }

}
