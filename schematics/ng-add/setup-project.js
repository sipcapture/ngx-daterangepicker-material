"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const config_1 = require("@schematics/angular/utility/config");
const theming_1 = require("./theming/theming");
const moduleName = 'NgxDaterangepickerMd';
/**
 * Scaffolds the basics of a Angular Material application, this includes:
 *  - Add Packages to package.json
 *  - Adds pre-built themes to styles.ext
 *  - Adds Browser Animation to app.module
 */
function default_1(options) {
    return schematics_1.chain([
        addDateRangePickerModule(options),
        theming_1.addThemeToAppStyles(options)
    ]);
}
exports.default = default_1;
/**
 * Adds an animation module to the root module of the specified project. In case the "animations"
 * option is set to false, we still add the `NoopAnimationsModule` because otherwise various
 * components of Angular Material will throw an exception.
 */
function addDateRangePickerModule(options) {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
        schematics_2.addModuleImportToRootModule(host, moduleName + '.forRoot()', 'ngx-daterangepicker-material', project);
        return host;
    };
}
//# sourceMappingURL=setup-project.js.map