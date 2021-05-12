import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { faArrowUp, faUser } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Fonts export
  faArrowUp = faArrowUp;
  faUser = faUser;

  title = 'origa';
  bodyObject:any;
  dataAvailable=false;
  tableContent:any[] = [];
  tableHeaders:any[] = [];
  selectedName="";
  selectedEmail="";
  selectedUsername="";
  calculatedPercentage=10;
  
  // pie chart variables:
  positiveLatitude =0;
  negativeLatitude =0;
  positiveLongitude=0;
  negativeLongitude=0;
  // end of pie chart variable declaration
  chartType: string = 'pie';
  chartDatasets: Array<any> = [ { data:  [], label: 'Pie Chart' } ];
  chartLabels: Array<any> = ['Latitude >0', 'Latitude <0', 'Longitude >0', 'Longitude <0'];
  chartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1'],
      hoverBackgroundColor: ['#ff2a2d', '#1bd6d3', '#ffb339', '#6287c2'],
      borderWidth: 2,
    }
  ];
  chartOptions: any = { responsive: true};
  chartClicked(e: any): void { }
  chartHovered(e: any): void { }


  constructor(private http : HttpClient){ }
  ngOnInit(): void {
    this.tableHeaders=['Name','Username','City','Pincode','Company Name']
    this.http.get('https://jsonplaceholder.typicode.com/users',{observe: 'response'}).subscribe(response => {
       if(response.status == 200){
          this.bodyObject=response.body;
          this.tableContent=this.bodyObject;
          this.selectedEmail=this.tableContent[0].email;
          this.selectedName=this.tableContent[0].name;
          this.selectedUsername=this.tableContent[0].username;

          this.tableContent.forEach(element => {
              if ( parseFloat(element.address.geo.lat) >0){
                this.positiveLatitude+=parseFloat(element.address.geo.lat);
              }
              if ( parseFloat(element.address.geo.lat) <0){
                this.negativeLatitude+=(parseFloat(element.address.geo.lat));
              }
              if ( parseFloat(element.address.geo.lng) >0){
                this.positiveLongitude+=parseFloat(element.address.geo.lng);
              }
              if ( parseFloat(element.address.geo.lng) <0){
                this.negativeLongitude+= (parseFloat(element.address.geo.lng));
              }
          });
          // pushing all the combination to array for visualization purpose
          this.chartDatasets[0]['data'].push(this.positiveLatitude);
          this.chartDatasets[0]['data'].push(this.negativeLatitude);
          this.chartDatasets[0]['data'].push(this.positiveLongitude);
          this.chartDatasets[0]['data'].push(this.negativeLongitude);
          this.dataAvailable=true;
       }
       else{
         console.log("Something went wrong !")
       }
     });
  }

  onSelect(selectedItem: any) {
    this.selectedUsername=selectedItem.username;
    this.selectedName=selectedItem.name;
    this.selectedEmail=selectedItem.email;
}
}

