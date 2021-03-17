import fetchHook from '../hooks/fetch-hook';

export type KeyValue<T, U> = {
    key: T,
    value: U,
};

export type APIMethod = "POST" | "GET" | "LOCAL";

export class APIService {
    private _method: APIMethod = "GET";
    private _headers: string[][] = [];
    private _body: any = {};
    private _url: string = "";

    get headers(): string[][] {
        return this._headers
    }

    public setHeaders(headers: KeyValue<string, string>[]): APIService {
        for (const i in headers) {
            if (headers[i].hasOwnProperty('key') && headers[i].hasOwnProperty('value'))
                this._headers.push([headers[i].key, headers[i].value]);
        }

        return this;
    }

    public setMethod(method: APIMethod): APIService {
        this._method = method;

        return this;
    }

    public setBody (body: any): APIService {
        this._body = body;

        return this;
    }

    public setURL(url: string): APIService {
        this._url = url;

        return this;
    }

    public execute() {
        let request: any = {
            headers: this._headers,
            method: this._method,
            body: (this._body && Object.keys(this._body).length > 0 ? this._body : null)
        };
        return fetchHook(this._url, request);
    }
}

export default APIService;