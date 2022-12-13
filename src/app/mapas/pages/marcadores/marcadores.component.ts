import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as  mapboxgl  from 'mapbox-gl';

interface MarcadorColor{
  color : string,
  marker?:  mapboxgl.Marker,
  centro?: [ number, number]

}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
     .mapa-container{
        width:100%;
        height:100%;
      }

      .list-group{
        position:fixed;
        top:20px;
        right:20px;
        z-index: 99;
      }

      li{
        cursor:pointer;
      }

    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [ number ,number ] = [ -3.773220478688819 , 40.665502525145214  ];

  //arreglo de marcadores
  marcadores: MarcadorColor[] = [];


  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    //lo llamamos aqui despues que se crea el mapa para asi añadirselo al mapa recien creado los marcadores que teniamos en localStorage
    this.leerLocalStorage();

    // const markerHtml: HTMLElement = document.createElement( 'div' );
    // markerHtml.innerHTML = 'hola Mundo';

    // const marker = new mapboxgl.Marker(
    //   //{element:markerHtml}
    //   )
    //   .setLngLat( this.center )
    //   .addTo( this.mapa );
  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
  //creamos el marcador
    const nuevoMarcador = new mapboxgl.Marker({
        draggable:true,
        color
      })
      .setLngLat( this.center )
      .addTo( this.mapa );

      //lo añadimos a la lista que se muestra en el html
      this.marcadores.push({
        marker: nuevoMarcador,
        color
      });
  //cada vez que guardamos uno actualizamos la lista de marcadores y su posicion
      this.guardarMarcadoresLocalStorage();

      nuevoMarcador.on( 'dragend', () => {
        this.guardarMarcadoresLocalStorage();
      })

  }

  irMarcador( marcador: MarcadorColor ){
    
    this.mapa.flyTo({
     center: marcador.marker!.getLngLat()
    })
  }

  guardarMarcadoresLocalStorage(){

    const lngLatArr: MarcadorColor[] = [];
    //nos recorremos todos los marcadores de nuestro array y le pasamos al array de objetos de tipo MarcadorColor
    this.marcadores.forEach(  m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
          color,
          centro: [ lng , lat]
         })
    });
    //sobrescribimos el array y lo guardamos de nuevo
    localStorage.setItem('marcadores', JSON.stringify(lngLatArr) )

  }

  leerLocalStorage(){
    //si no tiene nada no hacemos nada
    if( !localStorage.getItem( 'marcadores' ) ){
      return
    }
    //si tiene agregamos al this.marcadores nuevos marcadores qu a su vez le decimos que son del mapa
    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem( 'marcadores' )! );

    lngLatArr.forEach( m => {
      const newMarker = new mapboxgl.Marker({
          draggable:true,
          color: m.color
        })
        .setLngLat( m.centro! )
        .addTo( this.mapa );
  
        this.marcadores.push({
          marker: newMarker,
          color: m.color
        });

        newMarker.on( 'dragend', () => {
          this.guardarMarcadoresLocalStorage();
        })
    });

  }

  borrarMarcador( i: number){
    this.marcadores[i].marker?.remove();
    this.marcadores.splice( i, 1 );
    this.guardarMarcadoresLocalStorage();
  }

}
