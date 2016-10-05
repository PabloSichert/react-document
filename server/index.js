import { createReadStream } from 'fs';
import { stripIndents } from 'common-tags';
import { exec } from 'child_process';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import Koa from 'koa';
import Router from 'koa-router';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../app/routes';
import App from '../app/components/App';
import defaults from '../config.example';

let config = defaults;

(async () => {
    try {
        config = require('../config').default;
    } catch (error) {
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
    }

    const compiler = webpack(webpackConfig);

    const bundle = await new Promise((resolve, reject) => {
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

    const app = new Koa;
    const router = new Router;

    router.get('/*', async function(next) {
        if (next instanceof Promise) {
            return next;
        }

        const {
            status,
            body,
            redirect
        } = await new Promise(resolve => {
            match({
                routes,
                location: this.url
            }, (error, redirectLocation, renderProps) => {
                if (error) {
                    resolve({
                        status: 500,
                        body: error.message
                    });
                } else if (redirectLocation) {
                    resolve({
                        status: 302,
                        redirect: redirectLocation.pathname + redirectLocation.search
                    });
                } else if (renderProps) {
                    const document = renderToString(
                        <App
                            scriptUrl={`/static/${bundle.assetsByChunkName.client}`}
                        >
                            <RouterContext
                                {...renderProps}
                            />
                        </App>
                    );

                    const notFound = renderProps.routes.some(({ path }) =>
                        path === '*'
                    );

                    resolve({
                        status: notFound ? 404 : 200,
                        body: stripIndents`
                            <!doctype html>
                            ${document}
                        `
                    });
                }
            });
        });

        this.status = status;
        this.body = body;
        this.redirect = redirect;
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
})();
