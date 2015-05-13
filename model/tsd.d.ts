/// <reference path="parties.ts" />
/// <reference path="../typings/tsd.d.ts" />

// tmeasday:publish-counts beginning ...

declare var Counts: CountsStatic

interface CountsStatic extends Mongo.Collection<CountsContent> {
	publish(me?: any, name?: string, cursor?: Mongo.Cursor<any>, options?: any): void;
}

interface CountsContent {
	count: number;
}

// ... tmeasday:publish-counts end