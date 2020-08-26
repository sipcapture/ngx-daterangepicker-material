"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("@angular-devkit/schematics/tasks");
const package_config_1 = require("./package-config");
// Just return the tree
function default_1(_options) {
    return (tree, _context) => {
        const angularVersionRange = package_config_1.getPackageVersionFromPackageJson(tree, '@angular/core');
        const materialVersionRange = package_config_1.getPackageVersionFromPackageJson(tree, '@angular/material');
        const cdkVersionRange = package_config_1.getPackageVersionFromPackageJson(tree, '@angular/cdk');
        const [version, major] = angularVersionRange.split('.');
        // fallback material version
        const fallbackMaterialVersionRange = version.replace('~', '^') + '.' + major + '.0';
        // Add @angular/material if the package isn't installed yet
        if (materialVersionRange === null) {
            package_config_1.addPackageToPackageJson(tree, '@angular/material', fallbackMaterialVersionRange);
        }
        // Add @angular/cdk if the package isn't installed yet
        if (cdkVersionRange === null) {
            package_config_1.addPackageToPackageJson(tree, '@angular/cdk', materialVersionRange || fallbackMaterialVersionRange);
        }
        // add angular/forms
        package_config_1.addPackageToPackageJson(tree, '@angular/forms', angularVersionRange);
        const installTaskId = _context.addTask(new tasks_1.NodePackageInstallTask());
        _context.addTask(new tasks_1.RunSchematicTask('ng-add-setup-project', _options), [installTaskId]);
        return tree;
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map