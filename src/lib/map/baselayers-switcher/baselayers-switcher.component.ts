import { Component, Input,
  AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Layer } from '../../layer';
import { IgoMap } from '../shared';
import { baseLayersSwitcherSlideInOut } from './baselayers-switcher.animation';

@Component({
  selector: 'igo-baselayers-switcher',
  templateUrl: './baselayers-switcher.component.html',
  styleUrls: ['./baselayers-switcher.component.styl'],
  animations: [
    baseLayersSwitcherSlideInOut()
  ]
})
export class BaseLayersSwitcherComponent implements AfterViewInit, OnDestroy {

  @Input()
  get map(): IgoMap { return this._map; }
  set map(value: IgoMap) {
    this._map = value;
  }
  private _map: IgoMap;

  public _baseLayers: Layer[] = [];
  public expand: boolean = false;

  private layers$$: Subscription;

  constructor() {}

  ngAfterViewInit() {
    this.layers$$ = this.map.layers$.subscribe((arrayLayers) => {
      this._baseLayers = arrayLayers.filter(l => l.baseLayer);
    });
  }

  ngOnDestroy() {
    this.layers$$.unsubscribe();
  }

  collapseOrExpand() {
    if (this.baseLayers.length > 1) {
      this.expand = !this.expand;
    } else {
      this.expand = false;
    }
  }

  get baseLayers(): Layer[] {
    const mapResolution = this.map.resolution$.value;

    const bl = this._baseLayers.filter(l => {
      return (!l.options.view.maxResolution || mapResolution <= l.options.view.maxResolution) &&
             (!l.options.view.minResolution || mapResolution >= l.options.view.minResolution);
    });

    const blHidden = bl.filter(l => !l.visible);
    return (blHidden.length + 1) ===  bl.length ? blHidden : bl;
  }
}
