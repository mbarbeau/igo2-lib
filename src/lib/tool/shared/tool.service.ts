import { Injectable, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { RequestService, ConfigService } from '../../core';
import { AuthHttp } from '../../auth';
import { Tool } from './tool.interface';

export function Register(toolDef: Tool) {
  return function(cls) {
    ToolService.register(toolDef, cls);
  };
}

@Injectable()
export class ToolService {

  static toolDefs: {[key: string]: [Tool, Component]} = {};

  public tools$ = new BehaviorSubject<{[key: string]: Tool}>({});
  public toolHistory$ = new BehaviorSubject<Tool[]>([]);
  public selectedTool$ = new BehaviorSubject<Tool>(undefined);
  private baseUrl: string;

  static register(tool: Tool, cls?: Component) {
    ToolService.toolDefs[tool.name] = [Object.assign({}, tool), cls];
  }

  constructor(private authHttp: AuthHttp,
              private requestService: RequestService,
              private config: ConfigService) {

    this.baseUrl = this.config.getConfig('context.url');

    this.tools$.subscribe(tools => this.handleToolsChange());

    const tools = Object.keys(ToolService.toolDefs).map(name => {
      return {name: name};
    });
    this.setTools(tools);
  }

  get(): Observable<Tool[]> {
    const url = this.baseUrl + '/tools';
    const request = this.authHttp.get(url);
    return this.requestService.register(request, 'Get tools error')
      .map((res) => {
        const tools: Tool[] = res.json();
        return tools;
      });
  }

  setTools(tools: Tool[]) {
    const _tools = {};
    tools.forEach(tool => {
      const toolDef = ToolService.toolDefs[tool.name];
      const baseTool = toolDef ? toolDef[0] : {};
      _tools[tool.name] = Object.assign({}, baseTool, tool);
    });

    this.tools$.next(_tools);
  }

  getTool(name: string): Tool {
    return this.tools$.value[name];
  }

  getToolClass(name: string) {
    const toolDef = ToolService.toolDefs[name];

    return toolDef === undefined ? undefined : toolDef[1];
  }

  selectTool(tool: Tool, force = false) {
    const selectedTool = this.selectedTool$.value;
    if (!force && selectedTool && tool.name === selectedTool.name) {
      return;
    }

    const toolHistory = this.toolHistory$.value
      .filter(t => t.name !== tool.name)
      .concat([Object.assign({}, tool)]);

    this.toolHistory$.next(toolHistory);
    this.selectedTool$.next(toolHistory[toolHistory.length - 1]);
  }

  selectPreviousTool() {
    const toolHistory = this.toolHistory$.value.slice(0, -1);

    this.toolHistory$.next(toolHistory);
    this.selectedTool$.next(toolHistory[toolHistory.length - 1]);
  }

  unselectTool() {
    this.toolHistory$.next([]);
    this.selectedTool$.next(undefined);
  }

  private handleToolsChange() {
    const selectedTool = this.selectedTool$.value;
    if (selectedTool === undefined) { return; }

    const tool = this.getTool(selectedTool.name);
    if (tool === undefined) {
      this.unselectTool();
    } else {
      // Force a reselect of the tool even if it's the same
      // to trigger changes in every components that observe
      // selectedTool$ or toolHistory$
      this.selectTool(tool, true);
    }
  }
}
