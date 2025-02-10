import { TestBed } from '@angular/core/testing';
import { ResponseService } from '@app_services';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '@app_services';
import { SocketService } from '@app_services';

describe('ResponseService - uploadFile', () => {
  let service: ResponseService;
  let httpMock: HttpTestingController;
  let configService: jasmine.SpyObj<ConfigService>;
  let socketService: jasmine.SpyObj<SocketService>;

  beforeEach(() => {
    const configSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);
    const socketSpy = jasmine.createSpyObj('SocketService', [], { socket: { id: 'mockSocketId' } });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ResponseService,
        { provide: ConfigService, useValue: configSpy },
        { provide: SocketService, useValue: socketSpy }
      ],
    });

    service = TestBed.inject(ResponseService);
    httpMock = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    socketService = TestBed.inject(SocketService) as jasmine.SpyObj<SocketService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send a POST request with correct FormData', () => {
    const mockFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const mockEnvConfig = { baseUrl: 'http://localhost:3000' };
    configService.getConfig.and.callFake((key) => key === 'envConfig' ? mockEnvConfig : 'mockChatId');

    service.uploadFile(mockFile).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/genesys/uploadFile');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();

    const formData = req.request.body as FormData;
    expect(formData.get('file')).toBe(mockFile);
    expect(formData.get('fileName')).toBe(mockFile.name);
    expect(formData.get('fileType')).toBe(mockFile.type);
    expect(formData.get('chatId')).toBe('mockChatId');
    expect(formData.get('socketId')).toBe('mockSocketId');

    req.flush({});
  });

  it('should handle missing envConfig and default to 0', () => {
    const mockFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    configService.getConfig.and.returnValue(null);

    service.uploadFile(mockFile).subscribe();

    const req = httpMock.expectOne('/api/genesys/uploadFile'); // Defaulting to invalid URL
    expect(req.request.method).toBe('POST');

    req.flush({});
  });

  it('should handle missing chatId', () => {
    const mockFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const mockEnvConfig = { baseUrl: 'http://localhost:3000' };
    configService.getConfig.and.callFake((key) => key === 'envConfig' ? mockEnvConfig : null);

    service.uploadFile(mockFile).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/genesys/uploadFile');
    expect(req.request.method).toBe('POST');

    const formData = req.request.body as FormData;
    expect(formData.get('chatId')).toBeNull();

    req.flush({});
  });

  it('should handle missing socketId', () => {
    const mockFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const mockEnvConfig = { baseUrl: 'http://localhost:3000' };
    socketService.socket.id = null;
    configService.getConfig.and.callFake((key) => key === 'envConfig' ? mockEnvConfig : 'mockChatId');

    service.uploadFile(mockFile).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/genesys/uploadFile');
    expect(req.request.method).toBe('POST');

    const formData = req.request.body as FormData;
    expect(formData.get('socketId')).toBeNull();

    req.flush({});
  });
});
