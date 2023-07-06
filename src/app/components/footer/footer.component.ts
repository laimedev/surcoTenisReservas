import { Component } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  version: string = environment.version;

}
