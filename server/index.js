import { createReadStream } from 'fs';
import { stripIndents } from 'common-tags';
import { exec } from 'child_process';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import Koa from 'koa';
import Router from 'koa-router';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Html from '../app/components/Html';
import defaults from '../config.example';

let config = defaults;

new Promise(resolve => {
    config = require('../config').default;

    resolve();
})
.catch(async () => {
    try {
        await new Promise((resolve, reject) => {
            exec('cp config.example.js config.js', error => {
                if (error) {
                    return reject(error);
                }

                resolve();
            });
        });

        // eslint-disable-next-line no-console
        console.info('No config file found, created new config.js');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed trying to create config.js', error);
    }
})
.then(() => {
    return new Promise((resolve, reject) => {
        const compiler = webpack(webpackConfig);

        compiler.run((err, stats) => {
            stats = stats.toJson({
                hash: true
            });

            if (stats.errors.length) {
                return reject(stats.errors);
            }

            resolve(stats);
        });
    });
})
.then(bundle => {
    const app = new Koa;
    const router = new Router;

    router.get('/', async function() {
        const document = renderToString(
            <Html
                scriptUrl={`/static/${bundle.assetsByChunkName.client}`}
            />
        );

        this.body = stripIndents`
            <!doctype html>
            ${document}
        `;

        this.status = 200;
    });

    router.get('/static/*', async function() {
        this.body = createReadStream(`./build/${this.params[0]}`);
    });

    app.use(router.routes());

    const {
        port
    } = config;

    app.listen(port);

    // eslint-disable-next-line no-console
    console.info(`App running at localhost:${port}`);
});
