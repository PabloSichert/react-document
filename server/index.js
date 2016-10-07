import { createReadStream } from 'fs';
import { stripIndents } from 'common-tags';
import { exec } from 'child_process';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import Koa from 'koa';
import Router from 'koa-router';
import logger from './logger';
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

        const runRoutes = config => new Promise((resolve, reject) => {
            match(config, (error, redirectLocation, renderProps) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    redirectLocation,
                    renderProps
                });
            });
        });

        try {
            const {
                redirectLocation,
                renderProps
            } = await runRoutes({
                routes,
                location: this.url
            });

            if (redirectLocation) {
                const {
                    pathname,
                    search
                } = redirectLocation;

                this.status = 302;
                this.redirect = pathname + search;
            } else if (renderProps) {
                const document = renderToString(
                    <App
                        scriptUrl={`/static/${bundle.assetsByChunkName.client}`}
                        protocol={this.protocol}
                        host={this.host}
                    >
                        <RouterContext
                            {...renderProps}
                        />
                    </App>
                );

                const notFound = renderProps.routes.some(({ path }) =>
                    path === '*'
                );

                this.status = notFound ? 404 : 200,
                this.body = stripIndents`
                    <!doctype html>
                    ${document}
                `;
            }
        } catch (error) {
            this.status = 500;
            this.body = stripIndents`
                ${error.message}

                ${error.stack}
            `;
        }
    });

    router.get('/static/*', async function() {
        this.body = createReadStream(`./build/${this.params[0]}`);
    });

    app.use(logger());

    app.use(router.routes());

    const {
        port
    } = config;

    app.listen(port);

    // eslint-disable-next-line no-console
    console.info(`App running at localhost:${port}`);
})();
