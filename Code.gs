function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Template.html')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function uploadFiles(form) {
  try {

    var folderName = "For Web Hosting";
    var sheetName = "Applicants";
    var folder;
    var folders = DriveApp.getFoldersByName(folderName);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    //handling uploading file
    var blob = form.resume;
    var file = folder.createFile(blob);
    file.setDescription("Uploaded by "+ form.nickname+" - " + form.name  + "("+ form.email +")" );

    var fileUrl = file.getUrl();

    //Find drive has this file or not
    var FileIterator = DriveApp.getFilesByName(sheetName);
    var sheetApp = "";
    while (FileIterator.hasNext())
    {
      var sheetFile = FileIterator.next();
      if (sheetFile.getName() == sheetName)
      {
        // Open sheet if exist
        sheetApp = SpreadsheetApp.open(sheetFile);
      }
    }


    if(sheetApp == "")
    {
      sheetApp = SpreadsheetApp.create(sheetName);
    }
    var sheet = sheetApp.getSheets()[0];
    var lastRow = sheet.getLastRow()+1;
    if(lastRow==1){
      sheet.getRange(1, 1, 1, 4).
        setValues([["First/Last name","email","Tel","Resume"]]);
        lastRow=2;
    }

    var data = [];

       data.push([form.fullname,form.email,form.tel,fileUrl]);


    Logger.log(JSON.stringify(data));
    Logger.log("data set completed,lastRow="+lastRow);
    var targetRange = sheet.getRange(lastRow, 1, data.length, 4).
        setValues(data);
    return "Your response has been record. Thank you."

  } catch (error) {

    return "Exception occured："+error.toString();
  }

}
