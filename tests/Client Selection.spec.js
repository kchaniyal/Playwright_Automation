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
const Reportentity = '0218_Entity_Middle';
const Import_Type = 'Import_Yearly';
const downloadDirectory = require('../playwright.config').use.downloadsPath;
const ReportName = 'Schedule K Equivalent';

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

test.skip('Yearly Import Download and Upload', async ({page}) => {
    
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

    const UploadCtrl = page.locator('xpath=//*[@id="dataloaduploadsection"]/div[1]/label').first();    
    await expect(UploadCtrl).toBeVisible({ timeout: 15000 });
    await UploadCtrl.setInputFiles(savedFilePath);
    await page.waitForTimeout(10000); 

    await page.getByText('Import History').click();//page.locator('button[role="tab"]:has-text("Import History")').first();
    
    const importHistoryTable = page.locator('xpath=/html/body/app-root/div[1]/kendo-splitter/kendo-splitter-pane/div/div[2]/div/app-dashboard/div/div[1]/div[2]/div/div[2]/kendo-tabstrip/div[2]/div/app-import-history/div/div/app-upload-history/div/kendo-grid').first();
    
    await expect(importHistoryTable).toBeVisible();    
    await expect(page.locator('.k-loading-image')).toBeVisible();
    await expect(page.locator('.k-loading-image')).toBeHidden();
    await expect(importHistoryTable).toBeVisible();
    const importHistoryRows = importHistoryTable.locator('tbody tr');
    
    const RefreshBtn = page.locator('xpath=/html/body/app-root/div[1]/kendo-splitter/kendo-splitter-pane/div/div[2]/div/app-dashboard/div/div[1]/div[2]/div/div[2]/kendo-tabstrip/div[2]/div/app-import-history/div/div/app-upload-history/div/button').first();
    
   //script to delete all the files from download directory
    const Downloadedfiles = fs.readdirSync(downloadDirectory);
    Downloadedfiles.forEach((file) => {
        fs.unlinkSync(path.join(downloadDirectory, file));
    });

    //Code section to verify uploaded file in import history table
    let matchedRowFound = false;
    const ImportedFileCheck = ImportHistoryFileNameUpdated.toLowerCase();
        await expect(RefreshBtn).toBeVisible();
        await RefreshBtn.click();
        await expect(page.locator('.k-loading-image')).toBeVisible();
        await expect(page.locator('.k-loading-image')).toBeHidden();
        await page.waitForTimeout(5000);

        const rowCount = await importHistoryRows.count();
        console.log(`Total import history rows: ${rowCount}`);

        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            const rowText = (await importHistoryRows.nth(rowIndex).innerText()).trim().toLowerCase();
            const normalizedUserId = userID.toLowerCase();
            const normalizedFileName = ImportHistoryFileNameUpdated.toLowerCase();

            console.log(`Checking import history row ${rowIndex}: ${rowText}`);

            
            if (rowText.includes(normalizedUserId) && rowText.includes(ImportedFileCheck)) {
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
});

test.skip('Download Entity Level Report', async ({page}) => {
    
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
    //Client Selection Ends

    //Dashboard loading wait
    await expect(page).toHaveTitle(/.*Dashboard*/);
    await expect(page.locator('.k-loading-image')).toBeVisible();
    await expect(page.locator('.k-loading-image')).toBeHidden();
    await page.waitForTimeout(5000);

    //Entity selection from dashboard Grid section
    await page.getByRole('link', { name: 'Entity Identification Filter' }).click();
    await expect(page.getByRole('textbox', { name: 'Entity Identification Filter' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Entity Identification Filter' }).click();
    await page.getByRole('textbox', { name: 'Entity Identification Filter' }).fill(entity);
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(page.locator('.k-loading-image')).toBeVisible();
    await expect(page.locator('.k-loading-image')).toBeHidden();
    
    const ActionButton = page.locator('xpath=/html/body/app-root/div[1]/kendo-splitter/kendo-splitter-pane/div/div[2]/div/app-dashboard/div/div[2]/div/div/div[2]/kendo-tabstrip/div[2]/div/app-entity-grid/kendo-grid/div[1]/kendo-grid-list/div/div/table/tbody/tr/td[2]/kendo-toolbar/kendo-dropdownbutton/button/span[1]').first();
    await expect(ActionButton).toBeVisible({ timeout: 15000 });
    await ActionButton.click();
    await expect(page.getByText('Download Reports')).toBeVisible();
    await page.getByText('Download Reports').click();
    await page.waitForTimeout(5000);
    await expect(page.getByText(ReportName, { exact: true })).toBeVisible();
    await page.getByRole('checkbox', { name: ReportName, exact: true }).check();
    const DownloadBtn = page.locator('input[type="submit"], input[name="button"], button:has-text("Run Reports")').first();
    await expect(DownloadBtn).toBeVisible({ timeout: 15000 });
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        DownloadBtn.click()
    ]   );
    const downloadedFileName = download.suggestedFilename();
    const savedFilePath = path.join(downloadDirectory, downloadedFileName);
    await download.saveAs(savedFilePath);
    expect(fs.existsSync(savedFilePath)).toBeTruthy();
    await console.log(`Downloaded file saved at: ${savedFilePath}`);    
    await page.waitForTimeout(10000); // Wait for 10 seconds to ensure the selection is registered   
});


test('On-Demand Report Download', async ({page}) => {

//Login and Client Selection steps starts
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
    //Client Selection Ends

    //Dashboard loading wait
    await expect(page).toHaveTitle(/.*Dashboard*/);
    await expect(page.locator('.k-loading-image')).toBeVisible();
    await expect(page.locator('.k-loading-image')).toBeHidden();
    await page.waitForTimeout(5000);
//Login and Client Selection steps ends

//   await page.getByText('On-Demand Report').dblclick();
const OnDemandReportBtn = page.getByText('On-Demand Report');
await expect(OnDemandReportBtn).toBeVisible({ timeout: 15000 });
await OnDemandReportBtn.click();

const EntityDropDown = page.locator('xpath=/html/body/app-root/div[1]/kendo-splitter/kendo-splitter-pane/div/div[2]/div/app-dashboard/div/div[1]/div[2]/div/div[2]/kendo-tabstrip/div[2]/div/on-demand-report/div/div[1]/div[1]/div/div/kendo-dropdownlist/span/span').first();
await expect(EntityDropDown).toBeVisible({ timeout: 15000 });
await EntityDropDown.click();
await page.waitForTimeout(5000);
await page.getByRole('searchbox', { name: 'Filter' }).click();
await page.waitForTimeout(5000);
await page.getByRole('searchbox', { name: 'Filter' }).fill(Reportentity);
await page.waitForTimeout(5000);
// await expect(page.getByLabel('On-Demand Report').getByText('0218_Entity_Lower')).toBeVisible();
// await page.getByRole('combobox').filter({ hasText: Reportentity }).getByLabel('Select').click();
await page.getByLabel('Options list').getByText(Reportentity).click();
await page.waitForTimeout(5000);

  
//   await page.getByRole('combobox', { name: '--Select State--' }).click();
//   await page.getByRole('combobox', { name: '--Select State--' }).fill('NY');
  
  await page.getByRole('button', { name: 'Select Report' }).click();
  await expect(page.getByText('State Fund Summary')).toBeVisible();
  await expect(page.getByText('State Fund Summary')).toBeVisible();
  await page.getByRole('checkbox', { name: 'State Fund Summary' }).check();
  await page.getByTitle('Close').dblclick();
  

});