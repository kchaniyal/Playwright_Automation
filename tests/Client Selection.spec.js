const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const ProjectUrl = require('../playwright.config').use.url;
const username = 'ustaxpsgtoscasvc@deloitte.com';
const userID = 'ustaxpsgtoscasvc';
const password = 'WDekq62SNN1%XuBo(yRt';
const clientName = 'QA Automation Global';
const importName = 'Yearly';
const entity = '0218_Entity_Lower';
const Import_Type = 'Import_Yearly';
const downloadDirectory = require('../playwright.config').use.downloadsPath;
fs.mkdirSync(downloadDirectory, { recursive: true });

test.skip('Login and select client', async ({page}) => {
    

    await page.goto(ProjectUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const usernameInput = page.locator('input[type="email"], input[name="loginfmt"], input[data-report-event="Signin_Email_Phone_Skype"]').first();
    const submitBtn = page.locator('input[type="submit"], input[data-report-event="Signin_Submit"]').first();

    await expect(usernameInput).toBeVisible({ timeout: 15000 });
    await usernameInput.fill(username);
    await submitBtn.click();

    const passwordInput = page.locator('input[type="password"], input[name="passwd"]').first();
    await expect(passwordInput).toBeVisible({ timeout: 15000 });
    await passwordInput.fill(password);
    await submitBtn.click();

    const bannerCloseBtn = page.locator('button[aria-label="Close"]').first();
    await expect(bannerCloseBtn).toBeVisible({ timeout: 15000 });
    await bannerCloseBtn.click();

    //Client Selection Starts
    await expect(page).toHaveTitle(/.*Client*/);
    const comboBox = page.locator('kendo-dropdownlist[role="combobox"], input[aria-haspopup="listbox"]').first();
    await expect(comboBox).toBeVisible({ timeout: 15000 });
    await comboBox.click();
    await page.locator(`.k-list-item:has-text("${clientName}")`).click();

    const continueBtn = page.locator('input[type="submit"], input[name="button"], button:has-text("Continue")').first();
    await expect(continueBtn).toBeVisible({ timeout: 15000 });
    await continueBtn.click();
    await expect(page).toHaveTitle(/.*Dashboard*/);
    //Client Selection Ends
});

test('Yearly Import Download and Upload', async ({page}) => {
    
    // let singleEntityLevelImport = true;
    //CLear the download directory before starting the test
    const files = fs.readdirSync(downloadDirectory);
    files.forEach((file) => {
        fs.unlinkSync(path.join(downloadDirectory, file));
    });

    await page.goto(ProjectUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const usernameInput = page.locator('input[type="email"], input[name="loginfmt"], input[data-report-event="Signin_Email_Phone_Skype"]').first();
    const submitBtn = page.locator('input[type="submit"], input[data-report-event="Signin_Submit"]').first();

    await expect(usernameInput).toBeVisible({ timeout: 15000 });
    await usernameInput.fill(username);
    await submitBtn.click();

    const passwordInput = page.locator('input[type="password"], input[name="passwd"]').first();
    await expect(passwordInput).toBeVisible({ timeout: 15000 });
    await passwordInput.fill(password);
    await submitBtn.click();

    const bannerCloseBtn = page.locator('button[aria-label="Close"]').first();
    await expect(bannerCloseBtn).toBeVisible();
    // await expect(bannerCloseBtn).toBeVisible({ timeout: 15000 });
    await bannerCloseBtn.click();

    //Client Selection Starts
    await expect(page).toHaveTitle(/.*Client*/);
    const comboBox = page.locator('kendo-dropdownlist[role="combobox"], input[aria-haspopup="listbox"]').first();
    await expect(comboBox).toBeVisible({ timeout: 15000 });
    await comboBox.click();
     await page.waitForTimeout(5000);

     if (!await page.locator(`.k-list-item:has-text("${clientName}")`).count() > 0) {
    await page.locator(`.k-list-item:has-text("${clientName}")`).click();
     }
     else {
    await comboBox.click(); 
    }

    const continueBtn = page.locator('input[type="submit"], input[name="button"], button:has-text("Continue")').first();
    await expect(continueBtn).toBeVisible({ timeout: 15000 });
    await continueBtn.click();
    await expect(page).toHaveTitle(/.*Dashboard*/);


    //Client Selection Ends

    //Yearly Import Download and Upload Starts
    await page.getByRole('combobox').filter({ hasText: /^Select an import\.\.\.$/ }).getByLabel('Select').click();

    await page.waitForTimeout(15000);
    await page.getByRole('searchbox', { name: 'Filter' }).fill(importName);
    await page.getByLabel('Options list').getByText(importName).click();
    
    const singleEntityControl = page.getByRole('combobox').filter({ hasText: /^Select an Entity$/ }).getByLabel('Select');
    if (await singleEntityControl.isVisible().catch(() => false)) {
        await singleEntityControl.click();
    }

    const multiEntityControl = page.getByRole('combobox').filter({ hasText: 'Select one or more Entities/Investments' }).getByLabel('Select');
    if (await multiEntityControl.isVisible().catch(() => false)) {
        await multiEntityControl.click();
    }
    
    await page.locator('xpath=/html/body/app-root/kendo-popup/div/div/div/div/div[1]/div[2]/kendo-textbox/input').click();
    await page.locator('xpath=/html/body/app-root/kendo-popup/div/div/div/div/div[1]/div[2]/kendo-textbox/input').fill(entity);
    await page.waitForTimeout(5000);
    expect(page.getByRole('option')).toContainText(entity);
    await page.locator('xpath=/html/body/app-root/kendo-popup/div/div/div/div/div[2]/div[1]/fieldset/div/kendo-listbox/div/div/div/ul').click();
    const closeButton = page.getByRole('button', { name: 'Close' });
    if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click();
    }

    const DownloadBtn = page.locator('input[type="submit"], input[name="downloadBtn"], button:has-text("Download")').first();
    await expect(DownloadBtn).toBeVisible({ timeout: 15000 });
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        DownloadBtn.click(),
    ]);
    const downloadedFileName = download.suggestedFilename();
    const savedFilePath = path.join(downloadDirectory, downloadedFileName);
    const ImportHistoryFileName = downloadedFileName.replace(/\.xlsx$/i, '');
    const ImportHistoryFileNameUpdated = ImportHistoryFileName.replace(/\downloadDirectory$/i, '');
    await download.saveAs(savedFilePath);
    expect(fs.existsSync(savedFilePath)).toBeTruthy();
    await expect(DownloadBtn).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveTitle(/.*Dashboard*/);
    await console.log(`Downloaded file saved at: ${savedFilePath}`);    
    await console.log(`ImportHistoryFileNameUpdated as: ${ImportHistoryFileNameUpdated}`);    
    await page.waitForTimeout(10000); // Wait for 2 seconds to ensure the selection is registered

    
    // const UploadCtrl = page.locator('input[type="file"]').first();
    const UploadCtrl = page.locator('xpath=//*[@id="dataloaduploadsection"]/div[1]/label').first();    
    await expect(UploadCtrl).toBeVisible({ timeout: 15000 });
    await UploadCtrl.setInputFiles(savedFilePath);
    await page.waitForTimeout(10000); 

    //Import Histries Tab Click
    // const ImportHistryTabBtn = 
    await page.getByText('Import History').click();//page.locator('button[role="tab"]:has-text("Import History")').first();
    // await expect(ImportHistryTabBtn).toBeVisible({ timeout: 20000 });
    // await ImportHistryTabBtn.click();
    // await page.waitForTimeout(50000);
    ////*[@id="dataloaduploadsection"]/div[1]/label
    const importHistoryTable = page.locator('table').first();
    await expect(page.locator('.k-loading-image')).toBeVisible();
    await expect(page.locator('.k-loading-image')).toBeHidden();
    await expect(importHistoryTable).toBeVisible();
    const RefreshBtn = page.locator('xpath=/html/body/app-root/div[1]/kendo-splitter/kendo-splitter-pane/div/div[2]/div/app-dashboard/div/div[1]/div[2]/div/div[2]/kendo-tabstrip/div[2]/div/app-import-history/div/div/app-upload-history/div/button').first();
    // const refreshBtn = page.locator(XPath='//*[@id="dataloaduploadsection"]/div[2]/div[1]/div[1]/div/div[2]/button').first();
    // /html/body/app-root/div[1]/kendo-splitter/kendo-splitter-pane/div/div[2]/div/app-dashboard/div/div[1]/div[2]/div/div[2]/kendo-tabstrip/div[2]/div/app-import-history/div/div/app-upload-history/div/button
    ////*[@id="k-tabstrip-tabpanel-9f34b594-f97f-49de-b908-57aff965ee90-1"]/div/app-import-history/div/div/app-upload-history/div/button
    // const importHistoryRow = importHistoryTable.locator('tbody tr').filter({ hasText: ("Entity Name") });

    // for (let i = 0; i < 10; i++) {
        
    //     await expect(RefreshBtn).toBeVisible();
    //     await RefreshBtn.click();
    //     await expect(page.locator('.k-loading-image')).toBeVisible();
    //     await expect(page.locator('.k-loading-image')).toBeHidden();
    //     await expect(importHistoryRow).toBeVisible();
    //     // await page.waitForTimeout(20000);
    //     if (await importHistoryRow.count() > 0) {
    //         await expect(importHistoryRow).toBeVisible();
    //         // await page.waitForTimeout(10000);
    //         // await expect(page.locator('div').filter({ hasText: /^ImportHistoryFileNameUpdated$/ })).toBeVisible();
    //         // await expect(page.getByText(/.*ImportHistoryFileNameUpdated*/)).toBeVisible();
    //         await expect(page.getByRole('gridcell', { name: userID }).first()).toBeVisible();
    //         await expect(page.getByRole('gridcell', { name: entity }).first()).toBeVisible();
    //         await expect(page.getByRole('gridcell', { name: ImportHistoryFileNameUpdated }).first()).toBeVisible();
    //         await expect(page.locator('.circle').first()).toBeVisible();
    //         break;
    //     }   
    // }
    
    // for (let i = 0; i < 100; i++) {
    //     await page.getByRole('gridcell').filter({ hasText: /^$/ }).nth(3).click();
        
    //     await expect(page.getByRole('gridcell', { name: 'Smoke2537DFEIE1_FedK1.csv', exact: true })).toBeVisible();
    //     await expect(page.getByRole('gridcell', { name: 'kchaniyal', exact: true })).toBeVisible();
    //     await expect(page.getByRole('gridcell', { name: '07/01/2026 6:30:42 AM', exact: true })).toBeVisible();
    // }

    
   //script to delete all the files from download directory
    const Downloadedfiles = fs.readdirSync(downloadDirectory);
    Downloadedfiles.forEach((file) => {
        fs.unlinkSync(path.join(downloadDirectory, file));
    });

    const importHistoryRows = page.locator('table').first().locator('tr').filter({ has: page.locator('td') });
    let matchedRowFound = false;
    const ImprtUpdtedCheck = 'Workflow Automation__05-18-26 05-40-21 10564'.toLowerCase();
    // for (let i = 0; i < 10; i++) {
        await expect(RefreshBtn).toBeVisible();
        await RefreshBtn.click();
        await expect(page.locator('.k-loading-image')).toBeVisible();
        await expect(page.locator('.k-loading-image')).toBeHidden();
        await page.waitForTimeout(5000);

        await expect(importHistoryRows.first()).toBeVisible({ timeout: 30000 });
        const rowCount = await importHistoryRows.count();
        console.log(`Total import history rows: ${rowCount}`);

        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            const rowText = (await importHistoryRows.nth(rowIndex).innerText()).trim().toLowerCase();
            const normalizedUserId = userID.toLowerCase();
            const normalizedFileName = ImportHistoryFileNameUpdated.toLowerCase();

            console.log(`Checking import history row ${rowIndex}: ${rowText}`);

            
            if (rowText.includes(normalizedUserId) && rowText.includes(ImprtUpdtedCheck)) {
                console.log(`Matched import history row ${rowIndex}: ${await importHistoryRows.nth(rowIndex).innerText()}`);
                matchedRowFound = true;
                
                break;
            }
            else {
                console.log(`No match found in row ${rowIndex}. Refreshing the import history table...`);
                await expect(RefreshBtn).toBeVisible();
                await RefreshBtn.click();
                await expect(page.locator('.k-loading-image')).toBeVisible();
                await expect(page.locator('.k-loading-image')).toBeHidden();
                }
            }
        // if (!matchedRowFound ) {

        // await expect(RefreshBtn).toBeVisible();
        // await RefreshBtn.click();
        // await expect(page.locator('.k-loading-image')).toBeVisible();
        // await expect(page.locator('.k-loading-image')).toBeHidden();
        // }
        

        // if (matchedRowFound) {
        //     break;
        // }

        
    

    // expect(matchedRowFound).toBeTruthy();

});

// test('Import History Section', async ({page}) => {
// const importHistoryTable = page.locator('table').first();
// const importHistoryRows = importHistoryTable.locator('tr');
// let matchedRowFound = false;

//     for (let i = 0; i < 10; i++) {
//         await expect(RefreshBtn).toBeVisible();
//         await RefreshBtn.click();
//         await expect(page.locator('.k-loading-image')).toBeVisible();
//         await page.waitForTimeout(20000);

//         const rowCount = await importHistoryRows.count();
//         for (let rowIndex = 1; rowIndex < rowCount; rowIndex++) {
//             const rowText = (await importHistoryRows.nth(rowIndex).innerText()).trim().toLowerCase();
//             const normalizedUserId = userID.toLowerCase();
//             const normalizedFileName = ImportHistoryFileNameUpdated.toLowerCase();
//             console.log(`Checking import history row ${rowIndex}: ${rowText}`);


//             if (rowText.includes(normalizedUserId) && rowText.includes(normalizedFileName)) {
//                 console.log(`Matched import history row ${rowIndex}: ${await importHistoryRows.nth(rowIndex).innerText()}`);
//                 matchedRowFound = true;
//                 break;
//             }
//         }

//         if (matchedRowFound) {
//             break;
//         }
//     }

//     expect(matchedRowFound).toBeTruthy();

// });