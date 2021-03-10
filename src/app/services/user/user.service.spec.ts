import { TestBed, ComponentFixture } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { promise } from 'selenium-webdriver';


describe('UserService', () => {
  let service: UserService;
  let fixture: ComponentFixture<UserService>;
  let serviceSpy: jasmine.SpyObj<UserService>;
  let reject;
  let resolve;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
    reject = jasmine.createSpy('reject');

    resolve = jasmine.createSpy('resolve');

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should turn 404 into a user-friendly error', () => {
    const msg = 'Deliberate 404';
    service.getUserInfo().subscribe(
      error => expect(error).toContain(msg)
    );
  });

  it('getLocation should resolve with geolocation when...', function() {

    service.getLocation().then(resolve, reject);

    expect(resolve).toBeDefined();
    expect(reject).not.toHaveBeenCalled();
  });

  it('getLocation should reject with geolocation when...', function() {

    service.getLocation().then(resolve, reject);

    expect(resolve).not.toHaveBeenCalled();
    expect(reject).toBeDefined();
  });
});
