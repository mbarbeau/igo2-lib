import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';


export enum SubjectStatus {
  Error = 0,
  Done = 1,
  Working = 2,
  Waiting = 3
}

export abstract class Watcher {

  public status$ = new Subject<SubjectStatus>();
  protected status$$: Subscription;

  get status(): SubjectStatus { return this._status; }
  set status(value: SubjectStatus) {
    this._status = value;
    this.status$.next(value);
  }
  private _status: SubjectStatus;

  protected abstract watch();

  protected abstract unwatch();

  subscribe(callback: Function, scope?: any) {
    this.watch();

    this.status$$ = this.status$
      .distinctUntilChanged()
      .subscribe((status: SubjectStatus) => {
        this.handleStatusChange(status);
        callback.call(scope, this);
      });
  };

  unsubscribe() {
    this.unwatch();
    if (this.status$$ !== undefined) {
      this.status$$.unsubscribe();
      this.status$$ = undefined;
    }
    this.status = SubjectStatus.Waiting;
  }

  protected handleStatusChange(status: SubjectStatus) {}

}
