import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the service title and phone number', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('REMORQUAGE');
    expect(compiled.querySelectorAll('h1')).toHaveLength(1);
    expect(compiled.textContent).toContain('21 533 933');
  });

  it('should expose valid local business structured data', () => {
    TestBed.createComponent(App);
    const schema = document.head.querySelector<HTMLScriptElement>(
      '#local-business-schema',
    );
    const data = JSON.parse(schema?.textContent ?? '{}');

    expect(data['@type']).toBe('AutomotiveBusiness');
    expect(data.telephone).toBe('+21621533933');
    expect(data.areaServed).toHaveLength(6);
  });
});
