// MIT License
//
// Copyright 2018 Electric Imp
//
// SPDX-License-Identifier: MIT
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
// OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

'use strict';

require('jasmine-expect');

const Shell = require('shelljs');
const FS = require('fs');
const config = require('../config');
const ImptTestHelper = require('../ImptTestHelper');

const PRODUCT_NAME = '__impt_product';
const DG_NAME = '__impt_dg';
const DG_DESCR = 'impt temp dg description';

// Helper class for testing impt project command group.
// Contains common methods for testing environment initialization and cleanup,
// running impt commands, check commands output, ...
class ImptProjectTestHelper {
    static get DEVICE_FILE() {
        return 'device.nut';
    }

    static get AGENT_FILE() {
        return 'agent.nut';
    }

    // check command`s result by exec project info command
    static checkProjectInfo(expectInfo) {
        return ImptTestHelper.runCommandEx(`impt project info -z json`, (commandOut) => {
            const json = JSON.parse(commandOut.output);
            expect(json.Project).toBeDefined;
            expect(json.Project['Device file']).toBe(expectInfo && expectInfo.dfile ? expectInfo.dfile : ImptProjectTestHelper.DEVICE_FILE);
            expect(json.Project['Agent file']).toBe(expectInfo && expectInfo.afile ? expectInfo.afile : ImptProjectTestHelper.AGENT_FILE);
            expect(json.Project['Device Group'].id).toBe(expectInfo && expectInfo.dg_id ? expectInfo.dg_id : json.Project['Device Group'].id);
            expect(json.Project['Device Group'].type).toBe('development');
            expect(json.Project['Device Group'].name).toBe(expectInfo && expectInfo.dg_name ? expectInfo.dg_name : DG_NAME);
            expect(json.Project['Device Group'].description).toBe(expectInfo && expectInfo.dg_descr ? expectInfo.dg_descr : DG_DESCR);
            expect(json.Project['Device Group'].Product.id).toBe(expectInfo && expectInfo.product_id ? expectInfo.product_id : json.Project['Device Group'].Product.id);
            expect(json.Project['Device Group'].Product.name).toBe(expectInfo && expectInfo.product_name ? expectInfo.product_name : PRODUCT_NAME);
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        });
    }

    // Checks if device and agent files exists
    static checkDeviceAgentFilesExists(expFiles) {
        ImptTestHelper.checkFileExist(expFiles && expFiles.dfile ? expFiles.dfile : ImptProjectTestHelper.DEVICE_FILE);
        ImptTestHelper.checkFileExist(expFiles && expFiles.afile ? expFiles.afile : ImptProjectTestHelper.AGENT_FILE);
    }

    // Checks if device and agent files not exists
    static checkDeviceAgentFilesNotExists(expFiles) {
        ImptTestHelper.checkFileNotExist(expFiles && expFiles.dfile ? expFiles.dfile : ImptProjectTestHelper.DEVICE_FILE);
        ImptTestHelper.checkFileNotExist(expFiles && expFiles.afile ? expFiles.afile : ImptProjectTestHelper.AGENT_FILE);
    }

    // Checks if project`s entities exists
    static checkProjectsEntitiesExists(expEntities) {
        return ImptTestHelper.runCommandEx(`impt product info -p ${expEntities && expEntities.product_name ? expEntities.product_name : PRODUCT_NAME}`,
            ImptTestHelper.checkSuccessStatusEx).
            then(() => ImptTestHelper.runCommandEx(`impt dg info -g ${expEntities && expEntities.dg_name ? expEntities.dg_name : DG_NAME}`,
                ImptTestHelper.checkSuccessStatusEx));
    }

    // Checks if project`s entities not exists
    static checkProjectsEntitiesNotExists(expEntities) {
        return ImptTestHelper.runCommandEx(`impt product info -p ${expEntities && expEntities.product_name ? expEntities.product_name : PRODUCT_NAME}`,
            ImptTestHelper.checkFailStatusEx).
            then(() => ImptTestHelper.runCommandEx(`impt dg info -g ${expEntities && expEntities.dg_name ? expEntities.dg_name : DG_NAME}`,
                ImptTestHelper.checkFailStatusEx));
    }
}

module.exports = ImptProjectTestHelper;
