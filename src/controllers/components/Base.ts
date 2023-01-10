// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {Request, Response} from "express";
import {HierarchicalDataTable, HierarchicalDataRow, ActionType, Input} from "../helpers/DatabaseHelper";
import {ValidationHelper} from "../helpers/ValidationHelper";
import {RenderHelper} from "../helpers/RenderHelper";
import {DataTableSchema, SchemaHelper} from "../helpers/SchemaHelper";
import {ProjectConfigurationHelper} from "../helpers/ProjectConfigurationHelper";
import geoip from "geoip-lite";

class Base {
  protected request: Request;
  protected response: Response;
  protected template: string;
  protected pageId: string;

  constructor(request: Request, response: Response, template: string) {
    this.request = request;
    this.response = response;
    this.template = template;
    this.pageId = template.split("/").splice(-1, 1)[0].replace(/_/g, "");

    if (this.request.query.lang) {
      this.response.locals.lang = this.request.query.lang;
    } else {
      let ip: string = (this.request.headers && this.request.headers['x-forwarded-for'] && this.request.headers['x-forwarded-for'].toString()) || (this.request.connection && this.request.connection.remoteAddress && this.request.connection.remoteAddress.toString());
      ip = ip.split(',')[0];
      if (ip && ip.startsWith('::ffff:')) ip = ip.substr(7);

      const geo = geoip.lookup(ip);
      this.response.locals.lang = geo && geo.country && geo.country.toLowerCase() || 'en';
    }
  }

  protected perform(action: ActionType, schema: DataTableSchema, data: Input[]) {
    SchemaHelper.verifyNotations(ProjectConfigurationHelper.getDotNotationPossibilities(this.pageId), ProjectConfigurationHelper.getDataSchema());

    this.call(action, schema, data).catch((error) => {
      RenderHelper.error(this.response, error);
    });
  }

  private async call(action: ActionType, schema: DataTableSchema, data: Input[]) {
    if (action != ActionType.Retrieve) {
      this.validate(data);
    }

    switch (action) {
      case ActionType.Insert:
        RenderHelper.json(this.response, await this.insert(data, schema));
        break;
      case ActionType.Update:
        RenderHelper.json(this.response, await this.update(data, schema));
        break;
      case ActionType.Upsert:
        RenderHelper.json(this.response, await this.upsert(data, schema));
        break;
      case ActionType.Delete:
        RenderHelper.json(this.response, await this.remove(data, schema));
        break;
      case ActionType.Retrieve:
        RenderHelper.json(this.response, await this.retrieve(data, schema));
        break;
      case ActionType.Popup:
        RenderHelper.json(this.response, await this.retrieve(data, schema));
        break;
      case ActionType.Navigate:
        RenderHelper.navigate(this.response, await this.navigate(data, schema));
        break;
      case ActionType.Test:
        RenderHelper.json(this.response, await this.get(data));
        break;
      default:
        this.response.cookie('lang', this.response.locals.lang);

        switch (this.request.method) {
          case "GET":
            RenderHelper.page(this.response, this.template, await this.get(data), await this.accessories(data));
            break;
          case "POST":
            RenderHelper.page(this.response, this.template, await this.post(data), await this.accessories(data));
            break;
          case "PUT":
            RenderHelper.page(this.response, this.template, await this.put(data), await this.accessories(data));
            break;
          case "DELETE":
            RenderHelper.page(this.response, this.template, await this.delete(data), await this.accessories(data));
            break;
        }
        break;
    }
  }

  protected validate(data: Input[]): void {
    ValidationHelper.validate(data);
  }

  protected async accessories(data: Input[]): Promise<any> {
    return new Promise((resolve) => {
      resolve({});
    });
  }

  protected async get(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise((resolve) => {
      resolve({});
    });
  }

  protected async post(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise((resolve) => {
      resolve({});
    });
  }

  protected async put(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise((resolve) => {
      resolve({});
    });
  }

  protected async delete(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise((resolve) => {
      resolve({});
    });
  }

  protected async insert(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    throw new Error("Not Implemented Error");
  }

  protected async update(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    throw new Error("Not Implemented Error");
  }

  protected async upsert(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    throw new Error("Not Implemented Error");
  }

  protected async retrieve(data: Input[], schema: DataTableSchema): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    throw new Error("Not Implemented Error");
  }

  protected async remove(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    throw new Error("Not Implemented Error");
  }

  protected async navigate(data: Input[], schema: DataTableSchema): Promise<string> {
    throw new Error("Not Implemented Error");
  }
}

export {Base};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.