const fs = require('fs');
const path = require('path');
const { HTTP_STATUS } = require('../config/constants');

const moduleRegistry = {
  modules: new Map(),
};

function registerModule(name, options = {}) {
  const {
    prefix = `/${name}`,
    routes = null,
    middleware = [],
    enabled = true,
  } = options;

  moduleRegistry.modules.set(name, {
    name,
    prefix,
    routes,
    middleware,
    enabled,
    registeredAt: new Date().toISOString(),
  });
}

function getModule(name) {
  return moduleRegistry.modules.get(name) || null;
}

function getRegisteredModules() {
  const modules = [];
  moduleRegistry.modules.forEach((mod) => {
    modules.push({
      name: mod.name,
      prefix: mod.prefix,
      enabled: mod.enabled,
      registeredAt: mod.registeredAt,
    });
  });
  return modules;
}

function loadModulesFromDirectory(modulesDir, router) {
  if (!fs.existsSync(modulesDir)) {
    console.log('  Modules directory not found, skipping module loading.');
    return;
  }

  const entries = fs.readdirSync(modulesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const moduleName = entry.name;
    const moduleDir = path.join(modulesDir, moduleName);
    const routesFile = path.join(moduleDir, 'routes.js');
    const indexFile = path.join(moduleDir, 'index.js');

    let moduleConfig = {};
    if (fs.existsSync(indexFile)) {
      moduleConfig = require(indexFile);
    }

    const isDisabled = moduleConfig.enabled === false;
    if (isDisabled) {
      console.log(`  [SKIP]  Module "${moduleName}" is disabled.`);
      continue;
    }

    const prefix = moduleConfig.prefix || `/${moduleName}`;
    const middleware = moduleConfig.middleware || [];

    if (fs.existsSync(routesFile)) {
      const loadRoute = require(routesFile);

      if (typeof loadRoute === 'function') {
        const subRouter = require('express').Router();

        if (middleware.length > 0) {
          subRouter.use(...middleware);
        }

        loadRoute(subRouter);
        router.use(prefix, subRouter);

        registerModule(moduleName, { prefix, routes: true, middleware, enabled: true });

        console.log(`  [OK]    Module "${moduleName}" loaded at ${prefix}`);
      }
    } else {
      registerModule(moduleName, { prefix, routes: false, enabled: true });
      console.log(`  [SKIP]  Module "${moduleName}" has no routes.js`);
    }
  }
}

function modulesHealthCheck() {
  const modules = [];
  moduleRegistry.modules.forEach((mod) => {
    modules.push({
      name: mod.name,
      prefix: mod.prefix,
      enabled: mod.enabled,
    });
  });
  return {
    total: modules.length,
    enabled: modules.filter((m) => m.enabled).length,
    modules,
  };
}

module.exports = {
  registerModule,
  getModule,
  getRegisteredModules,
  loadModulesFromDirectory,
  modulesHealthCheck,
  HTTP_STATUS,
};
