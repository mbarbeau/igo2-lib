import { TestBed, inject } from '@angular/core/testing';
import { NotificationsService } from 'angular2-notifications';
import { HttpModule, JsonpModule } from '@angular/http';

import { MessageService } from '../message';
import { ActivityService } from '../activity';
import { RequestService } from '.';

describe('RequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        JsonpModule
      ],
      providers: [
        NotificationsService,
        ActivityService,
        MessageService,
        RequestService
      ]
    });
  });

  it('should ...', inject([RequestService], (service: RequestService) => {
    expect(service).toBeTruthy();
  }));
});
